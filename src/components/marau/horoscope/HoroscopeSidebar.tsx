import { Mail, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { AdSlot } from "@/components/marau/AdSlot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SIGNS_LIST, fetchRealHoroscope, getCurrentSign } from "@/lib/horoscope";

type MostReadItem = { title: string; href?: string };

export function HoroscopeSidebar({ mostRead }: { mostRead: MostReadItem[] }) {
  const currentSign = getCurrentSign();

  const { data: prediction, isLoading } = useQuery({
    queryKey: ["horoscope-sidebar", currentSign.slug],
    queryFn: () => fetchRealHoroscope(currentSign.slug),
    staleTime: 1000 * 60 * 60 * 4, // 4 hours
    refetchOnWindowFocus: false,
  });

  return (
    <aside className="lg:col-span-1 space-y-8">
      <AdSlot label="Anúncio (300x250)" />

      <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5 overflow-hidden relative">
        <CardHeader className="pb-3 relative z-10">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Signo do Mês
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 relative z-10">
          <div className="rounded-xl border border-primary/10 bg-card/50 backdrop-blur-sm p-6 shadow-sm group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <p className="text-xl font-black text-primary uppercase tracking-tighter">{currentSign.sign}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{currentSign.dateRange}</p>
              </div>
              <span className="text-3xl opacity-50 group-hover:opacity-100 transition-opacity">{currentSign.symbol}</span>
            </div>
            {isLoading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-3 bg-primary/10 rounded w-full"></div>
                <div className="h-3 bg-primary/10 rounded w-5/6"></div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                "{prediction}"
              </p>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-6 w-full border-primary/20 hover:bg-primary hover:text-white transition-all font-bold text-xs uppercase tracking-widest cursor-pointer">
                  Ver Perfil Completo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-gradient-to-br from-background to-primary/5 border-primary/20">
                <DialogHeader>
                  <DialogTitle className="flex flex-col gap-1 items-start">
                    <div className="flex items-center gap-3 text-2xl font-black text-primary">
                      <span className="text-4xl filter opacity-80">{currentSign.symbol}</span>
                      {currentSign.sign}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground italic font-normal tracking-normal pt-1 break-words">
                      {currentSign.traits}
                    </div>
                  </DialogTitle>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground pt-3 border-t border-primary/10 mt-2 flex flex-col gap-3">
                    <span>{currentSign.dateRange} • Signo do Mês</span>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-md text-[10px] break-keep">Elemento: {currentSign.element}</span>
                      <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-md text-[10px] break-keep">Planeta: {currentSign.planet}</span>
                    </div>
                  </div>
                </DialogHeader>
                <div className="py-2 relative overflow-hidden">
                  <Sparkles className="absolute top-0 right-0 h-24 w-24 text-primary/5 -mr-4 -mt-4 animate-pulse pointer-events-none" />
                  
                  <div className="mb-6 bg-muted/30 border border-primary/10 rounded-xl p-4 shadow-sm relative z-10">
                    <h4 className="text-[11px] uppercase tracking-widest font-bold text-primary mb-2 flex items-center gap-2">
                      Perfil do Signo
                      <div className="h-px bg-primary/20 flex-grow"></div>
                    </h4>
                    <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                      {currentSign.profileDesc}
                    </p>
                  </div>

                  <div className="relative z-10">
                    <h4 className="text-[11px] uppercase tracking-widest font-bold text-primary mb-2 flex items-center gap-2">
                      Energia do Mês
                      <div className="h-px bg-primary/20 flex-grow"></div>
                    </h4>
                    <p className="text-base text-foreground/90 leading-relaxed break-words pl-2 border-l-2 border-primary/20">
                      {isLoading ? "Consultando os astros..." : prediction}
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Mais Lidas no Marau Agora</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {mostRead.map((item, idx) => (
              <li key={`${idx}-${item.title}`} className="flex gap-3 items-start">
                <span className="text-2xl font-black text-muted leading-none">{idx + 1}</span>
                {item.href ? (
                  <Link className="text-sm font-medium hover:text-primary transition-colors" to={item.href}>
                    {item.title}
                  </Link>
                ) : (
                  <a className="text-sm font-medium hover:text-primary transition-colors" href="#">
                    {item.title}
                  </a>
                )}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card className="bg-secondary/10 border-secondary/20">
        <CardContent className="p-6 text-center">
          <Mail className="h-10 w-10 text-secondary mx-auto mb-2" aria-hidden="true" />
          <h3 className="font-bold text-lg text-primary">Horóscopo no seu e-mail</h3>
          <p className="mt-1 text-xs text-muted-foreground">Receba previsões diárias e conteúdos exclusivos.</p>
          <form className="mt-4 space-y-2" onSubmit={(e) => e.preventDefault()}>
            <Input type="email" placeholder="Seu e-mail" inputMode="email" autoComplete="email" className="bg-card" />
            <Button className="w-full">Inscrever-se</Button>
          </form>
        </CardContent>
      </Card>
    </aside>
  );
}
