import * as React from "react";

import { supabase } from "@/integrations/supabase/client";

type AuthState = {
  user: Awaited<ReturnType<typeof supabase.auth.getUser>>["data"]["user"] | null;
  loading: boolean;
  isDeveloper: boolean;
};

const AuthContext = React.createContext<AuthState>({ user: null, loading: true, isDeveloper: false });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthState>({ user: null, loading: true, isDeveloper: false });

  React.useEffect(() => {
    let mounted = true;

    // Helper to check dev email
    const checkIsDev = (email?: string) => email === "marauagorars@gmail.com" || email === "loopsalesone@gmail.com"; // Including current user for safety, but focusing on request

    // Keep auth state in sync; set up listener BEFORE getSession() (Supabase best practice)
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      // const { data } = await supabase.auth.getUser(); // Session is passed in event usually better
      if (!mounted) return;
      const user = session?.user ?? null;
      setState({
        user,
        loading: false,
        isDeveloper: user?.email ? checkIsDev(user.email) : false
      });
    });

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      const user = data.user ?? null;
      setState({
        user,
        loading: false,
        isDeveloper: user?.email ? checkIsDev(user.email) : false
      });
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
