import { Bell, LogOut, Settings } from "lucide-react";
import * as React from "react";
import { NavLink as RRNavLink } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type DashboardNavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  end?: boolean;
};

type DashboardShellProps = {
  brand?: string;
  panelTitle: string;
  navItems: DashboardNavItem[];
  userLabel: string;
  userSublabel: string;
  onSignOut: () => void;
  children: React.ReactNode;
};

export function DashboardShell({
  brand = "Marau Agora",
  panelTitle,
  navItems,
  userLabel,
  userSublabel,
  onSignOut,
  children,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside className="w-72 border-r bg-card hidden md:flex md:flex-col">
          <div className="px-5 py-5 border-b">
            <p className="text-sm text-muted-foreground">{brand}</p>
            <p className="text-lg font-semibold">{panelTitle}</p>
          </div>

          <nav className="p-3 space-y-1">
            {navItems.map((item) => (
              <RRNavLink
                key={item.to}
                to={item.to}
                end={item.end}
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
            <Button variant="outline" className="w-full justify-start" onClick={onSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <header className="h-16 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="h-full px-6 flex items-center justify-end gap-3">
              <Button variant="outline" size="icon" aria-label="Notificações">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" aria-label="Configurações">
                <Settings className="h-4 w-4" />
              </Button>
              <div className="pl-2 border-l ml-1 flex items-center gap-3">
                <div className="text-right leading-tight">
                  <div className="text-sm font-semibold truncate max-w-[180px]">{userLabel}</div>
                  <div className="text-xs text-muted-foreground">{userSublabel}</div>
                </div>
                <div className="h-9 w-9 rounded-full bg-muted border" aria-hidden />
              </div>
            </div>
          </header>

          <main className="min-w-0">{children}</main>

          <footer className="px-6 py-6 text-xs text-muted-foreground border-t">
            © 2024 Marau Agora. Todos os direitos reservados.
          </footer>
        </div>
      </div>
    </div>
  );
}
