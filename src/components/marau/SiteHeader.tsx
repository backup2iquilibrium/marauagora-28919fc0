import { Facebook, Instagram, Mail, Search, Youtube } from "lucide-react";
import * as React from "react";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
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
  const navigate = useNavigate();
  const [q, setQ] = React.useState("");

  const submitSearch = () => {
    const trimmed = q.trim();
    navigate(`/busca?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <header className="bg-card shadow-sm sticky top-0 z-40">
      <div className="container px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="shrink-0">
            <img
              src={logoUrl}
              alt="Marau Agora — logomarca"
              className="h-16 w-auto object-contain"
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
              <a
                className="hover:opacity-80"
                href="mailto:marauagorars@gmail.com"
                aria-label="E-mail"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                className="hover:opacity-80"
                href="https://www.youtube.com/@marauagora"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>

            <div className="relative w-full sm:w-80 md:w-96 lg:w-[450px]">
              <Input
                placeholder="Buscar notícias, vagas, serviços..."
                className="h-11 rounded-full pl-5 pr-12 bg-muted focus-visible:ring-ring"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitSearch();
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                aria-label="Buscar"
                onClick={submitSearch}
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
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
