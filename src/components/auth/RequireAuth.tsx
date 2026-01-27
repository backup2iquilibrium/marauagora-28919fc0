import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

export function RequireAuth({ children, to = "/admin/login" }: { children: JSX.Element; to?: string }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="min-h-[50vh] grid place-items-center text-muted-foreground">Carregando…</div>;
  if (!user) return <Navigate to={to} replace state={{ from: location }} />;
  return children;
}
