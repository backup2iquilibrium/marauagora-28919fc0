import { BadgePercent, Tag } from "lucide-react";
import { Outlet } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DashboardShell, type DashboardNavItem } from "@/components/layout/DashboardShell";

const navItems: DashboardNavItem[] = [
  { to: "/anunciante/publicidade", label: "Publicidade", icon: BadgePercent, end: true },
  { to: "/anunciante/classificados", label: "Classificados", icon: Tag },
];

export default function AdvertiserLayout() {
  const { user } = useAuth();
  const displayName = (user?.user_metadata as any)?.full_name || user?.email || "Anunciante";

  return (
    <DashboardShell
      panelTitle="Painel do Anunciante"
      navItems={navItems}
      userLabel={displayName}
      userSublabel="Conta de Anunciante"
      onSignOut={() => supabase.auth.signOut()}
    >
      <Outlet />
    </DashboardShell>
  );
}
