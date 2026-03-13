import { Mail, Sparkles } from "lucide-react";
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

      <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5 overflow-hidden relative">
        <CardHeader className="pb-3 relative z-10">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Signo do Mês
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 relative z-10">
          <div className="rounded-xl border border-primary/10 bg-card/50 backdrop-blur-sm p-6 shadow-sm group">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xl font-black text-primary uppercase tracking-tighter">Peixes</p>
              <span className="text-3xl opacity-50 group-hover:opacity-100 transition-opacity">♓</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              "É tempo de navegar nas águas profundas da intuição e da criatividade. O universo convida você a sonhar alto."
            </p>
            <Button asChild variant="outline" className="mt-6 w-full border-primary/20 hover:bg-primary hover:text-white transition-all font-bold text-xs uppercase tracking-widest">
              <a href="#">Ver Perfil Completo</a>
            </Button>
          </div>
        </CardContent>
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
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
