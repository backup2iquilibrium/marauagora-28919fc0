import { Mail, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Sidebar() {
  return (
    <aside className="lg:col-span-1 space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Patrocinadores</h3>
          <span className="text-[10px] bg-muted px-1 rounded text-muted-foreground">Publicidade</span>
        </div>

        <div className="w-full bg-card border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
          <p className="text-[10px] text-muted-foreground uppercase mb-4">Patrocínio Master</p>
          <div className="w-24 h-24 bg-muted rounded-full mb-4 mx-auto flex items-center justify-center group-hover:opacity-90 transition-opacity">
            <span className="text-primary font-serif font-black text-2xl">SM</span>
          </div>
          <h4 className="font-bold text-xl text-primary group-hover:text-secondary transition-colors">Supermercado Marau</h4>
          <p className="text-sm text-muted-foreground mt-2">Ofertas imperdíveis toda terça!</p>
          <span className="inline-flex mt-4 text-xs font-bold text-secondary border border-secondary px-3 py-1.5 rounded hover:bg-secondary hover:text-secondary-foreground transition-colors">
            Ver Encarte Digital
          </span>
        </div>

        <div className="w-full bg-card border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
          <p className="text-[10px] text-muted-foreground uppercase mb-2">Apoio Local</p>
          <div className="w-16 h-16 bg-muted rounded-full mb-3 mx-auto flex items-center justify-center group-hover:opacity-90 transition-opacity">
            <span className="text-primary font-serif font-black">MC</span>
          </div>
          <h4 className="font-bold text-lg text-primary group-hover:text-secondary transition-colors">Mecânica Central</h4>
          <p className="text-xs text-muted-foreground mt-1">Revisão completa para seu veículo</p>
          <span className="inline-flex mt-3 text-xs font-bold text-secondary border border-secondary px-2 py-1 rounded hover:bg-secondary hover:text-secondary-foreground transition-colors">
            Agendar
          </span>
        </div>

        <div className="w-full bg-muted/50 border-2 border-dashed rounded-lg flex items-center justify-center relative overflow-hidden group hover:border-secondary hover:bg-card transition-all cursor-pointer">
          <span className="absolute top-2 right-2 text-[10px] bg-card/80 px-1.5 py-0.5 rounded shadow-sm text-muted-foreground">
            Anuncie Aqui
          </span>
          <div className="text-center p-6">
            <p className="font-serif font-bold text-2xl text-primary mb-2 group-hover:scale-105 transition-transform">Sua Marca</p>
            <p className="text-sm text-muted-foreground mb-4">Alcance milhares de leitores</p>
            <Button className="rounded-full" size="sm">
              Contatar Comercial
            </Button>
          </div>
        </div>
      </div>

      <a
        className="block bg-card border hover:border-primary transition-all rounded-lg p-3 shadow-sm group cursor-pointer text-center"
        href="#"
      >
        <div className="flex items-center justify-center gap-2">
          <Phone className="h-4 w-4 text-primary" aria-hidden="true" />
          <span className="font-medium text-sm group-hover:text-primary transition-colors">Consultar Telefones Úteis</span>
        </div>
      </a>

      <div className="bg-card rounded-lg p-6 shadow-sm border">
        <h3 className="font-serif font-bold text-lg text-primary mb-4">Mais Lidas</h3>
        <ul className="space-y-4">
          {[
            "Acidente na ERS-324 deixa trânsito lento nesta manhã",
            "Prefeitura abre inscrições para concurso público",
            "Novo shopping center confirma instalação na região",
            "Programação de Natal é divulgada com shows nacionais",
          ].map((t, idx) => (
            <li key={t} className="flex gap-3 items-start border-b pb-3 last:border-0 last:pb-0">
              <span className="text-3xl font-bold text-muted leading-none">{idx + 1}</span>
              <a className="text-sm font-medium hover:text-primary transition-colors leading-snug" href="#">
                {t}
              </a>
            </li>
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
