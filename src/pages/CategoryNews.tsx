import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";

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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { ArrowDown, ArrowRight, ChevronRight, Search, TrendingUp } from "lucide-react";

const LOGO_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAxrvhZIsLpFBhL4Fdg88ttSHjhIb-frJZQZlaxm8GNQc7IW4mGb6BEqX2FQHmaj5bWS_a_MAl-WrKOfqZv531UtiOEoVWECnv_zEkdUgFQPP4xOUlX1yLx1i1OZJ8scM7yIzgQ_kxoKeircZhd3n99pbXddvrZNxvVJ0LngrGdOEY6Erpyltdl5OirCSp02ao8a-6h_Tq9XGEvnDmkDVa-vtppe-1SASqAQ2YWNx6p66Oa5ofAncc0fEvxM9h_FbKYN9e7c07h";

type CategoryItem = {
  tag: string;
  title: string;
  excerpt: string;
  authorLine: string;
  date: string;
  href: string;
};

export default function CategoryNews() {
  const { slug } = useParams();
  const categoryLabel = useMemo(() => {
    if (!slug) return "Notícias";
    const map: Record<string, string> = {
      esportes: "Esporte",
      esporte: "Esporte",
      politica: "Política",
      policial: "Polícia",
      cidade: "Notícias",
      noticias: "Notícias",
    };
    return map[slug] ?? slug.charAt(0).toUpperCase() + slug.slice(1);
  }, [slug]);

  const filters = useMemo(() => ["Todos", "Futebol", "Vôlei", "Futsal", "Eventos"], []);

  const highlight = useMemo(
    () => ({
      title: "Vôlei Marau conquista título regional histórico em noite de ginásio lotado",
      excerpt:
        "A equipe local superou os adversários de Passo Fundo em uma partida emocionante de cinco sets neste domingo, garantindo o troféu inédito para a cidade.",
      authorLine: "Por Lucas Silva",
      time: "Há 2 horas",
      href: "/noticia/volei-marau-conquista-titulo",
    }),
    [],
  );

  const items = useMemo<CategoryItem[]>(
    () => [
      {
        tag: "Futebol",
        title: "Campeonato Municipal de Futebol inicia neste final de semana com 12 equipes",
        excerpt:
          "Jogos de abertura acontecem no Estádio Municipal Carlos Renato Bebber com entrada franca para a comunidade.",
        authorLine: "",
        date: "24 Out, 2023",
        href: "/noticia/campeonato-municipal-futebol",
      },
      {
        tag: "Atletismo",
        title: "Maratona Escolar reúne mais de 500 estudantes da rede pública",
        excerpt:
          "Evento promove saúde e integração entre as escolas do município, revelando novos talentos do atletismo.",
        authorLine: "",
        date: "23 Out, 2023",
        href: "/noticia/maratona-escolar-500-estudantes",
      },
      {
        tag: "Futsal",
        title: "AMF anuncia novo reforço para a temporada 2024",
        excerpt:
          "Ala esquerdo com passagem pela seleção chega para somar ao elenco na busca pelo acesso.",
        authorLine: "",
        date: "22 Out, 2023",
        href: "/noticia/amf-anuncia-reforco-2024",
      },
    ],
    [],
  );

  const mostRead = useMemo(
    () => [
      "Prefeitura anuncia cronograma de obras no centro",
      "Vôlei Marau lota ginásio em final histórica",
      "Acidente na ERS-324 causa lentidão nesta manhã",
      "Festival do Salame acontece no próximo mês",
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <SiteHeader logoUrl={LOGO_URL} />

      <main className="container px-4 py-8">
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/categoria/noticias">Notícias</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>{categoryLabel}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <section className="lg:col-span-3">
            <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">{slug ? `categoria: ${slug}` : ""}</p>
                <h1 className="font-serif text-3xl tracking-tight md:text-4xl">{categoryLabel} em Marau</h1>
              </div>

              <div className="flex items-center gap-2 md:max-w-sm md:w-full">
                <div className="relative w-full">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Buscar" className="pl-9" />
                </div>
                <Button size="icon" variant="secondary" aria-label="Buscar">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </header>

            <div className="mt-6 flex flex-wrap gap-2">
              {filters.map((f, idx) => (
                <Badge
                  key={f}
                  variant={idx === 0 ? "secondary" : "outline"}
                  className="rounded-full px-3 py-1"
                >
                  {f}
                </Badge>
              ))}
            </div>

            <section className="mt-8">
              <Card>
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-5">
                    <div className="md:col-span-2 bg-muted aspect-[16/10] md:aspect-auto" />
                    <div className="md:col-span-3 p-6">
                      <p className="text-xs text-muted-foreground">Destaque</p>
                      <h2 className="mt-2 font-serif text-2xl leading-tight">{highlight.title}</h2>
                      <p className="mt-2 text-muted-foreground">{highlight.excerpt}</p>
                      <p className="mt-4 text-sm text-muted-foreground">
                        <span className="text-foreground font-medium">{highlight.authorLine}</span> • {highlight.time}
                      </p>
                      <div className="mt-4">
                        <Button asChild variant="secondary" className="gap-2">
                          <Link to={highlight.href}>
                            Ler matéria
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="mt-8 space-y-6">
              {items.map((item) => (
                <Card key={item.href}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">{item.tag}</p>
                        <h3 className="mt-1 font-serif text-xl leading-snug">
                          <Link to={item.href} className="hover:underline">
                            {item.title}
                          </Link>
                        </h3>
                        <p className="mt-2 text-muted-foreground">{item.excerpt}</p>
                        <p className="mt-3 text-sm text-muted-foreground">{item.date}</p>
                      </div>
                      <div className="hidden sm:block h-20 w-28 rounded-md bg-muted" />
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="flex justify-center">
                <Button variant="outline" className="gap-2">
                  Carregar mais notícias
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            </section>
          </section>

          <aside className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Mais Lidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mostRead.map((t, idx) => (
                  <div key={t} className="flex gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                      {idx + 1}
                    </div>
                    <p className="text-sm font-medium leading-snug">{t}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Boletim Diário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Receba as principais notícias de Marau no seu e-mail todas as manhãs.
                </p>
                <Button variant="secondary" className="w-full">
                  Inscrever-se
                </Button>
              </CardContent>
            </Card>

            <AdSlot />
            <Separator />
            <Sidebar />
          </aside>
        </div>
      </main>

      <Footer logoUrl={LOGO_URL} />
    </div>
  );
}
