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
  Instagram, Mail, Loader2, User,
} from "lucide-react";
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
                <Button size="lg" variant="secondary">Nossa História</Button>
                <Button size="lg" variant="outline" className="bg-background/15 border-primary-foreground/30">
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
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6" aria-label="Missão, visão e valores">
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
          <section aria-label="Nossa Jornada" className="space-y-6">
            <SectionTitle title="Nossa Jornada" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {timeline.map((step: any) => (
                <Card key={step.id} className="shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Newspaper className="h-5 w-5 text-primary" />
                        <span className="text-sm font-bold text-primary">{step.year}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </CardContent>
                </Card>
              ))}
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

        {/* Newsletter */}
        <section aria-label="Newsletter" className="rounded-xl border bg-card p-6 md:p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-black tracking-tight">Faça parte da nossa história</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                Assine nossa newsletter gratuita e receba as principais notícias de Marau diretamente no seu e-mail toda manhã.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input type="email" placeholder="Seu e-mail" aria-label="E-mail para newsletter" className="h-11" />
                <Button className="h-11">Inscrever-se</Button>
              </div>
              <p className="text-xs text-muted-foreground">Respeitamos sua privacidade. Cancele quando quiser.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer logoUrl={LOGO_URL} />
    </div>
  );
}
