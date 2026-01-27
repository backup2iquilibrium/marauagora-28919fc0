import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import * as React from "react";
import { Check, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import sidebarImage from "@/assets/admin-sidebar.jpg";

const passwordRules = {
  minLen: (v: string) => v.length >= 8,
  number: (v: string) => /\d/.test(v),
  upper: (v: string) => /[A-Z]/.test(v),
  lower: (v: string) => /[a-z]/.test(v),
  special: (v: string) => /[^A-Za-z0-9]/.test(v),
} as const;

function getPasswordChecks(password: string) {
  return {
    minLen: passwordRules.minLen(password),
    number: passwordRules.number(password),
    upperLower: passwordRules.upper(password) && passwordRules.lower(password),
    special: passwordRules.special(password),
  };
}

function PasswordRequirements({ password }: { password: string }) {
  const checks = React.useMemo(() => getPasswordChecks(password), [password]);
  const Item = ({ ok, label }: { ok: boolean; label: string }) => (
    <div className="flex items-center gap-3">
      <div
        className={
          "h-5 w-5 rounded-sm border grid place-items-center " +
          (ok ? "bg-primary border-primary text-primary-foreground" : "bg-background border-input text-muted-foreground")
        }
        aria-hidden
      >
        {ok ? <Check className="h-3.5 w-3.5" /> : null}
      </div>
      <span className={"text-sm " + (ok ? "text-foreground" : "text-muted-foreground")}>{label}</span>
    </div>
  );

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="text-xs font-semibold tracking-wider text-muted-foreground">REQUISITOS DA SENHA</div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Item ok={checks.minLen} label="Mínimo de 8 caracteres" />
        <Item ok={checks.upperLower} label="Letra maiúscula e minúscula" />
        <Item ok={checks.number} label="Pelo menos um número" />
        <Item ok={checks.special} label="Caractere especial (!@#$%)" />
      </div>
    </div>
  );
}

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Use no mínimo 8 caracteres")
      .refine((v) => passwordRules.number(v), "Inclua pelo menos um número")
      .refine((v) => passwordRules.upper(v), "Inclua pelo menos uma letra maiúscula")
      .refine((v) => passwordRules.lower(v), "Inclua pelo menos uma letra minúscula")
      .refine((v) => passwordRules.special(v), "Inclua pelo menos um caractere especial"),
    confirmPassword: z.string().min(8, "Confirme sua senha"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type Values = z.infer<typeof schema>;

export default function AdminResetPassword() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onSubmit",
  });

  const passwordValue = form.watch("password");

  const onSubmit = async (values: Values) => {
    const parsed = schema.safeParse(values);
    if (!parsed.success) return;

    const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
    if (error) {
      toast.error("Não foi possível redefinir", { description: "Tente novamente." });
      return;
    }

    toast.success("Senha atualizada", { description: "Faça login com sua nova senha." });
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-10">
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border bg-card shadow-sm grid grid-cols-1 md:grid-cols-2">
        {/* Painel lateral */}
        <aside className="relative min-h-[320px] md:min-h-[640px] overflow-hidden">
          <img
            src={sidebarImage}
            alt="Paisagem urbana ao entardecer"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/25 to-background/10" />

          <div className="relative z-10 p-8 md:p-10 flex h-full flex-col">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-background/15 border border-border/30 grid place-items-center">
                <span className="text-sm font-bold">M</span>
              </div>
              <div>
                <div className="font-semibold">Marau Agora</div>
                <div className="text-xs text-muted-foreground">Painel Administrativo</div>
              </div>
            </div>

            <div className="mt-auto">
              <blockquote className="max-w-sm text-lg font-semibold leading-snug">
                “A segurança da informação é fundamental para manter a integridade do nosso jornalismo.”
              </blockquote>
              <div className="mt-3 text-xs text-muted-foreground">Painel Administrativo v2.4</div>
            </div>
          </div>
        </aside>

        {/* Form */}
        <main className="p-8 md:p-12">
          <div className="max-w-xl">
            <h1 className="text-4xl font-semibold tracking-tight">Definir Nova Senha</h1>
            <p className="mt-3 text-muted-foreground max-w-prose">
              Por favor, insira sua nova senha abaixo para acessar o painel administrativo do Marau Agora.
            </p>
          </div>

          <div className="mt-10">
            {loading ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Verificando link…</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">Aguarde um instante.</CardContent>
              </Card>
            ) : !user ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Link inválido ou expirado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Abra novamente o link de recuperação enviado por e-mail para continuar.
                  </p>
                  <Button variant="outline" onClick={() => navigate("/admin/login")}>
                    Voltar ao Login
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="max-w-xl">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nova Senha</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                autoComplete="new-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Digite sua nova senha"
                                className="pr-11"
                                {...field}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                              >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <PasswordRequirements password={passwordValue ?? ""} />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar Nova Senha</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                autoComplete="new-password"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Repita sua nova senha"
                                className="pr-11"
                                {...field}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => setShowConfirmPassword((v) => !v)}
                                aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                              >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full">
                      Redefinir Senha
                    </Button>

                    <div className="text-center text-sm">
                      <button
                        type="button"
                        onClick={() => navigate("/admin/login")}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        ← Voltar ao Login
                      </button>
                    </div>
                  </form>
                </Form>
              </div>
            )}
          </div>
        </main>
      </div>

      <div className="mt-8 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} Marau Agora. Todos os direitos reservados.</div>
    </div>
  );
}
