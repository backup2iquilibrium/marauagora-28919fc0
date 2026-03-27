import { Newspaper, Tag, Users, Megaphone, FileText, Settings, MapPin, Briefcase, CalendarDays, Info, Shield, Video } from "lucide-react";
import { Outlet } from "react-router-dom";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { DashboardShell, type DashboardNavItem } from "@/components/layout/DashboardShell";

const navItems: DashboardNavItem[] = [
  { to: "/admin", label: "Dashboard", icon: Newspaper, end: true },
  { to: "/admin/publicidade", label: "Publicidade", icon: Megaphone },
  { to: "/admin/conteudo", label: "Conteúdo", icon: FileText },
  { to: "/admin/guia-da-cidade", label: "Cidade / Guia", icon: MapPin },
  { to: "/admin/vagas", label: "Vagas de Emprego", icon: Briefcase },
  { to: "/admin/agenda", label: "Agenda de Eventos", icon: CalendarDays },
  { to: "/admin/classificados", label: "Classificados", icon: Tag },
  { to: "/admin/ao-vivo", label: "Ao Vivo", icon: Video },
  { to: "/admin/quem-somos", label: "Quem Somos", icon: Info },
  { to: "/admin/usuarios", label: "Usuários", icon: Users },
  { to: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export default function AdminLayout() {
  const { user } = useAuth();
  const displayName = (user?.user_metadata as any)?.full_name || user?.email || "Admin";

  return (
    <DashboardShell
      panelTitle="Painel Administrativo"
      navItems={navItems}
      userLabel={displayName}
      userSublabel="Painel Administrativo"
      onSignOut={() => supabase.auth.signOut()}
    >
      <Outlet />
    </DashboardShell>
  );
}
