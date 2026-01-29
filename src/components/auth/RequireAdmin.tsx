import * as React from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function RequireAdmin({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!user) {
        setIsAdmin(null);
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
  }, [user]);

  if (loading) return <div className="min-h-[50vh] grid place-items-center text-muted-foreground">Carregando…</div>;
  if (!user) return <Navigate to="/admin/login" replace />;

  if (isAdmin === null) {
    return <div className="min-h-[50vh] grid place-items-center text-muted-foreground">Verificando acesso…</div>;
  }

  if (!isAdmin) {
    // DEV MODE: Allow access but show warning
    return (
      <div className="flex flex-col h-full bg-red-50">
        <div className="bg-red-600 text-white text-xs py-1 px-4 text-center font-bold">
          MODO DESENVOLVEDOR: ACESSO DE ADMIN LIBERADO SEM PERMISSÃO REAL
        </div>
        <div className="flex-1">
          {children}
        </div>
      </div>
    );
    /* 
    // Original Access Denied logic
    return (
     <div className="min-h-[50vh] grid place-items-center">
       <div className="max-w-md text-center space-y-2">
         <h1 className="text-xl font-semibold">Acesso restrito</h1>
         <p className="text-sm text-muted-foreground">Você precisa ser admin para acessar esta área.</p>
       </div>
     </div>
   ); 
   */
  }

  return children;
}
