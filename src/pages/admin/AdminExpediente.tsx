import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Plus, Pencil, Trash2, Loader2, Save, Building2, Users, MapPin, Phone, Mail, FileText
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface ExpedienteSettings {
  company_name: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
  director: string;
  editor: string;
}

const DEFAULT_SETTINGS: ExpedienteSettings = {
  company_name: "Marau Agora Comunicações LTDA",
  cnpj: "00.000.000/0000-00",
  address: "Av. Júlio Borella, 777 - 3 andar - Marau - RS",
  phone: "(54) 92000-1320",
  email: "marauagorars@gmail.com",
  director: "Direção Geral",
  editor: "Redação"
};

export default function AdminExpediente() {
  const queryClient = useQueryClient();
  const [recordId, setRecordId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<ExpedienteSettings>(DEFAULT_SETTINGS);

  const { data: config, isLoading } = useQuery({
    queryKey: ["site_settings", "expediente_info"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", "expediente_info")
        .maybeSingle();
      
      if (error && error.code !== "PGRST116") throw error;
      
      if (data) {
        setRecordId(data.id);
        if (data.value) setForm(data.value as ExpedienteSettings);
      }
      return data;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (newConfig: ExpedienteSettings) => {
      const payload: any = {
        key: "expediente_info",
        value: newConfig
      };
      
      if (recordId) payload.id = recordId;

      const { error } = await supabase
        .from("site_settings")
        .upsert(payload, { onConflict: "key" });
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site_settings", "expediente_info"] });
      toast.success("Expediente salvo com sucesso!");
    },
    onError: (e: any) => {
      console.error("Erro ao salvar expediente:", e);
      toast.error("Erro ao salvar", { description: e.message || "Verifique os logs ou permissões." });
    }
  });

  if (isLoading) return <div className="p-12 text-center text-muted-foreground"><Loader2 className="animate-spin mx-auto mb-4" /> Carregando expediente...</div>;

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gerenciar Expediente</h1>
          <p className="text-sm text-muted-foreground">Configure as informações institucionais do portal.</p>
        </div>
        <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending} className="gap-2">
          {saveMutation.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
          Salvar Expediente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" /> Dados Institucionais
          </CardTitle>
          <CardDescription>Estes dados aparecem na página pública de Expediente.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Razão Social / Nome da Empresa</Label>
                <Input value={form.company_name} onChange={e => setForm({...form, company_name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>CNPJ</Label>
                <Input value={form.cnpj} onChange={e => setForm({...form, cnpj: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Endereço Completo</Label>
                <Textarea value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Telefone / WhatsApp de Contato</Label>
                <Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>E-mail Institucional</Label>
                <Input value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <Separator className="my-2" />
              <div className="space-y-2">
                <Label>Responsável / Direção</Label>
                <Input value={form.director} onChange={e => setForm({...form, director: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Redação / Editores</Label>
                <Input value={form.editor} onChange={e => setForm({...form, editor: e.target.value})} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" /> Gestão da Equipe
          </CardTitle>
          <CardDescription>
            A lista detalhada de profissionais é compartilhada com a página "Quem Somos".
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
            <p className="text-sm">Para adicionar, editar ou remover jornalistas e membros da equipe:</p>
            <Button variant="outline" asChild>
              <a href="/admin/quem-somos?tab=team">Gerenciar Equipe na Aba "Quem Somos"</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
