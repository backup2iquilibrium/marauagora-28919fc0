import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

async function fetchHomeJobs() {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("posted_at", { ascending: false })
    .limit(4);
  if (error) throw error;
  return data || [];
}

export function Jobs() {
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["home-jobs-list"],
    queryFn: fetchHomeJobs,
  });

  if (isLoading) {
    return <div className="h-40 bg-muted animate-pulse rounded-lg" />;
  }

  if (jobs.length === 0) return null;

  return (
    <section>
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h2 className="text-2xl font-serif font-bold text-primary">Vagas de Emprego</h2>
        <Link
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          to="/vagas"
        >
          Ver todas as vagas
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((j) => (
          <article key={j.id} className="bg-card p-5 rounded border shadow-sm hover:shadow-md transition-shadow">
            <h4 className="font-bold text-lg text-primary mb-1">{j.title}</h4>
            <p className="text-sm text-muted-foreground mb-3">
              {j.company}
              {j.location ? ` • ${j.location}` : ""}
            </p>

            <div className="flex justify-between items-center">
              <span className="text-xs bg-muted text-foreground px-2 py-1 rounded">
                {j.employment_type || "Efetivo"}
              </span>
              <Link
                className="text-sm font-medium underline text-foreground hover:text-primary transition-colors"
                to={`/vagas/${j.id}`}
              >
                Detalhes
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
