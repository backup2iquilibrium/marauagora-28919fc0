import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Save, Loader2, Megaphone, Image as ImageIcon, Users, Target, 
  BarChart3, Mail, Phone, MessageCircle, FileDown, Plus, Trash2, Pencil
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

interface AdvertiseConfig {
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  intro_text: string;
  benefits: { title: string; description: string; icon: string }[];
  mediakit_url: string;
  contact_email: string;
  contact_phone: string;
  contact_whatsapp: string;
}

const DEFAULT_CONFIG: AdvertiseConfig = {
  hero_title: "Anuncie no Marau Agora",
  hero_subtitle: "Conecte sua marca com milhares de moradores de Marau e região todos os dias.",
  hero_image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80",
  intro_text: "O Marau Agora é o principal portal de notícias e entretenimento da nossa cidade. Oferecemos soluções inteligentes de publicidade para empresas que buscam visibilidade e resultados reais.",
  benefits: [
    { title: "Audiência Qualificada", description: "Alcance um público local engajado e interessado no que acontece na cidade.", icon: "users" },
    { title: "Visibilidade Máxima", description: "Banners estrategicamente posicionados nas páginas de maior acesso do portal.", icon: "target" },
    { title: "Resultados Mensuráveis", description: "Acompanhe o desempenho de suas campanhas com relatórios de impressões e cliques.", icon: "bar-chart" }
  ],
  mediakit_url: "",
  contact_email: "marauagorars@gmail.com",
  contact_phone: "(54) 92000-1320",
  contact_whatsapp: "(54) 92000-1320"
};

export default function AdminAdvertise() {
  const queryClient = useQueryClient();
  const [recordId, setRecordId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<AdvertiseConfig>(DEFAULT_CONFIG);
  const [isBenefitOpen, setIsBenefitOpen] = React.useState(false);
  const [editingBenefitIndex, setEditingBenefitIndex] = React.useState<number | null>(null);
  const [benefitForm, setBenefitForm] = React.useState({ title: "", description: "", icon: "megaphone" });

  const { data: config, isLoading } = useQuery({
    queryKey: ["site_settings", "advertise_page"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", "advertise_page")
        .maybeSingle();
      
      if (error && error.code !== "PGRST116") throw error;
      
      if (data) {
        setRecordId(data.id);
        if (data.value) setForm(data.value as AdvertiseConfig);
      }
      return data;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (newConfig: AdvertiseConfig) => {
      const payload: any = {
        key: "advertise_page",
        value: newConfig
      };
      
      if (recordId) payload.id = recordId;

      const { error } = await supabase
        .from("site_settings")
        .upsert(payload, { onConflict: "key" });
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site_settings", "advertise_page"] });
      toast.success("Configurações de publicidade salvas!");
    },
    onError: (e: any) => {
      console.error("Erro ao salvar publicidade:", e);
      toast.error("Erro ao salvar", { description: e.message || "Verifique logs ou permissões." });
    }
  });

  const handleAddBenefit = () => {
    setEditingBenefitIndex(null);
    setBenefitForm({ title: "", description: "", icon: "megaphone" });
    setIsBenefitOpen(true);
  };

  const handleEditBenefit = (idx: number) => {
    setEditingBenefitIndex(idx);
    setBenefitForm(form.benefits[idx]);
    setIsBenefitOpen(true);
  };

  const handleSaveBenefit = () => {
    const nextBenefits = [...form.benefits];
    if (editingBenefitIndex !== null) {
      nextBenefits[editingBenefitIndex] = benefitForm;
    } else {
      nextBenefits.push(benefitForm);
    }
    setForm({ ...form, benefits: nextBenefits });
    setIsBenefitOpen(false);
  };

  const handleDeleteBenefit = (idx: number) => {
    const nextBenefits = form.benefits.filter((_, i) => i !== idx);
    setForm({ ...form, benefits: nextBenefits });
  };

  if (isLoading) return <div className="p-12 text-center text-muted-foreground"><Loader2 className="animate-spin mx-auto mb-4" /> Carregando configurações...</div>;

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Configurar "Anuncie Conosco"</h1>
          <p className="text-sm text-muted-foreground">Gerencie o conteúdo informativo para anunciantes.</p>
        </div>
        <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending} className="gap-2">
          {saveMutation.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
          Salvar Página
        </Button>
      </div>

      <Tabs defaultValue="geral">
        <TabsList>
          <TabsTrigger value="geral">Geral / Hero</TabsTrigger>
          <TabsTrigger value="beneficios">Benefícios</TabsTrigger>
          <TabsTrigger value="contato">Contatos & Media Kit</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="mt-6 space-y-6">
          <Card>
            <CardHeader><CardTitle>Capa (Hero)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Título Principal</Label>
                <Input value={form.hero_title} onChange={e => setForm({...form, hero_title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Subtítulo</Label>
                <Textarea value={form.hero_subtitle} onChange={e => setForm({...form, hero_subtitle: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>URL da Imagem de Fundo</Label>
                <Input value={form.hero_image_url} onChange={e => setForm({...form, hero_image_url: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Texto de Introdução (Corpo da página)</Label>
                <Textarea rows={4} value={form.intro_text} onChange={e => setForm({...form, intro_text: e.target.value})} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="beneficios" className="mt-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Lista de Benefícios</h2>
            <Button size="sm" onClick={handleAddBenefit} className="gap-2"><Plus className="h-4 w-4" /> Adicionar</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {form.benefits.map((b, idx) => (
              <Card key={idx}>
                <CardContent className="p-4 flex justify-between items-start gap-4">
                  <div>
                    <div className="font-bold flex items-center gap-2">
                      <Megaphone className="h-4 w-4 text-primary" /> {b.title}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{b.description}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEditBenefit(idx)}><Pencil className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteBenefit(idx)}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contato" className="mt-6 space-y-6">
          <Card>
            <CardHeader><CardTitle>Informações de Contato</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>E-mail Comercial</Label>
                  <Input value={form.contact_email} onChange={e => setForm({...form, contact_email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input value={form.contact_phone} onChange={e => setForm({...form, contact_phone: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp (com DDD)</Label>
                  <Input value={form.contact_whatsapp} onChange={e => setForm({...form, contact_whatsapp: e.target.value})} />
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>URL do Media Kit (PDF)</Label>
                <div className="flex gap-2">
                  <Input value={form.mediakit_url} onChange={e => setForm({...form, mediakit_url: e.target.value})} placeholder="https://..." />
                  <Button variant="outline" size="icon"><FileDown className="h-4 w-4" /></Button>
                </div>
                <p className="text-xs text-muted-foreground italic">Link direto para o arquivo que os anunciantes poderão baixar.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isBenefitOpen} onOpenChange={setIsBenefitOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBenefitIndex !== null ? "Editar Benefício" : "Adicionar Benefício"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input value={benefitForm.title} onChange={e => setBenefitForm({...benefitForm, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Descrição Curta</Label>
              <Textarea value={benefitForm.description} onChange={e => setBenefitForm({...benefitForm, description: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Ícone (slug)</Label>
              <Input value={benefitForm.icon} onChange={e => setBenefitForm({...benefitForm, icon: e.target.value})} placeholder="users, target, bar-chart..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBenefitOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveBenefit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
