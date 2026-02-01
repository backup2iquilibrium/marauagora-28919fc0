import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
    Search,
    MoreVertical,
    User,
    CheckCircle2,
    XCircle,
    Mail,
    Building2,
    Calendar
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
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

async function fetchUsers(q = "") {
    let query = supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

    if (q.trim()) {
        query = query.ilike("display_name", `%${q.trim()}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
}

export default function AdminUsers() {
    const [q, setQ] = React.useState("");

    const usersQuery = useQuery({
        queryKey: ["admin_users", q],
        queryFn: () => fetchUsers(q),
    });

    const toggleVerify = async (id: string, current: boolean) => {
        const { error } = await supabase
            .from("profiles")
            .update({ is_verified: !current })
            .eq("id", id);

        if (error) {
            toast.error("Erro ao atualizar status");
        } else {
            toast.success(current ? "Selo removido" : "Usuário verificado");
            usersQuery.refetch();
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Gerenciamento de Usuários</h1>
                <p className="text-sm text-muted-foreground">Visualize e modifique os perfis cadastrados no portal.</p>
            </div>

            <Card className="p-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nome..."
                        className="pl-9"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                </div>
            </Card>

            <div className="border rounded-lg bg-card overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Usuário</TableHead>
                            <TableHead>Empresa</TableHead>
                            <TableHead>Cadastro</TableHead>
                            <TableHead>Selo</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {usersQuery.isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Carregando usuários...</TableCell>
                            </TableRow>
                        ) : usersQuery.data?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Nenhum usuário encontrado.</TableCell>
                            </TableRow>
                        ) : (
                            usersQuery.data?.map((user: any) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={user.avatar_url} />
                                                <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium text-sm">{user.display_name || "Sem nome"}</div>
                                                <div className="text-[10px] text-muted-foreground truncate max-w-[150px]">{user.id}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Building2 className="h-3 w-3" />
                                            {user.company_name || "—"}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            {format(new Date(user.created_at), "dd/MM/yy")}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {user.is_verified ? (
                                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none gap-1">
                                                <CheckCircle2 className="h-3 w-3" /> Verificado
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-muted-foreground gap-1">
                                                <XCircle className="h-3 w-3" /> Sem selo
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="gap-2" onClick={() => toggleVerify(user.id, user.is_verified)}>
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    {user.is_verified ? "Remover Verificação" : "Tornar Verificado"}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2 text-destructive" onClick={() => toast.info("Exclusão de usuário via Admin desabilitada por segurança")}>
                                                    <XCircle className="h-4 w-4" /> Bloquear
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
        </div>
    );
}
