import { JobItem } from "./types";

const jobs: JobItem[] = [
  { title: "Auxiliar Administrativo", company: "Empresa Metalúrgica", location: "Centro", typeLabel: "CLT" },
  { title: "Vendedor Externo", company: "Distribuidora de Bebidas", location: "Zona Norte", typeLabel: "Comissão" },
  { title: "Técnico em Enfermagem", company: "Hospital Cristo Redentor", typeLabel: "Plantão" },
  { title: "Cozinheiro(a)", company: "Restaurante Sabor & Arte", typeLabel: "Noite" },
];

export function Jobs() {
  return (
    <section>
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h2 className="text-2xl font-serif font-bold text-primary">Vagas de Emprego</h2>
        <a className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="#">
          Ver todas as vagas
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((j) => (
          <article key={j.title} className="bg-card p-5 rounded border shadow-sm">
            <h4 className="font-bold text-lg text-primary mb-1">{j.title}</h4>
            <p className="text-sm text-muted-foreground mb-3">
              {j.company}
              {j.location ? ` • ${j.location}` : ""}
            </p>

            <div className="flex justify-between items-center">
              <span className="text-xs bg-muted text-foreground px-2 py-1 rounded">{j.typeLabel}</span>
              <a className="text-sm font-medium underline text-foreground" href="#">
                Detalhes
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
