import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

async function fetchLatestNews() {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("published_at", { ascending: false })
    .range(5, 12); // Pula as 5 primeiras do Hero
  if (error) throw error;
  return data || [];
}

export function LatestNews() {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["latest-news-list"],
    queryFn: fetchLatestNews,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h2 className="text-2xl font-serif font-bold text-primary">Mais Recentes</h2>
        <Link className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" to="/categoria/noticias">
          Ver todas
        </Link>
      </div>

      <div className="space-y-6">
        {items.map((n) => (
          <article
            key={n.id}
            className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border group"
          >
            <Link to={`/noticia/${n.slug}`} className="sm:w-1/3 h-48 sm:h-auto overflow-hidden rounded-md relative shrink-0">
              <img
                alt={n.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                src={n.image_url || "https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=2070&auto=format&fit=crop"}
                loading="lazy"
              />
            </Link>

            <div className="flex-1 flex flex-col justify-center min-w-0">
              <div className="flex items-center text-[10px] md:text-xs text-muted-foreground mb-2 gap-2">
                <Link
                  to={`/categoria/${n.category_slug}`}
                  className="text-primary font-bold uppercase hover:underline whitespace-nowrap"
                >
                  {n.category_slug}
                </Link>
                <span aria-hidden="true">•</span>
                <span>{formatDistanceToNow(new Date(n.published_at), { addSuffix: true, locale: ptBR })}</span>
              </div>

              <h3 className="text-lg md:text-xl font-bold font-serif mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                <Link to={`/noticia/${n.slug}`}>{n.title}</Link>
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-2">{n.excerpt}</p>
            </div>
          </article>
        ))}

        {items.length === 0 && (
          <div className="py-12 text-center text-muted-foreground border-2 border-dashed rounded-xl">
            Nenhuma outra notícia encontrada no momento.
          </div>
        )}
      </div>
    </section>
  );
}
