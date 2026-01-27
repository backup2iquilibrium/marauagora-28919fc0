import * as React from "react";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BadgeCheck,
  Bus,
  CalendarDays,
  Cloud,
  FileText,
  Globe,
  GraduationCap,
  Gavel,
  HeartPulse,
  Landmark,
  MapPin,
  Newspaper,
  Phone,
  ReceiptText,
  Search,
  Shield,
  Siren,
  Store,
  Trash2,
  Zap,
} from "lucide-react";

import { TopBar } from "@/components/marau/TopBar";
import { SiteHeader } from "@/components/marau/SiteHeader";
import { Footer } from "@/components/marau/Footer";

import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const LOGO_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAxrvhZIsLpFBhL4Fdg88ttSHjhIb-frJZQZlaxm8GNQc7IW4mGb6BEqX2FQHmaj5bWS_a_MAl-WrKOfqZv531UtiOEoVWECnv_zEkdUgFQPP4xOUlX1yLx1i1OZJ8scM7yIzgQ_kxoKeircZhd3n99pbXddvrZNxvVJ0LngrGdOEY6Erpyltdl5OirCSp02ao8a-6h_Tq9XGEvnDmkDVa-vtppe-1SASqAQ2YWNx6p66Oa5ofAncc0fEvxM9h_FbKYN9e7c07h";

type CategoryRow = Tables<"public_service_categories">;
type ServiceRow = Tables<"public_services">;
type ActionRow = Tables<"public_service_actions">;
type LinkRow = Tables<"public_service_links">;
type EmergencyRow = Tables<"emergency_numbers">;

function iconFromKey(key?: string | null) {
  const k = (key ?? "").trim();
  const map: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    local_hospital: HeartPulse,
    school: GraduationCap,
    directions_bus: Bus,
    water_drop: Cloud, // fallback visual; use Cloud for "Água/tempo" quando não houver
    account_balance: Landmark,
    clinical_notes: FileText,
    badge: BadgeCheck,
    receipt_long: ReceiptText,
    delete: Trash2,
    gavel: Gavel,
    public: Globe,
    bolt: Zap,
    cloud: Cloud,
    storefront: Store,
    emergency: Siren,
    policia: Shield,
  };

  return map[k] ?? FileText;
}

function statusPillClass(status?: string | null) {
  const s = (status ?? "").toLowerCase();
  if (s.includes("aberto")) return "bg-secondary text-secondary-foreground";
  if (s.includes("fecha")) return "bg-destructive text-destructive-foreground";
  return "bg-muted text-muted-foreground";
}

