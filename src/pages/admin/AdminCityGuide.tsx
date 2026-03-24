import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Plus,
    Search,
    MoreVertical,
    Pencil,
    Trash2,
    MapPin,
    Phone,
    CalendarDays,
    Star,
    Loader2,
    Image as ImageIcon,
    Check,
    X,
    ExternalLink
} from "lucide-react";
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

async function fetchCategories() {
    const { data, error } = await supabase
        .from("public_service_categories")
        .select("*")
        .order("sort_order", { ascending: true });
    if (error) throw error;
    return data || [];
}

async function fetchPublicServices({
    q = "",
    category = "all",
}) {
    let query = supabase
        .from("public_services")
        .select(`
            *,
            category:public_service_categories(*)
        `)
        .order("sort_order", { ascending: true })
        .order("title", { ascending: true });

    if (category !== "all") {
        query = query.eq("category_slug", category);
    }

    if (q.trim()) {
        const trimmed = q.trim();
        query = query.or(`title.ilike.%${trimmed}%,summary.ilike.%${trimmed}%,address.ilike.%${trimmed}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
}

export default function AdminCityGuide() {
    const queryClient = useQueryClient();
    const [q, setQ] = React.useState("");
    const [categoryFilter, setCategoryFilter] = React.useState("all");
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [editingItem, setEditingItem] = React.useState<any>(null);
    const [formData, setFormData] = React.useState({
        title: "",
        slug: "",
        summary: "",
        details: "",
        category_slug: "",
        address: "",
        phone: "",
        hours_label: "",
        status_badge: "",
        image_url: "",
        is_published: true,
        is_featured: false,
        sort_order: 0,
        rating: 5,
    });

    const categoriesQuery = useQuery({
        queryKey: ["admin_service_categories"],
        queryFn: fetchCategories,
    });

    const servicesQuery = useQuery({
        queryKey: ["admin_services", { q, categoryFilter }],
        queryFn: () => fetchPublicServices({ q, category: categoryFilter }),
    });

    const saveMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            if (editingItem) {
                const { error } = await supabase
                    .from("public_services")
                    .update(data)
                    .eq("id", editingItem.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("public_services")
                    .insert([data]);
                if (error) throw error;
            }
        },
        onSuccess: () => {
            toast.success(editingItem ? "Estabelecimento atualizado!" : "Estabelecimento criado!");
            setIsDialogOpen(false);
            setEditingItem(null);
            queryClient.invalidateQueries({ queryKey: ["admin_services"] });
            queryClient.invalidateQueries({ queryKey: ["public-services-list"] });
        },
        onError: (error) => {
            console.error(error);
            toast.error("Erro ao salvar", { description: error.message });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from("public_services").delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            toast.success("Excluído com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["admin_services"] });
        },
        onError: (error) => {
            toast.error("Erro ao excluir", { description: error.message });
        },
    });

    const handleOpenAdd = () => {
        setEditingItem(null);
        setFormData({
            title: "",
            slug: "",
            summary: "",
            details: "",
            category_slug: categoriesQuery.data?.[0]?.slug || "",
            address: "",
            phone: "",
            hours_label: "",
            status_badge: "",
            image_url: "",
            is_published: true,
            is_featured: false,
            sort_order: (servicesQuery.data?.length || 0),
            rating: 5,
        });
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (item: any) => {
        setEditingItem(item);
        setFormData({
            title: item.title || "",
            slug: item.slug || "",
            summary: item.summary || "",
            details: item.details || "",
            category_slug: item.category_slug || "",
            address: item.address || "",
            phone: item.phone || "",
            hours_label: item.hours_label || "",
            status_badge: item.status_badge || "",
            image_url: item.image_url || "",
            is_published: item.is_published ?? true,
            is_featured: item.is_featured || false,
            sort_order: item.sort_order || 0,
            rating: item.rating || 5,
        });
        setIsDialogOpen(true);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        const slug = title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-");

        setFormData((prev) => ({ ...prev, title, slug }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveMutation.mutate(formData);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Guia da Cidade</h1>
                    <p className="text-sm text-muted-foreground">Gerencie pontos turísticos e estabelecimentos locais.</p>
                </div>
                <Button className="gap-2" onClick={handleOpenAdd}>
                    <Plus className="h-4 w-4" />
                    Novo Estabelecimento
                </Button>
            </div>

            <Card className="p-4 bg-card">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nome, resumo ou endereço..."
                            className="pl-9"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                        />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue placeholder="Categoria" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas as Categorias</SelectItem>
                            {categoriesQuery.data?.map((cat: any) => (
                                <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </Card>

            <div className="border rounded-lg bg-card overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Estabelecimento</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Local / Contato</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {servicesQuery.isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                                    Carregando guia...
                                </TableCell>
                            </TableRow>
                        ) : servicesQuery.data?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Nenhum item encontrado.</TableCell>
                            </TableRow>
                        ) : (
                            servicesQuery.data?.map((item: any) => (
                                <TableRow key={item.id} className="group">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            {item.image_url ? (
                                                <img src={item.image_url} alt={item.title} className="w-12 h-12 rounded bg-muted object-cover" />
                                            ) : (
                                                <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                                                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-semibold flex items-center gap-2">
                                                    {item.title}
                                                    {item.is_featured && <Badge variant="secondary" className="text-[8px] h-3 px-1 uppercase">Destaque</Badge>}
                                                </div>
                                                <div className="text-xs text-muted-foreground truncate max-w-[300px]">{item.summary}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">
                                            {item.category?.name || item.category_slug}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-xs space-y-1">
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <MapPin className="h-3 w-3" /> {item.address || "Sem endereço"}
                                            </div>
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Phone className="h-3 w-3" /> {item.phone || "Sem telefone"}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {item.is_published ? (
                                            <Badge variant="secondary" className="gap-1 bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
                                                <Check className="h-3 w-3" /> Público
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="gap-1 text-muted-foreground">
                                                <X className="h-3 w-3" /> Rascunho
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[160px]">
                                                <DropdownMenuItem className="gap-2" onClick={() => handleOpenEdit(item)}>
                                                    <Pencil className="h-4 w-4" /> Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="gap-2 text-destructive"
                                                    onClick={() => confirm("Excluir?") && deleteMutation.mutate(item.id)}
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

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingItem ? "Editar Estabelecimento" : "Novo Estabelecimento"}</DialogTitle>
                        <DialogDescription>
                            Preencha as informações do guia da cidade.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="title">Nome / Título</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={handleTitleChange}
                                    placeholder="Ex: Restaurante do Porto"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">Identificador (URL Slug)</Label>
                                <Input
                                    id="slug"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Categoria</Label>
                                <Select
                                    value={formData.category_slug}
                                    onValueChange={(v) => setFormData({ ...formData, category_slug: v })}
                                >
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categoriesQuery.data?.map((cat: any) => (
                                            <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="summary">Breve Resumo (Listagem)</Label>
                                <Input
                                    id="summary"
                                    value={formData.summary}
                                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                    placeholder="Ex: O melhor peixe da região com vista para o porto."
                                />
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="details">Detalhes Completos</Label>
                                <Textarea
                                    id="details"
                                    value={formData.details}
                                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                    placeholder="Descreva o local em detalhes..."
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Endereço</Label>
                                <Input
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Rua, Número, Bairro"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Telefone / WhatsApp</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="(54) 99999-9999"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hours">Horário de Funcionamento</Label>
                                <Input
                                    id="hours"
                                    value={formData.hours_label}
                                    onChange={(e) => setFormData({ ...formData, hours_label: e.target.value })}
                                    placeholder="Ex: Seg-Sex: 08:00 - 18:00"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status_badge">Status (Badge)</Label>
                                <Input
                                    id="status_badge"
                                    value={formData.status_badge}
                                    onChange={(e) => setFormData({ ...formData, status_badge: e.target.value })}
                                    placeholder="Ex: Aberto Agora / Fechado"
                                />
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="image_url">Link da Imagem (URL)</Label>
                                <Input
                                    id="image_url"
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    placeholder="https://images.unsplash.com/..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 col-span-2">
                                <div className="space-y-2">
                                    <Label htmlFor="sort_order">Ordem de Exibição</Label>
                                    <Input
                                        id="sort_order"
                                        type="number"
                                        value={formData.sort_order}
                                        onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rating">Avaliação (1-5)</Label>
                                    <Input
                                        id="rating"
                                        type="number"
                                        step="0.1"
                                        min="1"
                                        max="5"
                                        value={formData.rating}
                                        onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 5 })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                                <div className="space-y-0.5">
                                    <Label>Publicar</Label>
                                    <p className="text-[10px] text-muted-foreground">Exibir no site publicamente.</p>
                                </div>
                                <Switch
                                    checked={formData.is_published}
                                    onCheckedChange={(v) => setFormData({ ...formData, is_published: v })}
                                />
                            </div>

                            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                                <div className="space-y-0.5">
                                    <Label>Destaque</Label>
                                    <p className="text-[10px] text-muted-foreground">Exibir na seção de destaques.</p>
                                </div>
                                <Switch
                                    checked={formData.is_featured}
                                    onCheckedChange={(v) => setFormData({ ...formData, is_featured: v })}
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={saveMutation.isPending}>
                                {saveMutation.isPending ? "Salvando..." : "Salvar Estabelecimento"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
