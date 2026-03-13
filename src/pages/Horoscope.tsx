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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

const SIGNS_LIST = [
  { sign: "Áries", slug: "aries", dateRange: "21 mar - 19 abr", symbol: "♈", color: "from-red-500/20 to-orange-500/20" },
  { sign: "Touro", slug: "touro", dateRange: "20 abr - 20 mai", symbol: "♉", color: "from-green-500/20 to-emerald-500/20" },
  { sign: "Gêmeos", slug: "gemeos", dateRange: "21 mai - 20 jun", symbol: "♊", color: "from-yellow-400/20 to-amber-500/20" },
  { sign: "Câncer", slug: "cancer", dateRange: "21 jun - 22 jul", symbol: "♋", color: "from-blue-400/20 to-indigo-500/20" },
  { sign: "Leão", slug: "leao", dateRange: "23 jul - 22 ago", symbol: "♌", color: "from-orange-500/20 to-yellow-600/20" },
  { sign: "Virgem", slug: "virgem", dateRange: "23 ago - 22 set", symbol: "♍", color: "from-teal-500/20 to-green-600/20" },
  { sign: "Libra", slug: "libra", dateRange: "23 set - 22 out", symbol: "♎", color: "from-pink-400/20 to-rose-500/20" },
  { sign: "Escorpião", slug: "escorpiao", dateRange: "23 out - 21 nov", symbol: "♏", color: "from-purple-600/20 to-indigo-900/20" },
  { sign: "Sagitário", slug: "sagitario", dateRange: "22 nov - 21 dez", symbol: "♐", color: "from-purple-500/20 to-blue-600/20" },
  { sign: "Capricórnio", slug: "capricornio", dateRange: "22 dez - 19 jan", symbol: "♑", color: "from-gray-600/20 to-slate-800/20" },
  { sign: "Aquário", slug: "aquario", dateRange: "20 jan - 18 fev", symbol: "♒", color: "from-cyan-400/20 to-blue-500/20" },
  { sign: "Peixes", slug: "peixes", dateRange: "19 fev - 20 mar", symbol: "♓", color: "from-indigo-400/20 to-purple-500/20" },
];

