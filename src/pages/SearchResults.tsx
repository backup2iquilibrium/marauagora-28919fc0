import * as React from "react";
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { TopBar } from "@/components/marau/TopBar";
import { SiteHeader } from "@/components/marau/SiteHeader";
import { Footer } from "@/components/marau/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

const LOGO_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAxrvhZIsLpFBhL4Fdg88ttSHjhIb-frJZQZlaxm8GNQc7IW4mGb6BEqX2FQHmaj5bWS_a_MAl-WrKOfqZv531UtiOEoVWECnv_zEkdUgFQPP4xOUlX1yLx1i1OZJ8scM7yIzgQ_kxoKeircZhd3n99pbXddvrZNxvVJ0LngrGdOEY6Erpyltdl5OirCSp02ao8a-6h_Tq9XGEvnDmkDVa-vtppe-1SASqAQ2YWNx6p66Oa5ofAncc0fEvxM9h_FbKYN9e7c07h";

type CategoryKey = "all" | "news" | "jobs" | "points" | "events";
type SortKey = "relevance" | "newest" | "oldest";

type PortalSearchResult = {
  item_type: CategoryKey;
  item_id: string;
  title: string;
  excerpt: string | null;
  route: string;
  published_at: string;
  rank: number;
};

type CountsResponse = {
  total: number;
  counts: Record<Exclude<CategoryKey, "all">, number>;
};

const categoryLabels: Record<CategoryKey, string> = {
  all: "Todas as Categorias",
  news: "Notícias",
  jobs: "Vagas",
  points: "Pontos da Cidade",
  events: "Eventos",
};

const sortLabels: Record<SortKey, string> = {
  relevance: "Relevância",
  newest: "Mais Recentes",
  oldest: "Mais Antigos",
};

function clampPage(n: number) {
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.floor(n);
}

function formatRelativeDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";

  const diffMs = Date.now() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);
  const diffD = Math.floor(diffH / 24);

  if (diffMin < 60) return `há ${Math.max(1, diffMin)} min`;
  if (diffH < 24) return `há ${diffH} horas`;
  if (diffD < 7) return `há ${diffD} dias`;

  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function ItemBadge({ type }: { type: CategoryKey }) {
  const label = categoryLabels[type];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
        "bg-card text-foreground",
      )}
    >
      {label.toUpperCase()}
    </span>
  );
}

