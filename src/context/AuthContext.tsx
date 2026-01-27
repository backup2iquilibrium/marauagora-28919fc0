import * as React from "react";

import { supabase } from "@/integrations/supabase/client";

type AuthState = {
  user: Awaited<ReturnType<typeof supabase.auth.getUser>>["data"]["user"] | null;
  loading: boolean;
};

const AuthContext = React.createContext<AuthState>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthState>({ user: null, loading: true });

  React.useEffect(() => {
    let mounted = true;

    // Keep auth state in sync; set up listener BEFORE getSession() (Supabase best practice)
    const { data: sub } = supabase.auth.onAuthStateChange(async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setState({ user: data.user ?? null, loading: false });
    });

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setState({ user: data.user ?? null, loading: false });
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}
