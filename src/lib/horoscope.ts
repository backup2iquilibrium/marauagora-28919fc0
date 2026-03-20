import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

export const SIGNS_LIST = [
  { sign: "Áries", slug: "aries", dateRange: "21/03 a 19/04", symbol: "♈", color: "from-red-500/20 to-orange-500/20", element: "Fogo", planet: "Marte", traits: "Espontaneidade, coragem e energia", profileDesc: "Pioneiros e intensos, vivem no agora com grande prazer de existir. Ação e decisão são as marcas registradas de Áries." },
  { sign: "Touro", slug: "touro", dateRange: "20/04 a 20/05", symbol: "♉", color: "from-green-500/20 to-emerald-500/20", element: "Terra", planet: "Vênus", traits: "Persistência, sensualidade e teimosia", profileDesc: "Focados no conforto e bem-estar, prezam pela beleza e pela segurança. A satisfação vem do contato com os cinco sentidos." },
  { sign: "Gêmeos", slug: "gemeos", dateRange: "21/05 a 21/06", symbol: "♊", color: "from-yellow-400/20 to-amber-500/20", element: "Ar", planet: "Mercúrio", traits: "Curiosidade, inteligência e liberdade", profileDesc: "Amam explorar novas ideias e ambientes. Com muito carisma e agilidade mental, estabelecem conexões facilmente através da comunicação e intercâmbio." },
  { sign: "Câncer", slug: "cancer", dateRange: "22/06 a 22/07", symbol: "♋", color: "from-blue-400/20 to-indigo-500/20", element: "Água", planet: "Lua", traits: "Sensibilidade, carinho e família", profileDesc: "Guiados pelo instinto e pela emoção. Têm necessidade de segurança e um laço forte com o lar, compreendendo o que não precisa ser dito pelas amizades." },
  { sign: "Leão", slug: "leao", dateRange: "23/07 a 22/08", symbol: "♌", color: "from-orange-500/20 to-yellow-600/20", element: "Fogo", planet: "Sol", traits: "Criatividade, autoestima e nobreza", profileDesc: "Donos de um brilho que atrai o sucesso. Destacam-se pela generosidade, senso de humor apurado e uma presença magnética nata e de liderança." },
  { sign: "Virgem", slug: "virgem", dateRange: "23/08 a 22/09", symbol: "♍", color: "from-teal-500/20 to-green-600/20", element: "Terra", planet: "Mercúrio", traits: "Objetividade, humanidade e organização", profileDesc: "Mestres do detalhe e da ordem em busca do aprimoramento. Conseguem identificar pequenas falhas de maneira rápida, sendo extremamente prestativos na ajuda ao próximo." },
  { sign: "Libra", slug: "libra", dateRange: "23/09 a 22/10", symbol: "♎", color: "from-pink-400/20 to-rose-500/20", element: "Ar", planet: "Vênus", traits: "Vaidade, empatia e diplomacia", profileDesc: "Buscando o equilíbrio em todas as frentes da vida. A compaixão e a conexão interpessoal fazem de Libra o mestre da conciliação e do charme natural em parcerias." },
  { sign: "Escorpião", slug: "escorpiao", dateRange: "23/10 a 21/11", symbol: "♏", color: "from-purple-600/20 to-indigo-900/20", element: "Água", planet: "Marte e Plutão", traits: "Intensidade, mistério e intuição", profileDesc: "Profundos como o universo, sentem muito a energia dos locais. Leais e corajosos investigam de frente seus medos, com imenso controle emocional e transformador." },
  { sign: "Sagitário", slug: "sagitario", dateRange: "22/11 a 21/12", symbol: "♐", color: "from-purple-500/20 to-blue-600/20", element: "Fogo", planet: "Júpiter", traits: "Otimismo, liberdade e movimento", profileDesc: "Os grandes filósofos desbravadores da nova era. Bem-humorados ao extremo e otimistas de alma livre que buscam o sentido nas jornadas longas e ensinamentos diários." },
  { sign: "Capricórnio", slug: "capricornio", dateRange: "22/12 a 19/01", symbol: "♑", color: "from-gray-600/20 to-slate-800/20", element: "Terra", planet: "Saturno", traits: "Responsabilidade, ambição e persistência", profileDesc: "Práticos e construtores de bases indestrutíveis para suas vitórias com disciplina absoluta. Assumem compromissos valendo cada minuto e prosperam subindo todas as montanhas." },
  { sign: "Aquário", slug: "aquario", dateRange: "20/01 a 18/02", symbol: "♒", color: "from-cyan-400/20 to-blue-500/20", element: "Ar", planet: "Saturno e Urano", traits: "Inovação, originalidade e independência", profileDesc: "Idealistas do zodíaco ligados fielmente às amizades originais. Exorbitam de mentalidade comunitária na quebra de paradigmas rumo à modernidade de valor humanitário." },
  { sign: "Peixes", slug: "peixes", dateRange: "19/02 a 20/03", symbol: "♓", color: "from-indigo-400/20 to-purple-500/20", element: "Água", planet: "Júpiter e Netuno", traits: "Solidariedade, intuição e desapego", profileDesc: "Sentem a vida por meio da mais bela imaginação. O coração universal sem barreiras que é doado sem limites a compaixão de um mar acolhedor e poético nos bastidores." },
];

