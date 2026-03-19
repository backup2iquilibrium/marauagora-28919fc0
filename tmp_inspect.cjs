const https = require('https');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  const html = await fetch('https://www.astrolink.com.br/horoscopo/aries');
  // Today's date in Portuguese usually on the site
  const todayMark = '19 de março de 2026';
  const index = html.indexOf(todayMark);
  if (index !== -1) {
    console.log('Found "' + todayMark + '" at index:', index);
    console.log('Context (next 2000 chars):\n', html.substring(index, index + 2000));
  } else {
    // Try lowercase
    const indexLower = html.toLowerCase().indexOf(todayMark.toLowerCase());
    if (indexLower !== -1) {
        console.log('Found date (any case) at index:', indexLower);
        console.log('Context:\n', html.substring(indexLower, indexLower + 2000));
    } else {
        console.log('Date not found. Hunting for <p> tags with long text.');
        // Regex search for paragraphs
        const pTags = html.match(/<p>[\s\S]{50,}<\/p>/g);
        if (pTags) {
            console.log('First 3 long <p> tags:\n', pTags.slice(0, 3));
        }
    }
  }
}

main();
