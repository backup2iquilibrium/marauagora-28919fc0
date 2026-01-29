import { ComponentType } from "react";
import { Mic, Globe, Users } from "lucide-react";

interface Milestone {
    year: string;
    title: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
}

export function OurJourney() {
    const milestones: Milestone[] = [
        {
            year: "2010",
            title: "O Início do Blog",
            description: "Tudo começou como um pequeno blog opinativo sobre a política local, escrito por um grupo de estudantes de jornalismo apaixonados por Marau.",
            icon: Mic
        },
        {
            year: "2015",
            title: "Lançamento do Portal",
            description: "Profissionalização da equipe e lançamento do site oficial, ampliando a cobertura para esportes, cultura e segurança pública.",
            icon: Globe
        },
        {
            year: "2023",
            title: "Expansão Regional",
            description: "O Marau Agora se consolida como uma das maiores fontes de informação da região, inaugurando sua nova sede e estúdio de podcast.",
            icon: Users
        }
    ];

    return (
        <section className="py-16 bg-slate-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-slate-900 mb-12">Nossa Jornada</h2>

                <div className="relative pl-8 md:pl-0">
                    {/* Vertical Line */}
                    <div className="absolute left-8 md:left-[17px] top-4 bottom-4 w-0.5 bg-slate-200 hidden md:block" />

                    <div className="space-y-12">
                        {milestones.map((m, idx) => (
                            <div key={m.year} className="relative flex flex-col md:flex-row gap-8 items-start">

                                {/* Timeline Node */}
                                <div className="absolute left-[-16px] md:left-0 w-9 h-9 rounded-full bg-blue-600 border-4 border-white shadow-sm flex items-center justify-center z-10">
                                    <m.icon className="w-4 h-4 text-white" />
                                </div>

                                <div className="md:ml-16 pt-1">
                                    <span className="text-blue-600 font-bold text-sm tracking-wide">{m.year}</span>
                                    <h3 className="text-xl font-bold text-slate-900 mt-1 mb-2">{m.title}</h3>
                                    <p className="text-slate-600 max-w-2xl text-sm leading-relaxed">
                                        {m.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
