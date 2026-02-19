import * as React from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  BadgeDollarSign,
  BarChart3,
  Copy,
  Eye,
  LayoutPanelTop,
  List,
  Megaphone,
  PanelBottom,
  Plus,
  Settings2,
  Sidebar as SidebarIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type MetricCardProps = {
  title: string;
  value: string;
  badgeText?: string;
  badgeTone?: "default" | "secondary" | "destructive" | "outline";
  icon?: React.ReactNode;
};

function MetricCard({ title, value, badgeText, badgeTone = "secondary", icon }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-3">
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        {badgeText ? (
          <Badge variant={badgeTone} className="rounded-full">
            {badgeText}
          </Badge>
        ) : null}
      </CardContent>
    </Card>
  );
}

// Chart data remains focused on totals as there is no historical analytics table yet
const chartData = [
  { week: "Semana 1", clicks: 12, views: 210 },
  { week: "Semana 2", clicks: 10, views: 180 },
  { week: "Semana 3", clicks: 14, views: 240 },
  { week: "Semana 4", clicks: 18, views: 320 },
];

async function fetchAdManagementData() {
  const [spacesRes, campaignsRes] = await Promise.all([
    supabase.from("ad_spaces").select("*").order("sort_order", { ascending: true }),
    supabase.from("ad_campaigns").select("*").order("created_at", { ascending: false }),
  ]);

  if (spacesRes.error) throw spacesRes.error;
  if (campaignsRes.error) throw campaignsRes.error;

  return {
    spaces: spacesRes.data || [],
    campaigns: campaignsRes.data || [],
  };
}

function getSpaceIcon(device: string) {
  const d = device.toLowerCase();
  if (d.includes("desktop") || d.includes("topo")) return <LayoutPanelTop className="h-5 w-5" />;
  if (d.includes("sidebar") || d.includes("lateral")) return <SidebarIcon className="h-5 w-5" />;
  if (d.includes("bottom") || d.includes("rodape")) return <PanelBottom className="h-5 w-5" />;
  return <List className="h-5 w-5" />;
}

