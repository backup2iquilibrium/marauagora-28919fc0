/// <reference lib="deno.ns" />
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.93.1";
import { z } from "npm:zod@3.25.76";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const payloadSchema = z.object({
  title: z.string().trim().min(3).max(140),
  city: z.string().trim().min(2).max(80).default("Marau"),
  venue: z.string().trim().min(2).max(120).optional().nullable(),
  category: z.string().trim().min(2).max(80).optional().nullable(),
  description: z.string().trim().min(5).max(4000).optional().nullable(),
  starts_at: z.string().datetime(),
  ends_at: z.string().datetime().optional().nullable(),
  is_free: z.boolean().default(false),
  organizer_name: z.string().trim().min(2).max(120),
  organizer_contact: z.string().trim().min(3).max(255),
  notes: z.string().trim().max(1000).optional().nullable(),
});

const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 min
const RATE_MAX = 3; // 3 envios por janela

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

    const ip = getClientIp(req);
    const keyBase = `${ip}:${parsed.data.organizer_contact.toLowerCase()}`;
    const now = Date.now();

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // rate limit (server-side)
    const { data: rlRow, error: rlReadErr } = await admin
      .from("event_submission_rate_limits")
      .select("key, window_start, count")
      .eq("key", keyBase)
      .maybeSingle();
    if (rlReadErr) throw rlReadErr;

    if (!rlRow) {
      const { error: rlInsertErr } = await admin.from("event_submission_rate_limits").insert({
        key: keyBase,
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
        .from("event_submission_rate_limits")
        .update({
          count: nextCount,
          window_start: inWindow ? rlRow.window_start : new Date(now).toISOString(),
          updated_at: new Date(now).toISOString(),
        })
        .eq("key", keyBase);
      if (rlUpErr) throw rlUpErr;
    }

    const { error } = await admin.from("event_submissions").insert({
      ...parsed.data,
      status: "pending",
    });
    if (error) throw error;

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("event-submit error", {
      message: err?.message,
      stack: err?.stack,
      cause: err?.cause,
    });

    return new Response(
      JSON.stringify({
        error: "Não foi possível enviar seu evento agora. Tente novamente em instantes.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
