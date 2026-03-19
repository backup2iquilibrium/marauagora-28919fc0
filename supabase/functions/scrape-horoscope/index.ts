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

async function scrapeAstrolink(sign: string) {
  const url = `https://www.astrolink.com.br/horoscopo/${sign}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  if (!res.ok) throw new Error(`Astrolink failed: ${res.status}`);
  const html = await res.text();

  // Encontra o container da previsão diária
  const match = html.match(/<div class="horoscope-sign__presentation-content">([\s\S]*?)<\/div>/);
  if (!match) throw new Error(`Could not find content for ${sign}`);

  // Limpa o HTML e remove tags
  let text = match[1]
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>?/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  return text;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date();
    // ISO format YYYY-MM-DD
    const forDate = now.toISOString().split('T')[0];

    const results = [];
    for (const sign of SIGNS) {
      try {
        const content = await scrapeAstrolink(sign);
        
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
      } catch (err) {
        console.error(`Error scraping ${sign}:`, err);
        results.push({ sign, ok: false, error: err.message });
      }
    }

    return new Response(JSON.stringify({ ok: true, forDate, results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Scrape error", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
