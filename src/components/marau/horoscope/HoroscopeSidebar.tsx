import { Mail, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import { AdSlot } from "@/components/marau/AdSlot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-6 w-full border-primary/20 hover:bg-primary hover:text-white transition-all font-bold text-xs uppercase tracking-widest cursor-pointer">
                  Ver Perfil Completo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-gradient-to-br from-background to-primary/5 border-primary/20">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3 text-2xl font-black text-primary">
                    <span className="text-4xl filter opacity-80">♓</span>
                    Peixes - Perfil Completo
                  </DialogTitle>
                  <DialogDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground pt-1 border-t border-primary/10">
                    19 Fev - 20 Mar • Elemento Água • Mutável
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4 relative overflow-hidden">
                  <Sparkles className="absolute top-0 right-0 h-32 w-32 text-primary/5 -mr-4 -mt-4 animate-pulse pointer-events-none" />
                  <p className="text-sm text-foreground/90 leading-relaxed z-10 relative">
                    <strong className="text-primary font-black uppercase text-xs tracking-wider">Personalidade:</strong><br />
                    Compassivos e empáticos, os piscianos possuem a capacidade inata de sentir a dor e a alegria dos outros. Com uma profunda imaginação, encontram na arte, música e espiritualidade sua forma de expressão.
                  </p>
                  <p className="text-sm text-foreground/90 leading-relaxed z-10 relative">
                    <strong className="text-primary font-black uppercase text-xs tracking-wider">No Amor:</strong><br />
                    Extremamente românticos e sonhadores. Quando se apaixonam, buscam uma profunda conexão de almas, entregando-se de forma pura e muitas vezes incondicional.
                  </p>
                  <p className="text-sm text-foreground/90 leading-relaxed z-10 relative">
                    <strong className="text-primary font-black uppercase text-xs tracking-wider">Missão:</strong><br />
                    Trazer cura e empatia para um mundo que muitas vezes carece de sensibilidade e compreensão mútua. Ensinar a magia da intuição.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
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
