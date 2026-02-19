import { Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

        <div className="w-full bg-muted/30 border-2 border-dashed rounded-lg flex items-center justify-center relative overflow-hidden group hover:border-primary hover:bg-card transition-all cursor-pointer">
          <div className="text-center p-8">
            <p className="font-serif font-bold text-xl text-primary mb-2">Sua Marca Aqui</p>
            <p className="text-sm text-muted-foreground mb-4">Alcance milhares de leitores em Marau e região.</p>
            <Button className="rounded-full" size="sm" asChild>
              <a href="mailto:comercial@marauagora.com.br">Anunciar Agora</a>
            </Button>
          </div>
        </div>
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
