import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
    Video, 
    Plus, 
    Trash2, 
    Pencil, 
    Search, 
    Save, 
    Youtube, 
    Facebook, 
    Instagram, 
    Radio as RadioIcon,
    Loader2,
    Clock
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    CardDescription 
} from "@/components/ui/card";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type LiveProgram = {
    id: string;
    day_info: string;
    title: string;
    time_info: string;
    sort_order: number;
};

type LiveSettings = {
    youtube_url: string;
    facebook_url: string;
    instagram_url: string;
    radio_url: string;
    active_live_id: string; // If we want to store a YouTube Video ID for the player
};

export default function AdminLive() {
    const queryClient = useQueryClient();
    const [editingProgram, setEditingProgram] = React.useState<LiveProgram | null>(null);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    // Form states for new/edit program
    const [dayInfo, setDayInfo] = React.useState("");
    const [title, setTitle] = React.useState("");
    const [timeInfo, setTimeInfo] = React.useState("");

    // Settings states
    const [settings, setSettings] = React.useState<LiveSettings>({
        youtube_url: "",
        facebook_url: "",
        instagram_url: "",
        radio_url: "",
        active_live_id: ""
    });

    // Fetch Schedule
    const { data: schedule, isLoading: loadingSchedule } = useQuery({
        queryKey: ["admin", "live_schedule"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("live_programs")
                .select("*")
                .order("sort_order", { ascending: true });
            if (error) throw error;
            return (data ?? []) as LiveProgram[];
        }
    });

    // Fetch Settings
    const { isLoading: loadingSettings } = useQuery({
        queryKey: ["admin", "live_settings"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("site_settings")
                .select("*")
                .eq("key", "live_config")
                .single();
            
            if (error && error.code !== "PGRST116") throw error;
            if (data?.value) {
                setSettings(data.value as LiveSettings);
            }
            return data;
        }
    });

    // Mutations
    const saveProgramMutation = useMutation({
        mutationFn: async (program: Partial<LiveProgram>) => {
            if (program.id) {
                const { error } = await supabase
                    .from("live_programs")
                    .update(program)
                    .eq("id", program.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("live_programs")
                    .insert([program]);
                if (error) throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "live_schedule"] });
            toast.success("Programação salva!");
            setIsDialogOpen(false);
            resetForm();
        },
        onError: (err) => toast.error(`Erro ao salvar: ${err.message}`)
    });

    const deleteProgramMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from("live_programs")
                .delete()
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "live_schedule"] });
            toast.success("Programa excluído!");
        }
    });

    const saveSettingsMutation = useMutation({
        mutationFn: async (newSettings: LiveSettings) => {
            const { error } = await supabase
                .from("site_settings")
                .upsert({ 
                    key: "live_config", 
                    value: newSettings,
                    updated_at: new Date().toISOString()
                }, { onConflict: "key" });
            if (error) throw error;
        },
        onSuccess: () => {
            toast.success("Configurações salvas!");
        },
        onError: (err) => toast.error(`Erro ao salvar: ${err.message}`)
    });

    const resetForm = () => {
        setEditingProgram(null);
        setDayInfo("");
        setTitle("");
        setTimeInfo("");
    };

    const handleEdit = (p: LiveProgram) => {
        setEditingProgram(p);
        setDayInfo(p.day_info);
        setTitle(p.title);
        setTimeInfo(p.time_info);
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveProgramMutation.mutate({
            id: editingProgram?.id,
            day_info: dayInfo,
            title: title,
            time_info: timeInfo,
            sort_order: editingProgram?.sort_order ?? 0
        });
    };

    return (
        <div className="p-6 max-w-5xl space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Gerenciar Marau Agora Live</h1>
                    <p className="text-sm text-muted-foreground">Configure links sociais e a grade de programação ao vivo.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Novo Programa
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingProgram ? "Editar Programa" : "Adicionar à Programação"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="day">Dia/Frequência (ex: SEG À SEX)</Label>
                                <Input id="day" value={dayInfo} onChange={e => setDayInfo(e.target.value)} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="title">Título do Programa</Label>
                                <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="time">Horário (ex: 08:00)</Label>
                                <Input id="time" value={timeInfo} onChange={e => setTimeInfo(e.target.value)} required />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={saveProgramMutation.isPending}>
                                    {saveProgramMutation.isPending ? "Salvando..." : "Salvar"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Column 1 & 2: Schedule */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-primary" />
                                Grade de Programação
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border divide-y">
                                {loadingSchedule ? (
                                    <div className="p-8 text-center text-muted-foreground">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                                        Carregando programação...
                                    </div>
                                ) : schedule?.length === 0 ? (
                                    <div className="p-8 text-center text-muted-foreground italic">
                                        Nenhum programa cadastrado.
                                    </div>
                                ) : (
                                    schedule?.map(p => (
                                        <div key={p.id} className="p-4 flex items-center justify-between group hover:bg-muted/50 transition-colors">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                        {p.day_info}
                                                    </span>
                                                    <span className="text-sm font-black text-foreground">{p.time_info}</span>
                                                </div>
                                                <p className="font-bold text-lg">{p.title}</p>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="icon" variant="ghost" onClick={() => handleEdit(p)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => {
                                                    if (confirm("Deseja excluir este programa?")) {
                                                        deleteProgramMutation.mutate(p.id);
                                                    }
                                                }}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Column 3: Social & Global Settings */}
                <aside className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Video className="h-5 w-5 text-primary" />
                                "Onde Assistir"
                            </CardTitle>
                            <CardDescription>Links das redes sociais para o portal ao vivo.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="yt" className="flex items-center gap-2">
                                    <Youtube className="h-4 w-4 text-red-600" /> YouTube URL
                                </Label>
                                <Input 
                                    id="yt" 
                                    value={settings.youtube_url} 
                                    onChange={e => setSettings({...settings, youtube_url: e.target.value})} 
                                    placeholder="https://youtube.com/..."
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="fb" className="flex items-center gap-2">
                                    <Facebook className="h-4 w-4 text-blue-600" /> Facebook URL
                                </Label>
                                <Input 
                                    id="fb" 
                                    value={settings.facebook_url} 
                                    onChange={e => setSettings({...settings, facebook_url: e.target.value})} 
                                    placeholder="https://facebook.com/..."
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="ig" className="flex items-center gap-2">
                                    <Instagram className="h-4 w-4 text-pink-600" /> Instagram URL
                                </Label>
                                <Input 
                                    id="ig" 
                                    value={settings.instagram_url} 
                                    onChange={e => setSettings({...settings, instagram_url: e.target.value})} 
                                    placeholder="https://instagram.com/..."
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="radio" className="flex items-center gap-2">
                                    <RadioIcon className="h-4 w-4 text-primary" /> Rádio App/Streaming URL
                                </Label>
                                <Input 
                                    id="radio" 
                                    value={settings.radio_url} 
                                    onChange={e => setSettings({...settings, radio_url: e.target.value})} 
                                    placeholder="https://..."
                                />
                            </div>

                            <Separator />

                            <div className="grid gap-2">
                                <Label htmlFor="live_id">YouTube Video ID (Live Ativa)</Label>
                                <Input 
                                    id="live_id" 
                                    value={settings.active_live_id} 
                                    onChange={e => setSettings({...settings, active_live_id: e.target.value})} 
                                    placeholder="ex: JFfPyY8vOIs"
                                />
                                <p className="text-[10px] text-muted-foreground italic">
                                    Deixe em branco se não houver transmissão ativa no momento.
                                </p>
                            </div>

                            <Button 
                                className="w-full gap-2" 
                                onClick={() => saveSettingsMutation.mutate(settings)}
                                disabled={saveSettingsMutation.isPending}
                            >
                                <Save className="h-4 w-4" />
                                {saveSettingsMutation.isPending ? "Salvando..." : "Salvar Configurações"}
                            </Button>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
}
