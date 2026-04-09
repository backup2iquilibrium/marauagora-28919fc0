import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { TopBar } from "@/components/marau/TopBar";
import { SiteHeader } from "@/components/marau/SiteHeader";
import { Footer } from "@/components/marau/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Flag, Eye, BadgeCheck, PencilLine, Globe, Users, Newspaper,
  Instagram, Mail, Loader2, User, Megaphone,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const LOGO_URL = "/logo.png";

// Map icon names stored in the DB to lucide components
const ICON_MAP: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  flag: Flag, eye: Eye, "badge-check": BadgeCheck, pencil: PencilLine,
  globe: Globe, users: Users, newspaper: Newspaper, user: User,
};

function getIcon(name: string) { return ICON_MAP[name?.toLowerCase()] ?? Flag; }

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="space-y-2">
      <h2 className="text-2xl md:text-3xl font-black tracking-tight">{title}</h2>
      {subtitle ? <p className="text-muted-foreground leading-relaxed">{subtitle}</p> : null}
    </header>
  );
}

export default function QuemSomos() {
  const heroQ = useQuery({
    queryKey: ["about_page"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("about_page")
        .select("*")
        .eq("id", "00000000-0000-0000-0000-000000000001")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const valuesQ = useQuery({
    queryKey: ["about_values"],
    queryFn: async () => {
      const { data, error } = await supabase.from("about_values").select("*").order("sort_order");
      if (error) throw error;
      return data || [];
    },
  });

  const timelineQ = useQuery({
    queryKey: ["about_timeline"],
    queryFn: async () => {
      const { data, error } = await supabase.from("about_timeline").select("*").order("sort_order");
      if (error) throw error;
      return data || [];
    },
  });

  const teamQ = useQuery({
    queryKey: ["about_team"],
    queryFn: async () => {
      const { data, error } = await supabase.from("about_team").select("*").order("sort_order");
      if (error) throw error;
      return data || [];
    },
  });

  const hero = heroQ.data;
  const values = valuesQ.data || [];
  const timeline = timelineQ.data || [];
  const team = teamQ.data || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <SiteHeader logoUrl={LOGO_URL} />

      <main className="container px-4 py-8 space-y-12">
        {/* Hero */}
        <section aria-label="Hero — Quem Somos">
          <div
            className={cn(
              "relative overflow-hidden rounded-xl",
              "min-h-[360px] md:min-h-[440px]",
              "flex items-center justify-center text-center",
            )}
            style={{
              backgroundImage: `linear-gradient(hsl(var(--primary) / 0.60), hsl(var(--primary) / 0.82)), url(${hero?.hero_image_url || "/marau-hero.png"})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="relative z-10 max-w-3xl px-6 py-10">
              <h1 className="text-primary-foreground text-4xl md:text-5xl font-black leading-tight tracking-tight">
                {hero?.hero_title || "Marau Agora: A voz da nossa comunidade"}
              </h1>
              <p className="mt-4 text-primary-foreground/90 text-base md:text-lg leading-relaxed">
                {hero?.hero_subtitle || "Seu portal confiável para notícias locais, cultura, esportes e eventos em Marau e região."}
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" variant="secondary" onClick={() => document.getElementById('historia')?.scrollIntoView({ behavior: 'smooth' })}>
                  Nossa História
                </Button>
                <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-white/90 border-none" onClick={() => document.getElementById('missao')?.scrollIntoView({ behavior: 'smooth' })}>
                  Nossa Missão e Valores
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Intro Text */}
        {hero?.intro_text && (
          <section className="max-w-3xl mx-auto text-center">
             <p className="text-lg text-muted-foreground leading-relaxed">
              {hero.intro_text}
             </p>
          </section>
        )}

        {/* Valores */}
        {values.length > 0 && (
          <section id="missao" className="grid grid-cols-1 lg:grid-cols-3 gap-6 scroll-mt-20" aria-label="Missão, visão e valores">
            <div className="lg:col-span-1">
              <SectionTitle title="Nossa Missão e Valores" />
            </div>
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {values.map((item: any) => {
                  const Icon = getIcon(item.icon);
                  return (
                    <Card key={item.id} className="shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Icon className="h-5 w-5 text-primary" />
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Timeline */}
        {timeline.length > 0 && (
          <section id="historia" aria-label="Nossa Jornada" className="space-y-10 scroll-mt-20 py-10 overflow-hidden">
            <SectionTitle title="Nossa Jornada" />
            
            <div className="relative mt-20">
              {/* Barra Central (Desktop) */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 z-0" />
              
              <div className="flex flex-col md:flex-row gap-8 md:gap-0 relative z-10 md:overflow-x-auto md:pb-10 no-scrollbar">
                {timeline.map((step: any, index: number) => {
                  const colors = [
                    'border-orange-500 text-orange-600 bg-orange-500', 
                    'border-pink-500 text-pink-600 bg-pink-500', 
                    'border-purple-500 text-purple-600 bg-purple-500', 
                    'border-blue-500 text-blue-600 bg-blue-500', 
                    'border-indigo-500 text-indigo-600 bg-indigo-500',
                    'border-emerald-500 text-emerald-600 bg-emerald-500'
                  ];
                  const colorClass = colors[index % colors.length];
                  const [borderColor, textColor, bgColor] = colorClass.split(' ');
                  
                  return (
                    <div 
                      key={step.id} 
                      className={cn(
                        "relative flex-1 md:min-w-[300px] px-4",
                        "md:flex md:flex-col",
                        index % 2 === 0 ? "md:justify-start" : "md:justify-end md:mt-[240px]"
                      )}
                    >
                      {/* Card de Conteúdo */}
                      <div className={cn(
                        "bg-card border-l-4 p-5 shadow-lg rounded-r-xl transition-transform hover:scale-105",
                        borderColor
                      )}>
                        <div className="flex items-center gap-2 mb-2 font-black uppercase text-xs tracking-widest opacity-70">
                          <Newspaper className="h-4 w-4" />
                          Linha do Tempo
                        </div>
                        <h4 className="text-lg font-black leading-tight mb-2">{step.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                          {step.description}
                        </p>
                      </div>

                      {/* Marcador de Ano (Conector) */}
                      <div className={cn(
                        "absolute left-1/2 -translate-x-1/2 z-20",
                        "hidden md:flex flex-col items-center",
                        index % 2 === 0 ? "top-[100%] pt-4" : "bottom-[100%] pb-4"
                      )}>
                        {/* Linha vertical conectora */}
                        <div className={cn("w-1 h-12", bgColor, "opacity-40")} />
                        
                        {/* Círculo do Ano na Barra */}
                        <div className={cn(
                          "w-12 h-12 rounded-full border-4 border-background flex items-center justify-center text-white font-black text-sm shadow-xl",
                          bgColor
                        )}>
                          {step.year}
                        </div>
                      </div>

                      {/* Marcador de Ano (Mobile) */}
                      <div className="md:hidden absolute -left-2 top-4 w-10 h-10 rounded-full border-4 border-background bg-primary flex items-center justify-center text-white font-bold text-xs ring-2 ring-primary/20">
                        {step.year}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Equipe */}
        {team.length > 0 && (
          <section aria-label="Equipe" className="space-y-6">
            <SectionTitle
              title="Quem faz o Marau Agora"
              subtitle="Uma equipe dedicada de jornalistas e colunistas comprometidos com a verdade."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {team.map((p: any) => (
                <Card key={p.id} className="shadow-sm overflow-hidden">
                  {p.photo_url ? (
                    <div className="h-40 overflow-hidden bg-muted">
                      <img src={p.photo_url} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-40 flex items-center justify-center bg-muted">
                      <User className="h-14 w-14 text-muted-foreground/30" />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{p.name}</CardTitle>
                    <p className="text-sm text-muted-foreground font-medium">{p.role}</p>
                  </CardHeader>
                  {p.bio && (
                    <CardContent className="pt-0 text-sm text-muted-foreground">{p.bio}</CardContent>
                  )}
                  {(p.social_instagram || p.social_email) && (
                    <CardContent className="pt-0 flex gap-3">
                      {p.social_instagram && (
                        <a href={`https://instagram.com/${p.social_instagram}`} target="_blank" rel="noopener noreferrer"
                          className="text-primary hover:opacity-80">
                          <Instagram className="h-4 w-4" />
                        </a>
                      )}
                      {p.social_email && (
                        <a href={`mailto:${p.social_email}`} className="text-primary hover:opacity-80">
                          <Mail className="h-4 w-4" />
                        </a>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Anuncie Conosco CTA */}
        <section aria-label="Anuncie Conosco" className="rounded-xl bg-primary p-8 md:p-12 text-primary-foreground shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 opacity-10">
            <Megaphone className="h-48 w-48 rotate-12" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative z-10">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-3xl md:text-4xl font-black tracking-tight">Anuncie no Marau Agora</h3>
              <p className="text-lg opacity-90 leading-relaxed max-w-2xl">
                Sua marca vista por milhares de pessoas todos os dias. Conheça nossas soluções de publicidade e conecte-se com Marau e região.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <Button asChild size="lg" variant="secondary" className="font-bold text-lg px-8 h-14">
                <Link to="/anuncie-conosco">Conhecer Soluções</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer logoUrl={LOGO_URL} />
    </div>
  );
}
