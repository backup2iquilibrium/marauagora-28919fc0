import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

type Status = "pending" | "active" | "rejected";

async function fetchMyAds(userId: string, status: Status | "all") {
  let query = supabase
    .from("classified_ads")
    .select("id,title,category_slug,status,created_at")
    .eq("owner_user_id", userId)
    .order("created_at", { ascending: false });

  if (status !== "all") query = query.eq("status", status);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export default function AdvertiserClassifiedsDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = React.useState<Status | "all">("all");

  const adsQuery = useQuery({
    enabled: Boolean(user?.id),
    queryKey: ["my_classified_ads", { tab, uid: user?.id }],
    queryFn: () => fetchMyAds(user!.id, tab),
    staleTime: 10 * 1000,
  });

  const counts = React.useMemo(() => {
    const rows = adsQuery.data ?? [];
    return {
      total: rows.length,
      active: rows.filter((r: any) => r.status === "active").length,
      pending: rows.filter((r: any) => r.status === "pending").length,
    };
  }, [adsQuery.data]);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Olá, {user?.email}</p>
          <h1 className="text-2xl font-semibold">Seus Classificados</h1>
          <p className="text-sm text-muted-foreground">Gerencie seus anúncios e acompanhe o status.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => adsQuery.refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button onClick={() => toast.info("Criar anúncio", { description: "Vamos implementar o formulário na próxima etapa." })}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Anúncio
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Anúncios Ativos</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{counts.active}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Em Análise</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{counts.pending}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{counts.total}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Lista de anúncios</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
            <TabsList className="bg-muted">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="active">Ativos</TabsTrigger>
              <TabsTrigger value="pending">Pendentes</TabsTrigger>
              <TabsTrigger value="rejected">Rejeitados</TabsTrigger>
            </TabsList>
            <TabsContent value={tab} className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(adsQuery.data ?? []).map((row: any) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.title}</TableCell>
                      <TableCell>{row.category_slug}</TableCell>
                      <TableCell>{format(new Date(row.created_at), "dd/MM/yyyy")}</TableCell>
                      <TableCell className="capitalize">{row.status}</TableCell>
                    </TableRow>
                  ))}

                  {!adsQuery.isLoading && (adsQuery.data?.length ?? 0) === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                        Nenhum anúncio.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
