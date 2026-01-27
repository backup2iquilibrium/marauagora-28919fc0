import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { TopBar } from "@/components/marau/TopBar";
import { SiteHeader } from "@/components/marau/SiteHeader";
import { Footer } from "@/components/marau/Footer";
import { AdSlot } from "@/components/marau/AdSlot";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { ArrowRight, Briefcase, Code, Factory, Mail, MapPin, Megaphone, Search, Stethoscope, Store, Timer, Wallet } from "lucide-react";

const LOGO_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAxrvhZIsLpFBhL4Fdg88ttSHjhIb-frJZQZlaxm8GNQc7IW4mGb6BEqX2FQHmaj5bWS_a_MAl-WrKOfqZv531UtiOEoVWECnv_zEkdUgFQPP4xOUlX1yLx1i1OZJ8scM7yIzgQ_kxoKeircZhd3n99pbXddvrZNxvVJ0LngrGdOEY6Erpyltdl5OirCSp02ao8a-6h_Tq9XGEvnDmkDVa-vtppe-1SASqAQ2YWNx6p66Oa5ofAncc0fEvxM9h_FbKYN9e7c07h";

type Job = {
  id: string;
  featuredLabel?: "Nova" | "Anúncio";
  icon: "factory" | "store" | "medical" | "computer";
  title: string;
  company: string;
  posted: string;
  bullets: { icon: "location" | "work" | "schedule" | "payments" | "code"; label: string }[];
  tags: string[];
};

function JobIcon({ name }: { name: Job["icon"] }) {
  const cls = "h-5 w-5 text-primary";
  switch (name) {
    case "factory":
      return <Factory className={cls} />;
    case "store":
      return <Store className={cls} />;
    case "medical":
      return <Stethoscope className={cls} />;
    case "computer":
      return <Code className={cls} />;
  }
}

function BulletIcon({ name }: { name: Job["bullets"][number]["icon"] }) {
  const cls = "h-4 w-4 text-muted-foreground";
  switch (name) {
    case "location":
      return <MapPin className={cls} />;
    case "work":
      return <Briefcase className={cls} />;
    case "schedule":
      return <Timer className={cls} />;
    case "payments":
      return <Wallet className={cls} />;
    case "code":
      return <Code className={cls} />;
  }
}

