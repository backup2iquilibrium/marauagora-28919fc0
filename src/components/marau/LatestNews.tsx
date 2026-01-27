import { NewsItem } from "./types";

const items: NewsItem[] = [
  {
    category: "Agronegócio",
    time: "Há 2 horas",
    title: "Tecnologia no campo: Produtores de Marau adotam drones para monitoramento de safras",
    excerpt:
      "A utilização de novas tecnologias tem aumentado a produtividade nas lavouras da região. Especialistas apontam crescimento de 15% na eficiência.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBJENOrvTKtFOCjkx12_vX5s0e38aaeuwQSc0p_wsR4KFjg4eKgAdWcSd2gus0h_s0XN9kc6q8Csd8r4a_MgZwGjwF3DdMipy7llmifCVIgGeOBHq_JDShWWCgoW8IVMcniWBDa8Q0-SCbt47hcZFNk0_mLXo8dyRFwwtiORtL7jnc21seRrCzOb9_VdjTfDkmyL3P_vmHu6li3YYhneeuxI8jvyXSAOgOH-isrMj8ZvtmmvBU75gRDsTiSRqLVuAIE6CNdFFd6",
  },
  {
    category: "Política",
    time: "Há 4 horas",
    title: "Câmara de Vereadores aprova projeto para revitalização do Parque Municipal",
    excerpt:
      "Sessão extraordinária definiu o orçamento para as obras que devem iniciar no próximo mês, visando melhorar as áreas de lazer da comunidade.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCDDZSqtdmEFel7nMOQ9pEB2aWWEbjd-Z8FF4I4ZukbtQk3J_iUN-ssSx7iPRexQHB9DmdE891y4_s-qPJufimzjnuVV6jwI3D1k_yGi6hvHeoVVDzv7VUXkBfMiT6EdaRRwKPLTVKxawL5OD5d_TbDUc5unPumElzIkdzz4PnDjk0zEjwi7OgR9axyzmJVbdImDHvdYo2h4pm_KZE4PKx2Y8wehoacrctwfGwnUs-qw5VYYLtT-f_hxk3Olc4JX5S7g_tHxDDw",
  },
  {
    category: "Cultura & Lazer",
    time: "Ontem",
    title: "Festival Gastronômico de Marau confirma data para a edição deste ano",
    excerpt:
      "O evento tradicional reunirá os principais restaurantes da cidade na praça central, oferecendo pratos típicos e shows ao vivo.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDqV3kLZTBBXR9cTpYIacfqpOa5OXYgkX5cxRueaxYxqzqTf4P1sWPrcPb0_SVlOlih69nDjGZTM0PSi66OcMiCV60r7YIfMuVLJ7mXvi6rzmvQ_VD87oqVd2TNUw0h6gMWHpi32G3Pa8eFl4DiG_zRHdp7-_sZY8ItzQ-HfyOjdjfHnwQFeI-TmOGjLgbR1ANyh0tqLY8stR9c8IxgsUdRlMVGek1EYnFzs-iThVD0HtcTMw1F0MbQMgsE-fDXcsw9P2UOcKri",
  },
];

export function LatestNews() {
  return (
    <section>
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h2 className="text-2xl font-serif font-bold text-primary">Últimas Notícias</h2>
        <a className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="#">
          Ver todas
        </a>
      </div>

      <div className="space-y-6">
        {items.map((n) => (
          <article
            key={n.title}
            className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border"
          >
            <div className="sm:w-1/3 h-48 sm:h-auto overflow-hidden rounded-md relative">
              <img
                alt={n.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                src={n.imageUrl}
                loading="lazy"
              />
            </div>

            <div className="sm:w-2/3 flex flex-col justify-center">
              <div className="flex items-center text-xs text-muted-foreground mb-2 gap-2">
                <span className="text-primary font-bold uppercase">{n.category}</span>
                <span aria-hidden="true">•</span>
                <span>{n.time}</span>
              </div>

              <h3 className="text-xl font-bold font-serif mb-2 text-foreground hover:text-primary transition-colors">
                <a href="#">{n.title}</a>
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-3">{n.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