export default function AdminAdManagement() {
  const [autoAds, setAutoAds] = React.useState(true);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-ad-management"],
    queryFn: fetchAdManagementData,
  });

  const onCopyPublisherId = async () => {
    try {
      await navigator.clipboard.writeText("pub-849201948201923");
      toast.success("Copiado", { description: "Publisher ID copiado para a área de transferência." });
    } catch {
      toast.error("Não foi possível copiar", { description: "Copie manualmente o código." });
    }
  };

  const spaces = data?.spaces || [];
  const campaigns = data?.campaigns || [];

  const activeSpaces = spaces.filter(s => s.is_active).length;
  const activeCampaigns = campaigns.filter(c => c.status === "active");
  const occupiedSpaces = new Set(activeCampaigns.map(c => c.space_id)).size;

  const totalImpressions = campaigns.reduce((sum, c) => sum + (c.impressions || 0), 0);
  const estimatedRevenue = activeCampaigns.reduce((sum, c) => {
    const space = spaces.find(s => s.id === c.space_id);
    return sum + (space?.monthly_price_cents || 0);
  }, 0) / 100;

  const occupancyRate = activeSpaces > 0 ? Math.round((occupiedSpaces / activeSpaces) * 100) : 0;

  if (isLoading) {
    return <div className="p-12 text-center text-muted-foreground">Carregando gerenciamento de publicidade...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="text-sm text-muted-foreground">
        <span>Admin</span> <span className="mx-2">›</span>
        <span>Publicidade</span> <span className="mx-2">›</span>
        <span className="text-foreground">Gerenciamento</span>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Gerenciamento de Publicidade</h1>
          <p className="mt-1 text-muted-foreground">Controle de banners, parcerias e análise de desempenho.</p>
        </div>

        <Button className="gap-2">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Novo Anúncio
        </Button>
      </div>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <MetricCard
          title="ESPAÇOS ATIVOS"
          value={`${occupiedSpaces}/${activeSpaces}`}
          badgeText="+2.5%"
          badgeTone="secondary"
          icon={<Megaphone className="h-4 w-4 text-primary" aria-hidden="true" />}
        />
        <MetricCard
          title="IMPRESSÕES (TOTAL)"
          value={totalImpressions > 1000 ? `${(totalImpressions / 1000).toFixed(1)}k` : totalImpressions.toString()}
          badgeText="+12%"
          badgeTone="secondary"
          icon={<Eye className="h-4 w-4 text-primary" aria-hidden="true" />}
        />
        <MetricCard
          title="RECEITA MENSAL"
          value={`R$ ${estimatedRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
          badgeText="+5%"
          badgeTone="secondary"
          icon={<BadgeDollarSign className="h-4 w-4 text-primary" aria-hidden="true" />}
        />
        <MetricCard
          title="OCUPAÇÃO"
          value={`${occupancyRate}%`}
          badgeText={occupancyRate > 70 ? "Alta" : "Estável"}
          badgeTone="outline"
          icon={<BarChart3 className="h-4 w-4 text-primary" aria-hidden="true" />}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-base">Desempenho Global</CardTitle>
                <p className="text-sm text-muted-foreground">Visão acumulada de todas as campanhas</p>
              </div>
              <Badge variant="outline" className="rounded-full px-3 py-1">
                Geral
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillPrimary" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.22} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="week" tickLine={false} axisLine={false} className="text-xs" />
                  <YAxis tickLine={false} axisLine={false} className="text-xs" width={28} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" fill="url(#fillPrimary)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-base">Inventário de Espaços</CardTitle>
                <Button variant="ghost" size="icon" aria-label="Configurar inventário">
                  <Settings2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {spaces.map((space) => {
                const activeCampaign = campaigns.find(c => c.space_id === space.id && c.status === "active");
                return (
                  <div key={space.id} className="flex items-start justify-between gap-3 rounded-lg border bg-card p-4">
                    <div className="flex items-start gap-2">
                      <div className="h-10 w-10 rounded-lg bg-muted grid place-items-center shrink-0">
                        {getSpaceIcon(space.device_label)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{space.name}</div>
                        <div className="text-[10px] text-muted-foreground uppercase flex gap-2">
                          <span>{space.size_label}</span>
                          <span>•</span>
                          <span>{space.device_label}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <Badge variant={activeCampaign ? "destructive" : "secondary"} className="rounded-full text-[10px]">
                        {activeCampaign ? "Ocupado" : "Livre"}
                      </Badge>
                      <div className="mt-1 text-[10px] font-bold text-muted-foreground">
                        {activeCampaign ? activeCampaign.client_name : (space.monthly_price_cents ? `R$ ${(space.monthly_price_cents / 100)}` : "-")}
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Google Adsense</CardTitle>
              <p className="text-sm text-muted-foreground">Integração automática para espaços livres.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-xs text-muted-foreground">PUBLISHER ID</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-lg border bg-card px-3 py-2 font-mono text-xs">pub-849201948201923</div>
                <Button variant="outline" size="icon" aria-label="Copiar Publisher ID" onClick={onCopyPublisherId}>
                  <Copy className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="text-sm font-medium">Anúncios Automáticos</div>
                <Switch checked={autoAds} onCheckedChange={setAutoAds} />
              </div>

              <Button variant="outline" className="w-full text-xs">
                Acessar Console Adsense
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-base">Campanhas Recentes</CardTitle>
            <Button variant="ghost" className="text-primary h-auto p-0 text-sm">
              Ver Histórico
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[10px] py-2">ANÚNCIO / PERÍODO</TableHead>
                <TableHead className="text-[10px] py-2">LOCALIZAÇÃO</TableHead>
                <TableHead className="text-[10px] py-2">CLIENTE</TableHead>
                <TableHead className="text-[10px] py-2">MÉTRICAS</TableHead>
                <TableHead className="text-[10px] py-2">STATUS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-sm">
                    Nenhuma campanha cadastrada.
                  </TableCell>
                </TableRow>
              ) : (
                campaigns.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="py-4">
                      <div className="font-semibold text-sm">{row.title}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {row.starts_at ? format(new Date(row.starts_at), "dd/MM/yyyy") : "Início imediato"}
                        {row.ends_at ? ` — ${format(new Date(row.ends_at), "dd/MM/yyyy")}` : " — Indeterminado"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="rounded-full text-[10px] capitalize">
                        {spaces.find(s => s.id === row.space_id)?.name || "Geral"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{row.client_name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 text-[10px]">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3 text-muted-foreground" /> {row.impressions || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <BarChart3 className="h-3 w-3 text-muted-foreground" /> {row.clicks || 0}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={row.status === "active" ? "secondary" : "outline"}
                        className="rounded-full capitalize text-[10px]"
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
