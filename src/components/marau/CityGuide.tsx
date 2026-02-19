import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

async function fetchServiceCategories() {
  const { data, error } = await supabase
    .from("public_service_categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .limit(4);
  if (error) throw error;
  return data || [];
}

export function CityGuide() {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["home-service-categories"],
    queryFn: fetchServiceCategories,
  });

  if (isLoading) {
    return <div className="h-24 bg-muted animate-pulse rounded-lg" />;
  }

  if (categories.length === 0) return null;

  return (
    <section>
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h2 className="text-2xl font-serif font-bold text-primary">Guia da Cidade</h2>
        <Link className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" to="/guia-da-cidade">
          Ver guia completo
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((i) => (
          <Link
            key={i.id}
            className="group block text-center"
            to={`/guia-da-cidade#${i.slug}`}
          >
            <div className="rounded-full overflow-hidden w-20 h-20 md:w-24 md:h-24 mx-auto mb-2 border-4 border-card shadow-sm group-hover:border-secondary transition-colors bg-muted flex items-center justify-center">
              {i.icon ? (
                <img alt={i.name} className="w-full h-full object-cover" src={i.icon} loading="lazy" />
              ) : (
                <span className="text-primary font-bold text-xl">{i.name.charAt(0)}</span>
              )}
            </div>
            <span className="font-medium text-xs md:text-sm text-foreground group-hover:text-primary transition-colors block px-1">
              {i.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
