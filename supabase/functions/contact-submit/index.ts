/// <reference lib="deno.ns" />
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.93.1";
import { z } from "npm:zod@3.25.76";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const payloadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().min(2).max(120),
  message: z.string().trim().min(5).max(4000),
});

const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 min
const RATE_MAX = 5; // 5 envios por janela

function getClientIp(req: Request) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const parsed = payloadSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid payload", details: parsed.error.flatten() }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { name, email, subject, message } = parsed.data;

    const ip = getClientIp(req);

    // Se existir auth header, tenta extrair o user_id (opcional)
    const authHeader = req.headers.get("Authorization") ?? "";
    let userId: string | null = null;

    if (authHeader.startsWith("Bearer ")) {
      const anon = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!,
        { global: { headers: { Authorization: authHeader } } },
      );
      const { data } = await anon.auth.getClaims();
      userId = (data?.claims?.sub as string | undefined) ?? null;
    }

    // Inserção via service role (bypass RLS) - tabela não permite INSERT direto do cliente
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Rate limit simples (por IP + email): evita spam/DoS
    const rateKey = `${ip}:${email.toLowerCase()}`;
    const now = Date.now();
    const { data: rlRow, error: rlReadErr } = await admin
      .from("contact_message_rate_limits")
      .select("key, window_start, count")
      .eq("key", rateKey)
      .maybeSingle();

    if (rlReadErr) throw rlReadErr;

    if (!rlRow) {
      const { error: rlInsertErr } = await admin.from("contact_message_rate_limits").insert({
        key: rateKey,
        window_start: new Date(now).toISOString(),
        count: 1,
        updated_at: new Date(now).toISOString(),
      });
      if (rlInsertErr) throw rlInsertErr;
    } else {
      const windowStart = new Date(rlRow.window_start).getTime();
      const inWindow = now - windowStart <= RATE_WINDOW_MS;
      const nextCount = inWindow ? (rlRow.count ?? 0) + 1 : 1;

      if (inWindow && nextCount > RATE_MAX) {
        return new Response(JSON.stringify({ error: "Rate limited" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error: rlUpErr } = await admin
        .from("contact_message_rate_limits")
        .update({
          count: nextCount,
          window_start: inWindow ? rlRow.window_start : new Date(now).toISOString(),
          updated_at: new Date(now).toISOString(),
        })
        .eq("key", rateKey);
      if (rlUpErr) throw rlUpErr;
    }

    const { error } = await admin.from("contact_messages").insert({
      name,
      email,
      subject,
      message,
      user_id: userId,
    });

    if (error) throw error;

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message ?? "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
