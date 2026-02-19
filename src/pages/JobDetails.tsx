import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

import { TopBar } from "@/components/marau/TopBar";
import { SiteHeader } from "@/components/marau/SiteHeader";
import { Footer } from "@/components/marau/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Briefcase, Building, Calendar, MapPin } from "lucide-react";

async function fetchJobById(id: string) {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export default function JobDetails() {
  const { id } = useParams();

  const { data: job, isLoading, isError } = useQuery({
    queryKey: ["job-detail", id],
    queryFn: () => fetchJobById(id || ""),
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando vaga...</div>;
  }

  if (isError || !job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Vaga não encontrada</h1>
        <Button asChild><Link to="/vagas">Voltar para Vagas</Link></Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <SiteHeader logoUrl="/logo.png" />

      <main className="container px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="ghost" className="gap-2">
            <Link to="/vagas">
              <ArrowLeft className="h-4 w-4" />
              Voltar para Vagas
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden border-t-4 border-t-primary">
              <CardHeader className="pb-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge variant="secondary">{job.employment_type || "Efetivo"}</Badge>
                </div>
                <CardTitle className="text-3xl font-serif font-bold">{job.title}</CardTitle>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4" /> {job.company}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {job.location || "Marau - RS"}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Postada {formatDistanceToNow(new Date(job.posted_at), { addSuffix: true, locale: ptBR })}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <h3 className="text-lg font-bold mb-3">Descrição da Vaga</h3>
                  <div className="whitespace-pre-wrap text-foreground/80 leading-relaxed">
                    {job.description || "Nenhuma descrição fornecida."}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row gap-4">
                  <Button className="flex-1 rounded-full text-lg h-12">Enviar Currículo</Button>
                  <Button variant="outline" className="flex-1 rounded-full h-12">Salvar Vaga</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sobre a Empresa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <div className="w-20 h-20 bg-muted rounded-full mx-auto flex items-center justify-center">
                  <Building className="h-10 w-10 text-muted-foreground" />
                </div>
                <h4 className="font-bold text-xl">{job.company}</h4>
                <p className="text-sm text-muted-foreground">Empresa local em Marau/RS</p>
                <Button variant="link" className="text-primary p-0">Ver todas as vagas desta empresa</Button>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 text-center">
                <Briefcase className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Busca recolocação?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Cadastre seu currículo em nosso banco de talentos e seja encontrado pelas melhores empresas.
                </p>
                <Button className="w-full rounded-full">Cadastrar Currículo</Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      <Footer logoUrl="/logo.png" />
    </div>
  );
}
