import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

import { AdSlot } from "@/components/marau/AdSlot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type MostReadItem = { title: string; href?: string };

export function HoroscopeSidebar({ mostRead }: { mostRead: MostReadItem[] }) {
  return (
    <aside className="lg:col-span-1 space-y-8">
      <AdSlot label="Anúncio (300x250)" />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Signo do Mês</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Escorpião</p>
            <p className="mt-2 text-sm text-muted-foreground">É tempo de transformação profunda e intensidade emocional.</p>
            <Button asChild variant="secondary" className="mt-4 w-full">
              <a href="#">Ler Perfil Completo</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Mais Lidas no Marau Agora</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {mostRead.map((item, idx) => (
              <li key={`${idx}-${item.title}`} className="flex gap-3 items-start">
                <span className="text-2xl font-black text-muted leading-none">{idx + 1}</span>
                {item.href ? (
                  <Link className="text-sm font-medium hover:text-primary transition-colors" to={item.href}>
                    {item.title}
                  </Link>
                ) : (
                  <a className="text-sm font-medium hover:text-primary transition-colors" href="#">
                    {item.title}
                  </a>
                )}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card className="bg-secondary/10 border-secondary/20">
        <CardContent className="p-6 text-center">
          <Mail className="h-10 w-10 text-secondary mx-auto mb-2" aria-hidden="true" />
          <h3 className="font-bold text-lg text-primary">Horóscopo no seu e-mail</h3>
          <p className="mt-1 text-xs text-muted-foreground">Receba previsões diárias e conteúdos exclusivos.</p>
          <form className="mt-4 space-y-2" onSubmit={(e) => e.preventDefault()}>
            <Input type="email" placeholder="Seu e-mail" inputMode="email" autoComplete="email" className="bg-card" />
            <Button className="w-full">Inscrever-se</Button>
          </form>
        </CardContent>
      </Card>
    </aside>
  );
}
