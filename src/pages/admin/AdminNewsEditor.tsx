import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Save, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function fetchNewsById(id: string) {
    const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("id", id)
        .single();
    if (error) throw error;
    return data;
}

async function fetchCategories() {
    const { data, error } = await supabase
        .from("news_categories")
        .select("*")
        .order("name");
    if (error) throw error;
    return data || [];
}

export default function AdminNewsEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEditing = !!id;

    const [formData, setFormData] = React.useState({
        title: "",
        slug: "",
        excerpt: "",
        body: "",
        category_slug: "geral",
        image_url: "",
        published_at: new Date().toISOString().slice(0, 16),
    });

    const categoriesQuery = useQuery({
        queryKey: ["news_categories"],
        queryFn: fetchCategories,
    });

    const newsQuery = useQuery({
        queryKey: ["news", id],
        queryFn: () => fetchNewsById(id!),
        enabled: isEditing,
    });

    React.useEffect(() => {
        if (newsQuery.data) {
            setFormData({
                title: newsQuery.data.title || "",
                slug: newsQuery.data.slug || "",
                excerpt: newsQuery.data.excerpt || "",
                body: newsQuery.data.body || "",
                category_slug: newsQuery.data.category_slug || "geral",
                image_url: (newsQuery.data as any).image_url || "",
                published_at: new Date(newsQuery.data.published_at || new Date()).toISOString().slice(0, 16),
            });
        }
    }, [newsQuery.data]);

    const saveMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const payload = {
                title: data.title,
                slug: data.slug,
                excerpt: data.excerpt,
                body: data.body,
                category_slug: data.category_slug,
                image_url: data.image_url,
                published_at: new Date(data.published_at).toISOString(),
            };

            if (isEditing) {
                const { error } = await supabase
                    .from("news")
                    .update(payload as any)
                    .eq("id", id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("news")
                    .insert([payload as any]);
                if (error) throw error;
            }
        },
        onSuccess: () => {
            toast.success(isEditing ? "Notícia atualizada!" : "Notícia criada!");
            queryClient.invalidateQueries({ queryKey: ["admin_news"] });
            navigate("/admin/conteudo");
        },
        onError: (error) => {
            console.error(error);
            toast.error("Erro ao salvar notícia", { description: error.message });
        },
    });

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
        if (!formData.title || !formData.slug) {
            toast.error("Título e Slug são obrigatórios");
            return;
        }
        saveMutation.mutate(formData);
    };

    if (isEditing && newsQuery.isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/admin/conteudo")}>
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-semibold">
                    {isEditing ? "Editar Notícia" : "Nova Notícia"}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Conteúdo Principal</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Título</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={handleTitleChange}
                                    placeholder="Ex: Inauguração da nova praça no centro"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug (URL)</Label>
                                <Input
                                    id="slug"
                                    value={formData.slug}
                                    onChange={(e) => setFormData(p => ({ ...p, slug: e.target.value }))}
                                    placeholder="nova-praca-centro"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="excerpt">Linha de Apoio (Resumo)</Label>
                                <Textarea
                                    id="excerpt"
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData(p => ({ ...p, excerpt: e.target.value }))}
                                    placeholder="Um breve resumo da notícia para a listagem..."
                                    className="h-20"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="body">Corpo da Notícia</Label>
                                <Textarea
                                    id="body"
                                    value={formData.body}
                                    onChange={(e) => setFormData(p => ({ ...p, body: e.target.value }))}
                                    placeholder="O conteúdo completo da sua notícia..."
                                    className="min-h-[400px]"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configurações</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Categoria</Label>
                                <Select
                                    value={formData.category_slug}
                                    onValueChange={(v) => setFormData(p => ({ ...p, category_slug: v }))}
                                >
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Selecione uma categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categoriesQuery.data?.map(cat => (
                                            <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="published_at">Data de Publicação</Label>
                                <Input
                                    id="published_at"
                                    type="datetime-local"
                                    value={formData.published_at}
                                    onChange={(e) => setFormData(p => ({ ...p, published_at: e.target.value }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image_url">URL da Imagem de Destaque</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="image_url"
                                        value={formData.image_url}
                                        onChange={(e) => setFormData(p => ({ ...p, image_url: e.target.value }))}
                                        placeholder="https://..."
                                    />
                                    <Button type="button" variant="outline" size="icon">
                                        <ImageIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                                {formData.image_url && (
                                    <img
                                        src={formData.image_url}
                                        alt="Preview"
                                        className="mt-2 rounded-lg border aspect-video object-cover"
                                    />
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Button type="submit" className="w-full gap-2" size="lg" disabled={saveMutation.isPending}>
                        {saveMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {isEditing ? "Salvar Alterações" : "Publicar Notícia"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
