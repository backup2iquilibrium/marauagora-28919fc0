import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/context/SettingsContext";
import { Link } from "react-router-dom";

async function fetchHeroNews() {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(5);
  if (error) throw error;
  return data || [];
}

function Tag({ tone, children }: { tone?: "primary" | "secondary" | "muted"; children: string }) {
  const cls =
    tone === "secondary"
      ? "bg-secondary text-secondary-foreground"
      : tone === "primary"
        ? "bg-primary text-primary-foreground"
        : "bg-muted text-foreground";

  return (
    <span className={`${cls} text-[10px] md:text-xs font-bold px-2 py-1 rounded uppercase tracking-wider inline-block shadow-sm`}>
      {children}
    </span>
  );
}

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { carouselSpeed } = useSettings();

  const { data: news = [], isLoading } = useQuery({
    queryKey: ["hero-news"],
    queryFn: fetchHeroNews,
  });

  const slides = useMemo(() => news.slice(0, 3), [news]);
  const sideCards = useMemo(() => news.slice(3, 5), [news]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, carouselSpeed || 5000);

    return () => clearInterval(timer);
  }, [slides.length, carouselSpeed]);

  if (isLoading) {
    return <div className="h-[500px] w-full bg-muted animate-pulse rounded-lg mb-12" />;
  }

  if (news.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <article className="lg:col-span-2 group relative rounded-lg overflow-hidden shadow-sm h-96 lg:h-[500px] bg-muted">
          {slides.map((s, idx) => (
            <div
              key={s.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
            >
              <Link to={`/noticia/${s.slug}`} className="block h-full">
                <img
                  src={s.image_url || "https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=2070&auto=format&fit=crop"}
                  alt={s.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                  <Tag tone={idx === 0 ? "secondary" : "primary"}>
                    {s.category_slug || "Notícia"}
                  </Tag>
                  <h1 className="mt-2 text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-foreground leading-tight">
                    {s.title}
                  </h1>
                  <p className="mt-2 text-foreground/80 text-sm md:text-base line-clamp-2 max-w-2xl">{s.excerpt}</p>
                </div>
              </Link>
            </div>
          ))}

          {slides.length > 1 && (
            <div className="absolute bottom-4 right-4 z-20 flex space-x-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`w-2 h-2 rounded-full transition-colors ${idx === currentSlide ? "bg-primary" : "bg-primary/30 hover:bg-primary/60"
                    }`}
                  onClick={() => setCurrentSlide(idx)}
                />
              ))}
            </div>
          )}
        </article>

        <div className="flex flex-col gap-6 h-auto lg:h-[500px]">
          {sideCards.map((c) => (
            <article key={c.id} className="relative flex-1 min-h-[180px] rounded-lg overflow-hidden shadow-sm group border">
              <Link to={`/noticia/${c.slug}`} className="block h-full">
                <img
                  alt={c.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  src={c.image_url || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <span className="text-secondary text-[10px] font-bold uppercase mb-1 block">
                    {c.category_slug}
                  </span>
                  <h3 className="text-foreground font-serif font-bold text-base md:text-lg leading-tight line-clamp-2">
                    {c.title}
                  </h3>
                </div>
              </Link>
            </article>
          ))}
          {sideCards.length === 0 && (
            <div className="flex-1 rounded-lg border border-dashed flex items-center justify-center text-muted-foreground text-sm p-8 text-center bg-muted/30">
              Mais notícias em breve...
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
