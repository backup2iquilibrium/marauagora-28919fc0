import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().trim().email("Informe um e-mail válido").max(255),
});

type Values = z.infer<typeof schema>;

export default function AdminForgotPassword() {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
    mode: "onSubmit",
  });

  const onSubmit = async (values: Values) => {
    const parsed = schema.safeParse(values);
    if (!parsed.success) return;

    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: `${window.location.origin}/admin/redefinir-senha`,
    });

    if (error) {
      toast.error("Não foi possível enviar", { description: "Verifique o e-mail e tente novamente." });
      return;
    }

    toast.success("Link enviado", { description: "Verifique seu e-mail para continuar." });
    form.reset();
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-10">
      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-xl shadow-sm border bg-card grid grid-cols-1 md:grid-cols-2">
        {/* Painel lateral */}
        <aside className="bg-primary text-primary-foreground p-8 md:p-10 relative">
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

          <div className="mt-10 mb-6">
            <img src="/login.png" alt="" className="max-w-[180px] h-auto rounded-lg shadow-2xl opacity-90" />
          </div>

          <div className="mt-auto border-t border-primary-foreground/15 pt-6 text-sm text-primary-foreground/70">
            © {new Date().getFullYear()} Marau Agora. Todos os direitos reservados.
          </div>
        </aside>

        {/* Form */}
        <main className="p-8 md:p-10">
          <div className="max-w-md">
            <h1 className="text-3xl font-semibold tracking-tight">Recuperar Senha</h1>
            <p className="mt-2 text-muted-foreground">
              Informe o e-mail associado à sua conta para receber o link de redefinição.
            </p>
          </div>

          <Card className="mt-8 max-w-md">
            <CardHeader>
              <CardTitle className="text-base">Enviar link</CardTitle>
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
                          <Input autoComplete="email" inputMode="email" type="email" placeholder="admin@marauagora.com.br" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">Enviar Link de Recuperação</Button>

                  <div className="pt-2 text-center text-sm">
                    <Link className="text-muted-foreground hover:text-primary transition-colors" to="/admin/login">
                      ← Voltar ao Login
                    </Link>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="mt-10 text-xs text-muted-foreground flex items-center gap-2">
            <span className="text-primary">🔒</span>
            Área segura e monitorada.
          </div>
        </main>
      </div>

      <div className="mt-6 text-right text-xs text-muted-foreground">v2.4.1 Build {new Date().getFullYear()}</div>
    </div>
  );
}
