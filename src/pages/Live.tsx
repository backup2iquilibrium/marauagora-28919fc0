import { TopBar } from "@/components/marau/TopBar";
import { SiteHeader } from "@/components/marau/SiteHeader";
import { Footer } from "@/components/marau/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Radio, Video, Youtube, Facebook, Instagram, Clock, AlertCircle } from "lucide-react";

export default function Live() {
  const LOGO_URL = "/logo.png";
  
  // Esse estado simularia se temos uma live ativa ou não
  const hasActiveLive = false; 

  return (
    <div className="min-h-screen bg-background text-foreground font-manrope">
      <TopBar />
      <SiteHeader logoUrl={LOGO_URL} />

      <main className="container px-4 py-8 md:py-16">
        <div className="max-w-5xl mx-auto space-y-12">
          
          {/* Header Section */}
          <header className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-bold animate-pulse">
              <div className="h-2 w-2 rounded-full bg-destructive"></div>
              AO VIVO
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight font-serif">
              Marau Agora <span className="text-primary">Live</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Acompanhe as transmissões ao vivo, coberturas especiais e câmeras da cidade em tempo real.
            </p>
          </header>

          {/* Main Video Player Area */}
          <section className="relative group">
            {hasActiveLive ? (
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-primary/20">
                {/* Aqui entrará o Iframe da Live (YouTube, Facebook, etc) */}
                <iframe 
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/live_stream?channel=YOUR_CHANNEL_ID" 
                  title="Marau Agora Live"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <Card className="aspect-video w-full rounded-2xl overflow-hidden bg-muted/30 border-dashed border-2 flex flex-col items-center justify-center text-center p-8 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
                <div className="relative z-10 space-y-6">
                  <div className="bg-background w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-sm border border-border">
                    <Video className="h-10 w-10 text-primary/40" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl md:text-3xl font-bold">Nenhuma transmissão ativa</h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Estamos preparando o melhor conteúdo para você. Em breve, lives exclusivas e câmeras ao vivo de Marau.
                    </p>
                  </div>
                  <Badge variant="outline" className="py-1 px-4 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
                    Aguardem novidades!
                  </Badge>
                </div>
              </Card>
            )}
          </section>

          {/* Social Links & Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <AlertCircle className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg">Onde assistir?</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Além do nosso portal, você pode acompanhar as transmissões em nossas redes sociais. Inscreva-se para receber notificações assim que entrarmos no ar.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Button variant="outline" className="flex flex-col h-auto py-4 gap-2 border-primary/10 hover:bg-primary/5">
                    <Youtube className="h-6 w-6 text-[#FF0000]" />
                    <span className="text-xs font-bold uppercase tracking-wider">YouTube</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col h-auto py-4 gap-2 border-primary/10 hover:bg-primary/5">
                    <Facebook className="h-6 w-6 text-[#1877F2]" />
                    <span className="text-xs font-bold uppercase tracking-wider">Facebook</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col h-auto py-4 gap-2 border-primary/10 hover:bg-primary/5">
                    <Instagram className="h-6 w-6 text-[#E4405F]" />
                    <span className="text-xs font-bold uppercase tracking-wider">Instagram</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col h-auto py-4 gap-2 border-primary/10 hover:bg-primary/5">
                    <Radio className="h-6 w-6 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider"> Rádio</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/10 border-primary/10">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg">Programação</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-primary uppercase">Seg à Sex</p>
                      <p className="text-sm font-medium">Jornal Marau Agora</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">08:00</Badge>
                  </li>
                  <li className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-primary uppercase">Quarta-feira</p>
                      <p className="text-sm font-medium">Entrevista da Semana</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">19:30</Badge>
                  </li>
                  <li className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-primary uppercase">Sexta-feira</p>
                      <p className="text-sm font-medium">Resumo do Esporte</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">18:00</Badge>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>

      <Footer logoUrl={LOGO_URL} />
    </div>
  );
}
