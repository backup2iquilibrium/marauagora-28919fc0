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
  Store, Home, Factory, Building, PieChart, Mountain, Mic, Video
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const LOGO_URL = "/logo.png";

// Map icon names stored in the DB to lucide components
const ICON_MAP: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  flag: Flag, eye: Eye, "badge-check": BadgeCheck, pencil: PencilLine,
  globe: Globe, users: Users, newspaper: Newspaper, user: User,
  store: Store, home: Home, factory: Factory, building: Building,
  "pie-chart": PieChart, mountain: Mountain, mic: Mic, video: Video
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
          <section id="historia" aria-label="Nossa Jornada" className="space-y-16 scroll-mt-20 py-20 overflow-hidden bg-white/50 rounded-3xl border border-border/50">
            <div className="px-4">
              <SectionTitle title="Nossa Jornada" />
            </div>
            
            <div className="relative mt-8">
              {/* Timeline Container - Scrollable on mobile/tablet */}
              <div className="overflow-x-auto no-scrollbar pb-12 pt-24 md:pt-32">
                <div className="flex md:min-w-max px-8 relative">
                  {/* Central Horizontal Bar - Fixed height, segmented by colors */}
                  <div className="absolute top-1/2 left-0 w-full h-[60px] -translate-y-1/2 z-0 hidden md:block" />

                  {timeline.map((step: any, index: number) => {
                    const colorVariants = [
                      { bg: 'bg-[#f9b233]', text: 'text-[#f9b233]', glow: '0 0 20px rgba(249, 178, 51, 0.4)', rgb: '249, 178, 51' },
                      { bg: 'bg-[#e91e63]', text: 'text-[#e91e63]', glow: '0 0 20px rgba(233, 30, 99, 0.4)', rgb: '233, 30, 99' },
                      { bg: 'bg-[#9c27b0]', text: 'text-[#9c27b0]', glow: '0 0 20px rgba(156, 39, 176, 0.4)', rgb: '156, 39, 176' },
                      { bg: 'bg-[#673ab7]', text: 'text-[#673ab7]', glow: '0 0 20px rgba(103, 58, 183, 0.4)', rgb: '103, 58, 183' },
                      { bg: 'bg-[#2196f3]', text: 'text-[#2196f3]', glow: '0 0 20px rgba(33, 150, 243, 0.4)', rgb: '33, 150, 243' },
                      { bg: 'bg-[#00bcd4]', text: 'text-[#00bcd4]', glow: '0 0 20px rgba(0, 188, 212, 0.4)', rgb: '0, 188, 212' },
                      { bg: 'bg-[#009688]', text: 'text-[#009688]', glow: '0 0 20px rgba(0, 150, 136, 0.4)', rgb: '0, 150, 136' },
                    ];
                    const color = colorVariants[index % colorVariants.length];
                    const isEven = index % 2 === 0;
                    const Icon = getIcon(step.icon);
                    
                    return (
                      <div 
                        key={step.id} 
                        className="relative flex-none w-[280px] md:w-[320px] group flex flex-col items-center"
                      >
                        {/* Content Block (Alternating Top/Bottom) */}
                        <div className={cn(
                          "absolute left-0 w-full px-6 transition-all duration-500",
                          isEven ? "bottom-[calc(50%+30px)] pb-6" : "top-[calc(50%+30px)] pt-6"
                        )}>
                          {/* Vertical Connector Line with Glow */}
                          <div 
                            className={cn(
                              "absolute left-0 w-[4px] h-24 md:h-32 transition-all duration-500 rounded-full",
                              color.bg
                            )}
                            style={{ boxShadow: color.glow }}
                          />

                          <div className="flex gap-4 items-start pl-6">
                            <div className="flex-1 space-y-1.5">
                              <div className={cn("text-[10px] md:text-xs font-black tracking-[0.25em] uppercase", color.text)}>
                                TIMELINE {(index+1).toString().padStart(2, '0')}
                              </div>
                              <h4 className="text-base md:text-lg font-black text-slate-800 leading-tight group-hover:text-primary transition-colors">
                                {step.title}
                              </h4>
                              <p className="text-xs md:text-sm text-slate-500 leading-relaxed line-clamp-4">
                                {step.description}
                              </p>
                            </div>
                            
                            <div className={cn(
                              "shrink-0 p-2.5 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:shadow-md group-hover:border-primary/20",
                              color.text
                            )}>
                              <Icon className="h-6 w-6 md:h-8 md:w-8" />
                            </div>
                          </div>
                        </div>

                        {/* Central Bar Segment */}
                        <div className={cn(
                          "w-full h-12 md:h-16 flex items-center justify-center relative z-10 transition-all duration-300",
                          color.bg,
                          "shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)]"
                        )}>
                          {/* Inner soft gradient for depth */}
                          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10 opacity-30" />
                          
                          {/* Year Text */}
                          <span className="text-white font-black text-xl md:text-2xl tracking-tight drop-shadow-md z-20">
                            {step.year}
                          </span>
                          
                          {/* Segment Cut Shadow */}
                          <div className="absolute top-0 right-0 h-full w-[1px] bg-black/10 z-30" />
                        </div>
                      </div>
                    );
                  })}
                </div>
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
