import { ArrowRight, Sparkles } from "lucide-react";
import * as React from "react";
import { Link } from "react-router-dom";

import { TopBar } from "@/components/marau/TopBar";
import { SiteHeader } from "@/components/marau/SiteHeader";
import { Footer } from "@/components/marau/Footer";
import { AdSlot } from "@/components/marau/AdSlot";
import { HoroscopeSidebar } from "@/components/marau/horoscope/HoroscopeSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LOGO_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAxrvhZIsLpFBhL4Fdg88ttSHjhIb-frJZQZlaxm8GNQc7IW4mGb6BEqX2FQHmaj5bWS_a_MAl-WrKOfqZv531UtiOEoVWECnv_zEkdUgFQPP4xOUlX1yLx1i1OZJ8scM7yIzgQ_kxoKeircZhd3n99pbXddvrZNxvVJ0LngrGdOEY6Erpyltdl5OirCSp02ao8a-6h_Tq9XGEvnDmkDVa-vtppe-1SASqAQ2YWNx6p66Oa5ofAncc0fEvxM9h_FbKYN9e7c07h";

type DayKey = "ontem" | "hoje" | "amanha";
type SignItem = {
  sign: string;
  dateRange: string;
  summary: string;
};

const BASE_SIGNS: SignItem[] = [
  {
    sign: "Áries",
    dateRange: "21 mar - 19 abr",
    summary:
      "A energia favorece a iniciativa. No trabalho, apresente novas ideias. No amor, exercite paciência. A saúde pede atenção com excessos.",
  },
  {
    sign: "Touro",
    dateRange: "20 abr - 20 mai",
    summary:
      "Foco na estabilidade. Organize finanças e revise orçamentos. No amor, a segurança emocional será prioridade.",
  },
  {
    sign: "Gêmeos",
    dateRange: "21 mai - 20 jun",
    summary: "Comunicação é a chave. Resolva mal-entendidos e encontre soluções criativas para questões domésticas.",
  },
  {
    sign: "Câncer",
    dateRange: "21 jun - 22 jul",
    summary: "Sensibilidade em alta. Conecte-se com a família. A intuição pode guiar decisões importantes hoje.",
  },
  {
    sign: "Leão",
    dateRange: "23 jul - 22 ago",
    summary:
      "Carisma em alta. Fortaleça laços sociais. Financeiramente, evite gastos impulsivos com luxos desnecessários.",
  },
  {
    sign: "Virgem",
    dateRange: "23 ago - 22 set",
    summary:
      "Detalhes contam. Um projeto antigo pode ser concluído. Cuidado para não ser crítico demais com os outros.",
  },
  {
    sign: "Libra",
    dateRange: "23 set - 22 out",
    summary:
      "Busque equilíbrio nas relações. No trabalho, a diplomacia será sua melhor ferramenta. Um encontro pode ser promissor.",
  },
  {
    sign: "Escorpião",
    dateRange: "23 out - 21 nov",
    summary:
      "Intensidade e transformação. Um ciclo se encerra para outro começar. Confie na sua força para superar desafios.",
  },
  {
    sign: "Sagitário",
    dateRange: "22 nov - 21 dez",
    summary:
      "Ótimo dia para planejar viagens ou estudos. A mente está aberta para novos conhecimentos. Surpresas agradáveis podem acontecer.",
  },
  {
    sign: "Capricórnio",
    dateRange: "22 dez - 19 jan",
    summary:
      "Ambição em destaque. Defina metas claras e use a disciplina para superar obstáculos. Reserve um tempo para relaxar.",
  },
  {
    sign: "Aquário",
    dateRange: "20 jan - 18 fev",
    summary:
      "Ideias originais surgem. O momento favorece tecnologia e inovação. Amigos podem trazer boas notícias.",
  },
  {
    sign: "Peixes",
    dateRange: "19 fev - 20 mar",
    summary:
      "Dia sonhador. Criatividade artística favorecida. Evite fugir da realidade e mantenha compromissos práticos em dia.",
  },
];

const MOST_READ = [
  { title: "Prefeitura anuncia novas obras no centro da cidade para 2024." },
  { title: "Festival de gastronomia atrai milhares de turistas neste fim de semana." },
  { title: "Confira a previsão do tempo para o feriado em Marau." },
];

function dayLabel(day: DayKey) {
  if (day === "ontem") return "Ontem";
  if (day === "amanha") return "Amanhã";
  return "Hoje";
}

function dayVariantSummary(base: string, day: DayKey) {
  if (day === "ontem") return `${base} Reflita sobre escolhas recentes e ajuste o ritmo.`;
  if (day === "amanha") return `${base} Prepare-se: pequenas oportunidades podem aparecer cedo.`;
  return base;
}

function chunk<T>(arr: T[], size: number) {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function Horoscope() {
  const [day, setDay] = React.useState<DayKey>("hoje");

  const signs = React.useMemo(
    () => BASE_SIGNS.map((s) => ({ ...s, summary: dayVariantSummary(s.summary, day) })),
    [day],
  );

  const rows = React.useMemo(() => chunk(signs, 3), [signs]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <SiteHeader logoUrl={LOGO_URL} />

      <main className="container px-4 py-8">
        <nav className="text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Início
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Horóscopo</span>
        </nav>

        <div className="mt-6">
          <AdSlot label="Banner Principal (728x90)" />
        </div>

        <header className="mt-8">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
            <p className="text-sm font-semibold text-primary">Astrologia</p>
          </div>
          <h1 className="mt-3 font-serif text-3xl tracking-tight md:text-4xl">Horóscopo do Dia</h1>
          <p className="mt-2 text-muted-foreground">Descubra o que os astros revelam para você hoje.</p>
        </header>

        <section className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <Tabs value={day} onValueChange={(v) => setDay(v as DayKey)}>
              <TabsList>
                <TabsTrigger value="ontem">Ontem</TabsTrigger>
                <TabsTrigger value="hoje">Hoje</TabsTrigger>
                <TabsTrigger value="amanha">Amanhã</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{dayLabel(day)}</p>
              <span className="text-xs text-muted-foreground">Atualizado diariamente</span>
            </div>

            <div className="space-y-6">
              {rows.map((row, idx) => (
                <React.Fragment key={idx}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {row.map((s) => (
                      <Card key={s.sign} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6 space-y-3">
                          <div>
                            <p className="font-bold text-lg">{s.sign}</p>
                            <p className="text-xs text-muted-foreground">{s.dateRange}</p>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{s.summary}</p>
                          <Button variant="secondary" className="w-full gap-2">
                            Ler mais
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {idx === 0 ? <AdSlot label="Espaço Publicitário Horizontal" /> : null}
                </React.Fragment>
              ))}
            </div>
          </div>

          <HoroscopeSidebar mostRead={MOST_READ} />
        </section>
      </main>

      <Footer logoUrl={LOGO_URL} />
    </div>
  );
}
