import * as React from "react";
import { Link } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { format, startOfDay, endOfDay, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowDown,
  ArrowRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  Filter,
  MapPin,
  Search,
  Timer,
} from "lucide-react";

import { TopBar } from "@/components/marau/TopBar";
import { SiteHeader } from "@/components/marau/SiteHeader";
import { Footer } from "@/components/marau/Footer";
import { Sidebar } from "@/components/marau/Sidebar";

import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LOGO_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAxrvhZIsLpFBhL4Fdg88ttSHjhIb-frJZQZlaxm8GNQc7IW4mGb6BEqX2FQHmaj5bWS_a_MAl-WrKOfqZv531UtiOEoVWECnv_zEkdUgFQPP4xOUlX1yLx1i1OZJ8scM7yIzgQ_kxoKeircZhd3n99pbXddvrZNxvVJ0LngrGdOEY6Erpyltdl5OirCSp02ao8a-6h_Tq9XGEvnDmkDVa-vtppe-1SASqAQ2YWNx6p66Oa5ofAncc0fEvxM9h_FbKYN9e7c07h";

type EventRow = Tables<"events">;

const CATEGORY_OPTIONS = [
  "Música e Shows",
  "Esportes",
  "Cultura e Arte",
  "Religioso",
  "Educação",
  "Outros",
] as const;

type SortKey = "newest" | "upcoming" | "alpha";

function formatMonthDay(d: Date) {
  // Ex.: JUL / 25
  const month = format(d, "MMM", { locale: ptBR }).toUpperCase();
  const day = format(d, "dd", { locale: ptBR });
  return { month, day };
}

function formatTimeRange(startsAt: Date, endsAt?: Date | null) {
  const start = format(startsAt, "HH:mm");
  if (!endsAt || !isValid(endsAt)) return start;
  return `${start} - ${format(endsAt, "HH:mm")}`;
}

function applyEventFilters(q: any, args: {
  city: string;
  selectedDate?: Date;
  categories: string[];
  onlyFree: boolean;
}) {
  // Cidade
  q = q.eq("city", args.city);

  // Data (dia inteiro)
  if (args.selectedDate && isValid(args.selectedDate)) {
    const from = startOfDay(args.selectedDate).toISOString();
    const to = endOfDay(args.selectedDate).toISOString();
    q = q.gte("starts_at", from).lte("starts_at", to);
  }

  // Categorias
  if (args.categories.length > 0) {
    q = q.in("category", args.categories);
  }

  // Gratuitos
  if (args.onlyFree) {
    q = q.eq("is_free", true);
  }

  return q;
}

function applySort(q: any, sort: SortKey) {
  if (sort === "upcoming") return q.order("starts_at", { ascending: true });
  if (sort === "alpha") return q.order("title", { ascending: true });
  // "Mais recentes" — prioriza o que foi publicado/adicionado por último
  return q.order("created_at", { ascending: false });
}

