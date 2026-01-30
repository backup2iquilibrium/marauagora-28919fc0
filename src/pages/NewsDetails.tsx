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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookmarkPlus, ChevronRight, Search, Share2, TrendingUp } from "lucide-react";

const LOGO_URL = "/logo.png";

type RelatedItem = {
  when: string;
  title: string;
  href: string;
};

export default function NewsDetails() {
  const { slug } = useParams();

  const article = useMemo(
    () => ({
      category: "Local",
      title: "Prefeitura de Marau anuncia novas obras de pavimentação no centro",
      excerpt:
        "Investimento de R$ 2 milhões visa melhorar o fluxo de veículos na Avenida Júlio Borella e ruas adjacentes, com previsão de término em 6 meses.",
      author: "João Silva",
      meta: "14 de Outubro, 2023 • 4 min de leitura",
      heroCaption: "Obras começam na próxima segunda-feira (16). Foto: Divulgação/Prefeitura.",
      paragraphs: [
        "A Prefeitura de Marau confirmou nesta manhã o início de um ambicioso projeto de revitalização asfáltica que contemplará as principais vias do centro da cidade. O projeto, que estava em fase de licitação desde o início do ano, finalmente recebeu luz verde para começar.",
        "Segundo o Secretário de Obras, o objetivo principal é reduzir os congestionamentos nos horários de pico e oferecer mais segurança para pedestres e motoristas. \"A Avenida Júlio Borella é o coração da nossa cidade, e ela precisa pulsar no ritmo do nosso crescimento\", afirmou durante a coletiva de imprensa.",
        "\"Não se trata apenas de tapar buracos, mas de repensar a mobilidade urbana de Marau para os próximos 10 anos.\"",
        "Além do recapeamento, o projeto prevê a instalação de nova sinalização viária, incluindo faixas de pedestres elevadas em frente às escolas e unidades de saúde. As calçadas também passarão por manutenção para garantir a acessibilidade de cadeirantes e idosos.",
      ],
      sectionTitle: "Cronograma e Desvios",
      sectionBody: [
        "Para minimizar o impacto no trânsito, as obras serão realizadas em etapas, começando pelo trecho norte da avenida. A prefeitura divulgou um mapa preliminar dos desvios que serão implementados. Motoristas devem ficar atentos à sinalização provisória e, se possível, buscar rotas alternativas durante o período de obras.",
        "A previsão é que tudo esteja concluído até o final do semestre, garantindo que a cidade esteja pronta para as festividades de fim de ano com uma infraestrutura renovada.",
      ],
      tags: ["Infraestrutura", "Trânsito", "Prefeitura"],
    }),
    [],
  );

  const mostRead = useMemo(
    () => [
      { category: "Esportes", title: "Marau Futsal vence clássico regional e avança para a final" },
      {
        category: "Policial",
        title: "Operação da Brigada Militar apreende grande quantidade de ilícitos na região",
      },
      { category: "Economia", title: "Nova indústria deve gerar 200 empregos diretos em Marau" },
    ],
    [],
  );

  const related = useMemo<RelatedItem[]>(
    () => [
      {
        when: "Há 2 dias",
        title: "Moradores do Bairro Santa Rita pedem melhorias no asfalto",
        href: "/noticia/melhorias-asfalto-bairro-santa-rita",
      },
      {
        when: "Semana passada",
        title: "Orçamento municipal para 2024 é aprovado na Câmara",
        href: "/noticia/orcamento-2024-aprovado",
      },
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
                <BreadcrumbPage>{article.category}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="mt-2 text-xs text-muted-foreground">slug: {slug}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <article className="lg:col-span-3">
            <header className="space-y-3">
              <div>
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  {article.category}
                </Badge>
              </div>

              <h1 className="font-serif text-3xl leading-tight tracking-tight md:text-4xl">{article.title}</h1>
              <p className="text-base text-muted-foreground md:text-lg">{article.excerpt}</p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{article.author}</span> {article.meta}
                </p>

                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Compartilhar
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <BookmarkPlus className="h-4 w-4" />
                    Salvar
                  </Button>
                </div>
              </div>
            </header>

            <section className="mt-6">
              <figure className="overflow-hidden rounded-lg border bg-card shadow-sm">
                <div className="aspect-[16/9] w-full bg-muted" />
                <figcaption className="px-4 py-3 text-sm text-muted-foreground">{article.heroCaption}</figcaption>
              </figure>
            </section>

            <section className="mt-8 space-y-5 text-base leading-relaxed">
              {article.paragraphs.map((p, idx) => (
                <p key={idx} className={idx === 2 ? "border-l-4 border-primary pl-4 text-foreground" : undefined}>
                  {p}
                </p>
              ))}
            </section>

            <section className="mt-10">
              <h2 className="font-serif text-2xl tracking-tight">{article.sectionTitle}</h2>
              <div className="mt-4 space-y-5 text-base leading-relaxed">
                {article.sectionBody.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}

                <figure className="overflow-hidden rounded-lg border bg-card shadow-sm">
                  <div className="aspect-[16/9] w-full bg-muted" />
                  <figcaption className="px-4 py-3 text-sm text-muted-foreground">
                    Mapa ilustrativo da área de intervenção.
                  </figcaption>
                </figure>
              </div>
            </section>

            <section className="mt-8 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Tags:</span>
              {article.tags.map((t) => (
                <Badge key={t} variant="outline" className="rounded-full px-3 py-1">
                  {t}
                </Badge>
              ))}
            </section>

            <section className="mt-10">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Relacionadas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {related.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="block rounded-md border bg-card px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <p className="text-xs text-muted-foreground">{item.when}</p>
                      <p className="mt-1 font-medium text-foreground">{item.title}</p>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </section>
          </article>

          <aside className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Buscar no Portal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="relative w-full">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Buscar..." className="pl-9" />
                  </div>
                  <Button size="icon" variant="secondary" aria-label="Buscar">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <AdSlot />

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Mais Lidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mostRead.map((item, idx) => (
                  <div key={`${item.title}-${idx}`} className="flex gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                      <p className="text-sm font-medium leading-snug">{item.title}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Sidebar />
          </aside>
        </div>
      </main>

      <Footer logoUrl={LOGO_URL} />
    </div>
  );
}
