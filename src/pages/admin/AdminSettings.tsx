import * as React from "react";
import {
    Settings,
    Clock,
    Shield,
    Database,
    Save,
    HelpCircle,
    Smartphone,
    Video,
    Plus,
    Trash2,
    Pencil,
    Youtube,
    Facebook,
    Instagram,
    Radio as RadioIcon,
    Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import { useSettings } from "@/context/SettingsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";

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
    active_live_id: string;
};

export default function AdminSettings() {
    const queryClient = useQueryClient();
    const { carouselSpeed, setCarouselSpeed } = useSettings();
    const [localSpeed, setLocalSpeed] = React.useState(carouselSpeed / 1000);
    const [loading, setLoading] = React.useState(false);

    // --- Live Program States ---
    const [editingProgram, setEditingProgram] = React.useState<LiveProgram | null>(null);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [dayInfo, setDayInfo] = React.useState("");
    const [title, setTitle] = React.useState("");
    const [timeInfo, setTimeInfo] = React.useState("");

    // --- Live Settings States ---
    const [liveSettings, setLiveSettings] = React.useState<LiveSettings>({
        youtube_url: "",
        facebook_url: "",
        instagram_url: "",
        radio_url: "",
        active_live_id: ""
    });

    // --- Queries ---
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

    useQuery({
        queryKey: ["admin", "live_settings"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("site_settings")
                .select("*")
                .eq("key", "live_config")
                .single();
            if (error && error.code !== "PGRST116") throw error;
            if (data?.value) setLiveSettings(data.value as LiveSettings);
            return data;
        }
    });

    // --- Mutations ---
    const saveProgramMutation = useMutation({
        mutationFn: async (program: Partial<LiveProgram>) => {
            if (program.id) {
                const { error } = await supabase.from("live_programs").update(program).eq("id", program.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from("live_programs").insert([program]);
                if (error) throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "live_schedule"] });
            toast.success("Programação salva!");
            setIsDialogOpen(false);
            resetProgramForm();
        }
    });

    const deleteProgramMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from("live_programs").delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "live_schedule"] });
            toast.success("Programa excluído!");
        }
    });

    const saveLiveSettingsMutation = useMutation({
        mutationFn: async (newSettings: LiveSettings) => {
            const { error } = await supabase.from("site_settings").upsert({ 
                key: "live_config", 
                value: newSettings,
                updated_at: new Date().toISOString()
            }, { onConflict: "key" });
            if (error) throw error;
        },
        onSuccess: () => toast.success("Configurações de live salvas!")
    });

    const handleSaveGeneral = () => {
        setLoading(true);
        setTimeout(() => {
            setCarouselSpeed(localSpeed * 1000);
            setLoading(false);
            toast.success("Configurações gerais salvas!");
        }, 500);
    };

    const resetProgramForm = () => {
        setEditingProgram(null);
        setDayInfo("");
        setTitle("");
        setTimeInfo("");
    };

    const handleEditProgram = (p: LiveProgram) => {
        setEditingProgram(p);
        setDayInfo(p.day_info);
        setTitle(p.title);
        setTimeInfo(p.time_info);
        setIsDialogOpen(true);
    };

    return (
        <div className="p-6 max-w-5xl space-y-8">
            <div>
                <h1 className="text-2xl font-semibold">Configurações do Sistema</h1>
                <p className="text-sm text-muted-foreground">Ajuste as preferências globais e comportamentos do portal.</p>
            </div>

            <Tabs defaultValue="geral" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="geral" className="gap-2">
                        <Settings className="h-4 w-4" /> Geral
                    </TabsTrigger>
                    <TabsTrigger value="aovivo" className="gap-2">
                        <Video className="h-4 w-4" /> Ao Vivo
                    </TabsTrigger>
                    <TabsTrigger value="seguranca" className="gap-2">
                        <Shield className="h-4 w-4" /> Segurança
                    </TabsTrigger>
                </TabsList>

                {/* --- TAB GERAL --- */}
                <TabsContent value="geral" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Geral</CardTitle>
                            <CardDescription>Preferências básicas de interface e portal.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="speed">Velocidade do Carrossel (segundos)</Label>
                                <div className="flex gap-2 max-w-[200px]">
                                    <Input
                                        id="speed"
                                        type="number"
                                        value={localSpeed}
                                        onChange={(e) => setLocalSpeed(Number(e.target.value))}
                                    />
                                    <Button variant="outline" size="icon" className="shrink-0">
                                        <Clock className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Modo de Manutenção</Label>
                                    <p className="text-xs text-muted-foreground">Bloqueia o acesso público ao site.</p>
                                </div>
                                <Switch disabled />
                            </div>
                            <Button onClick={handleSaveGeneral} disabled={loading} className="gap-2">
                                <Save className="h-4 w-4" /> Salvar Alterações
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- TAB AO VIVO --- */}
                <TabsContent value="aovivo" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <Clock className="h-5 w-5 text-primary" /> Programação
                                        </CardTitle>
                                        <CardDescription>Gerencie a grade de programas da TV/Live.</CardDescription>
                                    </div>
                                    <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetProgramForm(); }}>
                                        <DialogTrigger asChild>
                                            <Button size="sm" className="gap-1">
                                                <Plus className="h-4 w-4" /> Novo
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader><DialogTitle>{editingProgram ? "Editar Programa" : "Adicionar à Programação"}</DialogTitle></DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="grid gap-2">
                                                    <Label>Dia/Frequência (ex: SEG À SEX)</Label>
                                                    <Input value={dayInfo} onChange={e => setDayInfo(e.target.value)} />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label>Título do Programa</Label>
                                                    <Input value={title} onChange={e => setTitle(e.target.value)} />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label>Horário (ex: 08:00)</Label>
                                                    <Input value={timeInfo} onChange={e => setTimeInfo(e.target.value)} />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button onClick={() => saveProgramMutation.mutate({
                                                    id: editingProgram?.id, day_info: dayInfo, title, time_info: timeInfo
                                                })} disabled={saveProgramMutation.isPending}>Salvar</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-md border divide-y">
                                        {loadingSchedule ? <div className="p-4 text-center"><Loader2 className="h-4 w-4 animate-spin mx-auto" /></div> : 
                                         schedule?.map(p => (
                                            <div key={p.id} className="p-3 flex items-center justify-between group">
                                                <div className="text-sm">
                                                    <span className="font-bold text-primary mr-2 uppercase text-[10px]">{p.day_info}</span>
                                                    <span className="font-medium">{p.title}</span>
                                                    <span className="ml-2 text-muted-foreground">({p.time_info})</span>
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEditProgram(p)}><Pencil className="h-3 w-3" /></Button>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => { if(confirm("Excluir?")) deleteProgramMutation.mutate(p.id); }}><Trash2 className="h-3 w-3" /></Button>
                                                </div>
                                            </div>
                                         ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Onde Assistir (Links)</CardTitle>
                                <CardDescription>URLs das redes sociais e streaming.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label className="flex items-center gap-2"><Youtube className="h-3.5 w-3.5 text-red-600" /> YouTube</Label>
                                    <Input value={liveSettings.youtube_url} onChange={e => setLiveSettings({...liveSettings, youtube_url: e.target.value})} placeholder="URL" />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="flex items-center gap-2"><Facebook className="h-3.5 w-3.5 text-blue-600" /> Facebook</Label>
                                    <Input value={liveSettings.facebook_url} onChange={e => setLiveSettings({...liveSettings, facebook_url: e.target.value})} placeholder="URL" />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="flex items-center gap-2"><Instagram className="h-3.5 w-3.5 text-pink-600" /> Instagram</Label>
                                    <Input value={liveSettings.instagram_url} onChange={e => setLiveSettings({...liveSettings, instagram_url: e.target.value})} placeholder="URL" />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="flex items-center gap-2"><RadioIcon className="h-3.5 w-3.5 text-primary" /> Rádio</Label>
                                    <Input value={liveSettings.radio_url} onChange={e => setLiveSettings({...liveSettings, radio_url: e.target.value})} placeholder="URL" />
                                </div>
                                <Separator />
                                <div className="grid gap-2">
                                    <Label>ID do Vídeo YouTube (Live)</Label>
                                    <Input value={liveSettings.active_live_id} onChange={e => setLiveSettings({...liveSettings, active_live_id: e.target.value})} placeholder="ex: JFfPyY8vOIs" />
                                </div>
                                <Button className="w-full" onClick={() => saveLiveSettingsMutation.mutate(liveSettings)} disabled={saveLiveSettingsMutation.isPending}>Salvar Links</Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* --- TAB SEGURANÇA --- */}
                <TabsContent value="seguranca" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Segurança</CardTitle>
                            <CardDescription>Gerencie políticas de autenticação.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5"><Label>Autenticação em Duas Etapas (2FA)</Label></div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5"><Label>Logs de Auditoria</Label></div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