export default function Agenda() {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();
  const [categories, setCategories] = React.useState<string[]>([]);
  const [onlyFree, setOnlyFree] = React.useState(false);
  const [sort, setSort] = React.useState<SortKey>("newest");
  const [q, setQ] = React.useState("");

  const city = "Marau";
  const pageSize = 12;

  const filterKey = React.useMemo(
    () => ({ selectedDate: selectedDate?.toISOString() ?? null, categories, onlyFree, sort, q: q.trim() }),
    [selectedDate, categories, onlyFree, sort, q],
  );

  const featuredQuery = useQuery({
    queryKey: ["agenda", "featured", city],
    queryFn: async () => {
      // 1) flag "is_featured_week"; 2) fallback: próximo evento futuro
      const nowIso = new Date().toISOString();

      const flagged = await supabase
        .from("events")
        .select("*")
        .eq("city", city)
        .eq("is_featured_week", true)
        .gte("starts_at", nowIso)
        .order("starts_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (flagged.data) return flagged.data as EventRow;

      const fallback = await supabase
        .from("events")
        .select("*")
        .eq("city", city)
        .gte("starts_at", nowIso)
        .order("starts_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      return (fallback.data ?? null) as EventRow | null;
    },
  });

  const totalCountQuery = useQuery({
    queryKey: ["agenda", "count", city, filterKey.selectedDate, filterKey.categories.join("|"), filterKey.onlyFree, filterKey.q],
    queryFn: async () => {
      let q1 = applyEventFilters(supabase.from("events"), { city, selectedDate, categories, onlyFree });

      if (q.trim()) {
        const like = `%${q.trim()}%`;
        q1 = (q1 as any).or(`title.ilike.${like},description.ilike.${like},venue.ilike.${like}`);
      }

      const { count, error } = await (q1 as any).select("id", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
  });

  const listQuery = useInfiniteQuery({
    queryKey: ["agenda", "list", city, filterKey],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const offset = Number(pageParam) || 0;
      const now = new Date();

      let query = applyEventFilters(supabase.from("events"), { city, selectedDate, categories, onlyFree });
      query = applySort(query, sort);
      query = (query as any).select("*");

      if (q.trim()) {
        const like = `%${q.trim()}%`;
        query = (query as any).or(`title.ilike.${like},description.ilike.${like},venue.ilike.${like}`);
      }

      // Se o sort for "Próximos dias", forçamos eventos a partir de agora.
      if (sort === "upcoming" && (!selectedDate || !isValid(selectedDate))) {
        query = (query as any).gte("starts_at", now.toISOString());
      }

      const { data, error } = await (query as any)
        .range(offset, offset + pageSize - 1);

      if (error) throw error;
      return (data ?? []) as EventRow[];
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < pageSize) return undefined;
      return allPages.flat().length;
    },
  });

  const events = React.useMemo(() => (listQuery.data?.pages ?? []).flat(), [listQuery.data]);
  const totalCount = totalCountQuery.data ?? 0;

  const toggleCategory = (value: string) => {
    setCategories((prev) => (prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <SiteHeader logoUrl={LOGO_URL} />

      <main className="container px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* LEFT FILTERS */}
          <aside className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Date */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Filtrar por Data</p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : "Selecionar data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                      <div className="border-t p-2 flex justify-end">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedDate(undefined)}>
                          Limpar
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Categorias</p>
                  <div className="space-y-2">
                    {CATEGORY_OPTIONS.map((c) => (
                      <label key={c} className="flex items-center gap-2 text-sm">
                        <Checkbox checked={categories.includes(c)} onCheckedChange={() => toggleCategory(c)} />
                        <span className="text-foreground">{c}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Only free */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Tipo de Entrada</p>
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox checked={onlyFree} onCheckedChange={(v) => setOnlyFree(Boolean(v))} />
                    <span>Apenas Gratuitos</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Publicidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-card p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <span className="sr-only">Campanha</span>
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </span>
                    Destaque sua Marca
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Alcance milhares de moradores de Marau interessados em cultura e eventos.
                  </p>
                  <Button className="mt-4 w-full" variant="secondary">
                    Saiba mais sobre nossos planos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* MAIN */}
          <section className="lg:col-span-3 space-y-8">
            {/* Featured */}
            <section>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Destaque da Semana</p>
                  <h1 className="mt-1 font-serif text-3xl tracking-tight md:text-4xl">Agenda de Eventos</h1>
                </div>
              </div>

              <Card className="mt-5 overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-5">
                    <div className="md:col-span-2 bg-muted aspect-[16/10] md:aspect-auto" />
                    <div className="md:col-span-3 p-6">
                      {featuredQuery.data ? (
                        <>
                          <h2 className="font-serif text-2xl leading-tight">
                            {featuredQuery.data.title}
                          </h2>
                          {featuredQuery.data.description ? (
                            <p className="mt-2 text-muted-foreground">{featuredQuery.data.description}</p>
                          ) : null}
                          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            {featuredQuery.data.venue ? (
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="h-4 w-4" /> {featuredQuery.data.venue}
                              </span>
                            ) : null}
                            <span className="inline-flex items-center gap-1">
                              <Timer className="h-4 w-4" />
                              {format(new Date(featuredQuery.data.starts_at), "PPP", { locale: ptBR })}
                            </span>
                          </div>
                          <div className="mt-5">
                            <Button asChild variant="secondary" className="gap-2">
                              <Link to={"/categoria/eventos"}>
                                Ver Detalhes do Evento
                                <ArrowRight className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <h2 className="font-serif text-2xl leading-tight">Sem destaque no momento</h2>
                          <p className="mt-2 text-muted-foreground">
                            Assim que houver um evento marcado como “Destaque da Semana”, ele aparecerá aqui.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* List header */}
            <section className="space-y-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="space-y-1">
                  <h2 className="font-serif text-2xl">Agenda de Eventos em {city}</h2>
                  <p className="text-sm text-muted-foreground">
                    Confira o que está acontecendo na nossa cidade. Shows, esportes, cultura e muito mais.
                  </p>
                </div>

                <div className="flex items-center gap-2 md:max-w-md md:w-full">
                  <div className="relative w-full">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="Buscar por título, local ou descrição"
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-muted-foreground">
                  Exibindo <span className="text-foreground font-medium">{events.length}</span>
                  {totalCountQuery.isSuccess ? (
                    <>
                      {" "}de <span className="text-foreground font-medium">{totalCount}</span>
                    </>
                  ) : null}{" "}
                  eventos em {city}
                </p>

                <div className="w-full md:w-64">
                  <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Ordenação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Mais recentes</SelectItem>
                      <SelectItem value="upcoming">Próximos dias</SelectItem>
                      <SelectItem value="alpha">Ordem alfabética</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            {/* List */}
            <section className="space-y-4">
              {listQuery.isLoading ? (
                <Card>
                  <CardContent className="p-6 text-sm text-muted-foreground">Carregando eventos…</CardContent>
                </Card>
              ) : listQuery.isError ? (
                <Card>
                  <CardContent className="p-6 text-sm text-muted-foreground">
                    Não foi possível carregar a agenda agora.
                  </CardContent>
                </Card>
              ) : events.length === 0 ? (
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground">Nenhum evento encontrado com os filtros atuais.</p>
                  </CardContent>
                </Card>
              ) : (
                events.map((ev) => {
                  const startsAt = new Date(ev.starts_at);
                  const endsAt = ev.ends_at ? new Date(ev.ends_at) : null;
                  const { month, day } = formatMonthDay(startsAt);
                  return (
                    <Card key={ev.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="flex gap-4">
                            <div className="shrink-0 text-center">
                              <div className="text-xs font-semibold text-muted-foreground">{month}</div>
                              <div className="text-3xl font-bold leading-none text-foreground">{day}</div>
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                {ev.category ? (
                                  <span className="text-xs font-semibold text-secondary">{ev.category}</span>
                                ) : (
                                  <span className="text-xs font-semibold text-muted-foreground">Evento</span>
                                )}
                                {ev.is_free ? (
                                  <span className="text-xs rounded-full border px-2 py-0.5 text-muted-foreground">
                                    Gratuito
                                  </span>
                                ) : null}
                              </div>

                              <h3 className="mt-1 font-serif text-xl leading-snug">{ev.title}</h3>
                              {ev.description ? (
                                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{ev.description}</p>
                              ) : null}

                              <div className="mt-3 flex flex-col gap-1 text-sm text-muted-foreground">
                                {ev.venue ? (
                                  <span className="inline-flex items-center gap-1">
                                    <MapPin className="h-4 w-4" /> {ev.venue}
                                  </span>
                                ) : null}
                                <span className="inline-flex items-center gap-1">
                                  <Timer className="h-4 w-4" /> {formatTimeRange(startsAt, endsAt)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="md:pl-6 md:shrink-0">
                            <Button asChild variant="secondary" className="w-full md:w-auto">
                              <Link to={"/categoria/eventos"}>Ver Detalhes</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}

              <div className="flex justify-center pt-2">
                <Button
                  variant="outline"
                  className="gap-2"
                  disabled={!listQuery.hasNextPage || listQuery.isFetchingNextPage}
                  onClick={() => listQuery.fetchNextPage()}
                >
                  Carregar Mais Eventos
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            </section>

            <Separator className="my-8" />
            <Sidebar />
          </section>
        </div>
      </main>

      <Footer logoUrl={LOGO_URL} />
    </div>
  );
}
