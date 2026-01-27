import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Bell,
  Bookmark,
  ExternalLink,
  MessageSquare,
  PenSquare,
  Upload,
  UserPlus,
} from "lucide-react";
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type StatCard = {
  title: string;
  value: string;
  helper: string;
  icon: React.ReactNode;
  iconBg: string;
};

const statCards: StatCard[] = [
  {
    title: "Visitas Hoje",
    value: "12.4k",
    helper: "+15% vs ontem",
    icon: <Bookmark className="h-4 w-4 text-primary" aria-hidden="true" />,
    iconBg: "bg-muted",
  },
  {
    title: "Artigos Pendentes",
    value: "4",
    helper: "Requer atenção",
    icon: <PenSquare className="h-4 w-4 text-primary" aria-hidden="true" />,
    iconBg: "bg-muted",
  },
  {
    title: "Anúncios Ativos",
    value: "18",
    helper: "-1 vs semana passada",
    icon: <Upload className="h-4 w-4 text-primary" aria-hidden="true" />,
    iconBg: "bg-muted",
  },
  {
    title: "Usuários Ativos",
    value: "3.2k",
    helper: "+8% novos registros",
    icon: <UserPlus className="h-4 w-4 text-primary" aria-hidden="true" />,
    iconBg: "bg-muted",
  },
];

const latestNews = [
  { title: "Festa do Salaminho…", author: "Ana Silva", category: "Cultura", categoryTone: "secondary" as const, status: "Publicado", statusTone: "secondary" as const },
  { title: "Prefeitura anuncia …", author: "Carlos Souza", category: "Política", categoryTone: "outline" as const, status: "Pendente", statusTone: "outline" as const },
  { title: "Marau Futsal vence…", author: "Roberto Lima", category: "Esporte", categoryTone: "outline" as const, status: "Publicado", statusTone: "secondary" as const },
  { title: "Previsão do tempo …", author: "Ana Silva", category: "Geral", categoryTone: "outline" as const, status: "Rascunho", statusTone: "outline" as const },
];

const occupancy = 80;
const donutData = [
  { name: "Ocupado", value: occupancy },
  { name: "Livre", value: 100 - occupancy },
];

const activity = [
  { title: "João Silva editou \"Ata da Câmara\"", time: "Há 10 minutos" },
  { title: "Sistema publicou \"Notícias da Manhã\"", time: "Há 45 minutos" },
  { title: "Anúncio \"Mercado X\" expira em breve", time: "Há 2 horas" },
];

export default function AdminDashboard() {
  const todayLabel = React.useMemo(() => {
    const d = new Date();
    // Quinta-feira, 24 de Outubro
    return format(d, "EEEE, dd 'de' MMMM", { locale: ptBR });
  }, []);

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-xl">
          <Input placeholder="Buscar no painel…" className="pl-10 bg-card" />
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <span className="sr-only">Buscar</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M21 21l-4.3-4.3m1.8-5.2a7 7 0 11-14 0 7 7 0 0114 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Notificações">
            <Bell className="h-5 w-5" aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Mensagens">
            <MessageSquare className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </header>

      <section className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Bom dia, Admin</h1>
          <p className="mt-1 text-muted-foreground">{todayLabel} | ☀️ 22°C em Marau, RS</p>
        </div>

        <Button variant="outline" className="gap-2" asChild>
          <a href="/" target="_blank" rel="noreferrer">
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Ver Site ao Vivo
          </a>
        </Button>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {statCards.map((c) => (
          <Card key={c.title}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-sm text-muted-foreground">{c.title}</CardTitle>
                <div className={`h-8 w-8 rounded-lg ${c.iconBg} grid place-items-center`}>{c.icon}</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold tracking-tight">{c.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{c.helper}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="flex flex-wrap items-center gap-3">
        <Button className="gap-2">
          <PenSquare className="h-4 w-4" aria-hidden="true" />
          Escrever Notícia
        </Button>
        <Button variant="outline" className="gap-2">
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          Novo Usuário
        </Button>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" aria-hidden="true" />
          Upload Banner
        </Button>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="text-base">Últimas Notícias</CardTitle>
              <Button variant="ghost" className="text-primary">
                Ver todas
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestNews.map((n) => (
                  <TableRow key={n.title}>
                    <TableCell className="font-medium">{n.title}</TableCell>
                    <TableCell>{n.author}</TableCell>
                    <TableCell>
                      <Badge variant={n.categoryTone} className="rounded-full">
                        {n.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={n.statusTone} className="rounded-full">
                        {n.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" aria-label="Mais ações">
                        <span className="text-muted-foreground">⋮</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-4">
                <CardTitle className="text-base">Espaços Publicitários</CardTitle>
                <Button variant="ghost" className="text-primary">
                  Gerenciar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                      innerRadius={48}
                      outerRadius={64}
                      paddingAngle={2}
                      stroke="hsl(var(--card))"
                    >
                      <Cell fill="hsl(var(--primary))" />
                      <Cell fill="hsl(var(--muted))" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="-mt-28 flex flex-col items-center">
                <div className="text-3xl font-semibold">{occupancy}%</div>
                <div className="text-xs text-muted-foreground">Ocupado</div>
              </div>

              <div className="mt-6 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Banner Topo</span>
                  <span className="text-primary">Ativo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Lateral Dir.</span>
                  <span className="text-primary">Ativo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Rodapé</span>
                  <span className="text-destructive">Expirado</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activity.map((a) => (
                <div key={a.title} className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-muted grid place-items-center">
                    <span className="text-xs font-semibold text-muted-foreground">•</span>
                  </div>
                  <div>
                    <div className="text-sm">{a.title}</div>
                    <div className="text-xs text-muted-foreground">{a.time}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