export default function SearchResults() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const q = (params.get("q") ?? "").trim();
  const category = (params.get("category") ?? "all") as CategoryKey;
  const sort = (params.get("sort") ?? "relevance") as SortKey;
  const page = clampPage(Number(params.get("page") ?? "1"));

  const pageSize = 10;
  const offset = (page - 1) * pageSize;

  const [counts, setCounts] = React.useState<CountsResponse | null>(null);
  const [items, setItems] = React.useState<PortalSearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const total = counts?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);

  const chips = useMemo(() => {
    const c = counts?.counts;
    return [
      { key: "all" as const, label: `${categoryLabels.all}${total ? ` (${total})` : ""}` },
      { key: "news" as const, label: `${categoryLabels.news}${c ? ` (${c.news})` : ""}` },
      { key: "jobs" as const, label: `${categoryLabels.jobs}${c ? ` (${c.jobs})` : ""}` },
      { key: "points" as const, label: `${categoryLabels.points}${c ? ` (${c.points})` : ""}` },
      { key: "events" as const, label: `${categoryLabels.events}${c ? ` (${c.events})` : ""}` },
    ];
  }, [counts]);

  const updateParams = (next: Partial<{ q: string; category: CategoryKey; sort: SortKey; page: number }>) => {
    const p = new URLSearchParams(params);
    if (next.q !== undefined) p.set("q", next.q);
    if (next.category !== undefined) p.set("category", next.category);
    if (next.sort !== undefined) p.set("sort", next.sort);
    if (next.page !== undefined) p.set("page", String(next.page));
    setParams(p, { replace: true });
  };

  React.useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);

      try {
        // 1) counts
        const { data: meta, error: metaErr } = await (supabase as any).rpc("search_portal_counts", {
          q,
          category,
        });

        if (metaErr) throw metaErr;
        if (!cancelled) setCounts(meta as CountsResponse);

        // 2) items
        const effectivePage = Math.min(page, Math.max(1, Math.ceil(((meta as CountsResponse)?.total ?? 0) / pageSize)));
        const effectiveOffset = (effectivePage - 1) * pageSize;
        const { data, error: itemsErr } = await (supabase as any).rpc("search_portal", {
          q,
          category,
          sort,
          page_size: pageSize,
          page_offset: effectiveOffset,
        });
        if (itemsErr) throw itemsErr;

        if (!cancelled) {
          setItems((data ?? []) as PortalSearchResult[]);
          if (effectivePage !== page) updateParams({ page: effectivePage });
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message ?? "Falha ao carregar resultados");
          setItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, category, sort, page]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <SiteHeader logoUrl={LOGO_URL} />

      <main className="container px-4 py-8">
        <header className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <button className="hover:text-primary" onClick={() => navigate("/")}>Início</button>
            <span aria-hidden="true">›</span>
            <span className="text-foreground">Resultados da Busca</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Resultados da Busca</h1>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-1">
              <p className="text-muted-foreground">
                Resultados para <span className="font-semibold text-foreground">“{q || ""}”</span>
              </p>
              <p className="text-sm text-muted-foreground">
                {loading ? "Carregando..." : `Encontrados ${total} resultados correspondentes`}
              </p>
            </div>

            <div className="w-full md:w-80">
              <label className="text-sm font-medium">Ordenar por:</label>
              <Select
                value={sort}
                onValueChange={(v) => updateParams({ sort: v as SortKey, page: 1 })}
              >
                <SelectTrigger className="mt-2 bg-card">
                  <SelectValue placeholder="Ordenação" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {Object.entries(sortLabels).map(([k, label]) => (
                    <SelectItem key={k} value={k}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>

        <Separator className="my-6" />

        <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Categoria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Select
                  value={category}
                  onValueChange={(v) => updateParams({ category: v as CategoryKey, page: 1 })}
                >
                  <SelectTrigger className="bg-card">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {chips.map((c) => (
                      <SelectItem key={c.key} value={c.key}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Search className="h-4 w-4" aria-hidden="true" />
                  Dica: refine por categoria para resultados mais precisos.
                </p>
              </CardContent>
            </Card>
          </aside>

          <section className="lg:col-span-3 space-y-4" aria-label="Resultados">
            {error ? (
              <Card>
                <CardContent className="p-6 text-sm text-destructive">{error}</CardContent>
              </Card>
            ) : null}

            {!loading && !error && items.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <p className="font-semibold">Nenhum resultado encontrado.</p>
                  <p className="text-sm text-muted-foreground mt-1">Tente outra palavra-chave ou altere a categoria.</p>
                </CardContent>
              </Card>
            ) : null}

            {items.map((it) => (
              <Card key={`${it.item_type}-${it.item_id}`} className="shadow-sm">
                <CardContent className="p-6 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <ItemBadge type={it.item_type} />
                    <span className="text-xs text-muted-foreground">{formatRelativeDate(it.published_at)}</span>
                  </div>

                  <h2 className="text-xl font-bold leading-snug">{it.title}</h2>
                  {it.excerpt ? <p className="text-sm text-muted-foreground leading-relaxed">{it.excerpt}</p> : null}

                  <div>
                    <Button onClick={() => navigate(it.route)} variant="link" className="px-0">
                      Ver detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Paginação */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                disabled={safePage <= 1 || loading}
                onClick={() => updateParams({ page: safePage - 1 })}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>

              <div className="text-sm text-muted-foreground">
                Página <span className="text-foreground font-medium">{safePage}</span> de {totalPages}
              </div>

              <Button
                variant="outline"
                disabled={safePage >= totalPages || loading}
                onClick={() => updateParams({ page: safePage + 1 })}
              >
                Próxima
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </section>
        </section>
      </main>

      <Footer logoUrl={LOGO_URL} />
    </div>
  );
}