const FALLBACK_PREDICTIONS: Record<string, { ontem: string, hoje: string, amanha: string }> = {
  aries: {
    ontem: "Ontem, Marte impulsionou sua energia, forçando você a enfrentar medos com coragem. As faíscas que soltaram podem ter gerado bons resultados profissionais.",
    hoje: "Sua determinação está em alta! Hoje é o momento de focar em objetivos que exigem iniciativa e ousadia. Cuidado para não atropelar quem está ao seu redor.",
    amanha: "O universo pede paciência para o dia de amanhã. Grandes conquistas levarão tempo para amadurecer. Escute mais e aja por impulso apenas se a intuição falar alto."
  },
  touro: {
    ontem: "As energias de Vênus trouxeram calma e necessidade de conforto no dia de ontem. Você pode ter sentido uma forte necessidade de apreciar as pequenas coisas.",
    hoje: "Hoje, sua resiliência e foco no prático são seus maiores trunfos. Momentos a dois ou em família serão particularmente reconfortantes. Organize suas finanças.",
    amanha: "Amanhã, surpresas no campo material podem surgir. Mantenha os pés no chão, mas permita-se pequenas inovações na sua rotina habitual."
  },
  gemeos: {
    ontem: "Sua mente não parou ontem. A comunicação foi a chave para resolver mal-entendidos e estabelecer novos e interessantes contatos.",
    hoje: "A curiosidade guia seus passos hoje. Excelente momento para aprender algo novo, ler e interagir. Sua versatilidade será exigida de forma positiva.",
    amanha: "Evite a dispersão amanhã. O dia exigirá foco em um único objetivo para que você não perca energia tentando abraçar o mundo inteiro de uma vez."
  },
  cancer: {
    ontem: "Ontem foi um dia em que os laços familiares e seu mundo interno chamaram muita atenção. Emoções passadas podem ter retornado para cura.",
    hoje: "Sua intuição está aguçadíssima hoje. Confie nos instintos, especialmente em decisões difíceis. Procure um refúgio acolhedor no final do dia.",
    amanha: "Amanhã, não deixe a vulnerabilidade te paralisar. Use sua sensibilidade para se conectar profundamente com alguém importante."
  },
  leao: {
    ontem: "O seu magnetismo pessoal esteve radiante ontem. Pequenos gestos seus foram observados e elogiados por pessoas ao seu redor.",
    hoje: "O sol brilha na sua essência! Hoje, assumir a liderança num projeto ou em casa trará muito orgulho. Expresse sua criatividade livremente.",
    amanha: "Amanhã, lembre-se de dividir o palco. Elogiar o esforço alheio garantirá a lealdade de quem caminha junto com você."
  },
  virgem: {
    ontem: "Ontem exigiu de você um olhar analítico e muito método para resolver um problema complexo que estava parado.",
    hoje: "O foco nos detalhes te colocará em vantagem hoje. Uma ótima jornada para colocar a rotina e a saúde em perfeita ordem. O cuidado com o corpo é essencial.",
    amanha: "Amanhã, cuidado com a necessidade de perfeição. Acolha alguns erros como parte do aprendizado, não seja tão carrasco consigo mesmo."
  },
  libra: {
    ontem: "A necessidade de harmonia falou alto ontem. Intervenções pacíficas que você realizou evitaram grandes conflitos ao seu redor.",
    hoje: "As relações estão no foco de hoje. Parcerias (tanto românticas quanto profissionais) estão extremamente favorecidas pela energia de Vênus.",
    amanha: "Amanhã poderá ser um dia de escolhas difíceis. Balanceie a razão e o coração, mas saiba que a decisão final deve sempre trazer paz de espírito."
  },
  escorpiao: {
    ontem: "Intensidade foi a palavra de ontem. Algo que estava escondido ou ignorado pediu sua atenção imediata para ser transmutado.",
    hoje: "Seu poder de regeneração e foco cirúrgico estão ativos hoje. É o dia perfeito para resolver enigmas e ir ao fundo de questões pendentes.",
    amanha: "As emoções podem fervilhar amanhã. Use esse poder para criar e não para destruir. A vulnerabilidade consciente curará muitas feridas."
  },
  sagitario: {
    ontem: "O seu desejo de mudança e expansão movimentou o seu dia ontem. Buscar novos conhecimentos foi mais forte do que a rotina.",
    hoje: "A sorte acompanha o humor! Otimismo será seu melhor veículo hoje. Enxergue além dos horizontes comuns e inspire as pessoas com sua visão de mundo.",
    amanha: "Amanhã, o senso de aventura te chamará, mas não pule etapas. A liberdade que você busca só vem junto com uma dose necessária de responsabilidade."
  },
  capricornio: {
    ontem: "O trabalho sério e a construção de alicerces sólidos geraram bons retornos ou pelo menos uma ótima sensação de dever cumprido ontem.",
    hoje: "Ambição na medida exata! Hoje é um momento incrível para estruturar os próximos passos de um plano de longo prazo. Confie no seu próprio tempo.",
    amanha: "Amanhã, reserve um instante para reconhecer as pequenas vitórias em vez de olhar apenas para o topo da montanha. O reconhecimento alheio te fará bem."
  },
  aquario: {
    ontem: "Um dia de ideias fora da caixa que te ajudou a visualizar a solução para um impasse coletivo ou de grupo.",
    hoje: "Originalidade e um pouco de rebeldia guiam seu dia de hoje. Não tenha medo de mostrar sua visão futurista e abraçar causas maiores.",
    amanha: "Amanhã será importante alinhar o ideal com a prática, caso contrário a frustração baterá à porta. Fazer networking será de imenso valor."
  },
  peixes: {
    ontem: "A intuição sussurrou no seu ouvido, e seguir esse caminho mais fluido e desapegado evitou dores de cabeça no dia de ontem.",
    hoje: "Muita empatia e conexão espiritual no dia de hoje. Atividades criativas ligadas à música, artes ou cura trarão enorme contentamento à alma.",
    amanha: "Tente não escapar demais da realidade amanhã. Use sua compaixão natural por um propósito tangível em vez de sonhar com o que não pode ser alcançado agora."
  }
};

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
  const [dayOffset, setDayOffset] = React.useState<"ontem" | "hoje" | "amanha">("hoje");

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

  const getPrediction = (slug: string, signName: string) => {
    const existing = predictions.find(p => p.sign_slug === slug)?.content;
    if (existing) return existing;

    const fallbackForSign = FALLBACK_PREDICTIONS[slug];
    if (fallbackForSign) {
      return fallbackForSign[dayOffset];
    }
    
    return `As estrelas estão alinhando sua energia para este momento. Um ciclo de renovação se inicia para ${signName}, trazendo muita clareza para suas decisões.`;
  };

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
            Horóscopo do Dia
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Descubra as mensagens que o universo reservou para você hoje. 
            Sintonize sua energia com o movimento dos astros e encontre o seu caminho.
          </p>
        </header>

        <section className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3 space-y-10">
            <div className="flex justify-center mb-8">
              <Tabs value={dayOffset} onValueChange={setDayOffset} className="w-full max-w-md">
                <TabsList className="grid w-full grid-cols-3 p-1 bg-muted/50 backdrop-blur-sm border rounded-full">
                  <TabsTrigger value="ontem" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Ontem</TabsTrigger>
                  <TabsTrigger value="hoje" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Hoje</TabsTrigger>
                  <TabsTrigger value="amanha" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Amanhã</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {SIGNS_LIST.map((s) => (
                <Card 
                  key={s.slug} 
                  className={`relative group overflow-hidden border-primary/5 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 bg-gradient-to-br ${s.color} hover:scale-[1.02] cursor-pointer`}
                >
                  <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-1">
                        <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">{s.sign}</h3>
                        <p className="text-xs font-bold text-muted-foreground/80 uppercase tracking-widest">{s.dateRange}</p>
                      </div>
                      <span className="text-4xl filter grayscale group-hover:grayscale-0 transition-all duration-500 opacity-60 group-hover:opacity-100 transform group-hover:scale-110">
                        {s.symbol}
                      </span>
                    </div>
                    
                    <div className="relative">
                      <p className="text-sm text-foreground/80 leading-relaxed min-h-[5.5rem] line-clamp-4 group-hover:line-clamp-none transition-all duration-300">
                        {isLoading ? "Consultando os astros..." : getPrediction(s.slug, s.sign)}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:gap-3 transition-all cursor-pointer">
                            Ler Previsão Completa
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md bg-gradient-to-br from-background to-primary/5 border-primary/20">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-3 text-2xl font-black text-primary">
                              <span className="text-4xl filter opacity-80">{s.symbol}</span>
                              {s.sign}
                            </DialogTitle>
                            <DialogDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground pt-1 border-t border-primary/10">
                              {s.dateRange} • Previsão para {dayOffset}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-6 relative overflow-hidden">
                            <Sparkles className="absolute top-0 right-0 h-24 w-24 text-primary/5 -mr-4 -mt-4 animate-pulse" />
                            <p className="text-base text-foreground/90 leading-relaxed z-10 relative">
                              {isLoading ? "Consultando os astros..." : getPrediction(s.slug, s.sign)}
                            </p>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <div className="h-1 w-12 bg-primary/20 rounded-full overflow-hidden">
                        <div className="h-full w-0 group-hover:w-full bg-primary transition-all duration-700" />
                      </div>
                    </div>
                  </CardContent>
                  
                  {/* Decorative element */}
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
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
