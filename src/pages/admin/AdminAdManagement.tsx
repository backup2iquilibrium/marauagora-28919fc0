import * as React from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Plus, Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

export default function AdminAdManagement() {
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
        <MetricCard title="ESPAÇOS ATIVOS" value="12/15" badgeText="+2.5%" badgeTone="secondary" />
        <MetricCard title="IMPRESSÕES (MÊS)" value="45.2k" badgeText="+12%" badgeTone="secondary" />
        <MetricCard title="RECEITA ESTIMADA" value="R$ 3.2k" badgeText="+5%" badgeTone="secondary" />
        <MetricCard title="OCUPAÇÃO" value="80%" badgeText="Estável" badgeTone="outline" />
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
              <div className="flex items-start justify-between gap-3 rounded-lg border bg-card p-4">
                <div>
                  <div className="font-medium">Topo Home</div>
                  <div className="text-xs text-muted-foreground">728x90px • Desktop</div>
                </div>
                <Badge variant="destructive" className="rounded-full">Ocupado</Badge>
              </div>

              <div className="flex items-start justify-between gap-3 rounded-lg border bg-card p-4">
                <div>
                  <div className="font-medium">Lateral Notícias</div>
                  <div className="text-xs text-muted-foreground">300x250px • Responsivo</div>
                </div>
                <Badge variant="secondary" className="rounded-full">Disponível</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Google Adsense</CardTitle>
              <p className="text-sm text-muted-foreground">Gerencie a integração automática.</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs text-muted-foreground">PUBLISHER ID</div>
              <div className="rounded-lg border bg-card px-3 py-2 font-mono text-sm">pub-849201948201923</div>
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
            <Button variant="ghost">Ver Todos</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">(Tabela de campanhas será conectada ao banco quando você enviar o HTML/estrutura final.)</div>
        </CardContent>
      </Card>
    </div>
  );
}
