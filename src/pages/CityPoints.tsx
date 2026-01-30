import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

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

const LOGO_URL = "/logo.png";

import {
  ChevronDown,
  Layers,
  LocateFixed,
  Building2,
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

type PointCategory =
  | "Todos"
  | "Restaurantes"
  | "Hotéis"
  | "Pontos Turísticos"
  | "Bares"
  | "Cafés"
  | "Lojas";

type Place = {
  id: string;
  name: string;
  rating: number;
  subtitle: string;
  address: string;
  category: Exclude<PointCategory, "Todos">;
};

function CategoryIcon({ category }: { category: PointCategory }) {
  const cls = "h-4 w-4";
  switch (category) {
    case "Restaurantes":
      return <UtensilsCrossed className={cls} />;
    case "Hotéis":
      return <Hotel className={cls} />;
    case "Pontos Turísticos":
      return <Landmark className={cls} />;
    case "Bares":
      return <Martini className={cls} />;
    case "Cafés":
      return <Coffee className={cls} />;
    case "Lojas":
      return <Store className={cls} />;
    default:
      return null;
  }
}

export default function CityPoints() {
  const categories = useMemo<PointCategory[]>(
    () => ["Todos", "Restaurantes", "Hotéis", "Pontos Turísticos", "Bares", "Cafés", "Lojas"],
    [],
  );

  const [category, setCategory] = useState<PointCategory>("Todos");
  const [sort, setSort] = useState<string>("recomendados");

  const places = useMemo<Place[]>(
    () => [
      {
        id: "cantina-da-terra",
        name: "Cantina da Terra",
        rating: 4.8,
        subtitle: "Restaurante Italiano • $$",
        address: "Av. Júlio Borella, 1200 - Centro",
        category: "Restaurantes",
      },
      {
        id: "hotel-de-conto",
        name: "Hotel De Conto",
        rating: 4.5,
        subtitle: "Hotel • $$$",
        address: "Rua Bento Gonçalves, 450",
        category: "Hotéis",
      },
      {
        id: "parque-municipal-lauro",
        name: "Parque Municipal Lauro",
        rating: 4.9,
        subtitle: "Parque e Lazer • Grátis",
        address: "Rua Irineu Ferlin, Marau - RS",
        category: "Pontos Turísticos",
      },
      {
        id: "bella-vista-cafe",
        name: "Bella Vista Café",
        rating: 4.7,
        subtitle: "Cafeteria • $$",
        address: "Av. Barão do Rio Branco, 890",
        category: "Cafés",
      },
      {
        id: "igreja-matriz-cristo-rei",
        name: "Igreja Matriz Cristo Rei",
        rating: 4.8,
        subtitle: "Ponto Turístico • Religioso",
        address: "Praça Dr. Elpídio Fialho",
        category: "Pontos Turísticos",
      },
      {
        id: "the-public-pub",
        name: "The Public Pub",
        rating: 4.6,
        subtitle: "Bar e Vida Noturna • $$$",
        address: "Av. Presidente Vargas, 100",
        category: "Bares",
      },
    ],
    [],
  );

  const filteredPlaces = useMemo(() => {
    const base = category === "Todos" ? places : places.filter((p) => p.category === category);
    // mock sort (mantém ordem do HTML como padrão)
    if (sort === "melhor_avaliados") return [...base].sort((a, b) => b.rating - a.rating);
    return base;
  }, [places, category, sort]);

  return (
    <div className="min-h-screen bg-background text-foreground font-jakarta">
      <TopBar />
      <SiteHeader logoUrl={LOGO_URL} />

      <main className="container px-4 py-8">
        {/* Hero */}
        <section className="rounded-xl border bg-card shadow-sm p-6 md:p-8">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Explore Marau</h1>
          <p className="mt-2 text-muted-foreground">
            Descubra os melhores restaurantes, hotéis, parques e atrações turísticas em nossa cidade.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Pesquisar" />
            </div>
            <Button variant="secondary" className="gap-2">
              Pesquisar
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button key={c} type="button" onClick={() => setCategory(c)}>
                <Badge
                  variant={c === category ? "secondary" : "outline"}
                  className="rounded-full px-3 py-1 hover:bg-accent inline-flex items-center gap-2"
                >
                  {c !== "Todos" ? <CategoryIcon category={c} /> : null}
                  {c}
                </Badge>
              </button>
            ))}
          </div>
        </section>

        {/* Mapa + controles */}
        <section className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <div className="aspect-[16/10] w-full bg-muted" aria-label="Mapa (placeholder)" />
                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    <Button variant="secondary" size="icon" aria-label="Minha localização">
                      <LocateFixed className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" size="icon" aria-label="Camadas">
                      <Layers className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="absolute left-4 top-16 right-4">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input className="pl-9 bg-card" placeholder="Pesquisar nesta área" />
                      </div>
                      <Button variant="secondary">Explorar nas Proximidades</Button>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Navegue pelo mapa para descobrir joias escondidas no centro da cidade.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Publicidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-muted p-6 text-center">
                  <p className="font-medium">Anúncio em destaque</p>
                </div>
              </CardContent>
            </Card>
          </aside>
        </section>

        {/* Listagem */}
        <section className="mt-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Lugares Populares</h2>

            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Ordenar por:</span>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-56 bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50 bg-popover">
                  <SelectItem value="recomendados">Recomendados</SelectItem>
                  <SelectItem value="melhor_avaliados">Melhor Avaliados</SelectItem>
                  <SelectItem value="mais_proximos">Mais Próximos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPlaces.map((p) => (
              <Card key={p.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">{p.category}</p>
                      <h3 className="mt-1 text-lg font-semibold leading-snug">{p.name}</h3>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 text-secondary" />
                      <span className="font-medium">{p.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">{p.subtitle}</p>
                  <div className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 h-4 w-4" />
                    <span className="leading-snug">{p.address}</span>
                  </div>

                  <div className="mt-4">
                    <Button variant="secondary" className="w-full">
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <Button variant="outline" className="gap-2">
              Mostrar mais lugares
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>

      <Footer logoUrl={LOGO_URL} />
    </div>
  );
}
