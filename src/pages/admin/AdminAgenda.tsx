import * as React from "react";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import {
    Plus,
    Search,
    MoreVertical,
    Pencil,
    Trash2,
    CalendarDays,
    MapPin,
    Loader2,
    Star,
    StarOff,
    Filter,
    Calendar as CalendarIcon,
    Clock,
    X,
} from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CATEGORY_OPTIONS = [
    "Música e Shows",
    "Esportes",
    "Cultura e Arte",
    "Religioso",
    "Educação",
    "Gastronomia",
    "Negócios / Feiras",
    "Saúde e Bem-estar",
    "Recreação / Lazer",
    "Outros",
] as const;

interface EventFormData {
    title: string;
    description: string;
    starts_at: string;
    ends_at: string;
    venue: string;
    city: string;
    category: string;
    is_free: boolean;
    is_featured_week: boolean;
    image_url: string;
    organizer: string;
    ticket_url: string;
    price_info: string;
}

const EMPTY_FORM: EventFormData = {
    title: "",
    description: "",
    starts_at: "",
    ends_at: "",
    venue: "",
    city: "Marau",
    category: "Outros",
    is_free: true,
    is_featured_week: false,
    image_url: "",
    organizer: "",
    ticket_url: "",
    price_info: "",
};

function formatDateTime(iso?: string | null) {
    if (!iso) return "—";
    const d = parseISO(iso);
    if (!isValid(d)) return "—";
    return format(d, "dd/MM/yyyy HH:mm", { locale: ptBR });
}

function toLocalDateTimeInput(iso?: string | null) {
    if (!iso) return "";
    try {
        const d = parseISO(iso);
        if (!isValid(d)) return "";
        // format for <input type="datetime-local">
        return format(d, "yyyy-MM-dd'T'HH:mm");
    } catch {
        return "";
    }
}

function fromLocalDateTimeInput(value: string): string {
    if (!value) return "";
    // Browser gives us "2026-03-26T10:00" local → convert to ISO
    return new Date(value).toISOString();
}

