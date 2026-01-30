import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import * as React from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  email: z.string().trim().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type Values = z.infer<typeof schema>;

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname ?? "/admin/classificados";
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const onSubmit = async (values: Values) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      form.setError("email", { message: "Não foi possível entrar. Verifique suas credenciais." });
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-10">
      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-xl shadow-sm border bg-card grid grid-cols-1 md:grid-cols-2">
        {/* Painel lateral */}
        <aside className="relative bg-primary text-primary-foreground p-8 md:p-10 overflow-hidden">
          <img
            src="/login.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary/90" />

          <div className="relative z-10 flex flex-col h-full">
            <div className="flex flex-col gap-3">
              <img src="/logo.png" alt="Marau Agora" className="h-12 w-auto object-contain" />
              <div className="text-sm font-medium text-primary-foreground/90 uppercase tracking-widest pl-1">
                Painel Administrativo
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-3xl font-semibold tracking-tight">Informação com credibilidade.</h2>
              <p className="mt-3 text-primary-foreground/85 max-w-sm">
                Acesse o painel para gerenciar notícias, colaboradores e publicidade do portal.
              </p>
            </div>

            <div className="mt-auto border-t border-primary-foreground/15 pt-6 text-sm text-primary-foreground/70">
              © {new Date().getFullYear()} Marau Agora. Todos os direitos reservados.
            </div>
          </div>
        </aside>

        {/* Form */}
        <main className="p-8 md:p-10">
          <div className="max-w-md">
            <h1 className="text-3xl font-semibold tracking-tight">Acesso Administrativo</h1>
            <p className="mt-2 text-muted-foreground">Bem-vindo de volta. Insira suas credenciais.</p>
          </div>

          <Card className="mt-8 max-w-md">
            <CardHeader>
              <CardTitle className="text-base">Entrar</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input autoComplete="email" type="email" placeholder="admin@marauagora.com.br" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between gap-4">
                          <FormLabel>Senha</FormLabel>
                          <Link className="text-sm text-primary hover:underline" to="/admin/recuperar-senha">
                            Esqueci minha senha
                          </Link>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Input
                              autoComplete="current-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Digite sua senha"
                              {...field}
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((v) => !v)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Acessar Painel
                  </Button>

                  <div className="pt-2 text-center text-sm">
                    <Link className="text-muted-foreground hover:text-primary transition-colors" to="/">
                      ← Voltar ao site
                    </Link>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="mt-10 text-xs text-muted-foreground flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" aria-hidden="true" />
            Área segura e monitorada.
          </div>
        </main>
      </div>

      <div className="mt-6 text-right text-xs text-muted-foreground">v2.4.1 Build {new Date().getFullYear()}</div>
    </div>
  );
}
