export function Team() {
    const team = [
        {
            name: "Ana Souza",
            role: "Editora-Chefe",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop"
        },
        {
            name: "Carlos Mendes",
            role: "Jornalista Político",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2670&auto=format&fit=crop"
        },
        {
            name: "Julia Lima",
            role: "Cultura e Lazer",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2661&auto=format&fit=crop"
        },
        {
            name: "Roberto Silva",
            role: "Esportes",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2574&auto=format&fit=crop"
        }
    ];

    return (
        <section className="py-20 bg-white text-center">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Quem faz o Marau Agora</h2>
                <p className="text-slate-500 mb-12 max-w-2xl mx-auto">
                    Uma equipe dedicada de jornalistas e colunistas comprometidos com a verdade.
                </p>

                <div className="flex flex-wrap justify-center gap-12">
                    {team.map((member) => (
                        <div key={member.name} className="flex flex-col items-center">
                            <div className="w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-slate-100 shadow-sm">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                                />
                            </div>
                            <h3 className="font-bold text-lg text-slate-900">{member.name}</h3>
                            <p className="text-blue-600 text-sm font-medium">{member.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
