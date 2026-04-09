import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Mail, Trash2, CheckCircle2, MessageSquare, 
  Search, Filter, Loader2, Eye, User, Calendar
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";

interface ContactMessage {
  id: string;
  created_at: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied";
}

export default function AdminMessages() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [selectedMessage, setSelectedMessage] = React.useState<ContactMessage | null>(null);

  const { data: messages, isLoading } = useQuery({
    queryKey: ["admin", "contact_messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ContactMessage[];
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ContactMessage["status"] }) => {
      const { error } = await supabase
        .from("contact_messages")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "contact_messages"] });
      toast.success("Status atualizado");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "contact_messages"] });
      toast.success("Mensagem excluída");
      setSelectedMessage(null);
    }
  });

  const filteredMessages = messages?.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewMessage = (m: ContactMessage) => {
    setSelectedMessage(m);
    if (m.status === "new") {
      updateStatusMutation.mutate({ id: m.id, status: "read" });
    }
  };

  const getStatusBadge = (status: ContactMessage["status"]) => {
    switch (status) {
      case "new": return <Badge className="bg-blue-500">Novo</Badge>;
      case "read": return <Badge variant="outline">Lido</Badge>;
      case "replied": return <Badge className="bg-green-600">Respondido</Badge>;
      default: return null;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Mail className="h-6 w-6 text-primary" /> Mensagens do Fale Conosco
        </h1>
        <p className="text-sm text-muted-foreground">Gerencie o contato recebido via portal.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nome, email ou assunto..." 
            className="pl-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="new">Novas</SelectItem>
              <SelectItem value="read">Lidas</SelectItem>
              <SelectItem value="replied">Respondidas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Remetente</TableHead>
                <TableHead>Assunto</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    <Loader2 className="animate-spin h-6 w-6 mx-auto mb-2" />
                    Carregando mensagens...
                  </TableCell>
                </TableRow>
              ) : filteredMessages?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    Nenhuma mensagem encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                filteredMessages?.map((m) => (
                  <TableRow key={m.id} className={m.status === "new" ? "bg-blue-50/50" : ""}>
                    <TableCell>
                      {m.status === "new" && <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{m.name}</div>
                      <div className="text-xs text-muted-foreground">{m.email}</div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{m.subject}</TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(m.created_at), "dd/MM/yy HH:mm", { locale: ptBR })}
                    </TableCell>
                    <TableCell>{getStatusBadge(m.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleViewMessage(m)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive" 
                          onClick={() => { if(confirm("Excluir mensagem?")) deleteMutation.mutate(m.id); }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedMessage} onOpenChange={open => !open && setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl">
          {selectedMessage && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between mb-2">
                  {getStatusBadge(selectedMessage.status)}
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(selectedMessage.created_at), "PPPP 'às' HH:mm", { locale: ptBR })}
                  </span>
                </div>
                <DialogTitle className="text-xl">{selectedMessage.subject}</DialogTitle>
                <div className="flex items-center gap-2 mt-2 p-2 bg-muted rounded-md border">
                  <User className="h-8 w-8 p-1 bg-background rounded-full border" />
                  <div className="text-sm">
                    <p className="font-bold">{selectedMessage.name}</p>
                    <p className="text-muted-foreground">{selectedMessage.email}</p>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="mt-4 p-4 rounded-lg bg-slate-50 border whitespace-pre-wrap text-sm leading-relaxed min-h-[150px]">
                {selectedMessage.message}
              </div>

              <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2">
                <div className="flex flex-col sm:flex-row gap-2 mr-auto">
                  <Button 
                    variant="outline" 
                    className="gap-2 bg-red-50 hover:bg-red-100 text-red-700 border-red-200" 
                    onClick={() => {
                      if (!selectedMessage) return;
                      const subject = encodeURIComponent(`RE: ${selectedMessage.subject}`);
                      const messageBody = selectedMessage.message.length > 800 
                        ? selectedMessage.message.substring(0, 800) + "..." 
                        : selectedMessage.message;
                      const body = encodeURIComponent(`\r\n\r\n\r\n--- Mensagem Original ---\r\nDe: ${selectedMessage.name}\r\nEm: ${format(new Date(selectedMessage.created_at), "dd/MM/yyyy HH:mm")}\r\n\r\n${messageBody}`);
                      
                      // Abrir Gmail diretamente no navegador
                      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${selectedMessage.email}&su=${subject}&body=${body}`;
                      window.open(gmailUrl, '_blank');
                      
                      toast.info("Abrindo Gmail...");
                    }}
                  >
                    <Mail className="h-4 w-4" /> Responder via Gmail
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="gap-2 text-muted-foreground"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedMessage.email);
                      toast.success("E-mail copiado!");
                    }}
                  >
                    <User className="h-4 w-4" /> Copiar E-mail
                  </Button>
                </div>
                {selectedMessage.status !== "replied" && (
                   <Button 
                    variant="secondary" 
                    className="gap-2 text-green-700 bg-green-50 border-green-200 hover:bg-green-100"
                    onClick={() => updateStatusMutation.mutate({ id: selectedMessage.id, status: "replied" })}
                  >
                    <CheckCircle2 className="h-4 w-4" /> Marcar como Respondido
                  </Button>
                )}
                <Button variant="ghost" onClick={() => setSelectedMessage(null)}>Fechar</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
