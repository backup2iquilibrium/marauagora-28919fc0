import * as React from "react";
import { Link } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { format, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowRight,
  Camera,
  CalendarDays,
  Eye,
  Film,
  Newspaper,
  Search,
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LOGO_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAxrvhZIsLpFBhL4Fdg88ttSHjhIb-frJZQZlaxm8GNQc7IW4mGb6BEqX2FQHmaj5bWS_a_MAl-WrKOfqZv531UtiOEoVWECnv_zEkdUgFQPP4xOUlX1yLx1i1OZJ8scM7yIzgQ_kxoKeircZhd3n99pbXddvrZNxvVJ0LngrGdOEY6Erpyltdl5OirCSp02ao8a-6h_Tq9XGEvnDmkDVa-vtppe-1SASqAQ2YWNx6p66Oa5ofAncc0fEvxM9h_FbKYN9e7c07h";

type GalleryRow = Tables<"galleries">;

type SortKey = "newest" | "popular" | "oldest";
type FilterTab = "all" | "photos" | "videos" | "events" | "nature";

function formatPublishedLabel(ts: string) {
  const d = new Date(ts);
  if (!isValid(d)) return "";
  return format(d, "dd MMM, yyyy", { locale: ptBR });
}

function applyGalleryFilters(q: any, args: { city: string; tab: FilterTab; q: string }) {
  q = q.eq("city", args.city).eq("is_published", true);

  if (args.tab === "photos") {
    // fotos + misto
    q = q.in("media_kind", ["photos", "mixed"]);
  } else if (args.tab === "videos") {
    // vídeos + misto
    q = q.in("media_kind", ["videos", "mixed"]);
  } else if (args.tab === "events") {
    q = q.eq("category", "Eventos");
  } else if (args.tab === "nature") {
    q = q.eq("category", "Natureza");
  }

  const trimmed = args.q.trim();
  if (trimmed) {
    const like = `%${trimmed}%`;
    q = (q as any).or(`title.ilike.${like},excerpt.ilike.${like},category.ilike.${like}`);
  }

  return q;
}

function applyGallerySort(q: any, sort: SortKey) {
  if (sort === "popular") return q.order("views_count", { ascending: false });
  if (sort === "oldest") return q.order("published_at", { ascending: true });
  return q.order("published_at", { ascending: false });
}

export default function Galleries() {
  const city = "Marau";
  const pageSize = 12;

  const [tab, setTab] = React.useState<FilterTab>("all");
  const [sort, setSort] = React.useState<SortKey>("newest");
  const [q, setQ] = React.useState("");

  const featuredQuery = useQuery({
    queryKey: ["galleries", "featured", city],
    queryFn: async () => {
      const flagged = await supabase
        .from("galleries")
        .select("*")
        .eq("city", city)
        .eq("is_published", true)
        .eq("is_featured", true)
        .order("published_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (flagged.data) return flagged.data as GalleryRow;

      const fallback = await supabase
        .from("galleries")
        .select("*")
        .eq("city", city)
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      return (fallback.data ?? null) as GalleryRow | null;
    },
  });

  const listQuery = useInfiniteQuery({
    queryKey: ["galleries", "list", city, { tab, sort, q: q.trim() }],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const offset = Number(pageParam) || 0;
      let query = supabase.from("galleries");
      query = applyGalleryFilters(query, { city, tab, q });
      query = applyGallerySort(query, sort);

      const { data, error } = await (query as any)
        .select("id,slug,title,excerpt,category,media_kind,cover_image_url,published_at,views_count")
        .range(offset, offset + pageSize - 1);

      if (error) throw error;
      return (data ?? []) as Pick<
        GalleryRow,
        "id" | "slug" | "title" | "excerpt" | "category" | "media_kind" | "cover_image_url" | "published_at" | "views_count"
      >[];
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < pageSize) return undefined;
      return allPages.flat().length;
    },
  });

  const galleries = React.useMemo(() => (listQuery.data?.pages ?? []).flat(), [listQuery.data]);

  const videosQuery = useQuery({
    queryKey: ["galleries", "featuredVideos", city],
    queryFn: async () => {
      // Puxa 4 itens de vídeo mais recentes de galerias publicadas
      const { data, error } = await supabase
        .from("gallery_items")
        .select(
          "id, kind, title, media_url, thumbnail_url, duration_seconds, gallery_id, galleries!inner(slug,title,is_published,city)",
        )
        .eq("kind", "video")
        .eq("galleries.city", city)
        .eq("galleries.is_published", true)
        .order("created_at", { ascending: false })
        .limit(4);

      if (error) throw error;
      return (data ?? []) as any[];
    },
  });

  const featured = featuredQuery.data;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <SiteHeader logoUrl={LOGO_URL} />

      <main className="container px-4 py-8">
        <header className="flex items-center gap-3">
          <Newspaper className="h-6 w-6 text-primary" aria-hidden="true" />
          <h1 className="font-serif text-3xl tracking-tight md:text-4xl">Galerias</h1>
        </header>

        {/* Featured */}
        <section className="mt-6">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <Link
                to={featured ? `/galerias/${featured.slug}` : "#"}
                className={cn("block", !featured && "pointer-events-none")}
                aria-disabled={!featured}
              >
                <div className="relative">
                  <div
                    className="aspect-[16/9] md:aspect-[21/9] bg-muted"
                    style={
                      featured?.cover_image_url
                        ? {
                            backgroundImage: `url(${featured.cover_image_url})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }
                        : undefined
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="inline-flex items-center gap-2 rounded-full bg-secondary text-secondary-foreground px-3 py-1 text-xs font-semibold">
                      Destaque
                      {featured?.published_at ? (
                        <span className="inline-flex items-center gap-1 text-secondary-foreground/80">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {formatPublishedLabel(featured.published_at)}
                        </span>
                      ) : null}
                    </div>
                    <h2 className="mt-3 font-serif text-2xl md:text-3xl leading-tight">
                      {featured?.title ?? "Nenhuma galeria em destaque"}
                    </h2>
                    <p className="mt-2 text-muted-foreground max-w-3xl">
                      {featured?.excerpt ?? "Cadastre uma galeria publicada para aparecer aqui."}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                      <span className="inline-flex items-center gap-1 text-primary">
                        <Camera className="h-4 w-4" />
                        Ver Galeria Completa
                      </span>
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        </section>

        {/* Filters */}
        <section className="mt-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <Tabs value={tab} onValueChange={(v) => setTab(v as FilterTab)}>
            <TabsList className="flex flex-wrap h-auto">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="photos" className="gap-2">
                <Camera className="h-4 w-4" /> Fotos
              </TabsTrigger>
              <TabsTrigger value="videos" className="gap-2">
                <Film className="h-4 w-4" /> Vídeos
              </TabsTrigger>
              <TabsTrigger value="events">Eventos</TabsTrigger>
              <TabsTrigger value="nature">Natureza</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto md:items-center">
            <div className="relative w-full sm:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar" className="pl-9" />
            </div>
            <div className="w-full sm:w-56">
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger>
                  <SelectValue placeholder="Ordenar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mais recentes</SelectItem>
                  <SelectItem value="popular">Populares</SelectItem>
                  <SelectItem value="oldest">Antigos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <section className="lg:col-span-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl">Últimas Atualizações</h3>
            </div>

            <div className="mt-4 space-y-4">
              {listQuery.isLoading ? (
                <Card>
                  <CardContent className="p-6 text-sm text-muted-foreground">Carregando galerias…</CardContent>
                </Card>
              ) : listQuery.isError ? (
                <Card>
                  <CardContent className="p-6 text-sm text-muted-foreground">Não foi possível carregar as galerias.</CardContent>
                </Card>
              ) : galleries.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-sm text-muted-foreground">Nenhuma galeria encontrada.</CardContent>
                </Card>
              ) : (
                galleries.map((g) => (
                  <Card key={g.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              {g.media_kind === "videos" ? (
                                <Film className="h-4 w-4" />
                              ) : (
                                <Camera className="h-4 w-4" />
                              )}
                              {g.media_kind === "videos" ? "Vídeo" : "Galeria"}
                            </span>
                            <span>•</span>
                            <span>{g.category ?? "Geral"}</span>
                            {g.views_count ? (
                              <>
                                <span>•</span>
                                <span className="inline-flex items-center gap-1">
                                  <Eye className="h-4 w-4" /> {Number(g.views_count).toLocaleString("pt-BR")}
                                </span>
                              </>
                            ) : null}
                          </div>
                          <h4 className="mt-1 font-serif text-lg leading-snug">
                            <Link className="hover:underline" to={`/galerias/${g.slug}`}>
                              {g.title}
                            </Link>
                          </h4>
                          {g.excerpt ? <p className="mt-1 text-sm text-muted-foreground">{g.excerpt}</p> : null}
                        </div>

                        <div className="shrink-0">
                          <Button asChild variant="secondary" className="gap-2">
                            <Link to={`/galerias/${g.slug}`}>
                              Ver arquivo
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}

              <div className="flex justify-center pt-2">
                <Button
                  variant="outline"
                  disabled={!listQuery.hasNextPage || listQuery.isFetchingNextPage}
                  onClick={() => listQuery.fetchNextPage()}
                >
                  Carregar mais
                </Button>
              </div>
            </div>

            {/* Ad block + videos */}
            <section className="mt-10 space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Publicidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border bg-card p-6">
                    <div className="text-sm font-semibold">Destaque sua marca aqui</div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Conecte-se com a comunidade de Marau. Espaço reservado para o seu anúncio ou campanha publicitária.
                    </p>
                    <Button className="mt-4" variant="secondary">
                      Anuncie Conosco
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Film className="h-4 w-4 text-primary" /> Vídeos em Destaque
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {videosQuery.isLoading ? (
                    <p className="text-sm text-muted-foreground">Carregando vídeos…</p>
                  ) : videosQuery.isError ? (
                    <p className="text-sm text-muted-foreground">Não foi possível carregar vídeos.</p>
                  ) : (videosQuery.data ?? []).length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum vídeo publicado ainda.</p>
                  ) : (
                    (videosQuery.data ?? []).map((v) => (
                      <Link
                        key={v.id}
                        to={`/galerias/${v.galleries.slug}`}
                        className="block rounded-md border bg-card p-4 hover:bg-accent/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs text-muted-foreground">{v.title ? "Entrevista" : "Vídeo"}</p>
                            <p className="mt-1 font-medium leading-snug line-clamp-2">{v.title ?? v.galleries.title}</p>
                            <p className="mt-2 text-xs text-muted-foreground">
                              {v.duration_seconds ? `${Math.floor(v.duration_seconds / 60)}:${String(v.duration_seconds % 60).padStart(2, "0")}` : ""}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground">▶</span>
                        </div>
                      </Link>
                    ))
                  )}

                  <Button variant="outline" className="w-full">
                    Ver todos os vídeos
                  </Button>
                </CardContent>
              </Card>
            </section>
          </section>

          <aside className="lg:col-span-1 space-y-6">
            <Sidebar />
          </aside>
        </div>
      </main>

      <Footer logoUrl={LOGO_URL} />
    </div>
  );
}
