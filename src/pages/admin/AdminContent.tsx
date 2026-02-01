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
    ChevronRight
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

async function fetchNews({
    q = "",
    category = "all",
    page = 0,
    pageSize = 10
}) {
    let query = supabase
        .from("news")
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
    const { data, error } = await supabase
        .from("news_categories")
        .select("*")
        .order("name");

    if (error || !data || data.length === 0) {
        // Fallback categories if table doesn't exist
        return [
            { slug: "cidade", name: "Cidade" },
            { slug: "politica", name: "Política" },
            { slug: "esportes", name: "Esportes" },
            { slug: "policia", name: "Polícia" },
            { slug: "agronegocio", name: "Agronegócio" },
            { slug: "geral", name: "Geral" },
        ];
    }
    return data;
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

        const { error } = await supabase.from("news").delete().eq("id", id);
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
                    <p className="text-sm text-muted-foreground">Administre as notícias e artigos do portal.</p>
                </div>
                <Button className="gap-2" onClick={() => toast.info("Funcionalidade de criação em breve")}>
                    <Plus className="h-4 w-4" />
                    Nova Notícia
                </Button>
            </div>

            <Card className="p-4 flex flex-col md:flex-row gap-4">
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
            </Card>

            <div className="border rounded-lg bg-card">
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
                                                <DropdownMenuItem className="gap-2" onClick={() => toast.info("Edição em breve")}>
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
        </div>
    );
}

