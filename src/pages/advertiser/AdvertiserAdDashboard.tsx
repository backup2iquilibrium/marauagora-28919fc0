import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type CampaignStatus = "draft" | "active" | "paused" | "ended";

function formatMoneyBRL(cents: number | null) {
  if (cents == null) return "—";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

function statusLabel(status: CampaignStatus) {
  switch (status) {
    case "draft":
      return "Rascunho";
    case "active":
      return "Ativa";
    case "paused":
      return "Pausada";
    case "ended":
      return "Encerrada";
    default:
      return status;
  }
}

function statusVariant(status: CampaignStatus): React.ComponentProps<typeof Badge>["variant"] {
  switch (status) {
    case "active":
      return "default";
    case "paused":
      return "secondary";
    case "ended":
      return "outline";
    case "draft":
    default:
      return "secondary";
  }
}

async function fetchSpaces() {
  const { data, error } = await supabase
    .from("ad_spaces")
    .select("id,name,slug,size_label,device_label,monthly_price_cents,is_active,sort_order")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

async function fetchMyCampaigns(userId: string) {
  const { data, error } = await supabase
    .from("ad_campaigns")
    .select(
      "id,title,status,starts_at,ends_at,impressions,clicks,created_at,space_id,ad_spaces(name,slug,size_label,device_label)",
    )
    .eq("owner_user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export default function AdvertiserAdDashboard() {
  const { user } = useAuth();

  const spacesQuery = useQuery({
    queryKey: ["ad_spaces"],
    queryFn: fetchSpaces,
    staleTime: 30 * 1000,
  });

  const campaignsQuery = useQuery({
    enabled: Boolean(user?.id),
    queryKey: ["my_ad_campaigns", { uid: user?.id }],
    queryFn: () => fetchMyCampaigns(user!.id),
    staleTime: 10 * 1000,
  });

  const counts = React.useMemo(() => {
    const rows = (campaignsQuery.data ?? []) as any[];
    return {
      total: rows.length,
      active: rows.filter((r) => r.status === "active").length,
      draft: rows.filter((r) => r.status === "draft").length,
    };
  }, [campaignsQuery.data]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Olá, {user?.email}</p>
          <h1 className="text-2xl font-semibold">Publicidade</h1>
          <p className="text-sm text-muted-foreground">Acompanhe seus espaços e campanhas.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              spacesQuery.refetch();
              campaignsQuery.refetch();
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button
            onClick={() =>
              toast.info("Nova campanha", {
                description: "Próximo passo: formulário para criar campanha vinculado a um espaço.",
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Campanha
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Campanhas Ativas</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{counts.active}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Rascunhos</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{counts.draft}</CardContent>
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
          <CardTitle className="text-base">Espaços disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(spacesQuery.data ?? []).map((space: any) => (
              <div key={space.id} className="rounded-lg border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{space.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {space.device_label} • {space.size_label}
                    </div>
                  </div>
                  <Badge variant={space.is_active ? "secondary" : "outline"}>
                    {space.is_active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  Preço mensal: <span className="text-foreground">{formatMoneyBRL(space.monthly_price_cents)}</span>
                </div>
              </div>
            ))}

            {!spacesQuery.isLoading && (spacesQuery.data?.length ?? 0) === 0 && (
              <div className="text-sm text-muted-foreground">Nenhum espaço cadastrado.</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Suas campanhas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campanha</TableHead>
                <TableHead>Espaço</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Métricas</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(campaignsQuery.data ?? []).map((row: any) => {
                const s = row.ad_spaces;
                const period = row.starts_at || row.ends_at
                  ? `${row.starts_at ? format(new Date(row.starts_at), "dd/MM/yyyy") : "—"} – ${row.ends_at ? format(new Date(row.ends_at), "dd/MM/yyyy") : "—"}`
                  : "—";

                return (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.title}</TableCell>
                    <TableCell>
                      {s ? (
                        <div className="leading-tight">
                          <div className="text-sm">{s.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {s.device_label} • {s.size_label}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>{period}</TableCell>
                    <TableCell>
                      <div className="text-sm">{Number(row.impressions ?? 0).toLocaleString("pt-BR")} impressões</div>
                      <div className="text-xs text-muted-foreground">{Number(row.clicks ?? 0).toLocaleString("pt-BR")} cliques</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(row.status)}>{statusLabel(row.status)}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}

              {!campaignsQuery.isLoading && (campaignsQuery.data?.length ?? 0) === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    Nenhuma campanha encontrada para sua conta.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
