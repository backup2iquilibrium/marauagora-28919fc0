import { ArrowRight, Sparkles } from "lucide-react";
import * as React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format, addDays, subDays } from "date-fns";

import { TopBar } from "@/components/marau/TopBar";
import { SiteHeader } from "@/components/marau/SiteHeader";
import { Footer } from "@/components/marau/Footer";
import { AdSlot } from "@/components/marau/AdSlot";
import { HoroscopeSidebar } from "@/components/marau/horoscope/HoroscopeSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

const SIGNS_LIST = [
  { sign: "Áries", slug: "aries", dateRange: "21 mar - 19 abr" },
  { sign: "Touro", slug: "touro", dateRange: "20 abr - 20 mai" },
  { sign: "Gêmeos", slug: "gemeos", dateRange: "21 mai - 20 jun" },
  { sign: "Câncer", slug: "cancer", dateRange: "21 jun - 22 jul" },
  { sign: "Leão", slug: "leao", dateRange: "23 jul - 22 ago" },
  { sign: "Virgem", slug: "virgem", dateRange: "23 ago - 22 set" },
  { sign: "Libra", slug: "libra", dateRange: "23 set - 22 out" },
  { sign: "Escorpião", slug: "escorpiao", dateRange: "23 out - 21 nov" },
  { sign: "Sagitário", slug: "sagitario", dateRange: "22 nov - 21 dez" },
  { sign: "Capricórnio", slug: "capricornio", dateRange: "22 dez - 19 jan" },
  { sign: "Aquário", slug: "aquario", dateRange: "20 jan - 18 fev" },
  { sign: "Peixes", slug: "peixes", dateRange: "19 fev - 20 mar" },
];

async function fetchHoroscope(date: string) {
  const { data, error } = await supabase
    .from("horoscopes")
    .select("*")
    .eq("for_date", date)
    .eq("is_published", true);
  if (error) throw error;
  return data || [];
}

async function fetchMostReadNews() {
  const { data, error } = await supabase
    .from("news")
    .select("title")
    .order("published_at", { ascending: false })
    .limit(3);
  if (error) throw error;
  return data || [];
}

export default function Horoscope() {
  const [dayOffset, setDayOffset] = React.useState<string>("hoje");

  const targetDate = React.useMemo(() => {
    const now = new Date();
    if (dayOffset === "ontem") return format(subDays(now, 1), "yyyy-MM-dd");
    if (dayOffset === "amanha") return format(addDays(now, 1), "yyyy-MM-dd");
    return format(now, "yyyy-MM-dd");
  }, [dayOffset]);

  const { data: predictions = [], isLoading } = useQuery({
    queryKey: ["horoscope", targetDate],
    queryFn: () => fetchHoroscope(targetDate),
  });

  const { data: mostRead = [] } = useQuery({
    queryKey: ["sidebar-most-read-titles"],
    queryFn: fetchMostReadNews,
  });

  const getPrediction = (slug: string) => {
    return predictions.find(p => p.sign_slug === slug)?.content ||
      "As estrelas estão alinhando sua energia. Aproveite o dia para refletir sobre seus objetivos e cultivar o equilíbrio emocional.";
  };

  const rows = React.useMemo(() => {
    const result = [];
    for (let i = 0; i < SIGNS_LIST.length; i += 3) {
      result.push(SIGNS_LIST.slice(i, i + 3));
    }
    return result;
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <SiteHeader logoUrl="/logo.png" />

      <main className="container px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <p className="text-sm font-semibold text-primary">Horóscopo</p>
          </div>
          <h1 className="mt-3 font-serif text-3xl md:text-5xl font-bold">Previsões Astrais</h1>
          <p className="mt-2 text-muted-foreground text-lg">O que os astros reservam para o seu caminho.</p>
        </header>

        <section className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <Tabs value={dayOffset} onValueChange={setDayOffset}>
              <TabsList className="rounded-full p-1 bg-muted">
                <TabsTrigger value="ontem" className="rounded-full px-6">Ontem</TabsTrigger>
                <TabsTrigger value="hoje" className="rounded-full px-6">Hoje</TabsTrigger>
                <TabsTrigger value="amanha" className="rounded-full px-6">Amanhã</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SIGNS_LIST.map((s) => (
                <Card key={s.slug} className="hover:shadow-lg transition-all duration-300 border-primary/10 group overflow-hidden">
                  <CardContent className="p-8 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{s.sign}</h3>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{s.dateRange}</p>
                      </div>
                      <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <Sparkles className="h-6 w-6" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                      {isLoading ? "Consultando os astros..." : getPrediction(s.slug)}
                    </p>
                    <Button variant="link" className="p-0 text-primary font-bold gap-2 group-hover:translate-x-1 transition-transform">
                      Ver previsão completa <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <AdSlot label="Espaço Publicitário" />
          </div>

          <HoroscopeSidebar mostRead={mostRead} />
        </section>
      </main>

      <Footer logoUrl="/logo.png" />
    </div>
  );
}
