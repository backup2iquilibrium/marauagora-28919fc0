import * as React from "react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Eye,
    Pencil,
    Trash2,
    Globe,
    FileEdit,
    ChevronLeft,
    ChevronRight,
    Calendar,
    Briefcase,
    Settings as SettingsIcon,
    LayoutGrid
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

async function fetchNews({
    q = "",
    category = "all",
    page = 0,
    pageSize = 10
}) {
    let query = supabase
        .from("news" as any)
        .select("*", { count: "exact" })
        .order("published_at", { ascending: false });

    if (category !== "all") {
        query = query.eq("category_slug", category);
    }

    if (q.trim()) {
        query = query.ilike("title", `%${q.trim()}%`);
    }

    const from = page * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await query.range(from, to);
    if (error) throw error;
    return { rows: data || [], count: count || 0 };
}

async function fetchCategories() {
    // We'll try news_categories first, if fails we'll use a hardcoded list or fallback
    try {
        const { data, error } = await supabase
            .from("news_categories" as any)
            .select("*")
            .order("name");
        if (error) throw error;
        return data || [];
    } catch (e) {
        return [
            { slug: "cidade", name: "Cidade" },
            { slug: "politica", name: "Política" },
            { slug: "esportes", name: "Esportes" },
            { slug: "policia", name: "Polícia" },
            { slug: "agronegocio", name: "Agronegócio" },
            { slug: "geral", name: "Geral" },
        ];
    }
}

export default function AdminContent() {
    const navigate = useNavigate();
    const [q, setQ] = React.useState("");
    const [category, setCategory] = React.useState("all");
    const [page, setPage] = React.useState(0);
    const pageSize = 10;

    const newsQuery = useQuery({
        queryKey: ["admin_news", { q, category, page }],
        queryFn: () => fetchNews({ q, category, page, pageSize }),
    });

    const categoriesQuery = useQuery({
        queryKey: ["news_categories"],
        queryFn: fetchCategories,
    });

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta notícia?")) return;

        const { error } = await supabase.from("news" as any).delete().eq("id", id);
        if (error) {
            toast.error("Erro ao excluir notícia");
        } else {
            toast.success("Notícia excluída com sucesso");
            newsQuery.refetch();
        }
    };

    const totalPages = Math.ceil((newsQuery.data?.count || 0) / pageSize);

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Gerenciamento de Conteúdo</h1>
                    <p className="text-sm text-muted-foreground">Administre todas as verticais de conteúdo do portal.</p>
                </div>
            </div>

            <Tabs defaultValue="news" className="space-y-6">
                <TabsList className="bg-card border w-full justify-start h-12 p-1 gap-1">
                    <TabsTrigger value="news" className="gap-2 px-4 h-full data-[state=active]:bg-muted">
                        <FileEdit className="h-4 w-4" />
                        Notícias
                    </TabsTrigger>
                    <TabsTrigger value="categories" className="gap-2 px-4 h-full data-[state=active]:bg-muted">
                        <LayoutGrid className="h-4 w-4" />
                        Categorias
                    </TabsTrigger>
                    <TabsTrigger value="events" className="gap-2 px-4 h-full data-[state=active]:bg-muted">
                        <Calendar className="h-4 w-4" />
                        Agenda
                    </TabsTrigger>
                    <TabsTrigger value="jobs" className="gap-2 px-4 h-full data-[state=active]:bg-muted">
                        <Briefcase className="h-4 w-4" />
                        Vagas
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="news" className="space-y-6 outline-none">
                    <div className="flex justify-end">
                        <Button className="gap-2" onClick={() => navigate("/admin/conteudo/novo")}>
                            <Plus className="h-4 w-4" />
                            Nova Notícia
                        </Button>
                    </div>

                    <Card className="p-4 bg-card">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar por título..."
                                    className="pl-9"
                                    value={q}
                                    onChange={(e) => {
                                        setQ(e.target.value);
                                        setPage(0);
                                    }}
                                />
                            </div>
                            <Select value={category} onValueChange={(v) => {
                                setCategory(v);
                                setPage(0);
                            }}>
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
                                    <TableHead>Título</TableHead>
                                    <TableHead>Categoria</TableHead>
                                    <TableHead>Data de Publicação</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {newsQuery.isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Carregando notícias...</TableCell>
                                    </TableRow>
                                ) : newsQuery.data?.rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Nenhuma notícia encontrada.</TableCell>
                                    </TableRow>
                                ) : (
                                    newsQuery.data?.rows.map((news: any) => (
                                        <TableRow key={news.id}>
                                            <TableCell className="font-medium">
                                                <div className="max-w-[400px] truncate">{news.title}</div>
                                                <div className="text-xs text-muted-foreground truncate">{news.slug}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">
                                                    {news.category_slug}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {format(new Date(news.published_at), "dd/MM/yyyy HH:mm")}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-[160px]">
                                                        <DropdownMenuItem asChild>
                                                            <a href={`/noticia/${news.slug}`} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                                                                <Eye className="h-4 w-4" /> Ver no site
                                                            </a>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2" onClick={() => navigate(`/admin/conteudo/${news.id}/editar`)}>
                                                            <Pencil className="h-4 w-4" /> Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDelete(news.id)}>
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

                        {totalPages > 1 && (
                            <div className="p-4 border-t flex items-center justify-between">
                                <p className="text-xs text-muted-foreground">
                                    Página {page + 1} de {totalPages} ({newsQuery.data?.count} total)
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={page === 0}
                                        onClick={() => setPage(p => p - 1)}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={page >= totalPages - 1}
                                        onClick={() => setPage(p => p + 1)}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="categories" className="space-y-6 outline-none">
                    <Card className="p-12 text-center space-y-4">
                        <div className="mx-auto w-12 h-12 rounded-full bg-muted grid place-items-center">
                            <LayoutGrid className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg">Gerenciamento de Categorias</h3>
                            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                                Esta funcionalidade está sendo integrada ao banco de dados e estará disponível para edição manual em breve.
                            </p>
                        </div>
                        <Button variant="outline" onClick={() => toast.info("Em breve")}>
                            Configurar Categorias
                        </Button>
                    </Card>
                </TabsContent>

                <TabsContent value="events" className="space-y-6 outline-none">
                    <Card className="p-12 text-center space-y-4">
                        <div className="mx-auto w-12 h-12 rounded-full bg-muted grid place-items-center">
                            <Calendar className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg">Agenda de Eventos</h3>
                            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                                Controle os eventos que aparecem na agenda do portal.
                            </p>
                        </div>
                        <Button onClick={() => toast.info("Módulo de Agenda em breve")}>
                            Gerenciar Agenda
                        </Button>
                    </Card>
                </TabsContent>

                <TabsContent value="jobs" className="space-y-6 outline-none">
                    <Card className="p-12 text-center space-y-4">
                        <div className="mx-auto w-12 h-12 rounded-full bg-muted grid place-items-center">
                            <Briefcase className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg">Vagas de Emprego</h3>
                            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                                Administre as oportunidades de trabalho listadas no portal.
                            </p>
                        </div>
                        <Button onClick={() => toast.info("Módulo de Vagas em breve")}>
                            Gerenciar Vagas
                        </Button>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

