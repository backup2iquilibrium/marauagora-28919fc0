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
  Mail,
  Ban,
  CheckCircle2,
  Clock,
  Share2,
  Copy,
  Quote,
} from "lucide-react";

const LOGO_URL = "/logo.png";

type TocItem = { id: string; label: string };

function TocLink({ item }: { item: TocItem }) {
  return (
    <a
      href={`#${item.id}`}
      className={cn(
        "text-sm text-muted-foreground hover:text-primary transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded",
      )}
    >
      {item.label}
    </a>
  );
}

export default function TermsOfUse() {
  const navigate = useNavigate();

  const toc = useMemo<TocItem[]>(
    () => [
      { id: "introducao", label: "Introdução" },
      { id: "aceitacao", label: "1. Aceitação dos Termos" },
      { id: "conteudo", label: "2. Uso do Conteúdo" },
      { id: "conduta", label: "3. Conduta do Usuário" },
      { id: "isencao", label: "4. Isenção de Responsabilidade" },
      { id: "privacidade", label: "5. Privacidade" },
      { id: "alteracoes", label: "6. Alterações" },
      { id: "contato", label: "7. Contato" },
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
            <button className="hover:text-primary" onClick={() => navigate("/")}>Home</button>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <span>Institucional</span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <span className="text-foreground">Termos de Uso</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Nesta página</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {toc.map((item) => (
                    <div key={item.id}>
                      <TocLink item={item} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-8 space-y-3">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">Termos de Uso</h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4" aria-hidden="true" /> Última atualização: 24 de Outubro de 2023
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Bem-vindo ao portal Marau Agora. Estes Termos de Uso regem o acesso e a utilização do nosso website, localizado
                em marauagora.com.br, bem como todos os serviços, conteúdos e funcionalidades oferecidos. Ao acessar ou usar
                nosso portal, você declara ter lido, compreendido e concordado com estes termos.
              </p>

              <Card className="border-primary/20">
                <CardContent className="p-6 flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary mt-0.5" aria-hidden="true" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">Importante:</span> Se você não concordar com qualquer parte
                    destes termos, recomendamos que interrompa o uso do portal imediatamente.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </header>

        <Separator className="my-8" />

        <article className="space-y-10">
          <section id="introducao" className="scroll-mt-28">
            <h2 className="text-2xl font-black tracking-tight">Introdução</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Estes termos explicam as regras de uso do Marau Agora e ajudam a manter um ambiente seguro para toda a comunidade.
            </p>
          </section>

          <section id="aceitacao" className="scroll-mt-28">
            <h2 className="text-2xl font-black tracking-tight">1. Aceitação dos Termos</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Ao acessar o Marau Agora, você concorda em cumprir estes Termos de Uso, todas as leis e regulamentos aplicáveis, e
              concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. O uso continuado do site após a
              publicação de quaisquer alterações constitui aceitação dos novos termos.
            </p>
          </section>

          <section id="conteudo" className="scroll-mt-28">
            <h2 className="text-2xl font-black tracking-tight">2. Uso do Conteúdo e Propriedade Intelectual</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Todo o conteúdo presente no Marau Agora, incluindo textos, gráficos, logotipos, ícones, imagens, clipes de áudio,
              downloads digitais e compilações de dados, é propriedade do Marau Agora ou de seus fornecedores de conteúdo e é
              protegido pelas leis de direitos autorais do Brasil e internacionais.
            </p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-primary" aria-hidden="true" />
                    <p className="font-semibold">Permitido</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    É permitido compartilhar links para nossas matérias em redes sociais.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <Copy className="h-5 w-5 text-primary" aria-hidden="true" />
                    <p className="font-semibold">Restrito</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    É proibida a reprodução total ou parcial de textos e fotos sem a devida autorização expressa e por escrito.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <Quote className="h-5 w-5 text-primary" aria-hidden="true" />
                    <p className="font-semibold">Citações</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Citações curtas são permitidas, desde que acompanhadas do link original para a fonte no Marau Agora.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section id="conduta" className="scroll-mt-28">
            <h2 className="text-2xl font-black tracking-tight">3. Conduta do Usuário</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              O Marau Agora preza por um ambiente de discussão saudável e respeitoso. Ao utilizar as áreas de comentários ou
              interagir com o portal, você concorda em não:
            </p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Ban className="h-5 w-5 text-primary" aria-hidden="true" /> Proibições
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "Discurso de ódio ou discriminatório",
                    "Ameaças ou assédio",
                    "Spam ou publicidade não autorizada",
                    "Conteúdo pornográfico ou ilegal",
                  ].map((t) => (
                    <div key={t} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                      <span>{t}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" /> Encorajado
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "Debate construtivo",
                    "Respeito às opiniões divergentes",
                    "Denúncia de conteúdo impróprio",
                    "Compartilhamento de informações verídicas",
                  ].map((t) => (
                    <div key={t} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                      <span>{t}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </section>

          <section id="isencao" className="scroll-mt-28">
            <h2 className="text-2xl font-black tracking-tight">4. Isenção de Responsabilidade</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              As informações contidas neste portal são para fins informativos gerais. Embora nos esforcemos para manter as
              informações atualizadas e corretas, não fazemos declarações ou garantias de qualquer tipo, expressas ou implícitas,
              sobre a integridade, precisão, confiabilidade, adequação ou disponibilidade em relação ao site ou às informações,
              produtos, serviços ou gráficos relacionados contidos no site.
            </p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              O portal pode conter links para sites externos que não são fornecidos ou mantidos por nós. O Marau Agora não
              garante a precisão, relevância, atualidade ou integridade de qualquer informação nesses sites externos.
            </p>
          </section>

          <section id="privacidade" className="scroll-mt-28">
            <h2 className="text-2xl font-black tracking-tight">5. Privacidade e LGPD</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Sua privacidade é importante para nós. Nossa política de coleta e uso de dados pessoais está em conformidade com a
              Lei Geral de Proteção de Dados (LGPD). Para entender como coletamos, usamos e protegemos seus dados, consulte nossa
              Política de Privacidade completa.
            </p>
            <div className="mt-4">
              <Button asChild variant="outline">
                <a href="/politica-de-privacidade">Ver Política de Privacidade</a>
              </Button>
            </div>
          </section>

          <section id="alteracoes" className="scroll-mt-28">
            <h2 className="text-2xl font-black tracking-tight">6. Alterações nos Termos</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              O Marau Agora reserva-se o direito de revisar estes termos de serviço a qualquer momento, sem aviso prévio. Ao usar
              este site, você concorda em ficar vinculado à versão atual desses termos de serviço.
            </p>
          </section>

          <section id="contato" className="scroll-mt-28">
            <h2 className="text-2xl font-black tracking-tight">7. Contato Jurídico</h2>
            <Card className="mt-4">
              <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
                    <p className="font-semibold">Dúvidas sobre os Termos de Uso?</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Entre em contato com nossa equipe: <span className="font-medium">juridico@marauagora.com.br</span>
                  </p>
                </div>
                <Button asChild>
                  <a href="mailto:juridico@marauagora.com.br">Enviar e-mail</a>
                </Button>
              </CardContent>
            </Card>
          </section>
        </article>
      </main>

      <Footer logoUrl={LOGO_URL} />
    </div>
  );
}
