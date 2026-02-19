import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
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
import { useSettings } from "@/context/SettingsContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

async function fetchStats() {
  const [news, pendingAds, activeAds, users, spaces, activeAdCampaigns] = await Promise.all([
    supabase.from("news").select("*", { count: "exact", head: true }),
    supabase.from("classified_ads").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("classified_ads").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("ad_spaces").select("*").order("sort_order", { ascending: true }),
    supabase.from("ad_campaigns").select("*").eq("status", "active"),
  ]);

  return {
    newsCount: news.count || 0,
    pendingAdsCount: pendingAds.count || 0,
    activeAdsCount: activeAds.count || 0,
    usersCount: users.count || 0,
    spaces: spaces.data || [],
    activeCampaigns: activeAdCampaigns.data || [],
  };
}

async function fetchLatestNews() {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(5);
  if (error) throw error;
  return data || [];
}

export default function AdminDashboard() {
  const { carouselSpeed, setCarouselSpeed } = useSettings();
  const [localSpeed, setLocalSpeed] = React.useState(carouselSpeed);

  const statsQuery = useQuery({
    queryKey: ["admin_stats"],
    queryFn: fetchStats,
  });

  const newsQuery = useQuery({
    queryKey: ["admin_latest_news"],
    queryFn: fetchLatestNews,
  });

  React.useEffect(() => {
    setLocalSpeed(carouselSpeed);
  }, [carouselSpeed]);

  const saveSpeed = () => {
    setCarouselSpeed(localSpeed);
    toast.success("Velocidade atualizada com sucesso!");
  };

  const todayLabel = React.useMemo(() => {
    const d = new Date();
    return format(d, "EEEE, dd 'de' MMMM", { locale: ptBR });
  }, []);

  const statCards = [
    {
      title: "Total de Notícias",
      value: statsQuery.data?.newsCount.toString() || "0",
      helper: "Artigos no portal",
      icon: <Bookmark className="h-4 w-4 text-primary" aria-hidden="true" />,
      iconBg: "bg-muted",
    },
    {
      title: "Anúncios Pendentes",
      value: statsQuery.data?.pendingAdsCount.toString() || "0",
      helper: "Aguardando revisão",
      icon: <PenSquare className="h-4 w-4 text-primary" aria-hidden="true" />,
      iconBg: statsQuery.data?.pendingAdsCount ? "bg-amber-100" : "bg-muted",
    },
    {
      title: "Classificados Ativos",
      value: statsQuery.data?.activeAdsCount.toString() || "0",
      helper: "Visíveis no mural",
      icon: <Upload className="h-4 w-4 text-primary" aria-hidden="true" />,
      iconBg: "bg-muted",
    },
    {
      title: "Usuários Registrados",
      value: statsQuery.data?.usersCount.toString() || "0",
      helper: "Base de usuários",
      icon: <UserPlus className="h-4 w-4 text-primary" aria-hidden="true" />,
      iconBg: "bg-muted",
    },
  ];

  const totalSpaces = statsQuery.data?.spaces.filter(s => s.is_active).length || 0;
  const occupiedCount = statsQuery.data?.activeCampaigns.length || 0;
  const occupancy = totalSpaces > 0 ? Math.round((occupiedCount / totalSpaces) * 100) : 0;

  const donutData = [
    { name: "Ocupado", value: occupancy },
    { name: "Livre", value: 100 - occupancy },
  ];

  const activity = [
    { title: "Dashboard atualizado com dados reais", time: "Justo agora" },
    { title: "Sistema monitorando acessos", time: "Em tempo real" },
  ];

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
          <p className="mt-1 text-muted-foreground">{todayLabel} | Marau, RS</p>
        </div>

        <Button variant="outline" className="gap-2" asChild>
          <a href="/" target="_blank" rel="noreferrer">
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Ver Site ao Vivo
          </a>
        </Button>
      </section>

      {/* Settings Card */}
      <Card className="bg-slate-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 rounded p-1">
              <PenSquare className="h-4 w-4 text-white" />
            </div>
            <CardTitle className="text-lg text-slate-900">Configurações Rápidas</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 max-w-md">
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-700 block mb-2">
                Velocidade do Carrossel (segundos)
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={localSpeed / 1000}
                  onChange={(e) => setLocalSpeed(Number(e.target.value) * 1000)}
                  className="bg-white"
                />
                <Button onClick={saveSpeed} disabled={localSpeed === carouselSpeed}>
                  Salvar
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Tempo que cada imagem fica visível na página inicial.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
              <div className="text-3xl font-semibold tracking-tight">{statsQuery.isLoading ? "..." : c.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{c.helper}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="text-base">Últimas Notícias</CardTitle>
              <Button variant="ghost" className="text-primary" asChild>
                <a href="/admin/conteudo">Ver todas</a>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newsQuery.isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">Carregando notícias...</TableCell>
                  </TableRow>
                ) : newsQuery.data?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">Nenhuma notícia encontrada.</TableCell>
                  </TableRow>
                ) : (
                  newsQuery.data?.map((n) => (
                    <TableRow key={n.id}>
                      <TableCell className="font-medium truncate max-w-[300px]">{n.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="rounded-full capitalize">
                          {n.category_slug}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {format(new Date(n.published_at), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" aria-label="Editar">
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1464 1.14645L3.71461 8.57829C3.62314 8.66976 3.55217 8.78131 3.50812 8.90295L2.5262 11.6139C2.43302 11.8711 2.50346 12.1578 2.70711 12.3614C2.91075 12.5651 3.19739 12.6355 3.45464 12.5423L6.16556 11.5604C6.28719 11.5163 6.39875 11.4454 6.49021 11.3539L13.8536 3.99052C14.0488 3.79526 14.0488 3.47868 13.8536 3.28341L11.8536 1.14645ZM4.42171 9.2854L10.5 3.20711L11.7929 4.5L5.71461 10.5783L4.42171 9.2854ZM3.75477 10.3341L4.6659 11.2452L3.25477 11.7511L3.75477 10.3341ZM12.5 3.20711L11.7929 2.5L10.5 3.79289L11.2071 4.5L12.5 3.20711Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-4">
                <CardTitle className="text-base">Espaços Publicitários</CardTitle>
                <Button variant="ghost" className="text-primary" asChild>
                  <a href="/admin/publicidade">Gerenciar</a>
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
                {statsQuery.data?.spaces.filter(s => s.is_active).slice(0, 3).map(space => {
                  const isActive = statsQuery.data?.activeCampaigns.some(c => c.space_id === space.id);
                  return (
                    <div key={space.id} className="flex items-center justify-between">
                      <span className="text-muted-foreground truncate max-w-[120px]">{space.name}</span>
                      <span className={isActive ? "text-primary font-medium" : "text-muted-foreground font-medium"}>
                        {isActive ? "Ativo" : "Livre"}
                      </span>
                    </div>
                  );
                })}
                {totalSpaces === 0 && (
                  <div className="text-center text-muted-foreground text-xs py-2">Nenhum espaço ativo.</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
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
      </div>
    </div>
  );
}