export default function Services() {
  const city = "Marau";
  const [q, setQ] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categoriesQuery = useQuery({
    queryKey: ["services", "categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("public_service_categories")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true });
      if (error) throw error;
      return (data ?? []) as CategoryRow[];
    },
  });

  const featuredQuery = useQuery({
    queryKey: ["services", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("public_services")
        .select("*")
        .eq("is_featured", true)
        .eq("is_published", true)
        .order("views_count", { ascending: false })
        .order("sort_order", { ascending: true })
        .limit(6);
      if (error) throw error;
      return (data ?? []) as ServiceRow[];
    },
  });

  const servicesQuery = useQuery({
    queryKey: ["services", "list", { q: q.trim(), selectedCategory }],
    queryFn: async () => {
      let query: any = supabase
        .from("public_services")
        .select("*")
        .eq("is_published", true)
        .order("views_count", { ascending: false })
        .order("sort_order", { ascending: true })
        .limit(12);

      if (selectedCategory) query = query.eq("category_slug", selectedCategory);

      const trimmed = q.trim();
      if (trimmed) {
        const like = `%${trimmed}%`;
        query = query.or(`title.ilike.${like},summary.ilike.${like},details.ilike.${like},address.ilike.${like}`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as ServiceRow[];
    },
  });

  const actionsQuery = useQuery({
    queryKey: ["services", "actions", servicesQuery.data?.map((s) => s.id).join("|") ?? ""],
    enabled: Boolean(servicesQuery.data?.length),
    queryFn: async () => {
      const serviceIds = (servicesQuery.data ?? []).map((s) => s.id);
      if (serviceIds.length === 0) return [] as ActionRow[];

      const { data, error } = await supabase
        .from("public_service_actions")
        .select("*")
        .in("service_id", serviceIds)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as ActionRow[];
    },
  });

  const linksQuery = useQuery({
    queryKey: ["services", "links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("public_service_links")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .limit(8);
      if (error) throw error;
      return (data ?? []) as LinkRow[];
    },
  });

  const emergencyQuery = useQuery({
    queryKey: ["services", "emergency"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("emergency_numbers")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .limit(8);
      if (error) throw error;
      return (data ?? []) as EmergencyRow[];
    },
  });

  const categories = categoriesQuery.data ?? [];
  const quickFilters = useMemo(() => categories.slice(0, 5), [categories]);

  const actionsByService = useMemo(() => {
    const map = new Map<string, ActionRow[]>();
    for (const a of actionsQuery.data ?? []) {
      map.set(a.service_id, [...(map.get(a.service_id) ?? []), a]);
    }
    return map;
  }, [actionsQuery.data]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <SiteHeader logoUrl={LOGO_URL} />

      <main className="container px-4 py-8">
        <nav className="text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Início
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Serviços Públicos</span>
        </nav>

        <header className="mt-4">
          <div className="flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-primary" aria-hidden="true" />
            <p className="text-sm font-semibold text-primary">Utilidade Pública</p>
          </div>
          <h1 className="mt-3 font-serif text-3xl tracking-tight md:text-4xl">Serviços Públicos em {city}</h1>
          <p className="mt-2 text-muted-foreground">
            Acesse horários de funcionamento, documentos, procedimentos de agendamento e contatos de serviços locais em um só lugar.
          </p>
        </header>

        <section className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* MAIN */}
          <div className="lg:col-span-3 space-y-8">
            {/* Search + quick filters */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Pesquisar"
                    className="pl-9"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground">Filtros rápidos:</span>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(null)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                      !selectedCategory ? "bg-secondary text-secondary-foreground border-transparent" : "bg-card",
                    )}
                  >
                    Ver tudo
                  </button>
                  {quickFilters.map((c) => {
                    const Icon = iconFromKey(c.icon);
                    const active = selectedCategory === c.slug;
                    return (
                      <button
                        key={c.slug}
                        type="button"
                        onClick={() => setSelectedCategory(active ? null : c.slug)}
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                          active ? "bg-secondary text-secondary-foreground border-transparent" : "bg-card",
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {c.name}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Categories grid */}
            <section>
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl">Navegue por Categoria</h2>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoriesQuery.isLoading ? (
                  <Card>
                    <CardContent className="p-6 text-sm text-muted-foreground">Carregando categorias…</CardContent>
                  </Card>
                ) : categories.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-sm text-muted-foreground">Nenhuma categoria cadastrada.</CardContent>
                  </Card>
                ) : (
                  categories.map((c) => {
                    const Icon = iconFromKey(c.icon);
                    return (
                      <button
                        key={c.slug}
                        type="button"
                        onClick={() => setSelectedCategory(c.slug)}
                        className="text-left"
                      >
                        <Card className="h-full hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-3">
                              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                              </span>
                              <div className="min-w-0">
                                <p className="font-semibold">{c.name}</p>
                                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">Acesse serviços e documentos.</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </button>
                    );
                  })
                )}
              </div>
            </section>

            {/* Ad block */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Publicidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-card p-6">
                  <div className="flex items-center gap-2 font-semibold">
                    <Store className="h-4 w-4 text-primary" />
                    Comércio Local em Destaque
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Conheça as ofertas especiais das lojas de Marau para esta semana. Valorize o comércio da nossa cidade.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Most accessed */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl">Mais Acessados</h2>

              {servicesQuery.isLoading ? (
                <Card>
                  <CardContent className="p-6 text-sm text-muted-foreground">Carregando serviços…</CardContent>
                </Card>
              ) : servicesQuery.isError ? (
                <Card>
                  <CardContent className="p-6 text-sm text-muted-foreground">Não foi possível carregar os serviços.</CardContent>
                </Card>
              ) : (servicesQuery.data ?? []).length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-sm text-muted-foreground">Nenhum serviço publicado ainda.</CardContent>
                </Card>
              ) : (
                (servicesQuery.data ?? []).map((s) => {
                  const category = categories.find((c) => c.slug === s.category_slug);
                  const Icon = iconFromKey(category?.icon);
                  const actions = actionsByService.get(s.id) ?? [];
                  return (
                    <Card key={s.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                                  <Icon className="h-4 w-4 text-primary" />
                                  {s.title}
                                </span>
                                {s.status_badge ? (
                                  <span className={cn("text-xs font-semibold rounded-full px-2 py-0.5", statusPillClass(s.status_badge))}>
                                    {s.status_badge}
                                  </span>
                                ) : null}
                              </div>
                              {s.summary ? <p className="mt-2 text-sm text-muted-foreground">{s.summary}</p> : null}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                            {s.hours_label ? (
                              <div className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4" />
                                {s.hours_label}
                              </div>
                            ) : null}
                            {s.phone ? (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                {s.phone}
                              </div>
                            ) : null}
                            {s.address ? (
                              <div className="flex items-center gap-2 md:col-span-2">
                                <MapPin className="h-4 w-4" />
                                {s.address}
                              </div>
                            ) : null}
                          </div>

                          {s.details ? (
                            <p className="text-sm text-muted-foreground leading-relaxed">{s.details}</p>
                          ) : null}

                          <div className="flex flex-wrap gap-2">
                            {actions.slice(0, 2).map((a) => (
                              <Button key={a.id} asChild variant="secondary" className="gap-2">
                                <a href={a.href} target="_blank" rel="noreferrer">
                                  {a.label}
                                  <ArrowRight className="h-4 w-4" />
                                </a>
                              </Button>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}

              <Separator />

              {/* Emergency */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Siren className="h-4 w-4 text-primary" />
                    Números de Emergência
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(emergencyQuery.data ?? []).map((e) => (
                      <div key={e.id} className="rounded-lg border bg-card p-4">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-semibold">{e.label}</span>
                          <span className="text-sm font-black text-primary">{e.number}</span>
                        </div>
                      </div>
                    ))}
                    {emergencyQuery.isLoading ? (
                      <p className="text-sm text-muted-foreground">Carregando…</p>
                    ) : null}
                  </div>
                </CardContent>
              </Card>

              {/* Useful links */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Links Úteis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(linksQuery.data ?? []).map((l) => {
                      const Icon = iconFromKey(l.icon);
                      return (
                        <a
                          key={l.id}
                          href={l.href}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg border bg-card p-4 hover:bg-accent/30 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-primary" />
                            <span className="text-sm font-semibold">{l.label}</span>
                          </div>
                        </a>
                      );
                    })}
                  </div>

                  <div className="mt-6 rounded-xl border bg-card p-6">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <p className="font-semibold">App Marau Conectada</p>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Acesse todos os serviços da cidade direto do seu celular. Relate problemas, pague taxas e mais.
                    </p>
                    <Button className="mt-4" variant="secondary">Baixar Agora</Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* RIGHT */}
          <aside className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Publicidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-card p-6">
                  <div className="flex items-center gap-2 font-semibold">
                    <Store className="h-4 w-4 text-primary" />
                    Anuncie no Marau Agora
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Alcance milhares de moradores de Marau diariamente. Soluções ideais para o seu negócio.
                  </p>
                  <Button className="mt-4 w-full" variant="secondary">Solicitar Mídia Kit</Button>
                </div>
              </CardContent>
            </Card>

            {/* Featured shortcuts */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Destaques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(featuredQuery.data ?? []).slice(0, 4).map((s) => (
                  <div key={s.id} className="rounded-lg border bg-card p-4">
                    <p className="text-sm font-semibold">{s.title}</p>
                    {s.summary ? <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{s.summary}</p> : null}
                  </div>
                ))}
                {featuredQuery.isLoading ? <p className="text-sm text-muted-foreground">Carregando…</p> : null}
              </CardContent>
            </Card>
          </aside>
        </section>
      </main>

      <Footer logoUrl={LOGO_URL} />
    </div>
  );
}
