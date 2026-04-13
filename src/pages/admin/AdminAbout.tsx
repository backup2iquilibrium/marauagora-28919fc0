import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Plus, Pencil, Trash2, Loader2, GripVertical,
    Flag, Eye, BadgeCheck, User, Clock, FileText, Image as ImageIcon,
    MoreVertical, Instagram, Mail as MailIcon, Save, PencilLine, Globe, Users, Newspaper,
    Store, Home, Factory, Building, PieChart, Mountain, Mic, Video
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
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

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface AboutPage { id: string; hero_title: string; hero_subtitle: string; hero_image_url?: string; intro_text?: string; }
interface AboutValue { id: string; title: string; description: string; icon: string; sort_order: number; }
interface AboutTimeline { id: string; year: string; title: string; description: string; icon?: string; sort_order: number; }
interface AboutTeam { id: string; name: string; role: string; bio?: string; photo_url?: string; social_instagram?: string; social_email?: string; sort_order: number; }

// ─── Hook genérico de CRUD para tabelas about_* ────────────────────────────

function useAboutCrud<T extends { id: string }>(table: string, queryKey: string) {
    const qc = useQueryClient();

    const query = useQuery({
        queryKey: [queryKey],
        queryFn: async () => {
            const { data, error } = await supabase.from(table).select("*").order("sort_order", { ascending: true });
            if (error) throw error;
            return (data || []) as T[];
        },
    });

    const upsert = useMutation({
        mutationFn: async (record: Partial<T>) => {
            if ((record as any).id) {
                const { id, ...rest } = record as any;
                const { error } = await supabase.from(table).update(rest).eq("id", id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from(table).insert([record]);
                if (error) throw error;
            }
        },
        onSuccess: () => { qc.invalidateQueries({ queryKey: [queryKey] }); toast.success("Salvo!"); },
        onError: (e: any) => toast.error("Erro ao salvar", { description: e.message }),
    });

    const remove = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from(table).delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => { qc.invalidateQueries({ queryKey: [queryKey] }); toast.success("Excluído!"); },
        onError: (e: any) => toast.error("Erro ao excluir", { description: e.message }),
    });

    return { query, upsert, remove };
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── SEÇÃO: Hero / Configurações da Página ────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

