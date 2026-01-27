import { CityGuideItem } from "./types";

const items: CityGuideItem[] = [
  {
    label: "Gastronomia",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAmbWGZzhyhdXQucDD8Z2HEgzu9lUl4nQXBu5S2yX1SQxP7v814bKPMH8qhLP64o9DmJhc7vbubwI6WF53l_bpZkA2mPXl1LWdiZUDdF1BlowjuTGm2YfEPH4tlUMf2S2tu-3KFLdtcBubhBpfJc1QPkB5vnZyPrlJ0ascl8YTGc7BUnveX-vwrs0v6PopnxWu-EOYQZPtu9xEvoos9IOPqwN6ts3Jbt2WAQUWTVMiJokqga6Xd7uhq_B03C4-pBYTm5EeQCifp",
  },
  {
    label: "Hotelaria",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCbSRgXkjwCJ_gAWTNyekFqYpxXqPTO4v_PstSWizcyl_r1TL051oRt5x0wbm_YJVlBqNzGJDySQJDQoDIT6wtjtRG_gzifhz32QJXjwerE3URihGkuNTrccMDYxHNYUlUhmVBIBBqO0X5PRtZ2yMRV-f73RgLHI6EIBGLErS5GaxVm1xaVcnuvO8HFl5J2F5GSshCgkZcOBK2n066cJCEDO9e7HX7dFFFxkmt0ukYMdRt6-e1TBA8FxHn8qKTufNRGDWw0kiAv",
  },
  {
    label: "Vida Noturna",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCzwmgI9rSA_AjRGt_-44xNwj0heat5FDW6haan3zl-vHVm2N11Q2Zsvfy71FS1DfMqazkY9W0whk482Q1bzH3OhwR_hZWJ_RlHMWsDKDDU7VZvqk8OAkzIA_tjCqUh9TMs2VsBCHASXH589x5dqm2hpk6TemRdySFNVaxVyomtwkENuryjggZhyDNz96TsJBQoZ67LuXUGRqYaHmLPlF2FGbYhPMPzA66VvgPU8mQIFtvrKvC8MgzCQVSpNqR52hvqb4J2ASt-",
  },
  {
    label: "Turismo",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAOZ8bKdzq7bs_v_TMt7XP18MthgFgvx3c9VwZoDrRqqZ3Vmypp1yZ32D2t2wvZcDUxj_CfVUhdZNTa2FdcEl_D8m_C3jTDqY2kneITq0avboc7wzTleUjLhTJq_QPJtaLf1MiSDKjkJHSgFIyCJKNu6-LlxBLY-yzphO1CLRX4fgPHzc-RNH7Z0IHPukbxjEwIO4nlYW-z-1a9EBYL86MaWhJ-5NMFobvqSWH4GW_crsyZmaSmrkVEdnMu_bfiIYfqc931wPpW",
  },
];

export function CityGuide() {
  return (
    <section>
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h2 className="text-2xl font-serif font-bold text-primary">Guia da Cidade</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((i) => (
          <a key={i.label} className="group block text-center" href="#">
            <div className="rounded-full overflow-hidden w-24 h-24 mx-auto mb-2 border-4 border-card shadow-sm group-hover:border-secondary transition-colors">
              <img alt={i.label} className="w-full h-full object-cover" src={i.imageUrl} loading="lazy" />
            </div>
            <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">{i.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
