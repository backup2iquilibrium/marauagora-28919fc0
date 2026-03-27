import * as React from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export function Newsletter() {
    const [email, setEmail] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = email.trim().toLowerCase();
        
        if (!trimmed || !trimmed.includes("@")) {
            toast.error("Por favor, insira um e-mail válido.");
            return;
        }

        setLoading(true);
        try {
            // Check if already subscribed to avoid duplicates (optional, Supabase unique constraint will handle too)
            const { error } = await supabase
                .from("newsletter_subscribers")
                .insert([{ email: trimmed }]);
            
            if (error) {
                if (error.code === "23505") { // Unique violation
                    toast.info("Este e-mail já está inscrito em nossa newsletter!");
                } else {
                    throw error;
                }
            } else {
                toast.success("Inscrição realizada com sucesso! Você receberá as próximas notícias.");
                setEmail("");
            }
        } catch (err: any) {
            console.error("Newsletter error:", err);
            toast.error("Erro ao realizar a inscrição. Tente novamente mais tarde.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-16 bg-blue-600 text-white">
            <div className="container mx-auto px-4">
                <div className="bg-blue-500/30 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-blue-400/30">
                    <div className="max-w-xl">
                        <h2 className="text-3xl font-bold mb-2">Faça parte da nossa história</h2>
                        <p className="text-blue-50 text-lg leading-relaxed">
                            Assine nossa newsletter gratuita e receba as principais notícias de Marau diretamente no seu e-mail toda manhã.
                        </p>
                    </div>

                    <form 
                        onSubmit={handleSubmit}
                        className="w-full md:w-auto flex flex-col gap-3 min-w-[350px]"
                    >
                        <Input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Seu melhor e-mail"
                            className="bg-blue-700/50 border-blue-400 placeholder:text-blue-200 text-white focus-visible:ring-white"
                        />
                        <Button 
                            disabled={loading}
                            className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            {loading ? "Processando..." : "Inscrever-se Agora"}
                        </Button>
                        <p className="text-xs text-blue-200 text-center">
                            Respeitamos sua privacidade. Cancele quando quiser.
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
}