function JobCard({ job }: { job: Job }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <JobIcon name={job.icon} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-serif text-xl leading-snug">{job.title}</h3>
                {job.featuredLabel ? (
                  <Badge variant={job.featuredLabel === "Anúncio" ? "secondary" : "outline"} className="rounded-full">
                    {job.featuredLabel}
                  </Badge>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{job.company}</p>
              <p className="mt-1 text-xs text-muted-foreground">{job.posted}</p>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {job.bullets.map((b, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <BulletIcon name={b.icon} />
                    <span className="text-muted-foreground">{b.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {job.tags.map((t) => (
                  <Badge key={t} variant="outline" className="rounded-full px-3 py-1">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Button asChild variant="secondary" className="shrink-0 gap-2">
            <Link to={`/vagas/${job.id}`}>
              Ver Detalhes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [city, setCity] = useState<string>("Marau - RS");
  const [sort, setSort] = useState<string>("recentes");

  const [selectedSector, setSelectedSector] = useState<string | null>(() => searchParams.get("setor"));
  const [selectedRegion, setSelectedRegion] = useState<string | null>(() => searchParams.get("bairro"));
  const [selectedType, setSelectedType] = useState<string | null>(() => searchParams.get("tipo"));

  // Mantém estado sincronizado se o usuário editar a URL manualmente.
  useEffect(() => {
    setSelectedSector(searchParams.get("setor"));
    setSelectedRegion(searchParams.get("bairro"));
    setSelectedType(searchParams.get("tipo"));
  }, [searchParams]);

  const updateParam = (key: "setor" | "bairro" | "tipo", value: string | null) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!value) next.delete(key);
      else next.set(key, value);
      return next;
    });
  };

  const clearFilters = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("setor");
      next.delete("bairro");
      next.delete("tipo");
      return next;
    });
  };

  const cities = useMemo(() => ["Marau - RS", "Passo Fundo - RS", "Vila Maria - RS"], []);
  const jobs = useMemo<Job[]>(
    () => [
      {
        id: "assistente-administrativo",
        featuredLabel: "Nova",
        icon: "factory",
        title: "Assistente Administrativo",
        company: "Metasa S.A.",
        posted: "Hoje",
        bullets: [
          { icon: "location", label: "Distrito Industrial, Marau" },
          { icon: "work", label: "Presencial" },
          { icon: "schedule", label: "Integral" },
        ],
        tags: ["Indústria", "Administrativo"],
      },
      {
        id: "vendedor-interno",
        icon: "store",
        title: "Vendedor Interno",
        company: "Lojas Benoit",
        posted: "Há 2 dias",
        bullets: [
          { icon: "location", label: "Centro, Marau" },
          { icon: "payments", label: "Comissão + Salário Fixo" },
        ],
        tags: ["Comércio", "Vendas"],
      },
      {
        id: "anuncio-destaque-empresa",
        featuredLabel: "Anúncio",
        icon: "computer",
        title: "Destaque sua empresa aqui!",
        company: "Alcance milhares de candidatos em Marau e região.",
        posted: "",
        bullets: [],
        tags: [],
      },
      {
        id: "tecnico-enfermagem",
        icon: "medical",
        title: "Técnico em Enfermagem",
        company: "Hospital Cristo Redentor",
        posted: "Há 3 dias",
        bullets: [
          { icon: "location", label: "Centro, Marau" },
          { icon: "schedule", label: "Plantão 12x36" },
        ],
        tags: ["Saúde", "Urgente"],
      },
      {
        id: "frontend-jr",
        icon: "computer",
        title: "Desenvolvedor Front-end Jr",
        company: "TechMarau Soluções",
        posted: "Há 1 semana",
        bullets: [
          { icon: "work", label: "Remoto / Híbrido" },
          { icon: "code", label: "React & Tailwind" },
        ],
        tags: ["Tecnologia"],
      },
    ],
    [],
  );

  const sectors = useMemo(
    () => [
      { label: "Indústria", count: 12 },
      { label: "Comércio / Varejo", count: 8 },
      { label: "Serviços", count: 5 },
      { label: "Tecnologia / TI", count: 3 },
    ],
    [],
  );
  const regions = useMemo(() => ["Centro", "Distrito Industrial", "Borghetti"], []);
  const types = useMemo(() => ["Qualquer tipo", "Efetivo (CLT)", "Estágio"], []);

  const filteredJobs = useMemo(() => {
    const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

    return jobs.filter((job) => {
      // mantém os cards de anúncio sempre visíveis
      if (job.featuredLabel === "Anúncio") return true;

      const tags = job.tags.map(normalize);
      const location = job.bullets.find((b) => b.icon === "location")?.label ?? "";
      const locationNorm = normalize(location);

      const sectorOk =
        !selectedSector ||
        tags.some((t) => t.includes(normalize(selectedSector))) ||
        // compatibilidade com "Comércio / Varejo" -> tag "Comércio"
        (normalize(selectedSector).includes("comercio") && tags.some((t) => t.includes("comercio")));

      const regionOk = !selectedRegion || locationNorm.includes(normalize(selectedRegion));

      // mock: ainda não temos o tipo no dataset, então só filtramos quando houver match explícito
      const typeOk =
        !selectedType ||
        selectedType === "Qualquer tipo" ||
        job.bullets.some((b) => normalize(b.label).includes(normalize(selectedType)));

      return sectorOk && regionOk && typeOk;
    });
  }, [jobs, selectedSector, selectedRegion, selectedType]);

  return (
    <div className="min-h-screen bg-background text-foreground font-manrope">
      <TopBar />
      <SiteHeader logoUrl={LOGO_URL} />

      <main className="container px-4 py-8">
        <header className="rounded-xl border bg-card shadow-sm p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <h1 className="font-serif text-3xl tracking-tight md:text-4xl">Vagas de Emprego em Marau</h1>
              <p className="text-muted-foreground">
                Confira as oportunidades mais recentes em nossa cidade e região. Conectamos talentos locais a grandes empresas.
              </p>
            </div>

            <div className="grid w-full gap-3 sm:grid-cols-5 lg:max-w-2xl">
              <div className="relative sm:col-span-3">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Buscar" className="pl-9" />
              </div>

              <div className="sm:col-span-2">
                <Label className="sr-only">Cidade</Label>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger className="bg-card" aria-label="Cidade">
                    <SelectValue placeholder="Todas as Cidades" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-popover">
                    <SelectItem value="Todas as Cidades">Todas as Cidades</SelectItem>
                    {cities.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-5">
                <Button type="button" variant="secondary" className="w-full gap-2">
                  Buscar
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-4">
          <aside className="space-y-6">
            <AdSlot />

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-base">Filtros</CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={clearFilters}
                  >
                    Limpar tudo
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <p className="text-sm font-medium">Setor</p>
                  <div className="mt-3 space-y-2">
                    {sectors.map((s) => (
                      <button
                        key={s.label}
                        type="button"
                        aria-pressed={selectedSector === s.label}
                        onClick={() => {
                          const next = selectedSector === s.label ? null : s.label;
                          updateParam("setor", next);
                        }}
                        className={
                          selectedSector === s.label
                            ? "w-full rounded-md border bg-accent px-3 py-2 text-left text-sm transition-colors"
                            : "w-full rounded-md border bg-card px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                        }
                      >
                        <span className="flex items-center justify-between">
                          <span>{s.label}</span>
                          <span className="text-muted-foreground">{s.count}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium">Bairro / Região</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {regions.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          const next = selectedRegion === r ? null : r;
                          updateParam("bairro", next);
                        }}
                        aria-pressed={selectedRegion === r}
                      >
                        <Badge
                          variant={selectedRegion === r ? "secondary" : "outline"}
                          className="rounded-full px-3 py-1 hover:bg-accent"
                        >
                          {r}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium">Tipo de Vaga</p>
                  <div className="mt-3 space-y-2">
                    {types.map((t, idx) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          const next = t === "Qualquer tipo" ? null : t;
                          updateParam("tipo", next);
                        }}
                        aria-pressed={selectedType === t || (!selectedType && idx === 0)}
                        className="block"
                      >
                        <Badge
                          variant={selectedType === t || (!selectedType && idx === 0) ? "secondary" : "outline"}
                          className="w-fit rounded-full px-3 py-1 hover:bg-accent"
                        >
                          {t}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Mail className="h-4 w-4 text-primary" />
                  Alerta de Vagas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">Receba novas oportunidades no seu e-mail toda manhã.</p>
                <Button type="button" variant="secondary" className="w-full">
                  Cadastrar Grátis
                </Button>
              </CardContent>
            </Card>
          </aside>

          <section className="lg:col-span-3">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">32 Vagas Encontradas</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Ordenar por:</span>
                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger className="w-56 bg-card" aria-label="Ordenar">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-popover">
                    <SelectItem value="recentes">Mais Recentes</SelectItem>
                    <SelectItem value="relevancia">Relevância</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <AdSlot />
              {filteredJobs.map((job) =>
                job.featuredLabel === "Anúncio" ? (
                  <Card key={job.id} className="border-dashed">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <Megaphone className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Anúncio</p>
                          <p className="mt-1 font-serif text-xl">{job.title}</p>
                          <p className="mt-1 text-muted-foreground">{job.company}</p>
                          <div className="mt-4">
                            <Button type="button" variant="secondary" className="gap-2">
                              Anuncie aqui
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <JobCard key={job.id} job={job} />
                ),
              )}
            </div>

            <div className="mt-8 flex items-center justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>

            <div className="mt-10">
              <AdSlot />
            </div>
          </section>
        </section>
      </main>

      <Footer logoUrl={LOGO_URL} />
    </div>
  );
}
