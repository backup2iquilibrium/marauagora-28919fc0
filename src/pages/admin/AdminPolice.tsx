import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Plus, Pencil, Trash2, Loader2, GripVertical,
    Shield, Phone, Building, Info, MapPin, Search,
    MoreVertical, Save
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select";

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface EmergencyNumber {
    id: string;
    label: string;
    description?: string;
    number: string;
    category: string;
    city: string;
    icon: string;
    sort_order: number;
    is_published: boolean;
}

const CATEGORIES = [
    "Emergência",
    "Segurança",
    "Saúde",
    "Administrativo",
    "Serviços Públicos",
    "Transporte",
    "Outros"
];

// O hook mapIcon para exibir de forma simpática no Admin
function mapIconName(name: string) {
    switch (name?.toLowerCase()) {
        case "shield": return <Shield className="h-4 w-4" />;
        case "siren": return <Shield className="h-4 w-4 text-destructive" fill="currentColor" />; // Fallback since Siren might not exist everywhere
        case "heart": return <Building className="h-4 w-4 text-red-500" />;
        case "landmark": return <Building className="h-4 w-4" />;
        default: return <Phone className="h-4 w-4" />;
    }
}

const EMPTY_PHONE: Partial<EmergencyNumber> = {
    label: "", number: "", description: "", category: "Emergência",
    city: "Marau", icon: "phone", sort_order: 0, is_published: true
};

export default function AdminPolice() {
    const qc = useQueryClient();
    const [searchQ, setSearchQ] = React.useState("");
    const [dialog, setDialog] = React.useState(false);
    const [editing, setEditing] = React.useState<Partial<EmergencyNumber>>(EMPTY_PHONE);
    const [categoryFilter, setCategoryFilter] = React.useState("all");

    // ─── Queries ───────────────────────────────────────────────────────────────

    const phonesQuery = useQuery({
        queryKey: ["admin_emergency_numbers", searchQ, categoryFilter],
        queryFn: async () => {
            let q = supabase
                .from("emergency_numbers")
                .select("*")
                .order("category", { ascending: true })
                .order("sort_order", { ascending: true });

            if (categoryFilter !== "all") {
                q = q.eq("category", categoryFilter);
            }
            if (searchQ.trim()) {
                const like = `%${searchQ.trim()}%`;
                q = q.or(`label.ilike.${like},number.ilike.${like},description.ilike.${like}`);
            }

            const { data, error } = await q;
            if (error) throw error;
            return (data || []) as EmergencyNumber[];
        },
    });

    // ─── Mutations ──────────────────────────────────────────────────────────────

    const saveMutation = useMutation({
        mutationFn: async (record: Partial<EmergencyNumber>) => {
            if (record.id) {
                const { id, ...rest } = record;
                const { error } = await supabase.from("emergency_numbers").update(rest).eq("id", id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from("emergency_numbers").insert([record]);
                if (error) throw error;
            }
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["admin_emergency_numbers"] });
            toast.success("Salvo com sucesso!");
            setDialog(false);
        },
        onError: (e: any) => toast.error("Erro ao salvar", { description: e.message }),
    });

    const removeMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from("emergency_numbers").delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["admin_emergency_numbers"] });
            toast.success("Excluído com sucesso!");
        },
        onError: (e: any) => toast.error("Erro ao excluir", { description: e.message }),
    });

    const togglePublishMutation = useMutation({
        mutationFn: async ({ id, value }: { id: string; value: boolean }) => {
            const { error } = await supabase.from("emergency_numbers").update({ is_published: value }).eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_emergency_numbers"] }),
    });

    // ─── Handlers ───────────────────────────────────────────────────────────────

    const openAdd = () => { setEditing(EMPTY_PHONE); setDialog(true); };
    const openEdit = (p: EmergencyNumber) => { setEditing({ ...p }); setDialog(true); };

    const phones = phonesQuery.data || [];

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Polícia &amp; Telefones Úteis</h1>
                    <p className="text-sm text-muted-foreground">
                        Gerencie os contatos de emergência, segurança pública e serviços que aparecem na aba Polícia / Utilidade Pública.
                    </p>
                </div>
                <Button className="gap-2" onClick={openAdd}>
                    <Plus className="h-4 w-4" />
                    Novo Telefone
                </Button>
            </div>

            <Card className="p-4 bg-card">
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nome ou número..."
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
                            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </Card>

            <div className="border rounded-lg bg-card overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Serviço / Órgão</TableHead>
                            <TableHead>Número</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Ordem</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {phonesQuery.isLoading ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></TableCell></TableRow>
                        ) : phones.length === 0 ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Nenhum telefone encontrado.</TableCell></TableRow>
                        ) : (
                            phones.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell>
                                        <div className="font-semibold flex items-center gap-2">
                                            {mapIconName(p.icon)} {p.label}
                                        </div>
                                        {p.description && <div className="text-xs text-muted-foreground mt-1 line-clamp-1 max-w-sm">{p.description}</div>}
                                    </TableCell>
                                    <TableCell className="font-mono">{p.number}</TableCell>
                                    <TableCell><Badge variant="outline">{p.category}</Badge></TableCell>
                                    <TableCell>{p.sort_order}</TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={p.is_published}
                                            onCheckedChange={(v) => togglePublishMutation.mutate({ id: p.id, value: v })}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="gap-2" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" />Editar</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="gap-2 text-destructive" onClick={() => confirm("Excluir telefone?") && removeMutation.mutate(p.id)}><Trash2 className="h-4 w-4" />Excluir</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={dialog} onOpenChange={setDialog}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{editing.id ? "Editar Telefone" : "Novo Telefone"}</DialogTitle>
                        <DialogDescription>Cadastre um número de utilidade pública ou emergência.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nome / Órgão</Label>
                                <Input value={editing.label || ""} onChange={(e) => setEditing({ ...editing, label: e.target.value })} placeholder="Ex: Polícia Militar" />
                            </div>
                            <div className="space-y-2">
                                <Label>Número</Label>
                                <Input value={editing.number || ""} onChange={(e) => setEditing({ ...editing, number: e.target.value })} placeholder="Ex: 190 ou (54) 3342..." />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Descrição Curta (Opcional)</Label>
                            <Input value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="Ex: Patrulha Maria da Penha" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Categoria</Label>
                                <Select value={editing.category || "Emergência"} onValueChange={(v) => setEditing({ ...editing, category: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Ícone (Lucide)</Label>
                                <Input value={editing.icon || ""} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} placeholder="shield, siren, heart, phone..." />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Cidade</Label>
                                <Input value={editing.city || "Marau"} onChange={(e) => setEditing({ ...editing, city: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Ordem de Exibição</Label>
                                <Input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                            <Switch id="is_published" checked={editing.is_published} onCheckedChange={(v) => setEditing({ ...editing, is_published: v })} />
                            <Label htmlFor="is_published">Publicado visivelmente no site</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialog(false)}>Cancelar</Button>
                        <Button onClick={() => saveMutation.mutate(editing as EmergencyNumber)} disabled={saveMutation.isPending}>
                            {saveMutation.isPending && <Loader2 className="animate-spin h-4 w-4 mr-2" />}Salvar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
