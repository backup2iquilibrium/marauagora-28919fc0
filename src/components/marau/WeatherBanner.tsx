import { CloudSun, Droplets, MapPin, Wind } from "lucide-react";

export function WeatherBanner() {
  return (
    <section className="mb-8 bg-card rounded-xl shadow-sm border overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-primary-glow p-6 text-primary-foreground relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <CloudSun className="h-24 w-24" aria-hidden="true" />
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <CloudSun className="h-14 w-14 text-secondary" aria-hidden="true" />
            <div>
              <h2 className="text-2xl font-bold font-serif leading-none flex items-center gap-2">
                <MapPin className="h-5 w-5 text-secondary" aria-hidden="true" />
                Marau, RS
              </h2>
              <p className="text-primary-foreground/80 text-sm mt-1">Quarta-feira, 25 de Outubro</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 bg-background/10 rounded-lg px-6 py-3 backdrop-blur-sm border border-background/10">
            <div className="text-center">
              <span className="text-4xl font-bold block">24°C</span>
              <span className="text-xs text-primary-foreground/80 uppercase tracking-wider">Atual</span>
            </div>
            <div className="hidden sm:block h-10 w-px bg-background/15" />
            <div className="text-center hidden sm:block">
              <span className="text-xl font-bold block">26°C</span>
              <span className="text-xs text-primary-foreground/80 uppercase tracking-wider">Sensação</span>
            </div>
            <div className="text-center hidden sm:block">
              <span className="text-xl font-bold block flex items-center justify-center gap-2">
                <Droplets className="h-4 w-4 text-secondary" aria-hidden="true" /> 62%
              </span>
              <span className="text-xs text-primary-foreground/80 uppercase tracking-wider">Umidade</span>
            </div>
            <div className="text-center hidden sm:block">
              <span className="text-xl font-bold block flex items-center justify-center gap-2">
                <Wind className="h-4 w-4 text-secondary" aria-hidden="true" /> 12 <span className="text-xs">km/h</span>
              </span>
              <span className="text-xs text-primary-foreground/80 uppercase tracking-wider">Vento</span>
            </div>
          </div>

          <div className="hidden md:flex gap-4">
            {[
              { day: "Qui", temp: "22°", tone: "text-primary-foreground" },
              { day: "Sex", temp: "19°", tone: "text-primary-foreground" },
              { day: "Sáb", temp: "25°", tone: "text-secondary" },
              { day: "Dom", temp: "27°", tone: "text-secondary" },
            ].map((f) => (
              <div key={f.day} className="text-center bg-background/10 rounded p-2 min-w-[70px] border border-background/10">
                <span className="text-xs text-primary-foreground/70 block mb-1">{f.day}</span>
                <CloudSun className={`h-5 w-5 mx-auto mb-1 ${f.tone}`} aria-hidden="true" />
                <span className="font-bold text-sm block">{f.temp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
