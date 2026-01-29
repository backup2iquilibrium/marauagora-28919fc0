import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
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

                    <div className="w-full md:w-auto flex flex-col gap-3 min-w-[350px]">
                        <Input
                            placeholder="Seu melhor e-mail"
                            className="bg-blue-700/50 border-blue-400 placeholder:text-blue-200 text-white focus-visible:ring-white"
                        />
                        <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold">
                            Inscrever-se Agora
                        </Button>
                        <p className="text-xs text-blue-200 text-center">
                            Respeitamos sua privacidade. Cancele quando quiser.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
