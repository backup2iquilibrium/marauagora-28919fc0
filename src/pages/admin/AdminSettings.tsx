import * as React from "react";
import {
    Settings,
    Clock,
    Shield,
    Bell,
    Database,
    Save,
    HelpCircle,
    Smartphone
} from "lucide-react";
import { toast } from "sonner";

import { useSettings } from "@/context/SettingsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function AdminSettings() {
    const { carouselSpeed, setCarouselSpeed } = useSettings();
    const [localSpeed, setLocalSpeed] = React.useState(carouselSpeed / 1000);
    const [loading, setLoading] = React.useState(false);

    const handleSaveGeneral = () => {
        setLoading(true);
        setTimeout(() => {
            setCarouselSpeed(localSpeed * 1000);
            setLoading(false);
            toast.success("Configurações gerais salvas!");
        }, 500);
    };

    return (
        <div className="p-6 max-w-4xl space-y-8">
            <div>
                <h1 className="text-2xl font-semibold">Configurações do Sistema</h1>
                <p className="text-sm text-muted-foreground">Ajuste as preferências globais e comportamentos do portal.</p>
            </div>

            <div className="grid gap-6">
                {/* Geral */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Settings className="h-5 w-5 text-primary" />
                            <CardTitle>Geral</CardTitle>
                        </div>
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
                                <Button variant="outline" size="icon" className="shrink-0" title="Valor padrão: 10">
                                    <Clock className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">Tempo base para troca automática de slides no destaque da Home.</p>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Modo de Manutenção</Label>
                                <p className="text-xs text-muted-foreground">Exibe uma página de aviso e bloqueia o acesso público ao site.</p>
                            </div>
                            <Switch disabled />
                        </div>

                        <Button onClick={handleSaveGeneral} disabled={loading} className="gap-2">
                            <Save className="h-4 w-4" />
                            {loading ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                    </CardContent>
                </Card>

                {/* Segurança */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            <CardTitle>Segurança</CardTitle>
                        </div>
                        <CardDescription>Gerencie políticas de autenticação e permissões.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Autenticação em Duas Etapas (2FA)</Label>
                                <p className="text-xs text-muted-foreground">Exigir código adicional no login de administradores.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Logs de Auditoria</Label>
                                <p className="text-xs text-muted-foreground">Gravar todas as ações críticas realizadas no painel.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </CardContent>
                </Card>

                {/* Mobile & App */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Smartphone className="h-5 w-5 text-primary" />
                            <CardTitle>Notificações Push</CardTitle>
                        </div>
                        <CardDescription>Configure o envio de alertas para dispositivos móveis.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg flex gap-3 items-start">
                            <HelpCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                            <div className="text-xs text-muted-foreground leading-relaxed">
                                As notificações push dependem da integração com o Google Firebase (FCM).
                                Para habilitar, você deve carregar o arquivo de credenciais `google-services.json` no servidor.
                            </div>
                        </div>
                        <Button variant="outline" disabled>Configurar Firebase</Button>
                    </CardContent>
                </Card>

                {/* Backup */}
                <Card className="border-destructive/20 bg-destructive/5">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-destructive" />
                            <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">Ações irreversíveis que afetam todo o banco de dados.</p>
                        <Button variant="destructive" size="sm" onClick={() => toast.error("Função restrita ao super-admin")}>Limpar Cache do Sistema</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
