import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Info, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

async function fetchCategories() {
    const { data, error } = await supabase
        .from("classified_categories")
        .select("slug,name")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
}

export default function CreateClassifiedAd() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [images, setImages] = React.useState<File[]>([]);

    const categoriesQuery = useQuery({
        queryKey: ["classified_categories"],
        queryFn: fetchCategories,
    });

    const [formData, setFormData] = React.useState({
        title: "",
        category_slug: "",
        price: "",
        whatsapp: "",
        description: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        if (!formData.category_slug) {
            toast.error("Selecione uma categoria");
            return;
        }

        setLoading(true);

        try {
            // 1. Create the AD
            const { data: ad, error: adError } = await supabase
                .from("classified_ads")
                .insert({
                    title: formData.title,
                    category_slug: formData.category_slug,
                    owner_user_id: user.id,
                    advertiser_name: user.email?.split("@")[0] || "Anunciante",
                    advertiser_email: user.email || "",
                    status: "pending",
                })
                .select()
                .single();

            if (adError) throw adError;

            // 2. Handle Image Uploads (Stub for now, implementation depends on bucket configuration)
            if (images.length > 0) {
                toast.info("Upload de imagens será processado na sequência.");
                // Implement image upload logic here
            }

            toast.success("Anúncio enviado!", {
                description: "Seu anúncio está em análise e será publicado em breve.",
            });
            navigate("/anunciante/classificados");
        } catch (error: any) {
            console.error(error);
            toast.error("Erro ao salvar anúncio", {
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 -ml-2">
                <ChevronLeft className="h-4 w-4" />
                Voltar
            </Button>

            <div>
                <h1 className="text-2xl font-semibold">Novo Anúncio</h1>
                <p className="text-sm text-muted-foreground">
                    Preencha os detalhes do seu anúncio para revisão.
                </p>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título do Anúncio</Label>
                            <Input
                                id="title"
                                placeholder="Ex: Vende-se Casa no Centro"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                            <p className="text-[10px] text-muted-foreground">
                                Seja direto e claro no título.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Categoria</Label>
                                <Select
                                    onValueChange={(v) => setFormData({ ...formData, category_slug: v })}
                                >
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categoriesQuery.data?.map((cat) => (
                                            <SelectItem key={cat.slug} value={cat.slug}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">Preço (Opcional)</Label>
                                <Input
                                    id="price"
                                    placeholder="Ex: R$ 1.500,00"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="whatsapp">WhatsApp para Contato</Label>
                            <Input
                                id="whatsapp"
                                placeholder="Ex: 54999999999"
                                required
                                value={formData.whatsapp}
                                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição Detalhada</Label>
                            <Textarea
                                id="description"
                                placeholder="Descreva as características, estado de conservação, etc."
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Fotos do Anúncio</Label>
                            <div
                                className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer"
                                onClick={() => document.getElementById("images")?.click()}
                            >
                                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                <p className="text-sm font-medium">Clique para enviar fotos</p>
                                <p className="text-xs text-muted-foreground">
                                    {images.length > 0
                                        ? `${images.length} fotos selecionadas`
                                        : "Até 5 fotos (JPG, PNG)"}
                                </p>
                                <input
                                    id="images"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>

                        <div className="bg-muted/30 p-4 rounded-lg flex gap-3">
                            <Info className="h-5 w-5 text-primary shrink-0" />
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Ao enviar seu anúncio, ele ficará com o status **Pendente**. Nossa equipe revisará o conteúdo e as imagens antes da publicação oficial no portal.
                            </p>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                "Enviar para Revisão"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
