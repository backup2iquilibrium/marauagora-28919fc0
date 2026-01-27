import { Link, useParams } from "react-router-dom";

import { TopBar } from "@/components/marau/TopBar";
import { SiteHeader } from "@/components/marau/SiteHeader";
import { Footer } from "@/components/marau/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ArrowLeft } from "lucide-react";

const LOGO_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAxrvhZIsLpFBhL4Fdg88ttSHjhIb-frJZQZlaxm8GNQc7IW4mGb6BEqX2FQHmaj5bWS_a_MAl-WrKOfqZv531UtiOEoVWECnv_zEkdUgFQPP4xOUlX1yLx1i1OZJ8scM7yIzgQ_kxoKeircZhd3n99pbXddvrZNxvVJ0LngrGdOEY6Erpyltdl5OirCSp02ao8a-6h_Tq9XGEvnDmkDVa-vtppe-1SASqAQ2YWNx6p66Oa5ofAncc0fEvxM9h_FbKYN9e7c07h";

export default function JobDetails() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background text-foreground font-manrope">
      <TopBar />
      <SiteHeader logoUrl={LOGO_URL} />

      <main className="container px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="ghost" className="gap-2">
            <Link to="/vagas">
              <ArrowLeft className="h-4 w-4" />
              Voltar para Vagas
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Detalhe da vaga</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-muted-foreground">ID: {id}</p>
            <p className="text-muted-foreground">(Página de detalhe será implementada quando você enviar o HTML correspondente.)</p>
          </CardContent>
        </Card>
      </main>

      <Footer logoUrl={LOGO_URL} />
    </div>
  );
}
