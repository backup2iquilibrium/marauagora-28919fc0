import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { TopBar } from "@/components/marau/TopBar";
import { SiteHeader } from "@/components/marau/SiteHeader";
import { Footer } from "@/components/marau/Footer";
import { Sidebar } from "@/components/marau/Sidebar";
import { AdSlot } from "@/components/marau/AdSlot";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookmarkPlus, ChevronRight, Share2 } from "lucide-react";

async function fetchNewsBySlug(slug: string) {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) throw error;
  return data;
}

async function fetchRelatedNews(categorySlug: string, currentId: string) {
  const { data, error } = await supabase
    .from("news")
    .select("id, title, slug, published_at")
    .eq("category_slug", categorySlug)
    .neq("id", currentId)
    .limit(3);
  if (error) throw error;
  return data || [];
}

export default function NewsDetails() {
  const { slug } = useParams();

  const { data: article, isLoading, isError } = useQuery({
    queryKey: ["news-detail", slug],
    queryFn: () => fetchNewsBySlug(slug || ""),
    enabled: !!slug,
  });

  const { data: related = [] } = useQuery({
    queryKey: ["related-news", article?.category_slug, article?.id],
    queryFn: () => fetchRelatedNews(article!.category_slug, article!.id),
    enabled: !!article,
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando notícia...</div>;
  }

  if (isError || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Notícia não encontrada</h1>
        <Button asChild><Link to="/">Voltar para a Home</Link></Button>
      </div>
    );
  }

  const paragraphs = article.body ? article.body.split('\n\n') : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <SiteHeader logoUrl="/logo.png" />

      <main className="container px-4 py-8">
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator><ChevronRight /></BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={`/categoria/${article.category_slug}`}>
                    {article.category_slug.charAt(0).toUpperCase() + article.category_slug.slice(1)}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator><ChevronRight /></BreadcrumbSeparator>
              <BreadcrumbItem><BreadcrumbPage>Notícia</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <article className="lg:col-span-3">
            <header className="space-y-4">
              <Badge variant="secondary" className="rounded-full px-3 py-1 uppercase text-[10px] font-bold">
                {article.category_slug}
              </Badge>

              <h1 className="font-serif text-3xl leading-tight tracking-tight md:text-5xl font-bold text-foreground">
                {article.title}
              </h1>

              <p className="text-lg text-muted-foreground md:text-xl font-medium">
                {article.excerpt}
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-y py-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-bold text-foreground">Redação Marau Agora</span>
                  <span>•</span>
                  <span>{format(new Date(article.published_at), "dd 'de' MMMM, yyyy", { locale: ptBR })}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="gap-2"><Share2 className="h-4 w-4" /> Compartilhar</Button>
                  <Button variant="ghost" size="sm" className="gap-2"><BookmarkPlus className="h-4 w-4" /> Salvar</Button>
                </div>
              </div>
            </header>

            <section className="mt-8">
              {article.image_url && (
                <figure className="overflow-hidden rounded-xl border bg-card shadow-sm mb-8">
                  <img src={article.image_url} alt={article.title} className="w-full h-auto object-cover aspect-video" />
                </figure>
              )}
            </section>

            <section className="mt-8 space-y-6 text-lg leading-relaxed text-foreground/90">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </section>

            {related.length > 0 && (
              <section className="mt-12 pt-8 border-t">
                <h3 className="font-serif text-2xl font-bold mb-6">Leia Também</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {related.map((item) => (
                    <Link
                      key={item.id}
                      to={`/noticia/${item.slug}`}
                      className="group block space-y-2"
                    >
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden border">
                        {/* Placeholder para imagem de relacionada se não houver no SELECT */}
                        <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary/20 font-serif font-bold text-3xl">MA</div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(item.published_at), "dd MMM, yyyy", { locale: ptBR })}
                      </p>
                      <h4 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>

          <aside className="space-y-8">
            <AdSlot />
            <Sidebar />
          </aside>
        </div>
      </main>

      <Footer logoUrl="/logo.png" />
    </div>
  );
}
