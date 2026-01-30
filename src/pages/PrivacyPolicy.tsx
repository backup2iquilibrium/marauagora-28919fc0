import * as React from "react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { TopBar } from "@/components/marau/TopBar";
import { SiteHeader } from "@/components/marau/SiteHeader";
import { Footer } from "@/components/marau/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Info,
  Database,
  Settings2,
  Cookie,
  Shield,
  Gavel,
  Mail,
  CheckCircle2,
  Eye,
  Pencil,
  Trash2,
  Ban,
  User,
  MapPin,
  Clock,
} from "lucide-react";

const LOGO_URL = "/logo.png";

type TocItem = {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

function TocLink({ item }: { item: TocItem }) {
  return (
    <a
      href={`#${item.id}`}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm",
        "hover:bg-accent hover:text-accent-foreground transition-colors",
      )}
    >
      <item.icon className="h-4 w-4 text-primary" aria-hidden="true" />
      <span className="font-medium">{item.label}</span>
    </a>
  );
}

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  const toc = useMemo<TocItem[]>(
    () => [
      { id: "introducao", label: "Introdução", icon: Info },
      { id: "coleta", label: "1. Coleta de Dados", icon: Database },
      { id: "uso", label: "2. Uso das Informações", icon: Settings2 },
      { id: "cookies", label: "3. Cookies", icon: Cookie },
      { id: "seguranca", label: "4. Segurança", icon: Shield },
      { id: "direitos", label: "5. Seus Direitos (LGPD)", icon: Gavel },
      { id: "contato", label: "6. Contato", icon: Mail },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <SiteHeader logoUrl={LOGO_URL} />

      <main className="container px-4 py-8">
        <header className="space-y-4">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <button className="hover:text-primary" onClick={() => navigate("/")}>Início</button>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <span>Institucional</span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <span className="text-foreground">Política de Privacidade</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Política de Privacidade</h1>

          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4" aria-hidden="true" /> Última atualização: 24 de Outubro de 2023
            </span>
            <span aria-hidden="true">•</span>
            <span>Tempo de leitura estimado: 8 minutos</span>
          </div>

          <p className="text-muted-foreground leading-relaxed max-w-3xl">
            No Marau Agora, a sua privacidade é prioridade. Estamos comprometidos em proteger os seus dados pessoais em total
            conformidade com a Lei Geral de Proteção de Dados (LGPD).
          </p>
          <p className="text-muted-foreground leading-relaxed max-w-3xl">
            Este documento detalha, de forma transparente, como coletamos, usamos, armazenamos e protegemos suas informações ao
            utilizar nosso portal de notícias, aplicativos móveis e serviços relacionados. Ao acessar nosso conteúdo, você
            concorda com as práticas descritas nesta política.
          </p>
        </header>

        <Separator className="my-8" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Índice */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="lg:sticky lg:top-24 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Índice</CardTitle>
                  <p className="text-sm text-muted-foreground">Navegue pelo documento</p>
                </CardHeader>
                <CardContent className="space-y-1">
                  {toc.map((item) => (
                    <TocLink key={item.id} item={item} />
                  ))}
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" aria-hidden="true" />
                    Dúvidas?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Fale com nosso Encarregado de Dados (DPO): <span className="font-medium">privacidade@marauagora.com.br</span>
                  </p>
                  <Button asChild className="w-full">
                    <a href="mailto:privacidade@marauagora.com.br">Enviar E-mail</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Conteúdo */}
          <article className="lg:col-span-8 xl:col-span-9 space-y-10" aria-label="Conteúdo da política">
            <section id="introducao" className="scroll-mt-28">
              <h2 className="text-2xl font-black tracking-tight">Introdução</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Esta Política descreve como tratamos dados pessoais coletados durante o uso do portal Marau Agora.
              </p>
            </section>

            <section id="coleta" className="scroll-mt-28">
              <h2 className="text-2xl font-black tracking-tight">1. Coleta de Dados</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Coletamos diferentes tipos de informações para melhorar a sua experiência em nosso portal:
              </p>

              <div className="mt-4 space-y-3">
                <Card>
                  <CardContent className="p-6 space-y-2">
                    <p className="font-semibold">Dados fornecidos por você</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Informações que você insere voluntariamente, como nome e e-mail ao se inscrever em nossa newsletter,
                      comentar em notícias ou participar de enquetes.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 space-y-2">
                    <p className="font-semibold">Dados de navegação</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Informações coletadas automaticamente, como endereço IP, tipo de navegador, páginas acessadas, tempo de
                      permanência e localização aproximada.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 space-y-2">
                    <p className="font-semibold">Dados de dispositivos</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Modelo do aparelho, sistema operacional e identificadores únicos de publicidade móvel.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                <span className="font-medium">Nota:</span> Não coletamos dados sensíveis (como origem racial, convicção religiosa
                ou dados de saúde) a menos que você os forneça explicitamente em áreas de comentários públicos.
              </p>
            </section>

            <section id="uso" className="scroll-mt-28">
              <h2 className="text-2xl font-black tracking-tight">2. Uso das Informações</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">Utilizamos seus dados para as seguintes finalidades:</p>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Jornalismo Personalizado",
                    desc: "Recomendamos notícias baseadas nos seus interesses e histórico de leitura em Marau e região.",
                  },
                  {
                    title: "Comunicação",
                    desc: "Envio de newsletters matinais, alertas de \"Plantão de Notícias\" e respostas a seus comentários.",
                  },
                  {
                    title: "Publicidade",
                    desc: "Exibição de anúncios relevantes para manter nosso portal gratuito e acessível a todos.",
                  },
                  {
                    title: "Melhoria do Portal",
                    desc: "Análise de tráfego para entender quais seções (Esportes, Política) são mais acessadas.",
                  },
                ].map((it) => (
                  <Card key={it.title}>
                    <CardContent className="p-6 space-y-2">
                      <p className="font-semibold">{it.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section id="cookies" className="scroll-mt-28">
              <h2 className="text-2xl font-black tracking-tight">3. Cookies e Tecnologias</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                O Marau Agora utiliza cookies para otimizar a funcionalidade do site e analisar o tráfego. Você pode gerenciar
                suas preferências de cookies através das configurações do seu navegador.
              </p>

              <div className="mt-4 overflow-x-auto rounded-lg border bg-card">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 font-semibold">Tipo</th>
                      <th className="text-left p-3 font-semibold">Função</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="p-3 font-medium">Essenciais</td>
                      <td className="p-3 text-muted-foreground">Necessários para o site funcionar (login, segurança).</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Analíticos</td>
                      <td className="p-3 text-muted-foreground">Google Analytics para entender audiência.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Publicidade</td>
                      <td className="p-3 text-muted-foreground">Entregar anúncios relevantes de parceiros locais.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="seguranca" className="scroll-mt-28">
              <h2 className="text-2xl font-black tracking-tight">4. Armazenamento e Segurança</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Adotamos medidas técnicas e administrativas rigorosas para proteger seus dados pessoais de acessos não
                autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão.
              </p>

              <div className="mt-4 space-y-2">
                {[
                  "Criptografia (SSL/TLS) em todas as comunicações do site.",
                  "Monitoramento contínuo contra vulnerabilidades e ataques.",
                  "Acesso restrito aos dados pessoais apenas a funcionários autorizados.",
                ].map((t) => (
                  <div key={t} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" aria-hidden="true" />
                    <p className="text-muted-foreground leading-relaxed">{t}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="direitos" className="scroll-mt-28">
              <h2 className="text-2xl font-black tracking-tight">5. Seus Direitos (LGPD)</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                A Lei Geral de Proteção de Dados (LGPD) garante a você, titular dos dados, os seguintes direitos que podem ser
                exercidos a qualquer momento mediante requisição gratuita:
              </p>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: Eye, title: "Confirmação e Acesso", desc: "Saber se tratamos seus dados e quais são eles." },
                  { icon: Pencil, title: "Correção", desc: "Solicitar a correção de dados incompletos, inexatos ou desatualizados." },
                  { icon: Trash2, title: "Eliminação", desc: "Pedir a exclusão de dados desnecessários ou tratados em desconformidade." },
                  { icon: Ban, title: "Revogação", desc: "Retirar o consentimento dado anteriormente." },
                ].map((it) => (
                  <Card key={it.title}>
                    <CardContent className="p-6 space-y-2">
                      <div className="flex items-center gap-2">
                        <it.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                        <p className="font-semibold">{it.title}</p>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section id="contato" className="scroll-mt-28">
              <h2 className="text-2xl font-black tracking-tight">6. Contato do DPO</h2>
              <Card className="mt-4">
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-xl font-bold">Fale com nosso Encarregado de Dados</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    Se você tiver dúvidas sobre esta Política de Privacidade ou quiser exercer seus direitos relacionados aos
                    seus dados pessoais, entre em contato com nosso Data Protection Officer (DPO).
                  </p>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-lg border bg-card p-4">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" aria-hidden="true" />
                        <p className="font-semibold">João Silva</p>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" aria-hidden="true" />
                        <span>privacidade@marauagora.com.br</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" aria-hidden="true" />
                        <span>Av. Júlio Borella, 100, Centro, Marau - RS</span>
                      </div>
                    </div>

                    <div className="rounded-lg border bg-card p-4 flex flex-col justify-between gap-3">
                      <p className="text-sm text-muted-foreground">
                        Para exercer seus direitos, descreva sua solicitação com detalhes para agilizar o atendimento.
                      </p>
                      <Button asChild className="w-full">
                        <a href="mailto:privacidade@marauagora.com.br">Entrar em Contato</a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </article>
        </div>
      </main>

      <Footer logoUrl={LOGO_URL} />
    </div>
  );
}
