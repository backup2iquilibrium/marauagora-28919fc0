import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, MessageCircle, Newspaper, Search, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { TopBar } from "@/components/marau/TopBar";
import { SiteHeader } from "@/components/marau/SiteHeader";
import { Footer } from "@/components/marau/Footer";

const LOGO_URL = "/logo.png";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome completo").max(120, "Máximo 120 caracteres"),
  email: z.string().trim().email("E-mail inválido").max(255, "Máximo 255 caracteres"),
  subject: z.string().trim().min(2, "Selecione um assunto").max(120),
  message: z.string().trim().min(5, "Escreva sua mensagem").max(4000, "Máximo 4000 caracteres"),
});

type ContactValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const subjectOptions = useMemo(
    () => ["Sugestão de Pauta", "Comercial / Anúncios", "Reclamação", "Outros"],
    [],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (values: ContactValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("contact-submit", { body: values });
      if (error) throw error;

      toast.success("Mensagem enviada!", {
        description: "Recebemos seu contato e responderemos em breve.",
      });
      form.reset();
    } catch (err: any) {
      toast.error("Não foi possível enviar", {
        description: err?.message ?? "Tente novamente em instantes.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <SiteHeader logoUrl={LOGO_URL} />

      <main className="container px-4 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <p className="text-sm font-semibold text-primary">Fale Conosco</p>
            </div>

            <h1 className="mt-3 font-serif text-3xl tracking-tight md:text-4xl">Fale com a Redação</h1>
            <p className="mt-2 text-muted-foreground">
              Tem uma sugestão de pauta, dúvida ou reclamação? A equipe do Marau Agora quer ouvir você. Preencha o
              formulário abaixo e entraremos em contato em breve.
            </p>

            <Card className="mt-6">
              <CardContent className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome" autoComplete="name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <Input placeholder="seuemail@email.com" type="email" autoComplete="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assunto</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger className="bg-card">
                                <SelectValue placeholder="Selecione o assunto" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="z-50 bg-popover">
                              {subjectOptions.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sua Mensagem</FormLabel>
                          <FormControl>
                            <Textarea rows={6} placeholder="Escreva sua mensagem..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" variant="secondary" className="w-full gap-2" disabled={isSubmitting}>
                      Enviar Mensagem
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </section>

          <aside className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Outros Canais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Fale diretamente com nossa equipe</p>
                  <p className="mt-1 text-sm text-muted-foreground">WhatsApp, e-mail e comercial.</p>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium">WhatsApp da Redação</p>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">(54) 99123-4567</p>
                  </div>

                  <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium">E-mail Geral</p>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">contato@marauagora.com.br</p>
                  </div>

                  <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium">Comercial</p>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">anuncios@marauagora.com.br</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      <Footer logoUrl={LOGO_URL} />
    </div>
  );
}
