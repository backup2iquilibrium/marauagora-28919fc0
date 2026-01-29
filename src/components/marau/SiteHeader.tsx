import { Facebook, Instagram, Mail, Search, Youtube, LayoutDashboard } from "lucide-react";
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

  const newNavItems = [
    { label: "Início", href: "/" },
    { label: "Notícias", href: "/categoria/noticias" },
    { label: "Esportes", href: "/categoria/esportes" },
    { label: "Política", href: "/categoria/politica" },
    { label: "Quem Somos", href: "/quem-somos" },
  ];

  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Nav */}
        <div className="flex items-center gap-8">
          <div className="shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-blue-500 rounded p-1">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Marau Agora</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {newNavItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                className={({ isActive }) =>
                  isActive ? "text-blue-600 font-semibold" : "hover:text-blue-600 transition-colors"
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Search and Action */}
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar"
              className="pl-9 bg-slate-100 border-transparent focus-visible:bg-white focus-visible:ring-blue-500 h-9"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitSearch()}
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium h-9 px-6">
            Inscrever-se
          </Button>
        </div>
      </div>
    </header>
  );
}
