import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TopBar } from "@/components/marau/TopBar";
import { SiteHeader } from "@/components/marau/SiteHeader";
import { Footer } from "@/components/marau/Footer";

import {
  ChevronDown,
  Layers,
  LocateFixed,
  MapPin,
  Search,
  Star,
  UtensilsCrossed,
  Hotel,
  Landmark,
  Martini,
  Coffee,
  Store,
} from "lucide-react";

async function fetchServiceCategories() {
  const { data, error } = await supabase
    .from("public_service_categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data || [];
}

async function fetchPublicServices() {
  const { data, error } = await supabase
    .from("public_services")
    .select(`
      *,
      category:public_service_categories(*)
    `)
    .eq("status", "active");
  if (error) throw error;
  return data || [];
}

function CategoryIcon({ slug }: { slug: string }) {
  const cls = "h-4 w-4";
  if (slug.includes("restaurante")) return <UtensilsCrossed className={cls} />;
  if (slug.includes("hotel") || slug.includes("hospedagem")) return <Hotel className={cls} />;
  if (slug.includes("turismo") || slug.includes("ponto")) return <Landmark className={cls} />;
  if (slug.includes("bar") || slug.includes("noite")) return <Martini className={cls} />;
  if (slug.includes("cafe")) return <Coffee className={cls} />;
  return <Store className={cls} />;
}

export default function CityPoints() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [sort, setSort] = useState<string>("recomendados");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: categories = [], isLoading: loadingCats } = useQuery({
    queryKey: ["service-categories"],
    queryFn: fetchServiceCategories,
  });

  const { data: allPlaces = [], isLoading: loadingPlaces } = useQuery({
    queryKey: ["public-services-list"],
    queryFn: fetchPublicServices,
  });

  const filteredPlaces = useMemo(() => {
    let result = [...allPlaces];

    if (selectedCategory !== "Todos") {
      result = result.filter((p) => p.category?.slug === selectedCategory);
    }

    if (searchTerm.trim()) {
      const low = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(low) ||
        (p.description && p.description.toLowerCase().includes(low))
      );
    }

    if (sort === "melhor_avaliados") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [allPlaces, selectedCategory, searchTerm, sort]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <SiteHeader logoUrl="/logo.png" />

      <main className="container px-4 py-8">
        <section className="rounded-2xl border bg-card shadow-sm p-6 md:p-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-card to-card">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl font-serif">Explore Marau</h1>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl font-light">
            Descubra os melhores estabelecimentos, serviços e atrações turísticas da Cidade do Pica-pau.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row max-w-3xl">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9 h-12 rounded-full border-primary/20 focus:border-primary shadow-sm"
                placeholder="O que você está procurando?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            <button key="all" type="button" onClick={() => setSelectedCategory("Todos")}>
              <Badge
                variant={selectedCategory === "Todos" ? "secondary" : "outline"}
                className="rounded-full px-4 py-1.5 hover:bg-accent transition-all text-sm font-medium"
              >
                Todos
              </Badge>
            </button>
            {categories.map((c) => (
              <button key={c.id} type="button" onClick={() => setSelectedCategory(c.slug)}>
                <Badge
                  variant={c.slug === selectedCategory ? "secondary" : "outline"}
                  className="rounded-full px-4 py-1.5 hover:bg-accent transition-all text-sm font-medium inline-flex items-center gap-2"
                >
                  <CategoryIcon slug={c.slug} />
                  {c.name}
                </Badge>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-6">
            <h2 className="text-2xl font-bold tracking-tight">
              {filteredPlaces.length} {filteredPlaces.length === 1 ? "lugar encontrado" : "lugares encontrados"}
            </h2>

            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground font-medium">Ordenar por:</span>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-56 bg-card rounded-full border-primary/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recomendados">Recomendados</SelectItem>
                  <SelectItem value="melhor_avaliados">Melhor Avaliados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPlaces.map((p) => (
              <Card key={p.id} className="group hover:shadow-xl transition-all duration-300 border-none bg-card shadow-md overflow-hidden flex flex-col">
                <div className="aspect-video w-full bg-muted relative overflow-hidden">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary/10 font-serif font-black text-6xl">MA</div>
                  )}
                  <Badge className="absolute top-3 right-3 bg-white/90 text-primary hover:bg-white backdrop-blur-sm border-none font-bold">
                    <Star className="h-3 w-3 fill-secondary text-secondary mr-1" />
                    {p.rating?.toFixed(1) || "5.0"}
                  </Badge>
                </div>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">{p.category?.name}</p>
                  <h3 className="text-xl font-bold leading-tight mb-2 group-hover:text-primary transition-colors">{p.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{p.description}</p>

                  <div className="space-y-2 mt-auto">
                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <span className="line-clamp-1">{p.address}</span>
                    </div>

                    <Button variant="outline" className="w-full rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-all mt-4 border-primary/20" asChild>
                      <Link to={`/guia-da-cidade/${p.id}`}>Detalhes</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {(loadingCats || loadingPlaces) && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mt-8">
              {[1, 2, 3].map(i => <div key={i} className="h-64 bg-muted animate-pulse rounded-2xl" />)}
            </div>
          )}

          {!loadingPlaces && filteredPlaces.length === 0 && (
            <div className="mt-20 text-center py-20 border-2 border-dashed rounded-3xl">
              <div className="bg-primary/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-10 w-10 text-primary/40" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Nenhum lugar encontrado</h3>
              <p className="text-muted-foreground mt-2">Tente ajustar seus filtros ou termo de busca.</p>
              <Button variant="link" onClick={() => { setSearchTerm(""); setSelectedCategory("Todos"); }} className="mt-4">
                Limpar todos os filtros
              </Button>
            </div>
          )}
        </section>
      </main>

      <Footer logoUrl="/logo.png" />
    </div>
  );
}
