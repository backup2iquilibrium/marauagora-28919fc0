import { Flag, Eye, CheckCircle } from "lucide-react";

export function MissionValues() {
    const cards = [
        {
            icon: Flag,
            title: "Missão",
            description: "Informar com isenção, agilidade e responsabilidade social, contribuindo para o desenvolvimento de Marau."
        },
        {
            icon: Eye,
            title: "Visão",
            description: "Ser a principal referência em jornalismo local no norte do RS, reconhecido pela credibilidade."
        },
        {
            icon: CheckCircle,
            title: "Valores",
            description: "Ética inegociável, transparência total e compromisso inabalável com a comunidade marauense."
        }
    ];

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Nossa Missão e Valores</h2>
                <p className="text-slate-600 max-w-2xl mb-12">
                    Fundado com o propósito de fortalecer a identidade local, o Marau Agora se dedica a trazer jornalismo de qualidade, fiscalizando o poder público e valorizando as histórias da nossa gente.
                </p>

                <div className="grid md:grid-cols-3 gap-8">
                    {cards.map((card) => (
                        <div key={card.title} className="bg-white border rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                                <card.icon className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{card.title}</h3>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                {card.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