export const FALLBACK_PREDICTIONS: Record<string, { hoje: string }> = {
  aries: { hoje: "Sua determinação está em alta! Hoje é o momento de focar em objetivos que exigem iniciativa e ousadia. Cuidado para não atropelar quem está ao seu redor." },
  touro: { hoje: "Hoje, sua resiliência e foco no prático são seus maiores trunfos. Momentos a dois ou em família serão particularmente reconfortantes. Organize suas finanças." },
  gemeos: { hoje: "A curiosidade guia seus passos hoje. Excelente momento para aprender algo novo, ler e interagir. Sua versatilidade será exigida de forma positiva." },
  cancer: { hoje: "Sua intuição está aguçadíssima hoje. Confie nos instintos, especialmente em decisões difíceis. Procure um refúgio acolhedor no final do dia." },
  leao: { hoje: "O sol brilha na sua essência! Hoje, assumir a liderança num projeto ou em casa trará muito orgulho. Expresse sua criatividade livremente." },
  virgem: { hoje: "O foco nos detalhes te colocará em vantagem hoje. Uma ótima jornada para colocar a rotina e a saúde em perfeita ordem. O cuidado com o corpo é essencial." },
  libra: { hoje: "As relações estão no foco de hoje. Parcerias estão extremamente favorecidas pela energia de Vênus." },
  escorpiao: { hoje: "Seu poder de regeneração e foco cirúrgico estão ativos hoje. É o dia perfeito para resolver enigmas e ir ao fundo de questões pendentes." },
  sagitario: { hoje: "A sorte acompanha o humor! Otimismo será seu melhor veículo hoje. Enxergue além dos horizontes comuns e inspire as pessoas com sua visão de mundo." },
  capricornio: { hoje: "Ambição na medida exata! Hoje é um momento incrível para estruturar os próximos passos de um plano de longo prazo. Confie no seu próprio tempo." },
  aquario: { hoje: "Originalidade e um pouco de rebeldia guiam seu dia de hoje. Não tenha medo de mostrar sua visão futurista e abraçar causas maiores." },
  peixes: { hoje: "Muita empatia e conexão espiritual no dia de hoje. Atividades criativas ligadas à música, artes ou cura trarão enorme contentamento à alma." }
};

export async function fetchRealHoroscope(sign: string) {
  try {
    const todayStr = format(new Date(), "yyyy-MM-dd");

    let { data, error } = await supabase
      .from("horoscopes")
      .select("content")
      .eq("sign_slug", sign)
      .eq("for_date", todayStr)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      console.log(`Dados não encontrados para ${sign} em ${todayStr}, disparando scraping...`);
      await supabase.functions.invoke("scrape-horoscope");
      
      const { data: retryData } = await supabase
        .from("horoscopes")
        .select("content")
        .eq("sign_slug", sign)
        .eq("for_date", todayStr)
        .maybeSingle();
      
      data = retryData;
    }

    if (data?.content) return data.content;
    
    const { data: lastAvailable } = await supabase
      .from("horoscopes")
      .select("content")
      .order("for_date", { ascending: false })
      .eq("sign_slug", sign)
      .limit(1)
      .maybeSingle();

    if (lastAvailable?.content) return lastAvailable.content;

    throw new Error("No data found in database");
  } catch (error) {
    console.error("Erro ao buscar horóscopo:", error);
    return FALLBACK_PREDICTIONS[sign]?.hoje || "As estrelas reservam grandes energias para você hoje. Siga sua intuição.";
  }
}

export function getCurrentSign() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return SIGNS_LIST[0]; // Áries
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return SIGNS_LIST[1]; // Touro
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return SIGNS_LIST[2]; // Gêmeos
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return SIGNS_LIST[3]; // Câncer
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return SIGNS_LIST[4]; // Leão
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return SIGNS_LIST[5]; // Virgem
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return SIGNS_LIST[6]; // Libra
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return SIGNS_LIST[7]; // Escorpião
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return SIGNS_LIST[8]; // Sagitário
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return SIGNS_LIST[9]; // Capricórnio
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return SIGNS_LIST[10]; // Aquário
  return SIGNS_LIST[11]; // Peixes
}
