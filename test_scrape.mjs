
// No import needed for native fetch in Node >= 18


const SIGNS = [
  "aries", "touro", "gemeos", "cancer", "leao", "virgem",
  "libra", "escorpiao", "sagitario", "capricornio", "aquario", "peixes"
];

async function scrapePersonare(sign) {
  const url = `https://www.personare.com.br/horoscopo-do-dia/${sign}`;
  console.log(`Fetching ${url}...`);
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
    }
  });

  if (!res.ok) throw new Error(`Personare failed for ${sign}: ${res.status}`);
  const html = await res.text();

  const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (!nextDataMatch) throw new Error(`Could not find __NEXT_DATA__ for ${sign}`);

  try {
    const nextData = JSON.parse(nextDataMatch[1]);
    const prediction = nextData?.props?.pageProps?.horoscopes?.daily?.prediction || 
                       nextData?.props?.pageProps?.horoscopes?.daily?.solar;
    
    if (!prediction) throw new Error(`No prediction found in JSON for ${sign}`);
    
    return prediction.replace(/<[^>]*>?/gm, '').trim();
  } catch (err) {
    throw new Error(`Failed to parse JSON for ${sign}: ${err.message}`);
  }
}

async function run() {
  for (const sign of SIGNS) {
    try {
      const content = await scrapePersonare(sign);
      console.log(`[${sign}] success: ${content.substring(0, 100)}...`);
    } catch (err) {
      console.error(`[${sign}] error: ${err.message}`);
    }
  }
}

run();
