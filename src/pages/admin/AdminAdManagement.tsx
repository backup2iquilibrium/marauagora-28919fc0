import * as React from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
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

const chartData = [
  { week: "Semana 1", clicks: 12, views: 210 },
  { week: "Semana 2", clicks: 10, views: 180 },
  { week: "Semana 3", clicks: 14, views: 240 },
  { week: "Semana 4", clicks: 18, views: 320 },
];

type InventoryItem = {
  title: string;
  subtitle: string;
  meta: string;
  statusLabel: string;
  statusTone: "secondary" | "destructive";
  rightMeta?: string;
  icon: React.ReactNode;
  iconBgClassName: string;
};

const inventory: InventoryItem[] = [
  {
    title: "Topo Home",
    subtitle: "728x90px • Desktop",
    meta: "",
    statusLabel: "Ocupado",
    statusTone: "destructive",
    rightMeta: "Fila: 2",
    icon: <LayoutPanelTop className="h-5 w-5" aria-hidden="true" />,
    iconBgClassName: "bg-muted",
  },
  {
    title: "Lateral Notícias",
    subtitle: "300x250px • Responsivo",
    meta: "",
    statusLabel: "Disponível",
    statusTone: "secondary",
    rightMeta: "R$ 450/mês",
    icon: <SidebarIcon className="h-5 w-5" aria-hidden="true" />,
    iconBgClassName: "bg-muted",
  },
  {
    title: "In-Feed (Lista)",
    subtitle: "Nativo • Mobile",
    meta: "",
    statusLabel: "Ocupado",
    statusTone: "destructive",
    rightMeta: "Fila: 0",
    icon: <List className="h-5 w-5" aria-hidden="true" />,
    iconBgClassName: "bg-muted",
  },
  {
    title: "Rodapé",
    subtitle: "970x250px • Desktop",
    meta: "",
    statusLabel: "Disponível",
    statusTone: "secondary",
    rightMeta: "R$ 300/mês",
    icon: <PanelBottom className="h-5 w-5" aria-hidden="true" />,
    iconBgClassName: "bg-muted",
  },
];

type CampaignRow = {
  ad: string;
  placement: string;
  client: string;
  status: "Ativo" | "Pausado";
  date: string;
};

const campaigns: CampaignRow[] = [
  { ad: "Ofertas Semanais", placement: "Topo Home", client: "Supermercado Bom Preço", status: "Ativo", date: "Até 12/11/2023" },
  { ad: "Festival de Inverno", placement: "Lateral Notícias", client: "Farmácias São João", status: "Pausado", date: "Até 30/11/2023" },
  { ad: "Vestibular de Verão", placement: "Topo Home", client: "Universidade UPF", status: "Ativo", date: "Até 15/12/2023" },
];

export default function AdminAdManagement() {
  const [autoAds, setAutoAds] = React.useState(true);

  const onCopyPublisherId = async () => {
    try {
      await navigator.clipboard.writeText("pub-849201948201923");
      toast.success("Copiado", { description: "Publisher ID copiado para a área de transferência." });
    } catch {
      toast.error("Não foi possível copiar", { description: "Copie manualmente o código." });
    }
  };

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
          value="12/15"
          badgeText="+2.5%"
          badgeTone="secondary"
          icon={<Megaphone className="h-4 w-4 text-primary" aria-hidden="true" />}
        />
        <MetricCard
          title="IMPRESSÕES (MÊS)"
          value="45.2k"
          badgeText="+12%"
          badgeTone="secondary"
          icon={<Eye className="h-4 w-4 text-primary" aria-hidden="true" />}
        />
        <MetricCard
          title="RECEITA ESTIMADA"
          value="R$ 3.2k"
          badgeText="+5%"
          badgeTone="secondary"
          icon={<BadgeDollarSign className="h-4 w-4 text-primary" aria-hidden="true" />}
        />
        <MetricCard
          title="OCUPAÇÃO"
          value="80%"
          badgeText="Estável"
          badgeTone="outline"
          icon={<BarChart3 className="h-4 w-4 text-primary" aria-hidden="true" />}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-base">Desempenho</CardTitle>
                <p className="text-sm text-muted-foreground">Cliques e visualizações nos últimos 30 dias</p>
              </div>
              <Badge variant="outline" className="rounded-full px-3 py-1">
                Últimos 30 dias
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
              {inventory.map((item) => (
                <div key={item.title} className="flex items-start justify-between gap-3 rounded-lg border bg-card p-4">
                  <div className="flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-lg ${item.iconBgClassName} grid place-items-center`}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-muted-foreground">{item.subtitle}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge variant={item.statusTone} className="rounded-full">
                      {item.statusLabel}
                    </Badge>
                    {item.rightMeta ? <div className="mt-1 text-xs text-muted-foreground">{item.rightMeta}</div> : null}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Google Adsense</CardTitle>
              <p className="text-sm text-muted-foreground">Gerencie a integração automática.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-xs text-muted-foreground">PUBLISHER ID</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-lg border bg-card px-3 py-2 font-mono text-sm">pub-849201948201923</div>
                <Button variant="outline" size="icon" aria-label="Copiar Publisher ID" onClick={onCopyPublisherId}>
                  <Copy className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium">Anúncios Automáticos</div>
                </div>
                <Switch checked={autoAds} onCheckedChange={setAutoAds} />
              </div>

              <Button variant="outline" className="w-full">
                Acessar Relatório Completo
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-base">Campanhas Ativas</CardTitle>
            <Button variant="ghost" className="text-primary">
              Ver Todos
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ANÚNCIO</TableHead>
                <TableHead>LOCALIZAÇÃO</TableHead>
                <TableHead>CLIENTE</TableHead>
                <TableHead>STATUS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((row) => (
                <TableRow key={`${row.ad}-${row.client}`}>
                  <TableCell>
                    <div className="font-medium">{row.ad}</div>
                    <div className="text-xs text-muted-foreground">{row.date}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-full">
                      {row.placement}
                    </Badge>
                  </TableCell>
                  <TableCell>{row.client}</TableCell>
                  <TableCell>
                    <Badge variant={row.status === "Ativo" ? "secondary" : "outline"} className="rounded-full">
                      {row.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
