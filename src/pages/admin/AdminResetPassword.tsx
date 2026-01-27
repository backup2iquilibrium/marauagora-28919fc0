import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z
  .object({
    password: z.string().min(8, "Use no mínimo 8 caracteres"),
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

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onSubmit",
  });

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
      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-xl shadow-sm border bg-card grid grid-cols-1 md:grid-cols-2">
        {/* Painel lateral */}
        <aside className="bg-primary text-primary-foreground p-8 md:p-10 relative">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-background/10 grid place-items-center">
              <span className="text-sm font-bold">M</span>
            </div>
            <div>
              <div className="font-semibold">Marau Agora</div>
              <div className="text-xs text-primary-foreground/80">Admin Panel</div>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-3xl font-semibold tracking-tight">Informação com credibilidade.</h2>
            <p className="mt-3 text-primary-foreground/85 max-w-sm">
              Acesse o painel para gerenciar notícias, colaboradores e publicidade do portal.
            </p>
          </div>

          <div className="mt-10 border-t border-primary-foreground/15 pt-6 text-sm text-primary-foreground/70">
            © {new Date().getFullYear()} Marau Agora. Todos os direitos reservados.
          </div>
        </aside>

        {/* Form */}
        <main className="p-8 md:p-10">
          <div className="max-w-md">
            <h1 className="text-3xl font-semibold tracking-tight">Redefinir Senha</h1>
            <p className="mt-2 text-muted-foreground">
              Defina uma nova senha para sua conta.
            </p>
          </div>

          <div className="mt-8">
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
                  <Button variant="outline" onClick={() => navigate("/admin/login")}>Voltar ao Login</Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="max-w-md">
                <CardHeader>
                  <CardTitle className="text-base">Nova senha</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nova Senha</FormLabel>
                            <FormControl>
                              <Input autoComplete="new-password" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmar Senha</FormLabel>
                            <FormControl>
                              <Input autoComplete="new-password" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full">Salvar Nova Senha</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      <div className="mt-6 text-right text-xs text-muted-foreground">v2.4.1 Build {new Date().getFullYear()}</div>
    </div>
  );
}
