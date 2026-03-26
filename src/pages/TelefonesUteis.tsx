import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Phone, Shield, Building, Heart, MapPin, Search } from "lucide-react";

import { TopBar } from "@/components/marau/TopBar";
import { SiteHeader } from "@/components/marau/SiteHeader";
import { Footer } from "@/components/marau/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

function mapIconName(name: string) {
    switch (name?.toLowerCase()) {
        case "shield": return <Shield className="h-5 w-5 text-blue-600" />;
        case "siren": return <Shield className="h-5 w-5 text-red-600" fill="currentColor" />;
        case "heart": return <Heart className="h-5 w-5 text-red-500" />;
        case "landmark": return <Building className="h-5 w-5 text-slate-600" />;
        default: return <Phone className="h-5 w-5 text-emerald-600" />;
    }
}

export default function TelefonesUteis() {
    const [q, setQ] = React.useState("");

    const phonesQuery = useQuery({
        queryKey: ["public_emergency_numbers"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("emergency_numbers")
                .select("*")
                .eq("is_published", true)
                .order("sort_order", { ascending: true })
                .order("category", { ascending: true });
            
            if (error) throw error;
            return data || [];
        },
        staleTime: 1000 * 60 * 10,
    });

    const phones = phonesQuery.data || [];
    
    const filteredPhones = React.useMemo(() => {
        if (!q.trim()) return phones;
        const term = q.trim().toLowerCase();
        return phones.filter(p => 
            p.label.toLowerCase().includes(term) || 
            p.number.toLowerCase().includes(term) || 
            (p.description && p.description.toLowerCase().includes(term))
        );
    }, [phones, q]);

    // Agrupar por categoria
    const grouped = React.useMemo(() => {
        const groups: Record<string, typeof phones> = {};
        for (const phone of filteredPhones) {
            if (!groups[phone.category]) groups[phone.category] = [];
            groups[phone.category].push(phone);
        }
        return groups;
    }, [filteredPhones]);

    // Ordenar categorias (Emergência e Segurança primeiro)
    const categoryOrder = ["Emergência", "Segurança", "Saúde", "Administrativo", "Serviços Públicos", "Transporte", "Outros"];
    const sortedCategories = Object.keys(grouped).sort((a, b) => {
        const indexA = categoryOrder.indexOf(a);
        const indexB = categoryOrder.indexOf(b);
        const posA = indexA === -1 ? 999 : indexA;
        const posB = indexB === -1 ? 999 : indexB;
        return posA - posB;
    });

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <TopBar />
            <SiteHeader logoUrl="/logo.png" />

            <main className="container flex-1 py-8 px-4 max-w-5xl mx-auto space-y-8">
                <nav className="text-sm text-muted-foreground mb-4">
                    <Link to="/" className="hover:text-foreground">Início</Link>
                    <span className="mx-2">/</span>
                    <span className="text-foreground">Serviços e Utilidade</span>
                    <span className="mx-2">/</span>
                    <span className="text-foreground">Telefones Úteis</span>
                </nav>

                <header>
                    <div className="flex items-center gap-3 mb-2">
                        <Phone className="h-6 w-6 text-primary" />
                        <h1 className="text-3xl font-black tracking-tight">Telefones Úteis</h1>
                    </div>
                    <p className="text-muted-foreground text-lg">
                        Encontre rapidamente os contatos de emergência, segurança e serviços públicos da cidade.
                    </p>
                </header>

                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar por órgão, serviço ou número..." 
                        className="pl-9 bg-card h-12 rounded-full border-muted-foreground/20 shadow-sm"
                        value={q}
                        onChange={e => setQ(e.target.value)}
                    />
                </div>

                {phonesQuery.isLoading ? (
                    <div className="text-center py-20 text-muted-foreground">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        Carregando contatos...
                    </div>
                ) : filteredPhones.length === 0 ? (
                    <div className="text-center py-20 bg-card rounded-xl border">
                        <Phone className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-lg font-medium text-muted-foreground">Nenhum telefone encontrado.</p>
                        {q && <Button variant="link" onClick={() => setQ("")}>Limpar busca</Button>}
                    </div>
                ) : (
                    <div className="space-y-12">
                        {sortedCategories.map(cat => (
                            <section key={cat} className="space-y-4">
                                <h2 className="text-xl font-bold flex items-center gap-2 pb-2 border-b">
                                    <Badge variant="outline" className="px-3 py-1 text-sm bg-muted/50 rounded-full">
                                        {cat}
                                    </Badge>
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {grouped[cat].map(phone => (
                                        <Card key={phone.id} className="overflow-hidden hover:shadow-md transition-shadow group">
                                            <CardContent className="p-0">
                                                <a 
                                                    href={`tel:${phone.number.replace(/\D/g, "")}`} 
                                                    className="flex items-start gap-4 p-5 w-full h-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                                                >
                                                    <div className="bg-muted p-3 rounded-full shrink-0 group-hover:scale-110 transition-transform">
                                                        {mapIconName(phone.icon)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-bold text-base line-clamp-1">{phone.label}</h3>
                                                        <p className="text-primary font-black text-xl tracking-tight mt-1">{phone.number}</p>
                                                        {phone.description && (
                                                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                                                {phone.description}
                                                            </p>
                                                        )}
                                                        {phone.city && phone.city !== "Marau" && (
                                                            <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                                                                <MapPin className="h-3 w-3" /> {phone.city}
                                                            </div>
                                                        )}
                                                    </div>
                                                </a>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </main>

            <Footer logoUrl="/logo.png" />
        </div>
    );
}
