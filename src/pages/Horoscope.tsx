import { ArrowRight, Sparkles } from "lucide-react";
import * as React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { TopBar } from "@/components/marau/TopBar";
import { SiteHeader } from "@/components/marau/SiteHeader";
import { Footer } from "@/components/marau/Footer";
import { AdSlot } from "@/components/marau/AdSlot";
import { HoroscopeSidebar } from "@/components/marau/horoscope/HoroscopeSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { SIGNS_LIST, fetchRealHoroscope } from "@/lib/horoscope";

const FALLBACK_PREDICTIONS: Record<string, { ontem: string, hoje: string, amanha: string }> = {
  aries: {
    ontem: "Ontem, Marte impulsionou sua energia, forçando você a enfrentar medos com coragem. As faíscas que soltaram podem ter gerado bons resultados profissionais.",
    hoje: "Sua determinação está em alta! Hoje é o momento de focar em objetivos que exigem iniciativa e ousadia. Cuidado para não atropelar quem está ao seu redor.",
    amanha: "O universo pede paciência para o dia de amanhã. Grandes conquistas levarão tempo para amadurecer. Escute mais e aja por impulso apenas se a intuição falar alto."
  },
  // We keep the static fallback structure for backward compatibility if needed, 
  // but day-to-day dynamic predictions now come from lib/horoscope
};

async function fetchMostReadNews() {
  const { data, error } = await supabase
    .from("news")
    .select("title")
    .order("published_at", { ascending: false })
    .limit(3);
  if (error) throw error;
  return data || [];
}

function SignCard({ s }: { s: typeof SIGNS_LIST[0] }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { data: prediction, isLoading } = useQuery({
    queryKey: ["horoscope-db", s.slug],
    queryFn: () => fetchRealHoroscope(s.slug),
    staleTime: 1000 * 60 * 60 * 4, // 4 hours
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <Card 
        className={`relative group overflow-hidden border-primary/5 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 bg-gradient-to-br ${s.color} hover:scale-[1.02] cursor-pointer`}
        onClick={() => setIsOpen(true)}
      >
        <CardContent className="p-8 h-full flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">{s.sign}</h3>
                <p className="text-xs font-bold text-muted-foreground/80 uppercase tracking-widest">{s.dateRange}</p>
              </div>
              <span className="text-4xl filter grayscale group-hover:grayscale-0 transition-all duration-500 opacity-60 group-hover:opacity-100 transform group-hover:scale-110">
                {s.symbol}
              </span>
            </div>
            
            <div className="relative mb-6">
              {isLoading ? (
                <div className="space-y-2 animate-pulse min-h-[5.5rem] py-2">
                  <div className="h-4 bg-primary/20 rounded w-full"></div>
                  <div className="h-4 bg-primary/20 rounded w-11/12"></div>
                  <div className="h-4 bg-primary/20 rounded w-4/5"></div>
                </div>
              ) : (
                <p className="text-sm text-foreground/80 leading-relaxed min-h-[5.5rem] line-clamp-4 group-hover:line-clamp-none transition-all duration-300">
                  {prediction}
                </p>
              )}
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between">
            <button className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:gap-3 transition-all">
              Ler Previsão Completa
              <ArrowRight className="h-3 w-3" />
            </button>
            <div className="h-1 w-12 bg-primary/20 rounded-full overflow-hidden shrink-0">
              <div className="h-full w-0 group-hover:w-full bg-primary transition-all duration-700" />
            </div>
          </div>
        </CardContent>
        
        {/* Decorative element */}
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-background to-primary/5 border-primary/20">
          <DialogHeader>
            <DialogTitle className="flex flex-col gap-1 items-start">
              <div className="flex items-center gap-3 text-2xl font-black text-primary">
                <span className="text-4xl filter opacity-80">{s.symbol}</span>
                {s.sign}
              </div>
              <div className="text-sm font-medium text-muted-foreground italic font-normal tracking-normal pt-1 break-words">
                {s.traits}
              </div>
            </DialogTitle>
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground pt-3 border-t border-primary/10 mt-2 flex flex-col gap-3">
              <span>{s.dateRange} • Previsão para Hoje</span>
              <div className="flex flex-wrap gap-2">
                <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-md text-[10px] break-keep">Elemento: {s.element}</span>
                <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-md text-[10px] break-keep">Planeta: {s.planet}</span>
              </div>
            </div>
          </DialogHeader>
          <div className="py-2 relative overflow-hidden">
            <Sparkles className="absolute top-0 right-0 h-24 w-24 text-primary/5 -mr-4 -mt-4 animate-pulse" />
            
            <div className="mb-6 relative z-10">
              <h4 className="text-[11px] uppercase tracking-widest font-bold text-primary mb-2 flex items-center gap-2">
                Perfil do Signo
                <div className="h-px bg-primary/20 flex-grow"></div>
              </h4>
              <p className="text-base text-foreground/90 leading-relaxed break-words pl-2 border-l-2 border-primary/20">
                {s.profileDesc}
              </p>
            </div>

            <div className="relative z-10">
              <h4 className="text-[11px] uppercase tracking-widest font-bold text-primary mb-2 flex items-center gap-2">
                Nas Estrelas
                <div className="h-px bg-primary/20 flex-grow"></div>
              </h4>
              <p className="text-base text-foreground/90 leading-relaxed break-words pl-2 border-l-2 border-primary/20">
                {isLoading ? "Consultando os astros e traduzindo a energia cósmica..." : prediction}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function Horoscope() {
  const { data: mostRead = [] } = useQuery({
    queryKey: ["sidebar-most-read-titles"],
    queryFn: fetchMostReadNews,
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <SiteHeader logoUrl="/logo.png" />

      <main className="container px-4 py-12">
        <header className="mb-12 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-8 bg-primary/30" />
            <span className="flex items-center gap-1.5 text-sm font-bold text-primary uppercase tracking-[0.2em]">
              <Sparkles className="h-4 w-4" />
              Conexão Astral
              <Sparkles className="h-4 w-4" />
            </span>
            <div className="h-px w-8 bg-primary/30" />
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
            Horóscopo do Dia <span className="text-xs align-top opacity-30">v1.1.2</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Descubra as mensagens que o universo reservou para você hoje. 
            Sintonize sua energia com o movimento dos astros e encontre o seu caminho.
          </p>
        </header>

        <section className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {SIGNS_LIST.map((s) => (
                <SignCard key={s.slug} s={s} />
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
