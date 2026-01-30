import * as React from "react";

import { TopBar } from "@/components/marau/TopBar";
import { SiteHeader } from "@/components/marau/SiteHeader";
import { Footer } from "@/components/marau/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Flag,
  Eye,
  BadgeCheck,
  PencilLine,
  Globe,
  Users,
  Newspaper,
} from "lucide-react";

const LOGO_URL = "/logo.png";

const HERO_IMAGE_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCEXsNSxDSRyUH2s6dTUNqLoLVyNDa3gyg2tJcS0NkdMfRNnVGvrBgoxVHUS-ZLTtCIKWow8f5jYSvTZH4U2Ph7Q5CRKDju-StU-1XLir4BBPQ0ZfN7B8fSXBNArNvRHFfMDuMougI6stsJF_c3HSVWB_IOkxDuSqHlPva_72_pLgjJIUuHN29DI3CGSTSWSj3Ndg3AHjqPiZzxVM5VXIFC9heiw3xg22oVOgyc6Q4fzlmxb54gLLYBy2sUa74kjvAssRgx8wGk";

type ValueCard = {
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const values: ValueCard[] = [
  {
    title: "Missão",
    description:
      "Informar com isenção, agilidade e responsabilidade social, contribuindo para o desenvolvimento de Marau.",
    icon: Flag,
  },
  {
    title: "Visão",
    description:
      "Ser a principal referência em jornalismo local no norte do RS, reconhecido pela credibilidade.",
    icon: Eye,
  },
  {
    title: "Valores",
    description:
      "Ética inegociável, transparência total e compromisso inabalável com a comunidade marauense.",
    icon: BadgeCheck,
  },
];

const timeline = [
  {
    year: "2010",
    title: "O Início do Blog",
    description:
      "Tudo começou como um pequeno blog opinativo sobre a política local, escrito por um grupo de estudantes de jornalismo apaixonados por Marau.",
    icon: PencilLine,
  },
  {
    year: "2015",
    title: "Lançamento do Portal",
    description:
      "Profissionalização da equipe e lançamento do site oficial, ampliando a cobertura para esportes, cultura e segurança pública.",
    icon: Globe,
  },
  {
    year: "2023",
    title: "Expansão Regional",
    description:
      "O Marau Agora se consolida como uma das maiores fontes de informação da região, inaugurando sua nova sede e estúdio de podcast.",
    icon: Users,
  },
];

const team = [
  { name: "Ana Souza", role: "Editora-Chefe" },
  { name: "Carlos Mendes", role: "Jornalista Político" },
  { name: "Julia Lima", role: "Cultura e Lazer" },
  { name: "Roberto Silva", role: "Esportes" },
];

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="space-y-2">
      <h2 className="text-2xl md:text-3xl font-black tracking-tight">{title}</h2>
      {subtitle ? <p className="text-muted-foreground leading-relaxed">{subtitle}</p> : null}
    </header>
  );
}

export default function QuemSomos() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <SiteHeader logoUrl={LOGO_URL} />

      <main className="container px-4 py-8 space-y-12">
        <section aria-label="Hero — Quem Somos">
          <div
            className={cn(
              "relative overflow-hidden rounded-xl",
              "min-h-[360px] md:min-h-[440px]",
              "flex items-center justify-center text-center",
            )}
            style={{
              backgroundImage: `linear-gradient(hsl(var(--primary) / 0.60), hsl(var(--primary) / 0.82)), url(${HERO_IMAGE_URL})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            aria-label="Vista panorâmica da praça de Marau ao entardecer"
          >
            <div className="relative z-10 max-w-3xl px-6 py-10">
              <h1 className="text-primary-foreground text-4xl md:text-5xl font-black leading-tight tracking-tight">
                Marau Agora: A voz da nossa comunidade
              </h1>
              <p className="mt-4 text-primary-foreground/90 text-base md:text-lg leading-relaxed">
                Seu portal confiável para notícias locais, cultura, esportes e eventos em Marau e região. Conectando pessoas
                através da informação de verdade.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" variant="secondary">
                  Nossa História
                </Button>
                <Button size="lg" variant="outline" className="bg-background/15 border-primary-foreground/30">
                  Nossa Missão e Valores
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6" aria-label="Missão, visão e valores">
          <div className="lg:col-span-1">
            <SectionTitle title="Nossa Missão e Valores" />
          </div>
          <div className="lg:col-span-2">
            <p className="text-muted-foreground leading-relaxed">
              Fundado com o propósito de fortalecer a identidade local, o Marau Agora se dedica a trazer jornalismo de
              qualidade, fiscalizando o poder público e valorizando as histórias da nossa gente.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {values.map((item) => (
                <Card key={item.title} className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <item.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground leading-relaxed">{item.description}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section aria-label="Nossa Jornada" className="space-y-6">
          <SectionTitle title="Nossa Jornada" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {timeline.map((step) => (
              <Card key={step.year} className="shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <step.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                      <span className="text-sm font-bold text-primary">{step.year}</span>
                    </div>
                    <Newspaper className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground leading-relaxed">{step.description}</CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section aria-label="Equipe" className="space-y-6">
          <SectionTitle
            title="Quem faz o Marau Agora"
            subtitle="Uma equipe dedicada de jornalistas e colunistas comprometidos com a verdade."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {team.map((p) => (
              <Card key={p.name} className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{p.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{p.role}</CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section aria-label="Newsletter" className="rounded-xl border bg-card p-6 md:p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-black tracking-tight">Faça parte da nossa história</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                Assine nossa newsletter gratuita e receba as principais notícias de Marau diretamente no seu e-mail toda
                manhã.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Seu e-mail"
                  aria-label="E-mail para newsletter"
                  className="h-11"
                />
                <Button className="h-11" variant="default">
                  Inscrever-se Agora
                </Button>
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