function HeroSection() {
    const qc = useQueryClient();
    const [form, setForm] = React.useState<Partial<AboutPage>>({});
    const [loaded, setLoaded] = React.useState(false);

    const { data, isLoading } = useQuery<AboutPage>({
        queryKey: ["about_page"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("about_page")
                .select("*")
                .eq("id", "00000000-0000-0000-0000-000000000001")
                .maybeSingle();
            if (error) throw error;
            return data as AboutPage;
        },
    });

    React.useEffect(() => {
        if (data && !loaded) { setForm(data); setLoaded(true); }
    }, [data, loaded]);

    const saveMutation = useMutation({
        mutationFn: async () => {
            const { error } = await supabase.from("about_page").upsert({
                id: "00000000-0000-0000-0000-000000000001",
                hero_title: form.hero_title,
                hero_subtitle: form.hero_subtitle,
                hero_image_url: form.hero_image_url,
                intro_text: form.intro_text,
                updated_at: new Date().toISOString()
            });
            if (error) throw error;
        },
        onSuccess: () => { qc.invalidateQueries({ queryKey: ["about_page"] }); toast.success("Configurações salvas!"); },
        onError: (e: any) => toast.error("Erro", { description: e.message }),
    });

    if (isLoading) return <div className="flex items-center gap-2 text-muted-foreground py-8"><Loader2 className="animate-spin h-4 w-4" /> Carregando...</div>;

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="space-y-2">
                <Label>Título Principal (Hero)</Label>
                <Input value={form.hero_title || ""} onChange={(e) => setForm({ ...form, hero_title: e.target.value })}
                    placeholder="Ex: Marau Agora: A voz da nossa comunidade" />
            </div>
            <div className="space-y-2">
                <Label>Subtítulo / Slogan do Hero</Label>
                <Textarea rows={3} value={form.hero_subtitle || ""} onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })}
                    placeholder="Seu portal confiável para..." />
            </div>
            <div className="space-y-2">
                <Label>URL da Imagem de Fundo (Hero)</Label>
                <Input value={form.hero_image_url || ""} onChange={(e) => setForm({ ...form, hero_image_url: e.target.value })}
                    placeholder="https://..." />
                {form.hero_image_url && (
                    <img src={form.hero_image_url} alt="Preview" className="mt-2 h-32 w-full object-cover rounded-lg border"
                        onError={(e) => (e.currentTarget.style.display = "none")} />
                )}
            </div>
            <div className="space-y-2">
                <Label>Texto Introdutório (exibido abaixo do hero)</Label>
                <Textarea rows={5} value={form.intro_text || ""} onChange={(e) => setForm({ ...form, intro_text: e.target.value })}
                    placeholder="Fundado com o propósito de..." />
            </div>
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="gap-2">
                {saveMutation.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                Salvar Configurações
            </Button>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── SEÇÃO: Missão / Visão / Valores ─────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

const EMPTY_VALUE: Partial<AboutValue> = { title: "", description: "", icon: "flag", sort_order: 0 };

const AVAILABLE_ICONS = [
    { id: "flag", icon: Flag, label: "Bandeira" },
    { id: "eye", icon: Eye, label: "Olho/Visão" },
    { id: "badge-check", icon: BadgeCheck, label: "Selo/Valor" },
    { id: "pencil", icon: PencilLine, label: "Lápis" },
    { id: "globe", icon: Globe, label: "Globo" },
    { id: "users", icon: Users, label: "Equipe" },
    { id: "newspaper", icon: Newspaper, label: "Jornal" },
    { id: "user", icon: User, label: "Usuário" },
    { id: "store", icon: Store, label: "Loja" },
    { id: "home", icon: Home, label: "Casa" },
    { id: "factory", icon: Factory, label: "Fábrica" },
    { id: "building", icon: Building, label: "Prédio" },
    { id: "pie-chart", icon: PieChart, label: "Gráfico" },
    { id: "mountain", icon: Mountain, label: "Montanha" },
    { id: "mic", icon: Mic, label: "Microfone" },
    { id: "video", icon: Video, label: "Vídeo" },
];

function ValuesSection() {
    const { query, upsert, remove } = useAboutCrud<AboutValue>("about_values", "about_values");
    const [dialog, setDialog] = React.useState(false);
    const [editing, setEditing] = React.useState<Partial<AboutValue>>(EMPTY_VALUE);

    const openAdd = () => { setEditing(EMPTY_VALUE); setDialog(true); };
    const openEdit = (v: AboutValue) => { setEditing({ ...v }); setDialog(true); };

    const handleSave = () => {
        upsert.mutate(editing, { onSuccess: () => setDialog(false) });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Edite os cartões de Missão, Visão e Valores exibidos na página.</p>
                <Button size="sm" className="gap-2" onClick={openAdd}><Plus className="h-4 w-4" />Novo Card</Button>
            </div>

            <div className="border rounded-lg overflow-hidden bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Título</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Ícone</TableHead>
                            <TableHead>Ordem</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {query.isLoading
                            ? <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground"><Loader2 className="animate-spin h-5 w-5 mx-auto" /></TableCell></TableRow>
                            : (query.data || []).map((v) => (
                                <TableRow key={v.id}>
                                    <TableCell className="font-semibold">{v.title}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground line-clamp-2 max-w-xs">{v.description}</TableCell>
                                    <TableCell><Badge variant="outline">{v.icon}</Badge></TableCell>
                                    <TableCell>{v.sort_order}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="gap-2" onClick={() => openEdit(v)}><Pencil className="h-4 w-4" />Editar</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="gap-2 text-destructive" onClick={() => confirm("Excluir?") && remove.mutate(v.id)}><Trash2 className="h-4 w-4" />Excluir</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={dialog} onOpenChange={setDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing.id ? "Editar Card" : "Novo Card"}</DialogTitle>
                        <DialogDescription>Missão, Visão, Valores ou qualquer pilar institucional.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Título</Label>
                            <Input value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Descrição</Label>
                            <Textarea rows={4} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
                        </div>
                        <div className="space-y-3">
                            <Label>Selecione um Ícone</Label>
                            <div className="grid grid-cols-4 gap-2">
                                {AVAILABLE_ICONS.map((item) => {
                                    const Icon = item.icon;
                                    const isSelected = editing.icon === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => setEditing({ ...editing, icon: item.id })}
                                            className={cn(
                                                "flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all",
                                                isSelected 
                                                    ? "border-primary bg-primary/5 text-primary" 
                                                    : "border-transparent hover:bg-muted"
                                            )}
                                            title={item.label}
                                        >
                                            <Icon className="h-6 w-6 mb-1" />
                                            <span className="text-[10px] truncate w-full text-center">{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Ordem de Exibição</Label>
                            <Input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialog(false)}>Cancelar</Button>
                        <Button onClick={handleSave} disabled={upsert.isPending}>
                            {upsert.isPending && <Loader2 className="animate-spin h-4 w-4 mr-2" />}Salvar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── SEÇÃO: Timeline / Nossa Jornada ─────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

const EMPTY_TIMELINE: Partial<AboutTimeline> = { year: "", title: "", description: "", icon: "clock", sort_order: 0 };

function TimelineSection() {
    const { query, upsert, remove } = useAboutCrud<AboutTimeline>("about_timeline", "about_timeline");
    const [dialog, setDialog] = React.useState(false);
    const [editing, setEditing] = React.useState<Partial<AboutTimeline>>(EMPTY_TIMELINE);

    const openAdd = () => { setEditing(EMPTY_TIMELINE); setDialog(true); };
    const openEdit = (t: AboutTimeline) => { setEditing({ ...t }); setDialog(true); };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Adicione ou edite os marcos históricos do portal.</p>
                <Button size="sm" className="gap-2" onClick={openAdd}><Plus className="h-4 w-4" />Novo Marco</Button>
            </div>

            <div className="border rounded-lg overflow-hidden bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ano</TableHead>
                            <TableHead>Ícone</TableHead>
                            <TableHead>Título</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Ordem</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {query.isLoading
                            ? <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground"><Loader2 className="animate-spin h-5 w-5 mx-auto" /></TableCell></TableRow>
                            : (query.data || []).map((t) => (
                                <TableRow key={t.id}>
                                    <TableCell><Badge className="font-bold">{t.year}</Badge></TableCell>
                                    <TableCell><Badge variant="outline" className="text-[10px]">{t.icon || "clock"}</Badge></TableCell>
                                    <TableCell className="font-semibold">{t.title}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground line-clamp-2 max-w-xs">{t.description}</TableCell>
                                    <TableCell>{t.sort_order}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="gap-2" onClick={() => openEdit(t)}><Pencil className="h-4 w-4" />Editar</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="gap-2 text-destructive" onClick={() => confirm("Excluir?") && remove.mutate(t.id)}><Trash2 className="h-4 w-4" />Excluir</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={dialog} onOpenChange={setDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing.id ? "Editar Marco" : "Novo Marco"}</DialogTitle>
                        <DialogDescription>Adicione um ponto da história do Marau Agora.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Ano</Label>
                                <Input value={editing.year || ""} onChange={(e) => setEditing({ ...editing, year: e.target.value })} placeholder="2024" />
                            </div>
                            <div className="space-y-2">
                                <Label>Ordem</Label>
                                <Input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label>Selecione um Ícone</Label>
                            <div className="grid grid-cols-4 md:grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1 border rounded-md no-scrollbar">
                                {AVAILABLE_ICONS.map((item) => {
                                    const Icon = item.icon;
                                    const isSelected = editing.icon === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => setEditing({ ...editing, icon: item.id })}
                                            className={cn(
                                                "flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all",
                                                isSelected 
                                                    ? "border-primary bg-primary/5 text-primary" 
                                                    : "border-transparent hover:bg-muted"
                                            )}
                                            title={item.label}
                                        >
                                            <Icon className="h-5 w-5 mb-1" />
                                            <span className="text-[9px] truncate w-full text-center">{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Título do Marco</Label>
                            <Input value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Descrição</Label>
                            <Textarea rows={4} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialog(false)}>Cancelar</Button>
                        <Button onClick={() => upsert.mutate(editing, { onSuccess: () => setDialog(false) })} disabled={upsert.isPending}>
                            {upsert.isPending && <Loader2 className="animate-spin h-4 w-4 mr-2" />}Salvar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── SEÇÃO: Equipe ────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

const EMPTY_TEAM: Partial<AboutTeam> = { name: "", role: "", bio: "", photo_url: "", social_instagram: "", social_email: "", sort_order: 0 };

function TeamSection() {
    const { query, upsert, remove } = useAboutCrud<AboutTeam>("about_team", "about_team");
    const [dialog, setDialog] = React.useState(false);
    const [editing, setEditing] = React.useState<Partial<AboutTeam>>(EMPTY_TEAM);

    const openAdd = () => { setEditing(EMPTY_TEAM); setDialog(true); };
    const openEdit = (m: AboutTeam) => { setEditing({ ...m }); setDialog(true); };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Gerencie os membros da equipe exibidos na página.</p>
                <Button size="sm" className="gap-2" onClick={openAdd}><Plus className="h-4 w-4" />Novo Membro</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {query.isLoading
                    ? <div className="col-span-3 flex justify-center py-8"><Loader2 className="animate-spin h-6 w-6 text-muted-foreground" /></div>
                    : (query.data || []).map((m) => (
                        <Card key={m.id} className="overflow-hidden">
                            {m.photo_url ? (
                                <div className="h-32 bg-muted overflow-hidden">
                                    <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="h-32 bg-muted flex items-center justify-center">
                                    <User className="h-12 w-12 text-muted-foreground/40" />
                                </div>
                            )}
                            <CardContent className="p-4">
                                <div className="font-bold text-sm">{m.name}</div>
                                <div className="text-xs text-muted-foreground mb-2">{m.role}</div>
                                {m.bio && <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{m.bio}</p>}
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => openEdit(m)}>
                                        <Pencil className="h-3 w-3" />Editar
                                    </Button>
                                    <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10"
                                        onClick={() => confirm(`Excluir ${m.name}?`) && remove.mutate(m.id)}>
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
            </div>

            <Dialog open={dialog} onOpenChange={setDialog}>
                <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader>
                        <DialogTitle>{editing.id ? "Editar Membro" : "Novo Membro da Equipe"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nome Completo</Label>
                                <Input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Cargo / Função</Label>
                                <Input value={editing.role || ""} onChange={(e) => setEditing({ ...editing, role: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Biografia curta</Label>
                            <Textarea rows={3} value={editing.bio || ""} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>URL da Foto</Label>
                            <Input value={editing.photo_url || ""} onChange={(e) => setEditing({ ...editing, photo_url: e.target.value })} placeholder="https://..." />
                            {editing.photo_url && (
                                <img src={editing.photo_url} alt="preview" className="mt-2 h-20 w-20 rounded-full object-cover border"
                                    onError={(e) => (e.currentTarget.style.display = "none")} />
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Instagram (@ sem @)</Label>
                                <Input value={editing.social_instagram || ""} onChange={(e) => setEditing({ ...editing, social_instagram: e.target.value })} placeholder="usuario" />
                            </div>
                            <div className="space-y-2">
                                <Label>E-mail</Label>
                                <Input type="email" value={editing.social_email || ""} onChange={(e) => setEditing({ ...editing, social_email: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Ordem de Exibição</Label>
                            <Input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialog(false)}>Cancelar</Button>
                        <Button onClick={() => upsert.mutate(editing, { onSuccess: () => setDialog(false) })} disabled={upsert.isPending}>
                            {upsert.isPending && <Loader2 className="animate-spin h-4 w-4 mr-2" />}Salvar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminAbout() {
    const [searchParams] = React.useState(new URLSearchParams(window.location.search));
    const defaultTab = searchParams.get("tab") || "hero";

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Quem Somos</h1>
                <p className="text-sm text-muted-foreground">
                    Gerencie todo o conteúdo da página institucional do portal.
                </p>
            </div>

            <Tabs defaultValue={defaultTab}>
                <TabsList className="flex flex-wrap gap-1 h-auto">
                    <TabsTrigger value="hero" className="gap-2"><ImageIcon className="h-4 w-4" />Hero / Capa</TabsTrigger>
                    <TabsTrigger value="values" className="gap-2"><Flag className="h-4 w-4" />Missão &amp; Valores</TabsTrigger>
                    <TabsTrigger value="timeline" className="gap-2"><Clock className="h-4 w-4" />Nossa Jornada</TabsTrigger>
                    <TabsTrigger value="team" className="gap-2"><User className="h-4 w-4" />Equipe</TabsTrigger>
                </TabsList>

                <TabsContent value="hero" className="mt-6">
                    <Card><CardHeader><CardTitle>Configurações do Hero</CardTitle></CardHeader>
                        <CardContent><HeroSection /></CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="values" className="mt-6">
                    <Card><CardHeader><CardTitle>Missão, Visão e Valores</CardTitle></CardHeader>
                        <CardContent><ValuesSection /></CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="timeline" className="mt-6">
                    <Card><CardHeader><CardTitle>Nossa Jornada (Timeline)</CardTitle></CardHeader>
                        <CardContent><TimelineSection /></CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="team" className="mt-6">
                    <Card><CardHeader><CardTitle>Equipe</CardTitle></CardHeader>
                        <CardContent><TeamSection /></CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
