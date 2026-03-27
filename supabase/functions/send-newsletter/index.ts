/// <reference lib="deno.ns" />
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.40.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    // Handle CORS
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
        
        // Data from Supabase Webhook (on insert news)
        const payload = await req.json();
        const news = payload.record;

        if (!news || !news.title) {
            return new Response(JSON.stringify({ error: "No news record found" }), { 
                status: 400, 
                headers: { ...corsHeaders, "Content-Type": "application/json" } 
            });
        }

        // 1. Get all subscribers
        const { data: subscribers, error: subError } = await supabase
            .from("newsletter_subscribers")
            .select("email");

        if (subError) throw subError;
        if (!subscribers || subscribers.length === 0) {
            return new Response(JSON.stringify({ message: "No subscribers found" }), { 
                status: 200, 
                headers: { ...corsHeaders, "Content-Type": "application/json" } 
            });
        }

        const emails = subscribers.map(s => s.email);

        // 2. Prepare Email Content
        const newsUrl = `https://marauagorars.vercel.app/noticia/${news.slug}`;
        const emailHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px;">Marau Agora</h1>
                    <p style="margin: 5px 0 0; opacity: 0.8;">Notícia Urgente</p>
                </div>
                <div style="padding: 30px; line-height: 1.6; color: #333;">
                    <h2 style="margin-top: 0; color: #1e40af;">${news.title}</h2>
                    <p>${news.summary || "Confira os detalhes da última notícia publicada em nosso portal."}</p>
                    <div style="margin: 30px 0; text-align: center;">
                        <a href="${newsUrl}" style="background-color: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                            Ler Notícia Completa
                        </a>
                    </div>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
                    <p style="font-size: 12px; color: #999; text-align: center;">
                        Você está recebendo este e-mail porque se inscreveu no portal Marau Agora.<br>
                        Se deseja cancelar a inscrição, <a href="#" style="color: #666;">clique aqui</a>.
                    </p>
                </div>
            </div>
        `;

        // 3. Send via Resend (using batch if many, but for now single or simple loop/array)
        // Note: Resend batch limit is 100 per request.
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: "Marau Agora <onboarding@resend.dev>", // Needs domain verification for custom sender
                to: emails,
                subject: `📰 ${news.title} - Marau Agora`,
                html: emailHtml,
            }),
        });

        const resData = await res.json();
        
        return new Response(JSON.stringify({ ok: true, resData }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error: any) {
        console.error("send-newsletter error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
