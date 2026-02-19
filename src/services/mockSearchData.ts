// ─── Tipos ────────────────────────────────────────────────────────────────────
export type MockItemType = "news" | "jobs" | "points" | "events" | "classifieds";

export type MockSearchResult = {
    item_type: MockItemType;
    item_id: string;
    title: string;
    excerpt: string | null;
    route: string;
    published_at: string;
    rank: number;
};

// ─── Dataset ──────────────────────────────────────────────────────────────────

const NEWS: MockSearchResult[] = [
    // Esportes
    {
        item_type: "news", item_id: "volei-marau-conquista-titulo",
        title: "Vôlei Marau conquista título regional histórico em noite de ginásio lotado",
        excerpt: "A equipe local superou os adversários de Passo Fundo em uma partida emocionante de cinco sets neste domingo.",
        route: "/noticia/volei-marau-conquista-titulo", published_at: "2023-10-26T10:00:00Z", rank: 0,
    },
    {
        item_type: "news", item_id: "campeonato-municipal-futebol",
        title: "Campeonato Municipal de Futebol inicia neste final de semana com 12 equipes",
        excerpt: "Jogos de abertura acontecem no Estádio Municipal Carlos Renato Bebber com entrada franca.",
        route: "/noticia/campeonato-municipal-futebol", published_at: "2023-10-24T08:00:00Z", rank: 0,
    },
    {
        item_type: "news", item_id: "maratona-escolar-500-estudantes",
        title: "Maratona Escolar reúne mais de 500 estudantes da rede pública",
        excerpt: "Evento promove saúde e integração entre as escolas do município de Marau.",
        route: "/noticia/maratona-escolar-500-estudantes", published_at: "2023-10-23T09:00:00Z", rank: 0,
    },
    // Agronegócio
    {
        item_type: "news", item_id: "safra-recorde-soja-marau",
        title: "Safra recorde de soja impulsiona economia local e gera novos empregos",
        excerpt: "Produtores rurais de Marau celebram números positivos da colheita, superando expectativas iniciais do setor.",
        route: "/noticia/safra-recorde-soja-marau", published_at: "2023-10-25T07:00:00Z", rank: 0,
    },
    {
        item_type: "news", item_id: "drones-campo-marau",
        title: "Drones transformam o monitoramento de safras no interior de Marau",
        excerpt: "Novos equipamentos permitem identificar pragas e falhas na irrigação com precisão milimétrica.",
        route: "/noticia/drones-campo-marau", published_at: "2023-10-25T08:00:00Z", rank: 0,
    },
    {
        item_type: "news", item_id: "preco-milho-estabilidade",
        title: "Preço do milho apresenta estabilidade após oscilações na bolsa",
        excerpt: "Análise econômica mostra o impacto direto nos produtores da região norte do estado.",
        route: "/noticia/preco-milho-estabilidade", published_at: "2023-10-24T11:00:00Z", rank: 0,
    },
    // Política
    {
        item_type: "news", item_id: "plano-diretor-marau",
        title: "Câmara de Vereadores debate novo plano diretor para o desenvolvimento de Marau",
        excerpt: "Audiência pública reuniu especialistas e comunidade para discutir o futuro urbano do município nos próximos 10 anos.",
        route: "/noticia/plano-diretor-marau", published_at: "2023-10-26T07:00:00Z", rank: 0,
    },
    {
        item_type: "news", item_id: "investimentos-educacao",
        title: "Prefeitura anuncia novos investimentos para a rede municipal de educação",
        excerpt: "Recursos serão destinados à reforma de escolas e aquisição de novos equipamentos tecnológicos.",
        route: "/noticia/investimentos-educacao", published_at: "2023-10-24T12:00:00Z", rank: 0,
    },
    // Mais lidas / sidebar
    {
        item_type: "news", item_id: "obras-centro",
        title: "Prefeitura anuncia cronograma de obras no centro de Marau",
        excerpt: "Obras de revitalização devem começar no próximo mês e incluem calçamento e iluminação pública.",
        route: "/noticia/obras-centro", published_at: "2023-10-22T09:00:00Z", rank: 0,
    },
    {
        item_type: "news", item_id: "acidente-ers-324",
        title: "Acidente na ERS-324 causa lentidão nesta manhã",
        excerpt: "Colisão entre dois caminhões interditou parcialmente a rodovia por cerca de duas horas.",
        route: "/noticia/acidente-ers-324", published_at: "2023-10-21T06:30:00Z", rank: 0,
    },
    {
        item_type: "news", item_id: "festival-salame",
        title: "Festival do Salame acontece no próximo mês em Marau",
        excerpt: "Tradicional festival que celebra a gastronomia e cultura local retorna com programação especial.",
        route: "/noticia/festival-salame", published_at: "2023-10-20T10:00:00Z", rank: 0,
    },
    {
        item_type: "news", item_id: "mercado-imobiliario-marau",
        title: "Mercado imobiliário em Marau apresenta alta procura por aluguéis no centro",
        excerpt: "Levantamento aponta que a proximidade com serviços e comércio é o principal fator de decisão para novos moradores.",
        route: "/categoria/classificados", published_at: "2023-10-20T09:00:00Z", rank: 0,
    },
];

