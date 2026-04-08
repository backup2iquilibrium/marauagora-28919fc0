import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { TopBar } from "@/components/marau/TopBar";
import { SiteHeader } from "@/components/marau/SiteHeader";
import { Footer } from "@/components/marau/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Users, MapPin, Phone, Mail, Building2, FileText, Loader2, User as UserIcon, Instagram
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const LOGO_URL = "/logo.png";

interface ExpedienteSettings {
  company_name: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
  director: string;
  editor: string;
}

const DEFAULT_SETTINGS: ExpedienteSettings = {
  company_name: "Marau Agora Comunicações LTDA",
  cnpj: "00.000.000/0000-00",
  address: "Av. Júlio Borella, 777 - 3 andar - Marau - RS",
  phone: "(54) 92000-1320",
  email: "marauagorars@gmail.com",
  director: "Direção Geral",
  editor: "Redação"
};

export default function Expediente() {
  const { data: settings, isLoading: loadingSettings } = useQuery({
    queryKey: ["site_settings", "expediente_info"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "expediente_info")
        .maybeSingle();
      if (error) throw error;
      return (data?.value as ExpedienteSettings) || DEFAULT_SETTINGS;
    }
  });

  const { data: team, isLoading: loadingTeam } = useQuery({
    queryKey: ["about_team"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("about_team")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data || [];
    }
  });

  if (loadingSettings || loadingTeam) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const s = settings || DEFAULT_SETTINGS;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <SiteHeader logoUrl={LOGO_URL} />

      <main className="container px-4 py-12 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-black tracking-tight mb-4">Expediente</h1>
          <p className="text-muted-foreground">Informações institucionais e equipe editorial do Marau Agora.</p>
        </header>

        <div className="space-y-10">
          {/* Informações da Empresa */}
          <section className="bg-card rounded-2xl border p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" /> Institucional
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-1">Razão Social</p>
                  <p className="font-medium">{s.company_name}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-1">CNPJ</p>
                  <p className="font-medium">{s.cnpj}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-1">Endereço</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-1 text-primary shrink-0" />
                    <p className="font-medium text-sm leading-relaxed">{s.address}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-1">Telefone / WhatsApp</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <p className="font-medium">{s.phone}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-1">E-mail</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <p className="font-medium">{s.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Equipe Editorial */}
          <section>
            <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> Equipe Editorial
            </h2>
            
            <div className="space-y-6">
              {team?.map((member: any) => (
                <div key={member.id} className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-xl border bg-card hover:bg-accent/5 transition-colors">
                  <div className="h-20 w-20 rounded-full overflow-hidden bg-muted shrink-0 border-2 border-primary/10">
                    {member.photo_url ? (
                      <img src={member.photo_url} alt={member.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <UserIcon className="h-10 w-10 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-bold">{member.name}</h3>
                    <p className="text-primary font-semibold text-sm mb-2">{member.role}</p>
                    {member.bio && (
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {member.bio}
                      </p>
                    )}
                    <div className="mt-3 flex justify-center sm:justify-start gap-3">
                      {member.social_instagram && (
                        <a 
                          href={`https://instagram.com/${member.social_instagram}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Instagram className="h-4 w-4" />
                        </a>
                      )}
                      {member.social_email && (
                        <a 
                          href={`mailto:${member.social_email}`}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="text-center py-8">
            <Separator className="mb-8" />
            <p className="text-sm text-muted-foreground italic mb-2">
              Direção Geral: <span className="font-bold text-foreground not-italic">{s.director}</span>
            </p>
            <p className="text-sm text-muted-foreground italic">
              Redação e Jornalistas: <span className="font-bold text-foreground not-italic">{s.editor}</span>
            </p>
          </section>
        </div>
      </main>

      <Footer logoUrl={LOGO_URL} />
    </div>
  );
}
