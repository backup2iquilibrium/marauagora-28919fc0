import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Plus,
    Copy,
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
    ExternalLink,
    Settings,
    LayoutGrid,
    Link,
    Upload as UploadIcon
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

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
    const [activeTab, setActiveTab] = React.useState("services");
    const [q, setQ] = React.useState("");
    const [catQ, setCatQ] = React.useState("");
    const [categoryFilter, setCategoryFilter] = React.useState("all");

    const DEFAULT_CATEGORIES = [
        { name: "Gastronomia", slug: "gastronomia", icon: "storefront", sort_order: 10 },
        { name: "Hospedagem", slug: "hospedagem", icon: "hotel", sort_order: 20 },
        { name: "Saúde", slug: "saude", icon: "local_hospital", sort_order: 30 },
        { name: "Educação", slug: "educacao", icon: "school", sort_order: 40 },
        { name: "Comércio", slug: "comercio", icon: "shopping_bag", sort_order: 50 },
        { name: "Turismo", slug: "turismo", icon: "map", sort_order: 60 },
        { name: "Serviços Públicos", slug: "servicos-publicos", icon: "account_balance", sort_order: 70 },
        { name: "Lazer", slug: "lazer", icon: "palmtree", sort_order: 80 },
        { name: "Transporte", slug: "transporte", icon: "directions_bus", sort_order: 90 },
        { name: "Segurança", slug: "seguranca", icon: "shield", sort_order: 100 },
    ];
    
    // Services State
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
        business_hours: [
            { day: "Segunda-feira", open: "08:00", close: "18:00", closed: false },
            { day: "Terça-feira", open: "08:00", close: "18:00", closed: false },
            { day: "Quarta-feira", open: "08:00", close: "18:00", closed: false },
            { day: "Quinta-feira", open: "08:00", close: "18:00", closed: false },
            { day: "Sexta-feira", open: "08:00", close: "18:00", closed: false },
            { day: "Sábado", open: "08:00", close: "12:00", closed: false },
            { day: "Domingo", open: "00:00", close: "23:59", closed: true },
        ],
    });

    // Categories State
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = React.useState(false);
    const [editingCategory, setEditingCategory] = React.useState<any>(null);
    const [categoryFormData, setCategoryFormData] = React.useState({
        name: "",
        slug: "",
        icon: "",
        sort_order: 0,
    });

    const [uploading, setUploading] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validations
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Arquivo muito grande. O tamanho máximo permitido é 2MB.");
            return;
        }

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `city-guide/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('content')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('content')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image_url: publicUrl }));
            toast.success("Imagem carregada com sucesso!");
        } catch (error: any) {
            console.error('Error uploading image:', error.message);
            toast.error("Erro ao fazer upload da imagem. Verifique as permissões do bucket.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

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
        onError: (error: any) => {
            console.error(error);
            toast.error("Erro ao salvar", { description: error.message });
        },
    });

    const categorySaveMutation = useMutation({
        mutationFn: async (data: typeof categoryFormData) => {
            if (editingCategory) {
                const { error } = await supabase
                    .from("public_service_categories")
                    .update(data)
                    .eq("slug", editingCategory.slug);
                if (error) throw error;
            } else {
                // Check duplicate slug
                const { data: existing } = await supabase
                  .from("public_service_categories")
                  .select("slug")
                  .eq("slug", data.slug)
                  .maybeSingle();

                if (existing) {
                  throw new Error(`A categoria com o slug "${data.slug}" já existe.`);
                }

                const { error } = await supabase
                    .from("public_service_categories")
                    .insert([data]);
                if (error) throw error;
            }
        },
        onSuccess: () => {
            toast.success(editingCategory ? "Categoria atualizada!" : "Categoria criada!");
            setIsCategoryDialogOpen(false);
            setEditingCategory(null);
            queryClient.invalidateQueries({ queryKey: ["admin_service_categories"] });
        },
        onError: (error: any) => {
            console.error(error);
            toast.error("Erro ao salvar categoria", { description: error.message });
        },
    });

    const seedCategoriesMutation = useMutation({
        mutationFn: async () => {
          const { data: current } = await supabase.from("public_service_categories").select("slug");
          const existingSlugs = new Set((current || []).map(c => c.slug));
          
          const toAdd = DEFAULT_CATEGORIES.filter(c => !existingSlugs.has(c.slug));
          
          if (toAdd.length === 0) return { count: 0 };
          
          const { error } = await supabase.from("public_service_categories").insert(toAdd);
          if (error) throw error;
          return { count: toAdd.length };
        },
        onSuccess: (res) => {
            if (res.count > 0) {
              toast.success(`${res.count} categorias padrão importadas!`);
              queryClient.invalidateQueries({ queryKey: ["admin_service_categories"] });
            } else {
              toast.info("Todas as categorias padrão já foram cadastradas.");
            }
        },
        onError: (error: any) => {
            console.error(error);
            toast.error("Erro ao importar categorias", { description: error.message });
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
        onError: (error: any) => {
            toast.error("Erro ao excluir", { description: error.message });
        },
    });

    const categoryDeleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from("public_service_categories").delete().eq("slug", id);
            if (error) throw error;
        },
        onSuccess: () => {
            toast.success("Categoria excluída com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["admin_service_categories"] });
        },
        onError: (error: any) => {
            toast.error("Erro ao excluir categoria", { description: error.message });
        },
    });

    const updateStatusFromHours = (hours: any[]) => {
        if (!hours || hours.length < 7) return "Fechado";
        
        const now = new Date();
        const dayIdx = now.getDay(); // 0 is Sunday, 1 is Monday...
        const currentMapping = [6, 0, 1, 2, 3, 4, 5]; // Map Day-of-week index to our Monday-start array
        const todayHours = hours[currentMapping[dayIdx]];

        if (!todayHours || todayHours.closed) {
            return "Fechado";
        }

        const currentTime = now.getHours() * 60 + now.getMinutes();
        const [openH, openM] = todayHours.open.split(":").map(Number);
        const [closeH, closeM] = todayHours.close.split(":").map(Number);
        
        const openTime = openH * 60 + openM;
        const closeTime = closeH * 60 + closeM;

        if (currentTime >= openTime && currentTime < closeTime) {
            return "Aberto Agora";
        } else {
            return "Fechado";
        }
    };

    const handleOpenAdd = () => {
        const defaultHours = [
            { day: "Segunda-feira", open: "08:00", close: "18:00", closed: false },
            { day: "Terça-feira", open: "08:00", close: "18:00", closed: false },
            { day: "Quarta-feira", open: "08:00", close: "18:00", closed: false },
            { day: "Quinta-feira", open: "08:00", close: "18:00", closed: false },
            { day: "Sexta-feira", open: "08:00", close: "18:00", closed: false },
            { day: "Sábado", open: "08:00", close: "12:00", closed: false },
            { day: "Domingo", open: "00:00", close: "00:00", closed: true },
        ];

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
            status_badge: updateStatusFromHours(defaultHours),
            image_url: "",
            is_published: true,
            is_featured: false,
            sort_order: (servicesQuery.data?.length || 0),
            rating: 5,
            business_hours: defaultHours,
        });
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (item: any) => {
        const itemHours = item.business_hours || [
            { day: "Segunda-feira", open: "08:00", close: "18:00", closed: false },
            { day: "Terça-feira", open: "08:00", close: "18:00", closed: false },
            { day: "Quarta-feira", open: "08:00", close: "18:00", closed: false },
            { day: "Quinta-feira", open: "08:00", close: "18:00", closed: false },
            { day: "Sexta-feira", open: "08:00", close: "18:00", closed: false },
            { day: "Sábado", open: "08:00", close: "12:00", closed: false },
            { day: "Domingo", open: "00:00", close: "00:00", closed: true },
        ];

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
            status_badge: updateStatusFromHours(itemHours),
            image_url: item.image_url || "",
            is_published: item.is_published ?? true,
            is_featured: item.is_featured || false,
            sort_order: item.sort_order || 0,
            rating: item.rating || 5,
            business_hours: itemHours,
        });
        setIsDialogOpen(true);
    };

    const handleOpenAddCategory = () => {
        setEditingCategory(null);
        setCategoryFormData({
            name: "",
            slug: "",
            icon: "storefront",
            sort_order: 0,
        });
        setIsCategoryDialogOpen(true);
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

    const handleHoursChange = (index: number, field: string, value: any) => {
        const newHours = [...formData.business_hours];
        newHours[index] = { ...newHours[index], [field]: value };
        
        const newStatus = updateStatusFromHours(newHours);
        setFormData(prev => ({ ...prev, business_hours: newHours, status_badge: newStatus }));
    };

    const copyHoursToAll = (index: number) => {
        const source = formData.business_hours[index];
        const newHours = formData.business_hours.map(h => ({
            ...h,
            open: source.open,
            close: source.close,
            closed: source.closed
        }));
        
        const newStatus = updateStatusFromHours(newHours);
        setFormData(prev => ({ ...prev, business_hours: newHours, status_badge: newStatus }));
        toast.success("Horário copiado para todos os dias!");
    };

    const handleCategoryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        const slug = name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-");

        setCategoryFormData((prev) => ({ ...prev, name, slug }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveMutation.mutate(formData);
    };

    const handleCategorySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        categorySaveMutation.mutate(categoryFormData);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Guia da Cidade</h1>
                    <p className="text-sm text-muted-foreground transition-colors">Gerencie pontos turísticos e estabelecimentos locais.</p>
                </div>
                <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="gap-2" 
                      onClick={() => seedCategoriesMutation.mutate()}
                      disabled={seedCategoriesMutation.isPending}
                    >
                        <Loader2 className={`h-4 w-4 ${seedCategoriesMutation.isPending ? "animate-spin" : ""}`} />
                        Carregar Padrões
                    </Button>
                    {activeTab === "services" ? (
                        <Button className="gap-2" onClick={handleOpenAdd}>
                            <Plus className="h-4 w-4" />
                            Novo Estabelecimento
                        </Button>
                    ) : (
                        <Button className="gap-2" onClick={handleOpenAddCategory}>
                            <Plus className="h-4 w-4" />
                            Nova Categoria
                        </Button>
                    )}
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-card border w-full justify-start h-12 p-1 gap-1">
                    <TabsTrigger value="services" className="gap-2 px-4 h-full data-[state=active]:bg-muted">
                        <MapPin className="h-4 w-4" />
                        Estabelecimentos
                    </TabsTrigger>
                    <TabsTrigger value="categories" className="gap-2 px-4 h-full data-[state=active]:bg-muted">
                        <LayoutGrid className="h-4 w-4" />
                        Categorias
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="services" className="space-y-6 outline-none">
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
                </TabsContent>

                <TabsContent value="categories" className="space-y-6 outline-none">
                    <Card className="p-4 bg-card">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Filtrar categorias por nome ou slug..."
                                className="pl-9"
                                value={catQ}
                                onChange={(e) => setCatQ(e.target.value)}
                            />
                        </div>
                    </Card>

                    <div className="border rounded-lg bg-card overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Slug (Identificador)</TableHead>
                                    <TableHead>Ícone</TableHead>
                                    <TableHead>Ordem</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categoriesQuery.isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                                            Carregando categorias...
                                        </TableCell>
                                    </TableRow>
                                ) : (categoriesQuery.data || []).length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Nenhuma categoria cadastrada.</TableCell>
                                    </TableRow>
                                ) : (
                                    categoriesQuery.data?.filter((c: any) => 
                                      c.name.toLowerCase().includes(catQ.toLowerCase()) || 
                                      c.slug.toLowerCase().includes(catQ.toLowerCase())
                                    ).map((cat: any) => (
                                        <TableRow key={cat.slug}>
                                            <TableCell className="font-medium">{cat.name}</TableCell>
                                            <TableCell className="text-xs text-muted-foreground font-mono">{cat.slug}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="gap-2">
                                                    <span className="text-[10px] text-muted-foreground uppercase">{cat.icon}</span>
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{cat.sort_order}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleOpenEditCategory(cat)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="text-destructive" 
                                                        onClick={() => confirm("Deseja realmente excluir esta categoria? Isso pode afetar estabelecimentos vinculados a ela.") && categoryDeleteMutation.mutate(cat.slug)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                    </div>
                </TabsContent>
            </Tabs>

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

                            <div className="space-y-3 col-span-2">
                                <Label>Categoria</Label>
                                <div className="flex flex-wrap gap-2 py-1">
                                    {categoriesQuery.data?.map((cat: any) => (
                                        <button
                                            key={cat.slug}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, category_slug: cat.slug })}
                                            className={cn(
                                                "px-4 py-2 rounded-full border text-sm font-medium transition-all whitespace-nowrap",
                                                formData.category_slug === cat.slug
                                                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                                                    : "bg-background hover:bg-muted border-input"
                                            )}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                    {(!categoriesQuery.data || categoriesQuery.data.length === 0) && (
                                        <p className="text-xs text-muted-foreground italic">Nenhuma categoria encontrada.</p>
                                    )}
                                </div>
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

                            <div className="space-y-4 col-span-2 border rounded-xl p-4 bg-muted/30">
                                <div className="flex items-center justify-between mb-2">
                                    <Label className="text-base font-bold flex items-center gap-2">
                                        <CalendarDays className="h-5 w-5 text-primary" />
                                        Horário de Funcionamento (Semanal)
                                    </Label>
                                </div>
                                <div className="space-y-2">
                                    {formData.business_hours.map((day, idx) => (
                                        <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 bg-background rounded-lg border shadow-sm">
                                            <div className="w-32 font-semibold text-sm text-primary">{day.day}</div>
                                            
                                            <div className="flex items-center gap-2 flex-1 w-full">
                                                {!day.closed ? (
                                                    <div className="flex items-center gap-2 flex-1">
                                                        <Input 
                                                            type="time" 
                                                            value={day.open} 
                                                            onChange={(e) => handleHoursChange(idx, "open", e.target.value)}
                                                            className="h-9 flex-1 min-w-[100px]"
                                                        />
                                                        <span className="text-muted-foreground">às</span>
                                                        <Input 
                                                            type="time" 
                                                            value={day.close} 
                                                            onChange={(e) => handleHoursChange(idx, "close", e.target.value)}
                                                            className="h-9 flex-1 min-w-[100px]"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex-1 h-9 flex items-center justify-center text-xs text-destructive font-bold uppercase border border-dashed rounded bg-destructive/5 tracking-wider">
                                                        Fechado o dia todo
                                                    </div>
                                                )}
                                                
                                                <div className="flex items-center gap-1 ml-auto">
                                                    <Button 
                                                        type="button" 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className={cn("h-8 w-8", day.closed && "text-destructive bg-destructive/10")}
                                                        onClick={() => handleHoursChange(idx, "closed", !day.closed)}
                                                        title={day.closed ? "Reabrir" : "Marcar como Fechado"}
                                                    >
                                                        {day.closed ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                                                    </Button>
                                                    <Button 
                                                        type="button" 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-8 w-8"
                                                        onClick={() => copyHoursToAll(idx)}
                                                        title="Copiar para todos"
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-2">
                                    * O status será atualizado automaticamente com base no horário configurado.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hours">Rótulo de Horário (Opcional)</Label>
                                <Input
                                    id="hours"
                                    value={formData.hours_label}
                                    onChange={(e) => setFormData({ ...formData, hours_label: e.target.value })}
                                    placeholder="Ex: Seg-Sex: 08:00 - 18:00"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status_badge">Status Atual</Label>
                                <Input
                                    id="status_badge"
                                    value={formData.status_badge}
                                    onChange={(e) => setFormData({ ...formData, status_badge: e.target.value })}
                                    placeholder="Ex: Aberto Agora / Fechado"
                                />
                            </div>

                            <div className="space-y-4 col-span-2">
                                <Label>Foto do Estabelecimento</Label>
                                <Tabs defaultValue="upload" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 mb-4">
                                        <TabsTrigger value="upload" className="gap-2">
                                            <UploadIcon className="h-4 w-4" />
                                            Upload
                                        </TabsTrigger>
                                        <TabsTrigger value="url" className="gap-2">
                                            <Link className="h-4 w-4" />
                                            Link URL
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="upload" className="space-y-4">
                                        <div
                                            className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer relative"
                                            onClick={() => !uploading && fileInputRef.current?.click()}
                                        >
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                disabled={uploading}
                                            />
                                            {uploading ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                                    <p className="text-sm font-medium">Carregando...</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <UploadIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                                    <p className="text-sm font-medium">Escolha uma imagem ou arraste aqui</p>
                                                    <p className="text-[10px] text-muted-foreground mt-1">
                                                        Tamanho máximo: 2MB
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="url" className="space-y-2">
                                        <Input
                                            id="image_url"
                                            value={formData.image_url}
                                            onChange={(e) => setFormData(p => ({ ...p, image_url: e.target.value }))}
                                            placeholder="https://..."
                                        />
                                        <p className="text-[10px] text-muted-foreground">
                                            Insira o link direto da imagem (deve terminar em .jpg, .png, .webp, etc).
                                        </p>
                                    </TabsContent>
                                </Tabs>

                                {formData.image_url && (
                                    <div className="relative group rounded-lg overflow-hidden border max-w-[300px] mx-auto">
                                        <img
                                            src={formData.image_url}
                                            alt="Preview"
                                            className="w-full aspect-video object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => setFormData(p => ({ ...p, image_url: "" }))}
                                            >
                                                Remover
                                            </Button>
                                        </div>
                                    </div>
                                )}
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
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
                        <DialogDescription>
                            Configure as categorias de estabelecimentos do guia.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCategorySubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="cat_name">Nome da Categoria</Label>
                            <Input
                                id="cat_name"
                                list="recommended-categories"
                                value={categoryFormData.name}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  handleCategoryNameChange(e);
                                  
                                  // Auto-fill icon if matching recommendation
                                  const rec = DEFAULT_CATEGORIES.find(c => c.name === val);
                                  if (rec && !editingCategory) {
                                      setCategoryFormData(prev => ({ ...prev, icon: rec.icon }));
                                  }
                                }}
                                placeholder="Ex: Gastronomia"
                                required
                            />
                            <datalist id="recommended-categories">
                                {DEFAULT_CATEGORIES.map(c => (
                                    <option key={c.slug} value={c.name} />
                                ))}
                            </datalist>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cat_slug">Identificador (URL Slug)</Label>
                            <Input
                                id="cat_slug"
                                value={categoryFormData.slug}
                                onChange={(e) => setCategoryFormData({ ...categoryFormData, slug: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cat_icon">Ícone (Chave Lucide)</Label>
                            <Input
                                id="cat_icon"
                                value={categoryFormData.icon}
                                onChange={(e) => setCategoryFormData({ ...categoryFormData, icon: e.target.value })}
                                placeholder="Ex: storefront, local_hospital, etc."
                            />
                            <p className="text-[10px] text-muted-foreground">
                                Use chaves como: school, Directions_bus, clinical_notes, bolt, cloud.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cat_sort">Ordem de Exibição</Label>
                            <Input
                                id="cat_sort"
                                type="number"
                                value={categoryFormData.sort_order}
                                onChange={(e) => setCategoryFormData({ ...categoryFormData, sort_order: parseInt(e.target.value) || 0 })}
                            />
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={categorySaveMutation.isPending}>
                                {categorySaveMutation.isPending ? "Salvando..." : "Salvar Categoria"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isJobDialogOpen} onOpenChange={setIsJobDialogOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingJob ? "Editar Vaga" : "Nova Vaga"}</DialogTitle>
                        <DialogDescription>
                            Preencha as informações da vaga de emprego.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={(e) => { e.preventDefault(); jobSaveMutation.mutate(jobFormData); }} className="space-y-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="job_title">Título / Cargo</Label>
                                <Input
                                    id="job_title"
                                    value={jobFormData.title}
                                    onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })}
                                    placeholder="Ex: Auxiliar de Produção"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="job_company">Empresa</Label>
                                <Input
                                    id="job_company"
                                    value={jobFormData.company}
                                    onChange={(e) => setJobFormData({ ...jobFormData, company: e.target.value })}
                                    placeholder="Ex: Empresa de Transportes"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="job_location">Localização</Label>
                                <Input
                                    id="job_location"
                                    value={jobFormData.location}
                                    onChange={(e) => setJobFormData({ ...jobFormData, location: e.target.value })}
                                    placeholder="Ex: Marau - RS"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="job_type">Tipo de Contrato</Label>
                                <Select value={jobFormData.employment_type} onValueChange={(v) => setJobFormData({ ...jobFormData, employment_type: v })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Efetivo">Efetivo</SelectItem>
                                        <SelectItem value="Estágio">Estágio</SelectItem>
                                        <SelectItem value="Temporário">Temporário</SelectItem>
                                        <SelectItem value="Freelance">Freelance</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="job_category">Setor</Label>
                                <Select value={jobFormData.category} onValueChange={(v) => setJobFormData({ ...jobFormData, category: v })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Indústria">Indústria</SelectItem>
                                        <SelectItem value="Comércio / Varejo">Comércio / Varejo</SelectItem>
                                        <SelectItem value="Serviços">Serviços</SelectItem>
                                        <SelectItem value="Tecnologia / TI">Tecnologia / TI</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="job_description">Descrição / Detalhes</Label>
                                <Textarea
                                    id="job_description"
                                    value={jobFormData.description}
                                    onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                                    rows={4}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="job_requirements">Requisitos</Label>
                                <Textarea
                                    id="job_requirements"
                                    value={jobFormData.requirements}
                                    onChange={(e) => setJobFormData({ ...jobFormData, requirements: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="job_benefits">Benefícios</Label>
                                <Textarea
                                    id="job_benefits"
                                    value={jobFormData.benefits}
                                    onChange={(e) => setJobFormData({ ...jobFormData, benefits: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={jobFormData.is_featured}
                                    onCheckedChange={(v) => setJobFormData({ ...jobFormData, is_featured: v })}
                                />
                                <Label>Vaga em Destaque</Label>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsJobDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={jobSaveMutation.isPending}>
                                {jobSaveMutation.isPending ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                                {editingJob ? "Salvar Alterações" : "Criar Vaga"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