const JOBS: MockSearchResult[] = [
    {
        item_type: "jobs", item_id: "assistente-administrativo",
        title: "Assistente Administrativo — Metasa S.A.",
        excerpt: "Vaga presencial no Distrito Industrial de Marau. Regime integral. Setor: Indústria e Administrativo.",
        route: "/vagas/assistente-administrativo", published_at: "2023-10-26T08:00:00Z", rank: 0,
    },
    {
        item_type: "jobs", item_id: "vendedor-interno",
        title: "Vendedor Interno — Lojas Benoit",
        excerpt: "Comissão + Salário Fixo. Localização: Centro, Marau. Setor: Comércio e Vendas.",
        route: "/vagas/vendedor-interno", published_at: "2023-10-24T08:00:00Z", rank: 0,
    },
    {
        item_type: "jobs", item_id: "tecnico-enfermagem",
        title: "Técnico em Enfermagem — Hospital Cristo Redentor",
        excerpt: "Plantão 12x36. Centro de Marau. Área: Saúde. Vaga urgente.",
        route: "/vagas/tecnico-enfermagem", published_at: "2023-10-23T08:00:00Z", rank: 0,
    },
    {
        item_type: "jobs", item_id: "frontend-jr",
        title: "Desenvolvedor Front-end Jr — TechMarau Soluções",
        excerpt: "Remoto ou híbrido. Stack: React e Tailwind. Setor: Tecnologia.",
        route: "/vagas/frontend-jr", published_at: "2023-10-19T08:00:00Z", rank: 0,
    },
];

const EVENTS: MockSearchResult[] = [
    {
        item_type: "events", item_id: "festival-salame-evento",
        title: "Festival do Salame de Marau 2023",
        excerpt: "Gastronomia, cultura e shows ao vivo. Entrada franca. Praça Central de Marau.",
        route: "/agenda", published_at: "2023-10-20T10:00:00Z", rank: 0,
    },
    {
        item_type: "events", item_id: "campeonato-futebol-abertura",
        title: "Abertura do Campeonato Municipal de Futebol",
        excerpt: "12 equipes disputam o título. Estádio Municipal Carlos Renato Bebber. Entrada gratuita.",
        route: "/agenda", published_at: "2023-10-24T08:00:00Z", rank: 0,
    },
    {
        item_type: "events", item_id: "maratona-escolar",
        title: "Maratona Escolar — Corrida da Saúde 2023",
        excerpt: "Mais de 500 estudantes participam. Rua da Prefeitura com chegada na Praça Central.",
        route: "/agenda", published_at: "2023-10-23T09:00:00Z", rank: 0,
    },
    {
        item_type: "events", item_id: "audiencia-plano-diretor",
        title: "Audiência Pública — Novo Plano Diretor de Marau",
        excerpt: "Participate e opine sobre o futuro da cidade. Câmara Municipal. Entrada franca.",
        route: "/agenda", published_at: "2023-10-26T14:00:00Z", rank: 0,
    },
];

