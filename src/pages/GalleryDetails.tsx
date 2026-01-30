import * as React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Camera, Film, MapPin } from "lucide-react";

import { TopBar } from "@/components/marau/TopBar";
import { SiteHeader } from "@/components/marau/SiteHeader";
import { Footer } from "@/components/marau/Footer";

import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LOGO_URL = "/logo.png";

type GalleryRow = Tables<"galleries">;
type GalleryItemRow = Tables<"gallery_items">;

type MediaTab = "all" | "photo" | "video";

function formatDate(ts: string) {
  const d = new Date(ts);
  if (!isValid(d)) return "";
  return format(d, "PPP", { locale: ptBR });
}

export default function GalleryDetails() {
  const { slug } = useParams();
  const [tab, setTab] = React.useState<MediaTab>("all");

  const galleryQuery = useQuery({
    queryKey: ["gallery", slug],
    enabled: Boolean(slug),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("galleries")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as GalleryRow | null;
    },
  });

  const itemsQuery = useQuery({
    queryKey: ["gallery", slug, "items", tab],
    enabled: Boolean(slug) && Boolean(galleryQuery.data?.id),
    queryFn: async () => {
      const galleryId = galleryQuery.data?.id;
      if (!galleryId) return [] as GalleryItemRow[];

      let q = supabase
        .from("gallery_items")
        .select("*")
        .eq("gallery_id", galleryId)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (tab !== "all") q = q.eq("kind", tab);

      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as GalleryItemRow[];
    },
  });

  const gallery = galleryQuery.data;
  const items = itemsQuery.data ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <SiteHeader logoUrl={LOGO_URL} />

      <main className="container px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="ghost" className="gap-2">
            <Link to="/galerias">
              <ArrowLeft className="h-4 w-4" /> Voltar para Galerias
            </Link>
          </Button>
        </div>

        {galleryQuery.isLoading ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">Carregando…</CardContent>
          </Card>
        ) : galleryQuery.isError || !gallery ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">Galeria não encontrada.</CardContent>
          </Card>
        ) : (
          <>
            <section>
              <div className="relative overflow-hidden rounded-2xl border">
                <div
                  className="aspect-[16/9] md:aspect-[21/9] bg-muted"
                  style={
                    gallery.cover_image_url
                      ? {
                        backgroundImage: `url(${gallery.cover_image_url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                      : undefined
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-xs text-muted-foreground">{gallery.category ?? "Galeria"} • {formatDate(gallery.published_at)}</p>
                  <h1 className="mt-2 font-serif text-3xl md:text-4xl leading-tight">{gallery.title}</h1>
                  {gallery.excerpt ? <p className="mt-2 text-muted-foreground max-w-3xl">{gallery.excerpt}</p> : null}
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> {gallery.city}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-8">
              <Tabs value={tab} onValueChange={(v) => setTab(v as MediaTab)}>
                <TabsList className="flex flex-wrap h-auto">
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="photo" className="gap-2">
                    <Camera className="h-4 w-4" /> Fotos
                  </TabsTrigger>
                  <TabsTrigger value="video" className="gap-2">
                    <Film className="h-4 w-4" /> Vídeos
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="mt-6">
                {itemsQuery.isLoading ? (
                  <p className="text-sm text-muted-foreground">Carregando mídia…</p>
                ) : itemsQuery.isError ? (
                  <p className="text-sm text-muted-foreground">Não foi possível carregar os itens.</p>
                ) : items.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum item nesta galeria.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((it) => (
                      <Card key={it.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          {it.kind === "video" ? (
                            <div className="bg-muted">
                              <video
                                className="w-full aspect-video"
                                controls
                                preload="metadata"
                                src={it.media_url}
                              />
                              {it.title ? (
                                <div className="p-3 text-sm font-medium">{it.title}</div>
                              ) : null}
                            </div>
                          ) : (
                            <a
                              href={it.media_url}
                              target="_blank"
                              rel="noreferrer"
                              className={cn("block", "bg-muted")}
                            >
                              <img
                                src={it.media_url}
                                alt={it.title ?? `${gallery.title} — foto`}
                                className="w-full aspect-[4/3] object-cover"
                                loading="lazy"
                              />
                              {it.title ? (
                                <div className="p-3 text-sm font-medium">{it.title}</div>
                              ) : null}
                            </a>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      <Footer logoUrl={LOGO_URL} />
    </div>
  );
}
