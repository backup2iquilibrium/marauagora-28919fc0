import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

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

const LOGO_URL = "/logo.png";

type CategoryItem = {
  tag: string;
  title: string;
  excerpt: string;
  authorLine: string;
  date: string;
  href: string;
  price?: string;
  whatsapp?: string;
  imageUrl?: string;
};

async function fetchActiveAds() {
  const { data, error } = await supabase
    .from("classified_ads")
    .select("*, classified_ad_media(*)")
    .eq("status", "active")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

function ClassifiedCard({ item }: { item: CategoryItem }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-[4/3] bg-muted relative">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">Sem imagem</div>
        )}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
            {item.tag}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        {item.price && (
          <p className="text-xl font-bold text-primary mb-1">{item.price}</p>
        )}
        <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2">
          {item.title}
        </h3>
        <p className="text-xs text-muted-foreground mb-4">{item.date}</p>
        <Button className="w-full gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white border-none" asChild>
          <a href={`https://wa.me/${item.whatsapp}`} target="_blank" rel="noopener noreferrer">
            Contatar Vendedor
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function CategoryNews() {
  const { slug } = useParams();
  const sanitizedSlug = (slug || "").trim().toLowerCase();

  const categoryLabel = useMemo(() => {
    if (!sanitizedSlug) return "Notícias";
    const map: Record<string, string> = {
      esportes: "Esportes",
      esporte: "Esportes",
      politica: "Política",
      policia: "Polícia",
      policial: "Polícia",
      agronegocio: "Agronegócio",
      agronegócios: "Agronegócio",
      cidade: "Cidade",
      noticias: "Notícias",
      classificados: "Classificados",
    };
    return map[sanitizedSlug] ?? sanitizedSlug.charAt(0).toUpperCase() + sanitizedSlug.slice(1);
  }, [sanitizedSlug]);

  const filters = useMemo(() => {
    const filterMap: Record<string, string[]> = {
      esportes: ["Todos", "Futebol", "Vôlei", "Futsal", "Eventos"],
      agronegocio: ["Todos", "Safra", "Pecuária", "Tecnologia", "Mercado"],
      politica: ["Todos", "Municipal", "Estadual", "Nacional"],
      policia: ["Todos", "Ocorrências", "Trânsito", "Investigação"],
      classificados: ["Todos", "Veículos", "Imóveis", "Serviços", "Empregos"],
    };
    return filterMap[sanitizedSlug] ?? ["Todos", "Geral", "Destaques"];
  }, [sanitizedSlug]);

  const highlight = useMemo(() => {
    if (sanitizedSlug === "agronegocio") {
      return {
        title: "Safra recorde de soja impulsiona economia local e gera novos empregos",
        excerpt: "Produtores rurais de Marau celebram números positivos da colheita, superando expectativas iniciais do setor.",
        authorLine: "Por Redação",
        time: "Há 1 dia",
        href: "/noticia/safra-recorde-soja-marau",
      };
    }
    if (sanitizedSlug === "classificados") {
      return {
        title: "Mercado imobiliário em Marau apresenta alta procura por aluguéis no centro",
        excerpt: "Levantamento aponta que a proximidade com serviços e comércio é o principal fator de decisão para novos moradores.",
        authorLine: "Por Redação",
        time: "Há 5 horas",
        href: "/categoria/classificados",
      };
    }
    if (sanitizedSlug === "politica") {
      return {
        title: "Câmara de Vereadores debate novo plano diretor para o desenvolvimento de Marau",
        excerpt: "Audiência pública reuniu especialistas e comunidade para discutir o futuro urbano do município nos próximos 10 anos.",
        authorLine: "Por Luiz Abreu",
        time: "Há 3 horas",
        href: "/noticia/plano-diretor-marau",
      };
    }
    return {
      title: "Vôlei Marau conquista título regional histórico em noite de ginásio lotado",
      excerpt: "A equipe local superou os adversários de Passo Fundo em uma partida emocionante de cinco sets neste domingo.",
      authorLine: "Por Lucas Silva",
      time: "Há 2 horas",
      href: "/noticia/volei-marau-conquista-titulo",
    };
  }, [sanitizedSlug]);

  const adsQuery = useQuery({
    queryKey: ["active_classified_ads"],
    queryFn: fetchActiveAds,
    enabled: sanitizedSlug === "classificados",
  });

  const items = useMemo<CategoryItem[]>(() => {
    if (sanitizedSlug === "agronegocio") {
      return [
        {
          tag: "Tecnologia",
          title: "Drones transformam o monitoramento de safras no interior de Marau",
          excerpt: "Novos equipamentos permitem identificar pragas e falhas na irrigação com precisão milimétrica.",
          authorLine: "",
          date: "25 Out, 2023",
          href: "/noticia/drones-campo-marau",
        },
        {
          tag: "Mercado",
          title: "Preço do milho apresenta estabilidade após oscilações na bolsa",
          excerpt: "Análise econômica mostra o impacto direto nos produtores da região norte do estado.",
          authorLine: "",
          date: "24 Out, 2023",
          href: "/noticia/preco-milho-estabilidade",
        },
      ];
    }
    if (sanitizedSlug === "classificados") {
      const dbAds = (adsQuery.data || []).map((ad: any) => ({
        tag: ad.category_slug.charAt(0).toUpperCase() + ad.category_slug.slice(1),
        title: ad.title,
        excerpt: ad.description || "",
        authorLine: ad.advertiser_name,
        date: format(new Date(ad.created_at), "dd MMM, yyyy"),
        href: `/categoria/classificados`,
        price: ad.price,
        whatsapp: ad.whatsapp,
        imageUrl: ad.classified_ad_media?.[0]?.media_url || ad.classified_ad_media?.[0]?.thumbnail_url,
      }));

      const mockClassifieds = [
        {
          tag: "Veículos",
          title: "Vende-se Caminhonete Hilux 2022 - Único dono",
          excerpt: "Veículo em estado de novo, com todas as revisões feitas em concessionária. Completa e pronta para uso.",
          authorLine: "",
          date: "26 Out, 2023",
          href: "/categoria/classificados",
          price: "R$ 245.000,00",
          whatsapp: "5554999999999",
        },
        {
          tag: "Imóveis",
          title: "Apartamento de 2 dormitórios para locação próxima à Praça Central",
          excerpt: "Excelente localização, mobiliado e com box de garagem. Ideal para estudantes ou casais novos.",
          authorLine: "",
          date: "25 Out, 2023",
          href: "/categoria/classificados",
          price: "R$ 1.800,00 / mês",
          whatsapp: "5554999999988",
        },
        {
          tag: "Serviços",
          title: "Aulas Particulares de Inglês e Reforço Escolar",
          excerpt: "Professor com experência internacional atende em domicílio ou online. Metodologia personalizada.",
          authorLine: "",
          date: "23 Out, 2023",
          href: "/categoria/classificados",
          price: "Consulte valor",
          whatsapp: "5554999999977",
        },
        {
          tag: "Imóveis",
          title: "Terreno em Loteamento Novo - Pronto para construir",
          excerpt: "Lote de 360m² em área alta com infraestrutura completa e ótima vista da cidade.",
          authorLine: "",
          date: "22 Out, 2023",
          href: "/categoria/classificados",
          price: "R$ 120.000,00",
          whatsapp: "5554999999966",
        },
      ];

      return [...dbAds, ...mockClassifieds];
    }
    if (sanitizedSlug === "politica") {
      return [
        {
          tag: "Municipal",
          title: "Prefeitura anuncia novos investimentos para a rede municipal de educação",
          excerpt: "Recursos serão destinados à reforma de escolas e aquisição de novos equipamentos tecnológicos.",
          authorLine: "",
          date: "24 Out, 2023",
          href: "/noticia/investimentos-educacao",
        },
      ];
    }
    return [
      {
        tag: "Futebol",
        title: "Campeonato Municipal de Futebol inicia neste final de semana com 12 equipes",
        excerpt: "Jogos de abertura acontecem no Estádio Municipal Carlos Renato Bebber com entrada franca.",
        authorLine: "",
        date: "24 Out, 2023",
        href: "/noticia/campeonato-municipal-futebol",
      },
      {
        tag: "Atletismo",
        title: "Maratona Escolar reúne mais de 500 estudantes da rede pública",
        excerpt: "Evento promove saúde e integração entre as escolas do município.",
        authorLine: "",
        date: "23 Out, 2023",
        href: "/noticia/maratona-escolar-500-estudantes",
      },
    ];
  }, [sanitizedSlug]);

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
              {sanitizedSlug === "classificados" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {items.map((item, idx) => (
                    <ClassifiedCard key={idx} item={item} />
                  ))}
                </div>
              ) : (
                <div className="space-y-8">
                  <section>
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

                  <section className="space-y-6">
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
                  </section>
                </div>
              )}

              <div className="flex justify-center mt-8">
                <Button variant="outline" className="gap-2">
                  Carregar mais {sanitizedSlug === "classificados" ? "anúncios" : "notícias"}
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
