import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Plus,
    Search,
    MoreVertical,
    Pencil,
    Trash2,
    Briefcase,
    Building,
    MapPin,
    Loader2
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
import { Card } from "@/components/ui/card";
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

export default function AdminJobs() {
    const queryClient = useQueryClient();
    const [jobsQ, setJobsQ] = React.useState("");

    // Jobs State
    const [isJobDialogOpen, setIsJobDialogOpen] = React.useState(false);
    const [editingJob, setEditingJob] = React.useState<any>(null);
    interface JobFormData {
        title: string;
        company: string;
        employment_type: string;
        description: string;
        location: string;
        category: string;
        is_featured: boolean;
        requirements: string;
        benefits: string;
        salary_range: string;
        tags: string[];
        application_link: string;
        application_type: string;
    }

    const [jobFormData, setJobFormData] = React.useState<JobFormData>({
        title: "",
        company: "",
        employment_type: "Efetivo",
        description: "",
        location: "Marau - RS",
        category: "Serviços",
        is_featured: false,
        requirements: "",
        benefits: "",
        salary_range: "",
        tags: [],
        application_link: "",
        application_type: "external",
    });

    const jobsQuery = useQuery({
        queryKey: ["admin_jobs", { jobsQ }],
        queryFn: async () => {
            let query = supabase.from("jobs").select("*").order("posted_at", { ascending: false });
            if (jobsQ.trim()) {
                query = query.or(`title.ilike.%${jobsQ.trim()}%,company.ilike.%${jobsQ.trim()}%`);
            }
            const { data, error } = await query;
            if (error) throw error;
            return data || [];
        },
    });

    const jobSaveMutation = useMutation({
        mutationFn: async (data: JobFormData) => {
            const slug = data.title
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-") + "-" + Math.random().toString(36).substring(2, 6);

            if (editingJob) {
                const { error } = await supabase
                    .from("jobs")
                    .update(data)
                    .eq("id", editingJob.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("jobs")
                    .insert([{ ...data, slug }]);
                if (error) throw error;
            }
        },
        onSuccess: () => {
            toast.success(editingJob ? "Vaga atualizada!" : "Vaga criada!");
            setIsJobDialogOpen(false);
            setEditingJob(null);
            queryClient.invalidateQueries({ queryKey: ["admin_jobs"] });
            queryClient.invalidateQueries({ queryKey: ["jobs-list"] });
        },
        onError: (error: any) => {
            console.error(error);
            toast.error("Erro ao salvar vaga", { description: error.message });
        },
    });

    const jobDeleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from("jobs").delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            toast.success("Vaga excluída com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["admin_jobs"] });
        },
        onError: (error: any) => {
            toast.error("Erro ao excluir vaga", { description: error.message });
        },
    });

    const handleOpenAddJob = () => {
        setEditingJob(null);
        setJobFormData({
            title: "",
            company: "",
            employment_type: "Efetivo",
            description: "",
            location: "Marau - RS",
            category: "Serviços",
            is_featured: false,
            requirements: "",
            benefits: "",
            salary_range: "",
            tags: [],
            application_link: "",
            application_type: "external",
        });
        setIsJobDialogOpen(true);
    };

    const handleOpenEditJob = (job: any) => {
        setEditingJob(job);
        setJobFormData({
            title: job.title || "",
            company: job.company || "",
            employment_type: job.employment_type || "Efetivo",
            description: job.description || "",
            location: job.location || "Marau - RS",
            category: job.category || "Serviços",
            is_featured: job.is_featured || false,
            requirements: job.requirements || "",
            benefits: job.benefits || "",
            salary_range: job.salary_range || "",
            tags: job.tags || [],
            application_link: job.application_link || "",
            application_type: job.application_type || "external",
        });
        setIsJobDialogOpen(true);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Vagas de Emprego</h1>
                    <p className="text-sm text-muted-foreground">Gerencie as oportunidades de trabalho listadas no portal.</p>
                </div>
                <Button className="gap-2" onClick={handleOpenAddJob}>
                    <Plus className="h-4 w-4" />
                    Nova Vaga
                </Button>
            </div>

            <Card className="p-4 bg-card">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por cargo ou empresa..."
                        className="pl-9"
                        value={jobsQ}
                        onChange={(e) => setJobsQ(e.target.value)}
                    />
                </div>
            </Card>

            <div className="border rounded-lg bg-card overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Vaga / Empresa</TableHead>
                            <TableHead>Tipo / Local</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {jobsQuery.isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                                    Carregando vagas...
                                </TableCell>
                            </TableRow>
                        ) : (jobsQuery.data || []).length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Nenhuma vaga encontrada.</TableCell>
                            </TableRow>
                        ) : (
                            jobsQuery.data?.map((job: any) => (
                                <TableRow key={job.id} className="group">
                                    <TableCell>
                                        <div className="font-semibold flex items-center gap-2">
                                            {job.title}
                                            {job.is_featured && <Badge variant="secondary" className="text-[8px] h-3 px-1 uppercase">Destaque</Badge>}
                                        </div>
                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Building className="h-3 w-3" /> {job.company}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">{job.employment_type}</div>
                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                            <MapPin className="h-3 w-3" /> {job.location}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{job.category}</Badge>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {new Date(job.posted_at).toLocaleDateString("pt-BR")}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[160px]">
                                                <DropdownMenuItem className="gap-2" onClick={() => handleOpenEditJob(job)}>
                                                    <Pencil className="h-4 w-4" /> Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="gap-2 text-destructive"
                                                    onClick={() => confirm("Excluir vaga?") && jobDeleteMutation.mutate(job.id)}
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
                                        <SelectItem value="Educação">Educação</SelectItem>
                                        <SelectItem value="Saúde">Saúde</SelectItem>
                                        <SelectItem value="Gastronomia / Alimentos">Gastronomia / Alimentos</SelectItem>
                                        <SelectItem value="Transporte / Logística">Transporte / Logística</SelectItem>
                                        <SelectItem value="Construção Civil">Construção Civil</SelectItem>
                                        <SelectItem value="Administrativo">Administrativo</SelectItem>
                                        <SelectItem value="Vendas / Marketing">Vendas / Marketing</SelectItem>
                                        <SelectItem value="Rural / Agronegócio">Rural / Agronegócio</SelectItem>
                                        <SelectItem value="Recursos Humanos">Recursos Humanos</SelectItem>
                                        <SelectItem value="Financeiro / Jurídico">Financeiro / Jurídico</SelectItem>
                                        <SelectItem value="Artes / Design">Artes / Design</SelectItem>
                                        <SelectItem value="Outros">Outros</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="application_type">Tipo de Candidatura</Label>
                                <Select 
                                    value={jobFormData.application_type} 
                                    onValueChange={(v) => setJobFormData({ ...jobFormData, application_type: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                        <SelectItem value="email">E-mail</SelectItem>
                                        <SelectItem value="external">Site / Link Externo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="application_link">Link / Contato para Candidatura</Label>
                                <Input
                                    id="application_link"
                                    value={jobFormData.application_link}
                                    onChange={(e) => setJobFormData({ ...jobFormData, application_link: e.target.value })}
                                    placeholder={
                                        jobFormData.application_type === 'whatsapp' ? "DDD + número (ex: 5499999999)" :
                                        jobFormData.application_type === 'email' ? "email@empresa.com" :
                                        "https://..."
                                    }
                                />
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
