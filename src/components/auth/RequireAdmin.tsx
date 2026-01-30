import * as React from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function RequireAdmin({ children }: { children: JSX.Element }) {
  const { user, loading, isDeveloper } = useAuth();
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!user) {
        setIsAdmin(null);
        return;
      }

      // If developer, instant access
      if (isDeveloper) {
        setIsAdmin(true);
        return;
      }

      const { data, error } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });

      if (cancelled) return;
      if (error) {
        // Fail closed
        setIsAdmin(false);
        return;
      }
      setIsAdmin(Boolean(data));
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [user, isDeveloper]);

  if (loading) return <div className="min-h-[50vh] grid place-items-center text-muted-foreground">Carregando…</div>;
  if (!user) return <Navigate to="/admin/login" replace />;

  if (isAdmin === null) {
    return <div className="min-h-[50vh] grid place-items-center text-muted-foreground">Verificando acesso…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[50vh] grid place-items-center">
        <div className="max-w-md text-center space-y-2">
          <h1 className="text-xl font-semibold">Acesso restrito</h1>
          <p className="text-sm text-muted-foreground">Você precisa ser admin para acessar esta área.</p>
        </div>
      </div>
    );
  }

  return children;
}
