import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Save, Loader2, Image as ImageIcon, Link, Upload as UploadIcon } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    const [uploading, setUploading] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const [formData, setFormData] = React.useState({
        title: "",
        slug: "",
        excerpt: "",
        body: "",
        category_slug: "geral",
        image_url: "",
        published_at: new Date().toISOString().slice(0, 16),
    });

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
            const filePath = `news/${fileName}`;

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

                            <div className="space-y-4">
                                <Label>Imagem de Destaque</Label>
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
                                                        Recomendado: 1200x675px (16:9)<br />
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
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-muted-foreground">
                                                Insira o link direto da imagem (deve terminar em .jpg, .png, .webp, etc).
                                            </p>
                                            {formData.image_url.includes("canva.com") && (
                                                <p className="text-[10px] text-amber-600 font-medium">
                                                    Atenção: Links de edição/compartilhamento do Canva não funcionam. Você precisa baixar a imagem ou pegar o "Endereço da Imagem" direto.
                                                </p>
                                            )}
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                {formData.image_url && (
                                    <div className="relative group rounded-lg overflow-hidden border">
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
