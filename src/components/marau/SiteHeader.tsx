import { Facebook, Instagram, Mail, Youtube } from "lucide-react";
import * as React from "react";

import { NavLink } from "@/components/NavLink";
import { SearchAutocomplete } from "./SearchAutocomplete";
import { NavItem } from "./types";

const defaultNav: NavItem[] = [
  { label: "Início", href: "/" },
  { label: "Cidade", href: "/categoria/cidade" },
  { label: "Polícia", href: "/categoria/policia" },
  { label: "Política", href: "/categoria/politica" },
  { label: "Esportes", href: "/categoria/esportes" },
  { label: "Serviços Públicos", href: "/servicos" },
  { label: "Horóscopo", href: "/horoscopo" },
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
              className="h-20 md:h-28 w-auto object-contain"
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
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