const CLASSIFIEDS: MockSearchResult[] = [
    {
        item_type: "classifieds" as any, item_id: "hilux-2022",
        title: "Vende-se Caminhonete Hilux 2022 — Único dono — R$ 245.000",
        excerpt: "Veículo em estado de novo, com todas as revisões em concessionária. Completa e pronta para uso.",
        route: "/categoria/classificados", published_at: "2023-10-26T08:00:00Z", rank: 0,
    },
    {
        item_type: "classifieds" as any, item_id: "ap-2dorm-locacao",
        title: "Apartamento 2 dormitórios para locação — Praça Central — R$ 1.800/mês",
        excerpt: "Excelente localização, mobiliado e com box de garagem. Ideal para estudantes ou casais novos.",
        route: "/categoria/classificados", published_at: "2023-10-25T08:00:00Z", rank: 0,
    },
    {
        item_type: "classifieds" as any, item_id: "aulas-ingles",
        title: "Aulas Particulares de Inglês e Reforço Escolar",
        excerpt: "Professor com experiência internacional. Atende em domicílio ou online. Metodologia personalizada.",
        route: "/categoria/classificados", published_at: "2023-10-23T08:00:00Z", rank: 0,
    },
    {
        item_type: "classifieds" as any, item_id: "terreno-loteamento",
        title: "Terreno em Loteamento Novo — 360m² — R$ 120.000",
        excerpt: "Área alta com infraestrutura completa e ótima vista da cidade. Pronto para construir.",
        route: "/categoria/classificados", published_at: "2023-10-22T08:00:00Z", rank: 0,
    },
];

const POINTS: MockSearchResult[] = [
    {
        item_type: "points", item_id: "hospital-cristo-redentor",
        title: "Hospital Cristo Redentor",
        excerpt: "Hospital geral público. Atendimento 24h. Centro de Marau.",
        route: "/servicos", published_at: "2023-01-01T00:00:00Z", rank: 0,
    },
    {
        item_type: "points", item_id: "prefeitura-marau",
        title: "Prefeitura Municipal de Marau",
        excerpt: "Serviços municipais, emissão de documentos, informações sobre obras e serviços públicos.",
        route: "/servicos", published_at: "2023-01-01T00:00:00Z", rank: 0,
    },
    {
        item_type: "points", item_id: "camara-vereadores",
        title: "Câmara Municipal de Vereadores de Marau",
        excerpt: "Poder legislativo municipal. Sessões abertas ao público. Centro de Marau.",
        route: "/servicos", published_at: "2023-01-01T00:00:00Z", rank: 0,
    },
    {
        item_type: "points", item_id: "estadio-municipal",
        title: "Estádio Municipal Carlos Renato Bebber",
        excerpt: "Principal estádio de futebol da cidade. Sede do Campeonato Municipal e eventos esportivos.",
        route: "/servicos", published_at: "2023-01-01T00:00:00Z", rank: 0,
    },
    {
        item_type: "points", item_id: "praca-central",
        title: "Praça Central de Marau",
        excerpt: "Principal ponto de encontro da cidade. Sede de eventos, feiras e shows.",
        route: "/servicos", published_at: "2023-01-01T00:00:00Z", rank: 0,
    },
    {
        item_type: "points", item_id: "metasa",
        title: "Metasa S.A. — Indústria",
        excerpt: "Uma das maiores indústrias de Marau. Distrito Industrial.",
        route: "/servicos", published_at: "2023-01-01T00:00:00Z", rank: 0,
    },
];

// Todos os dados unidos
const ALL_MOCK_DATA: MockSearchResult[] = [
    ...NEWS,
    ...JOBS,
    ...EVENTS,
    ...CLASSIFIEDS,
    ...POINTS,
];

// ─── Normalização ─────────────────────────────────────────────────────────────
function normalize(s: string): string {
    return s
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/[^a-z0-9 ]/g, " ");
}

function scoreItem(item: MockSearchResult, terms: string[]): number {
    const titleN = normalize(item.title);
    const excerptN = normalize(item.excerpt ?? "");
    let score = 0;

    for (const term of terms) {
        // Título: peso 3
        if (titleN.includes(term)) {
            score += titleN.startsWith(term) ? 5 : 3;
        }
        // Excerpt: peso 1
        if (excerptN.includes(term)) {
            score += 1;
        }
    }

    // Bônus para correspondência exata de múltiplos termos
    if (terms.length > 1 && titleN.includes(normalize(terms.join(" ")))) {
        score += 4;
    }

    return score;
}

// ─── Função principal de busca ────────────────────────────────────────────────
export function searchMockData(query: string, limit = 8): MockSearchResult[] {
    if (!query || query.trim().length < 2) return [];

    const terms = normalize(query.trim())
        .split(/\s+/)
        .filter((t) => t.length >= 2);

    if (terms.length === 0) return [];

    const scored = ALL_MOCK_DATA
        .map((item) => ({ ...item, rank: scoreItem(item, terms) }))
        .filter((item) => item.rank > 0)
        .sort((a, b) => b.rank - a.rank || b.published_at.localeCompare(a.published_at));

    return scored.slice(0, limit);
}
