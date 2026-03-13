import { Mail, Phone, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdSlot } from "./AdSlot";

async function fetchTopReadNews() {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(4);
  if (error) throw error;
  return data || [];
}

export function Sidebar() {
  const { data: topNews = [], isLoading } = useQuery({
    queryKey: ["sidebar-top-news"],
    queryFn: fetchTopReadNews,
  });

  return (
    <aside className="lg:col-span-1 space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Publicidade</h3>
        </div>

        <AdSlot slug="sidebar-top" />
      </div>

      <Link
        className="block bg-card border hover:border-primary transition-all rounded-lg p-3 shadow-sm group text-center"
        to="/guia-da-cidade"
      >
        <div className="flex items-center justify-center gap-2">
          <Phone className="h-4 w-4 text-primary" aria-hidden="true" />
          <span className="font-medium text-sm group-hover:text-primary transition-colors">Telefones Úteis</span>
        </div>
      </Link>

      <Link
        to="/horoscopo"
        className="block relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 rounded-xl p-6 shadow-xl border border-white/10 group transition-all hover:scale-[1.02] hover:shadow-indigo-500/20"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">Mensagem dos Astros</span>
          </div>
          <h3 className="font-serif text-xl font-bold text-white mb-2 leading-tight">
            Descubra o que o <span className="text-amber-400">universo</span> reservou para você hoje
          </h3>
          <p className="text-indigo-200 text-xs leading-relaxed mb-4 opacity-80">
            Previsões diárias personalizadas para o seu signo. Sintonize sua energia.
          </p>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-white bg-white/10 px-4 py-2 rounded-full border border-white/20 group-hover:bg-white/20 transition-all">
            Ver meu signo agora
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-purple-500/20 rounded-full blur-3xl" />
      </Link>

      <div className="bg-card rounded-lg p-6 shadow-sm border">
        <h3 className="font-serif font-bold text-lg text-primary mb-4">Veja Também</h3>
        <ul className="space-y-4">
          {topNews.map((n, idx) => (
            <li key={n.id} className="flex gap-3 items-start border-b pb-3 last:border-0 last:pb-0 group">
              <span className="text-3xl font-bold text-muted leading-none group-hover:text-primary transition-colors">
                {idx + 1}
              </span>
              <Link
                className="text-sm font-medium hover:text-primary transition-colors leading-snug line-clamp-2"
                to={`/noticia/${n.slug}`}
              >
                {n.title}
              </Link>
            </li>
          ))}
          {isLoading && [1, 2, 3].map(i => (
            <div key={i} className="h-10 bg-muted animate-pulse rounded" />
          ))}
        </ul>
      </div>

      <div className="bg-secondary/10 rounded-lg p-6 text-center border border-secondary/20">
        <Mail className="h-10 w-10 text-secondary mx-auto mb-2" aria-hidden="true" />
        <h3 className="font-bold text-lg text-primary mb-2">Receba as notícias</h3>
        <p className="text-xs text-muted-foreground mb-4">Cadastre-se e receba os destaques de Marau no seu e-mail.</p>
        <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
          <Input
            type="email"
            placeholder="Seu melhor e-mail"
            className="bg-card"
            inputMode="email"
            autoComplete="email"
          />
          <Button className="w-full">Inscrever-se</Button>
        </form>
      </div>
    </aside>
  );
}
