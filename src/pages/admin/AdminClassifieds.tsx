import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle2, MoreVertical, Search, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Status = "pending" | "active" | "rejected";

const statusLabels: Record<Status, string> = {
  pending: "Pendente",
  active: "Ativo",
  rejected: "Rejeitado",
};

function StatusPill({ status }: { status: Status }) {
  const cls =
    status === "active"
      ? "bg-secondary/15 text-secondary border-secondary/30"
      : status === "pending"
        ? "bg-muted text-muted-foreground border-border"
        : "bg-destructive/10 text-destructive border-destructive/20";
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", cls)}>{statusLabels[status]}</span>;
}

async function fetchCategories() {
  const { data, error } = await supabase
    .from("classified_categories")
    .select("slug,name")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

async function fetchAds(params: {
  q: string;
  status: Status | "all";
  category: string | "all";
  day: Date | undefined;
  page: number;
  pageSize: number;
}) {
  let query = supabase
    .from("classified_ads")
    .select("id,title,category_slug,advertiser_name,advertiser_email,status,created_at", { count: "exact" })
    .order("created_at", { ascending: false });

  if (params.status !== "all") query = query.eq("status", params.status);
  if (params.category !== "all") query = query.eq("category_slug", params.category);
  if (params.q.trim()) query = query.ilike("title", `%${params.q.trim()}%`);
  if (params.day) {
    const start = new Date(params.day);
    start.setHours(0, 0, 0, 0);
    const end = new Date(params.day);
    end.setHours(23, 59, 59, 999);
    query = query.gte("created_at", start.toISOString()).lte("created_at", end.toISOString());
  }

  const from = params.page * params.pageSize;
  const to = from + params.pageSize - 1;
  const { data, error, count } = await query.range(from, to);
  if (error) throw error;
  return { rows: data ?? [], count: count ?? 0 };
}

export default function AdminClassifieds() {
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<Status | "all">("all");
  const [category, setCategory] = React.useState<string | "all">("all");
  const [day, setDay] = React.useState<Date>();
  const [page, setPage] = React.useState(0);
  const pageSize = 10;

  const categoriesQuery = useQuery({ queryKey: ["classified_categories"], queryFn: fetchCategories, staleTime: 5 * 60 * 1000 });

  const adsQuery = useQuery({
    queryKey: ["classified_ads", { q, status, category, day: day?.toISOString().slice(0, 10), page, pageSize }],
    queryFn: () => fetchAds({ q, status, category, day, page, pageSize }),
    staleTime: 10 * 1000,
  });

  const catMap = React.useMemo(() => {
    const map = new Map<string, string>();
    (categoriesQuery.data ?? []).forEach((c) => map.set(c.slug, c.name));
    return map;
  }, [categoriesQuery.data]);

  const total = adsQuery.data?.count ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const updateStatus = async (id: string, next: Status) => {
    const payload: any = { status: next };
    if (next === "active") payload.published_at = new Date().toISOString();

    const { error } = await supabase.from("classified_ads").update(payload).eq("id", id);
    if (error) {
      toast.error("Não foi possível atualizar", { description: "Tente novamente." });
      return;
    }
    toast.success("Atualizado");
    adsQuery.refetch();
  };

  React.useEffect(() => {
    setPage(0);
  }, [q, status, category, day]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Gerenciamento de Classificados</h1>
          <p className="text-sm text-muted-foreground">Revise, aprove e gerencie os anúncios do portal.</p>
        </div>
        <Button>Novo Anúncio</Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar anúncio…" className="pl-9" />
            </div>

            <Select value={status} onValueChange={(v) => setStatus(v as any)}>
              <SelectTrigger className="bg-card">
                <SelectValue placeholder="Todos os Status" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-popover">
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="rejected">Rejeitado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={category} onValueChange={(v) => setCategory(v as any)}>
              <SelectTrigger className="bg-card">
                <SelectValue placeholder="Todas Categorias" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-popover">
                <SelectItem value="all">Todas Categorias</SelectItem>
                {(categoriesQuery.data ?? []).map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("justify-start text-left font-normal", !day && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {day ? format(day, "dd/MM/yyyy") : "Data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50" align="start">
                <Calendar
                  mode="single"
                  selected={day}
                  onSelect={setDay}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <p className="text-sm text-muted-foreground">
              {adsQuery.isLoading ? "Carregando…" : `Mostrando ${Math.min(total, page * pageSize + 1)}-${Math.min(total, (page + 1) * pageSize)} de ${total} resultados`}
            </p>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Anúncio</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Anunciante</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(adsQuery.data?.rows ?? []).map((row: any) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <div className="font-medium">{row.title}</div>
                    <div className="text-xs text-muted-foreground">ID: #{String(row.id).slice(0, 8)}</div>
                  </TableCell>
                  <TableCell>{catMap.get(row.category_slug) ?? row.category_slug}</TableCell>
                  <TableCell>
                    <div className="font-medium">{row.advertiser_name}</div>
                    <div className="text-xs text-muted-foreground">{row.advertiser_email}</div>
                  </TableCell>
                  <TableCell>{format(new Date(row.created_at), "dd/MM/yyyy")}</TableCell>
                  <TableCell>
                    <StatusPill status={row.status as Status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-2">
                      {row.status === "pending" && (
                        <>
                          <Button size="icon" variant="outline" aria-label="Aprovar" onClick={() => updateStatus(row.id, "active")}>
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="outline" aria-label="Rejeitar" onClick={() => updateStatus(row.id, "rejected")}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button size="icon" variant="ghost" aria-label="Mais ações">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {!adsQuery.isLoading && (adsQuery.data?.rows?.length ?? 0) === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    Nenhum anúncio encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between px-6 py-4 border-t">
            <Button variant="outline" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
              Anterior
            </Button>
            <p className="text-sm text-muted-foreground">
              Página {page + 1} de {pageCount}
            </p>
            <Button
              variant="outline"
              disabled={page + 1 >= pageCount}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            >
              Próxima
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