export default function AdminAgenda() {
    const queryClient = useQueryClient();
    const [searchQ, setSearchQ] = React.useState("");
    const [categoryFilter, setCategoryFilter] = React.useState("all");
    const [onlyFeatured, setOnlyFeatured] = React.useState(false);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [editingEvent, setEditingEvent] = React.useState<any>(null);
    const [formData, setFormData] = React.useState<EventFormData>(EMPTY_FORM);

    // ─── Queries ────────────────────────────────────────────────────────────────

    const statsQuery = useQuery({
        queryKey: ["admin_agenda_stats"],
        queryFn: async () => {
            const now = new Date().toISOString();
            const [total, upcoming, featured] = await Promise.all([
                supabase.from("events").select("id", { count: "exact", head: true }),
                supabase.from("events").select("id", { count: "exact", head: true }).gte("starts_at", now),
                supabase.from("events").select("id", { count: "exact", head: true }).eq("is_featured_week", true),
            ]);
            return {
                total: total.count ?? 0,
                upcoming: upcoming.count ?? 0,
                featured: featured.count ?? 0,
            };
        },
    });

    const eventsQuery = useQuery({
        queryKey: ["admin_events", { searchQ, categoryFilter, onlyFeatured }],
        queryFn: async () => {
            let q = supabase
                .from("events")
                .select("*")
                .order("starts_at", { ascending: false });

            if (categoryFilter !== "all") {
                q = q.eq("category", categoryFilter);
            }
            if (onlyFeatured) {
                q = q.eq("is_featured_week", true);
            }
            if (searchQ.trim()) {
                const like = `%${searchQ.trim()}%`;
                q = (q as any).or(`title.ilike.${like},venue.ilike.${like},description.ilike.${like}`);
            }

            const { data, error } = await q;
            if (error) throw error;
            return data || [];
        },
    });

    // ─── Mutations ───────────────────────────────────────────────────────────────

    const saveMutation = useMutation({
        mutationFn: async (data: EventFormData) => {
            const payload = {
                ...data,
                starts_at: fromLocalDateTimeInput(data.starts_at) || data.starts_at,
                ends_at: data.ends_at ? fromLocalDateTimeInput(data.ends_at) || data.ends_at : null,
            };

            if (editingEvent) {
                const { error } = await supabase.from("events").update(payload).eq("id", editingEvent.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from("events").insert([payload]);
                if (error) throw error;
            }
        },
        onSuccess: () => {
            toast.success(editingEvent ? "Evento atualizado!" : "Evento criado!");
            setIsDialogOpen(false);
            setEditingEvent(null);
            queryClient.invalidateQueries({ queryKey: ["admin_events"] });
            queryClient.invalidateQueries({ queryKey: ["admin_agenda_stats"] });
        },
        onError: (err: any) => {
            toast.error("Erro ao salvar evento", { description: err.message });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from("events").delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            toast.success("Evento excluído!");
            queryClient.invalidateQueries({ queryKey: ["admin_events"] });
            queryClient.invalidateQueries({ queryKey: ["admin_agenda_stats"] });
        },
        onError: (err: any) => {
            toast.error("Erro ao excluir evento", { description: err.message });
        },
    });

    const toggleFeaturedMutation = useMutation({
        mutationFn: async ({ id, value }: { id: string; value: boolean }) => {
            const { error } = await supabase.from("events").update({ is_featured_week: value }).eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin_events"] });
            queryClient.invalidateQueries({ queryKey: ["admin_agenda_stats"] });
        },
    });

    // ─── Handlers ────────────────────────────────────────────────────────────────

    const handleOpenAdd = () => {
        setEditingEvent(null);
        setFormData(EMPTY_FORM);
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (event: any) => {
        setEditingEvent(event);
        setFormData({
            title: event.title || "",
            description: event.description || "",
            starts_at: toLocalDateTimeInput(event.starts_at),
            ends_at: toLocalDateTimeInput(event.ends_at),
            venue: event.venue || "",
            city: event.city || "Marau",
            category: event.category || "Outros",
            is_free: event.is_free ?? true,
            is_featured_week: event.is_featured_week ?? false,
            image_url: event.image_url || "",
            organizer: event.organizer || "",
            ticket_url: event.ticket_url || "",
            price_info: event.price_info || "",
        });
        setIsDialogOpen(true);
    };

    const patch = (field: keyof EventFormData, value: any) =>
        setFormData((prev) => ({ ...prev, [field]: value }));

    // ─── Render ──────────────────────────────────────────────────────────────────

    const events = eventsQuery.data || [];

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Agenda de Eventos</h1>
                    <p className="text-sm text-muted-foreground">
                        Gerencie os eventos e atividades da cidade.
                    </p>
                </div>
                <Button className="gap-2" onClick={handleOpenAdd}>
                    <Plus className="h-4 w-4" />
                    Novo Evento
                </Button>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total de Eventos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{statsQuery.data?.total ?? "—"}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Próximos Eventos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-primary">{statsQuery.data?.upcoming ?? "—"}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Destaques da Semana</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-yellow-500">{statsQuery.data?.featured ?? "—"}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="p-4 bg-card">
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por título, local ou descrição..."
                            className="pl-9"
                            value={searchQ}
                            onChange={(e) => setSearchQ(e.target.value)}
                        />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-full md:w-56">
                            <SelectValue placeholder="Categoria" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas as categorias</SelectItem>
                            {CATEGORY_OPTIONS.map((c) => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <label className="flex items-center gap-2 text-sm whitespace-nowrap cursor-pointer px-3">
                        <Checkbox
                            checked={onlyFeatured}
                            onCheckedChange={(v) => setOnlyFeatured(Boolean(v))}
                        />
                        Apenas destaques
                    </label>
                </div>
            </Card>

            {/* Table */}
            <div className="border rounded-lg bg-card overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Evento</TableHead>
                            <TableHead>Data / Horário</TableHead>
                            <TableHead>Local</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Entrada</TableHead>
                            <TableHead>Destaque</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {eventsQuery.isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                                    Carregando eventos...
                                </TableCell>
                            </TableRow>
                        ) : events.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                    Nenhum evento encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            events.map((ev: any) => (
                                <TableRow key={ev.id} className="group">
                                    <TableCell>
                                        <div className="font-semibold line-clamp-1">{ev.title}</div>
                                        {ev.organizer && (
                                            <div className="text-xs text-muted-foreground">{ev.organizer}</div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        <div className="flex items-center gap-1">
                                            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                            {formatDateTime(ev.starts_at)}
                                        </div>
                                        {ev.ends_at && (
                                            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                <Clock className="h-3 w-3" />
                                                até {formatDateTime(ev.ends_at)}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {ev.venue ? (
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                                <span className="line-clamp-1">{ev.venue}</span>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-xs">
                                            {ev.category || "—"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={ev.is_free ? "secondary" : "outline"}
                                            className="text-xs"
                                        >
                                            {ev.is_free ? "Gratuito" : "Pago"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <button
                                            title={ev.is_featured_week ? "Remover destaque" : "Marcar como destaque"}
                                            onClick={() =>
                                                toggleFeaturedMutation.mutate({
                                                    id: ev.id,
                                                    value: !ev.is_featured_week,
                                                })
                                            }
                                        >
                                            {ev.is_featured_week ? (
                                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                            ) : (
                                                <StarOff className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </button>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[160px]">
                                                <DropdownMenuItem className="gap-2" onClick={() => handleOpenEdit(ev)}>
                                                    <Pencil className="h-4 w-4" /> Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="gap-2 text-destructive"
                                                    onClick={() =>
                                                        confirm(`Excluir "${ev.title}"?`) &&
                                                        deleteMutation.mutate(ev.id)
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" /> Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingEvent ? "Editar Evento" : "Novo Evento"}</DialogTitle>
                        <DialogDescription>
                            Preencha as informações do evento da agenda.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            saveMutation.mutate(formData);
                        }}
                        className="space-y-6 py-2"
                    >
                        <Tabs defaultValue="geral">
                            <TabsList className="mb-4">
                                <TabsTrigger value="geral">Informações Gerais</TabsTrigger>
                                <TabsTrigger value="detalhes">Detalhes e Ingressos</TabsTrigger>
                                <TabsTrigger value="opcoes">Opções</TabsTrigger>
                            </TabsList>

                            {/* ── ABA: Informações Gerais ── */}
                            <TabsContent value="geral" className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="ev_title">Título do Evento *</Label>
                                    <Input
                                        id="ev_title"
                                        value={formData.title}
                                        onChange={(e) => patch("title", e.target.value)}
                                        placeholder="Ex: Festival de Música de Marau"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ev_description">Descrição</Label>
                                    <Textarea
                                        id="ev_description"
                                        value={formData.description}
                                        onChange={(e) => patch("description", e.target.value)}
                                        placeholder="Descreva o evento..."
                                        rows={4}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="ev_starts">Data e Hora de Início *</Label>
                                        <Input
                                            id="ev_starts"
                                            type="datetime-local"
                                            value={formData.starts_at}
                                            onChange={(e) => patch("starts_at", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ev_ends">Data e Hora de Encerramento</Label>
                                        <Input
                                            id="ev_ends"
                                            type="datetime-local"
                                            value={formData.ends_at}
                                            onChange={(e) => patch("ends_at", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="ev_venue">Local / Venue</Label>
                                        <Input
                                            id="ev_venue"
                                            value={formData.venue}
                                            onChange={(e) => patch("venue", e.target.value)}
                                            placeholder="Ex: Praça Central, Marau"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ev_city">Cidade</Label>
                                        <Input
                                            id="ev_city"
                                            value={formData.city}
                                            onChange={(e) => patch("city", e.target.value)}
                                            placeholder="Marau"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ev_category">Categoria</Label>
                                    <Select value={formData.category} onValueChange={(v) => patch("category", v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORY_OPTIONS.map((c) => (
                                                <SelectItem key={c} value={c}>{c}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </TabsContent>

                            {/* ── ABA: Detalhes e Ingressos ── */}
                            <TabsContent value="detalhes" className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="ev_organizer">Organizador / Responsável</Label>
                                    <Input
                                        id="ev_organizer"
                                        value={formData.organizer}
                                        onChange={(e) => patch("organizer", e.target.value)}
                                        placeholder="Ex: Prefeitura Municipal de Marau"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ev_image">URL da Imagem do Evento</Label>
                                    <Input
                                        id="ev_image"
                                        value={formData.image_url}
                                        onChange={(e) => patch("image_url", e.target.value)}
                                        placeholder="https://..."
                                    />
                                    {formData.image_url && (
                                        <img
                                            src={formData.image_url}
                                            alt="Preview"
                                            className="mt-2 rounded-lg h-32 w-full object-cover border"
                                            onError={(e) => (e.currentTarget.style.display = "none")}
                                        />
                                    )}
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <Switch
                                        id="ev_is_free"
                                        checked={formData.is_free}
                                        onCheckedChange={(v) => patch("is_free", v)}
                                    />
                                    <Label htmlFor="ev_is_free">Entrada Gratuita</Label>
                                </div>

                                {!formData.is_free && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="ev_price_info">Informações de Preço</Label>
                                            <Input
                                                id="ev_price_info"
                                                value={formData.price_info}
                                                onChange={(e) => patch("price_info", e.target.value)}
                                                placeholder="Ex: R$ 30,00 – R$ 80,00"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="ev_ticket_url">Link para Compra de Ingressos</Label>
                                            <Input
                                                id="ev_ticket_url"
                                                value={formData.ticket_url}
                                                onChange={(e) => patch("ticket_url", e.target.value)}
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </>
                                )}
                            </TabsContent>

                            {/* ── ABA: Opções ── */}
                            <TabsContent value="opcoes" className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Switch
                                        id="ev_featured"
                                        checked={formData.is_featured_week}
                                        onCheckedChange={(v) => patch("is_featured_week", v)}
                                    />
                                    <Label htmlFor="ev_featured" className="flex flex-col">
                                        <span>Destaque da Semana</span>
                                        <span className="text-xs text-muted-foreground font-normal">
                                            Exibe o evento em destaque na página pública da Agenda.
                                        </span>
                                    </Label>
                                </div>
                            </TabsContent>
                        </Tabs>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={saveMutation.isPending}>
                                {saveMutation.isPending && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
                                {editingEvent ? "Salvar Alterações" : "Criar Evento"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
