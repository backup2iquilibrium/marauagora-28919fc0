import { Facebook, Instagram, Mail, Youtube, ChevronDown } from "lucide-react";
import * as React from "react";
import { Link } from "react-router-dom";

import { NavLink } from "@/components/NavLink";
import { SearchAutocomplete } from "./SearchAutocomplete";
import { NavItem } from "./types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const defaultNav: NavItem[] = [
  { 
    label: "Início", 
    href: "/",
    children: [
      { label: "Página Inicial", href: "/" },
      { label: "Quem Somos", href: "/quem-somos" },
    ]
  },
  { 
    label: "Cidade", 
    href: "/categoria/cidade",
    children: [
      { label: "Notícias da Cidade", href: "/categoria/cidade" },
      { label: "Guia da Cidade", href: "/guia-da-cidade" },
      { label: "Vagas de Emprego", href: "/vagas" },
      { label: "Agenda de Eventos", href: "/agenda" },
      { label: "Telefones Úteis", href: "/telefones-uteis" },
    ]
  },
  { 
    label: "Polícia", 
    href: "/categoria/policia",
    children: [
      { label: "Notícias de Polícia", href: "/categoria/policia" },
      { label: "Ocorrências", href: "/categoria/policial" },
    ]
  },
  { 
    label: "Política", 
    href: "/categoria/politica",
    children: [
      { label: "Notícias de Política", href: "/categoria/politica" },
      { label: "Câmara de Vereadores", href: "/categoria/politica?q=Camara" },
      { label: "Prefeitura", href: "/categoria/politica?q=Prefeitura" },
    ]
  },
  { label: "Esportes", href: "/categoria/esportes" },
  { label: "Serviços Públicos", href: "/servicos" },

  { label: "Agronegócio", href: "/categoria/agronegocio" },
  { label: "Agenda", href: "/agenda" },
  { label: "Classificados", href: "/categoria/classificados" },
  { label: "Ao Vivo", href: "/ao-vivo", accent: true },
];

export function SiteHeader({
  logoUrl,
  navItems = defaultNav,
}: {
  logoUrl: string;
  navItems?: NavItem[];
}) {
  return (
    <header className="bg-card shadow-sm sticky top-0 z-40">
      <div className="container px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="shrink-0">
            <img
              src={logoUrl}
              alt="Marau Agora — logomarca"
              className="h-28 w-auto object-contain"
              loading="eager"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-primary">
              <a
                className="hover:opacity-80"
                href="https://www.facebook.com/marauagora/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                className="hover:opacity-80"
                href="https://www.instagram.com/marauagora/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <button
                className="hover:opacity-80 cursor-pointer bg-transparent border-none p-0 text-primary"
                aria-label="Enviar e-mail para Marau Agora"
                title="Enviar e-mail: marauagorars@gmail.com"
                onClick={() => window.open("mailto:marauagorars@gmail.com", "_self")}
              >
                <Mail className="h-5 w-5" />
              </button>
              <button
                className="hover:opacity-80 cursor-pointer bg-transparent border-none p-0 text-primary"
                aria-label="YouTube - Em Breve"
                title="Em Breve"
                onClick={() => alert("Em Breve! 🎬\nNosso canal no YouTube estará disponível em breve.")}
              >
                <Youtube className="h-5 w-5" />
              </button>
            </div>

            {/* Busca com autocomplete em tempo real */}
            <SearchAutocomplete />
          </div>
        </div>
      </div>

      <nav className="border-t bg-card">
        <div className="container px-4">
          <ul className="flex overflow-x-auto no-scrollbar gap-6 py-3 text-sm font-medium text-muted-foreground whitespace-nowrap">
            {navItems.map((item) => (
              <li key={item.label} className={item.accent ? "ml-auto" : undefined}>
                {item.children ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1 hover:text-primary transition-colors outline-none">
                      {item.label}
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[180px]">
                      {item.children.map((child) => (
                        <DropdownMenuItem key={child.label} asChild>
                          <Link to={child.href} className="w-full cursor-pointer">
                            {child.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <NavLink
                    to={item.href}
                    className={
                      item.accent
                        ? "text-primary font-bold inline-flex items-center"
                        : "hover:text-primary transition-colors"
                    }
                  >
                    {item.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
