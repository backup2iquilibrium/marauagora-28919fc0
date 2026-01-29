import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative w-full h-[500px] mb-16 rounded-xl overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2576&auto=format&fit=crop" // Placeholder for a city square/church
          alt="Marau Background"
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-slate-900/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight max-w-4xl drop-shadow-lg">
          Marau Agora: A voz da nossa comunidade
        </h1>
        <p className="text-lg md:text-xl text-slate-100 mb-8 max-w-2xl leading-relaxed drop-shadow-md">
          Seu portal confiável para notícias locais, cultura, esportes e eventos em Marau e região. Conectando pessoas através da informação de verdade.
        </p>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-8 rounded-md text-lg transition-all transform hover:scale-105"
        >
          Nossa História
        </Button>
      </div>
    </section>
  );
}
