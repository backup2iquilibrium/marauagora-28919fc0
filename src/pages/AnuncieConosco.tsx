import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { TopBar } from "@/components/marau/TopBar";
import { SiteHeader } from "@/components/marau/SiteHeader";
import { Footer } from "@/components/marau/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Megaphone, Target, Users, BarChart3, Mail, Phone, MessageCircle, FileDown, Loader2, CheckCircle2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const LOGO_URL = "/logo.png";

interface AdvertiseConfig {
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  intro_text: string;
  benefits: { title: string; description: string; icon: string }[];
  mediakit_url: string;
  contact_email: string;
  contact_phone: string;
  contact_whatsapp: string;
}

const DEFAULT_CONFIG: AdvertiseConfig = {
  hero_title: "Anuncie no Marau Agora",
  hero_subtitle: "Conecte sua marca com milhares de moradores de Marau e região todos os dias.",
  hero_image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80",
  intro_text: "O Marau Agora é o principal portal de notícias e entretenimento da nossa cidade. Oferecemos soluções inteligentes de publicidade para empresas que buscam visibilidade e resultados reais.",
  benefits: [
    { title: "Audiência Qualificada", description: "Alcance um público local engajado e interessado no que acontece na cidade.", icon: "users" },
    { title: "Visibilidade Máxima", description: "Banners estrategicamente posicionados nas páginas de maior acesso do portal.", icon: "target" },
    { title: "Resultados Mensuráveis", description: "Acompanhe o desempenho de suas campanhas com relatórios de impressões e cliques.", icon: "bar-chart" }
  ],
  mediakit_url: "",
  contact_email: "comercial@marauagora.com.br",
  contact_phone: "(54) 3342-0000",
  contact_whatsapp: "(54) 99200-1320"
};

const ICON_MAP: Record<string, any> = {
  users: Users,
  target: Target,
  "bar-chart": BarChart3,
  megaphone: Megaphone
};

export default function AnuncieConosco() {
  const { data: config, isLoading } = useQuery({
    queryKey: ["site_settings", "advertise_page"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "advertise_page")
        .maybeSingle();
      
      if (error) throw error;
      return (data?.value as AdvertiseConfig) || DEFAULT_CONFIG;
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const finalConfig = config || DEFAULT_CONFIG;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <SiteHeader logoUrl={LOGO_URL} />

      <main>
        {/* Hero Section */}
        <section className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 z-0 scale-105"
            style={{
              backgroundImage: `linear-gradient(to right, hsl(var(--primary) / 0.9), hsl(var(--primary) / 0.4)), url(${finalConfig.hero_image_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="container relative z-10 px-4 text-center md:text-left text-primary-foreground">
            <div className="max-w-3xl">
              <BadgeCheck className="h-12 w-12 mb-4 text-secondary inline-block md:block" />
              <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
                {finalConfig.hero_title}
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-8 leading-relaxed max-w-2xl">
                {finalConfig.hero_subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button size="lg" variant="secondary" className="font-bold gap-2">
                  <Mail className="h-5 w-5" /> Falar com Consultor
                </Button>
                {finalConfig.mediakit_url && (
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 gap-2">
                    <FileDown className="h-5 w-5" /> Baixar Media Kit
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Intro & Benefits */}
        <div className="container px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-6">Por que anunciar conosco?</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {finalConfig.intro_text}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {finalConfig.benefits.map((benefit, idx) => {
                const Icon = ICON_MAP[benefit.icon] || CheckCircle2;
                return (
                  <div key={idx} className="flex gap-4 p-6 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{benefit.title}</h3>
                      <p className="text-muted-foreground text-sm">{benefit.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Section */}
          <section className="bg-muted/50 rounded-2xl p-8 md:p-12 border">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-black mb-4">Pronto para começar?</h2>
              <p className="text-muted-foreground">Nossa equipe comercial está à disposição para criar o plano ideal para o seu negócio.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center p-6 bg-card border-none shadow-sm">
                <CardHeader className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">E-mail</CardTitle>
                </CardHeader>
                <CardContent>
                  <a href={`mailto:${finalConfig.contact_email}`} className="text-primary font-medium hover:underline">
                    {finalConfig.contact_email}
                  </a>
                </CardContent>
              </Card>

              <Card className="text-center p-6 bg-card border-none shadow-sm">
                <CardHeader className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Telefone</CardTitle>
                </CardHeader>
                <CardContent>
                  <a href={`tel:${finalConfig.contact_phone}`} className="text-primary font-medium hover:underline">
                    {finalConfig.contact_phone}
                  </a>
                </CardContent>
              </Card>

              <Card className="text-center p-6 bg-card border-none shadow-sm">
                <CardHeader className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">WhatsApp Comercial</CardTitle>
                </CardHeader>
                <CardContent>
                  <a 
                    href={`https://wa.me/55${finalConfig.contact_whatsapp.replace(/\D/g, '')}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-primary font-medium hover:underline"
                  >
                    {finalConfig.contact_whatsapp}
                  </a>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>

      <Footer logoUrl={LOGO_URL} />
    </div>
  );
}

function BadgeCheck({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
