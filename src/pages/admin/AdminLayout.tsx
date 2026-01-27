import { LogOut, Newspaper, Tag, Settings, Users } from "lucide-react";
import { Outlet, NavLink as RRNavLink } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: Newspaper },
  { to: "/admin/classificados", label: "Classificados", icon: Tag },
  { to: "/admin/usuarios", label: "Usuários", icon: Users },
  { to: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside className="w-72 border-r bg-card hidden md:flex md:flex-col">
          <div className="px-5 py-5 border-b">
            <p className="text-sm text-muted-foreground">Marau Agora</p>
            <p className="text-lg font-semibold">Painel Administrativo</p>
          </div>

          <nav className="p-3 space-y-1">
            {navItems.map((item) => (
              <RRNavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
                    isActive && "bg-muted text-foreground font-medium",
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </RRNavLink>
            ))}
          </nav>

          <div className="mt-auto p-4 border-t">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => supabase.auth.signOut()}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </aside>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
