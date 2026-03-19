/// <reference lib="deno.ns" />
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SIGNS = [
  "aries", "touro", "gemeos", "cancer", "leao", "virgem",
  "libra", "escorpiao", "sagitario", "capricornio", "aquario", "peixes"
];

async function scrapePersonare(sign: string) {
  const url = `https://www.personare.com.br/horoscopo-do-dia/${sign}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
    }
  });

  if (!res.ok) throw new Error(`Personare failed for ${sign}: ${res.status}`);
  const html = await res.text();

  // Procurar pelo script __NEXT_DATA__ que contém o JSON estruturado
  const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (!nextDataMatch) throw new Error(`Could not find __NEXT_DATA__ for ${sign}`);

  try {
    const nextData = JSON.parse(nextDataMatch[1]);
    const prediction = nextData?.props?.pageProps?.horoscopes?.daily?.prediction || 
                       nextData?.props?.pageProps?.horoscopes?.daily?.solar;
    
    if (!prediction) throw new Error(`No prediction found in JSON for ${sign}`);
    
    // Limpeza de tags HTML simples se houver
    return prediction.replace(/<[^>]*>?/gm, '').trim();
  } catch (err) {
    throw new Error(`Failed to parse JSON for ${sign}: ${err.message}`);
  }
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date();
    // No horário do Brasil -3h (aproximadamente, para o banco de dados) 
    // ou apenas usamos o ISO, mas o importante é o sign_slug e for_date
    const forDate = now.toISOString().split('T')[0];

    const results = [];
    for (const sign of SIGNS) {
      try {
        console.log(`Scraping Personare for ${sign}...`);
        const content = await scrapePersonare(sign);
        
        // Upsert no Supabase
        const { error } = await admin
          .from("horoscopes")
          .upsert(
            {
              sign_slug: sign,
              for_date: forDate,
              content: content,
              period: "today",
              is_published: true,
              updated_at: now.toISOString(),
            },
            { onConflict: "sign_slug,for_date,period" }
          );

        if (error) throw error;
        results.push({ sign, ok: true });
        console.log(`Updated ${sign} successfully`);
      } catch (err: any) {
        console.error(`Error scraping ${sign}:`, err);
        results.push({ sign, ok: false, error: err.message });
      }
    }

    return new Response(JSON.stringify({ ok: true, forDate, results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Scrape overall error", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
