import { HeroSlide } from "./types";

const slides: HeroSlide[] = [
  {
    tag: "Destaque",
    title: "Marau investe R$ 5 milhões em nova infraestrutura urbana no centro da cidade",
    excerpt:
      "Prefeitura anuncia pacote de obras que inclui pavimentação, iluminação LED e revitalização das praças centrais para o próximo semestre.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDHfsuTxaLnq-IjQZ2WQ60RkG0VcAXorigTSVn_p2DGseu0Lfsxzf6Zy3x3QtLp73-dNxFVGYBqM_tVdJdu8fcSstOS51LqBd_Fu-Z5D_ZS13jtYN2Ef-Y3pOpAwoUT7qSVQHZR71V8PHXhd4DwFb98MoVXZmH7s4hK9pGA7z6LraUiVfIPa7fblAtt9qZto92TNPK5hxiUyQo43PTtTjFKM8x3Nn970GbWdwRpOLLmnQqiiM-FgshiIuXN4HK4VgyJWcq8IZdw",
    tagTone: "secondary",
  },
  {
    tag: "Cultura",
    title: "Inauguração do novo Centro Cultural deve atrair turistas da região",
    excerpt:
      "Espaço conta com teatro, salas de exposição e biblioteca pública moderna, prometendo ser o novo ponto de encontro da cidade.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjIeEmnFpMGbhVofcf4w3QfR360Ydr1tuwhCxlSnMzKHBNld7vkOIdiKiDHf4TKngsqEGz_p8raiRMHCUYOBdRk9J1wrAq_nR-ZxlCpjnD7ARSH0gQdLlNwTeeGifWfPGlqPql_T5XQJTcaO5mNf4vd5XmHctg9ssCEHc2FtZZVjE3I1RgurM3Dwokv7YzvO8Wr2U0xD1e7K8gx94f9xfWe1cUFJP3wuDYfoFBM1X0fr12ovYBpe9MSqPNt1aC-BTIQyWucEm1",
    tagTone: "primary",
  },
  {
    tag: "Agronegócio",
    title: "Safra recorde de soja impulsiona economia local e gera novos empregos",
    excerpt:
      "Produtores rurais celebram os números positivos da colheita deste ano, superando as expectativas iniciais do setor.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC7qI9PveiJbDuREDPKV5Q_3S8nAS945Z77aId7qlfk70p5YxTAeXNhBYl38KtA--nJg88BhkvGHIluQicG3sRDnx27rdU6UMxXq839h-95LIGEpGCMF-b0q7pqYQTaLOxlbL1fptTFIc6eVReoZ7LW9eUtgluWApyc2mbiPyGL68UyvyDsk3YD_OItPxI22CNfBv0-z1ihmXUu83VXnHfqzidH0ChCSgy-8CUh0juW8RW76EBv2yMOfDs-gWYY2DY1RPM5TGa1",
    tagTone: "muted",
  },
];

const sideCards = [
  {
    category: "Economia",
    title: "Feira industrial de Marau deve movimentar milhões em negócios",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB6EpRHegf1zNgg5E8-ugngTu_V7MzqD0hclfuIffQZ4EiJsC7vQi9EQ4hMEs9rhSiclYqb6ZsuYrPFWyZHe42S9ilIEsPXGuE2iL2mFoKrYGO3Ldt1lIS-fgzXrQ36ZfEesVG0rbKJrtvp31dsG_m4FDehpwUvQL1nj6KBgyqnZcjrFpW0zFsTSo2a3AOPdt_sS6niVwZHt6kdkakNDfewr0Ws4XUUmxoz4LSe3OH8lYE06HEgW1T2DXj7m6fXswyZpMDZkgMk",
  },
  {
    category: "Esportes",
    title: "Equipe de futsal local avança para a final estadual",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBBgy-5RnxRj5wV7vukYyP9QRZxpWtdZEdGwQxtehbbbMw1gdytlBv9zLlsM6n0AXgViRupize5Qj5pSJEwWHQ9yntzVy_dKPbu761-FHBlaTRsEp1XftPPGSepFQfdGO-NUsR5ZgadiAO0l1FonQrCOz2o7VGtnsswJgtZ8FDUUMs2m_-ucQGYDDcNblgcTgl9rO2hqxMmJ68GyySmj7_ZU6Vel706VOUvB7MFEuAGVKl_dbwtbUQV6CUAvJ9F4On2Vent3f7",
  },
];

function Tag({ tone, children }: { tone?: HeroSlide["tagTone"]; children: string }) {
  const cls =
    tone === "secondary"
      ? "bg-secondary text-secondary-foreground"
      : tone === "primary"
        ? "bg-primary text-primary-foreground"
        : "bg-muted text-foreground";

  return (
    <span className={`${cls} text-xs font-bold px-2 py-1 rounded uppercase tracking-wider inline-block shadow-sm`}>
      {children}
    </span>
  );
}

export function Hero() {
  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <article className="lg:col-span-2 group cursor-pointer relative rounded-lg overflow-hidden shadow-sm h-96 lg:h-[500px] bg-muted">
          {slides.map((s, idx) => (
            <div
              key={s.title}
              className={
                "absolute inset-0 w-full h-full opacity-0 transition-opacity duration-1000 " +
                (idx === 0 ? "animate-carousel-1" : idx === 1 ? "animate-carousel-2" : "animate-carousel-3")
              }
            >
              <img src={s.imageUrl} alt={s.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                <Tag tone={s.tagTone}>{s.tag}</Tag>
                <h1 className="mt-2 text-2xl md:text-4xl font-serif font-bold text-primary-foreground leading-tight drop-shadow-sm">
                  {s.title}
                </h1>
                <p className="mt-2 text-primary-foreground/90 text-sm md:text-base line-clamp-2">{s.excerpt}</p>
              </div>
            </div>
          ))}

          <div className="absolute bottom-4 right-4 z-20 flex space-x-2" aria-hidden="true">
            <div className="w-2 h-2 rounded-full bg-primary-foreground/80" />
            <div className="w-2 h-2 rounded-full bg-primary-foreground/50" />
            <div className="w-2 h-2 rounded-full bg-primary-foreground/50" />
          </div>
        </article>

        <div className="flex flex-col gap-6 h-[500px]">
          {sideCards.map((c) => (
            <article key={c.title} className="relative flex-1 rounded-lg overflow-hidden shadow-sm group cursor-pointer">
              <img
                alt={c.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={c.imageUrl}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <span className="text-secondary text-xs font-bold uppercase mb-1 block">{c.category}</span>
                <h3 className="text-primary-foreground font-serif font-bold text-lg leading-snug drop-shadow-sm">{c.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
