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
  const html = await fetch('https://www.personare.com.br/horoscopo-do-dia/aries');
  // Today's date in Portuguese often on the site
  const todayMark = '19/03'; // Typical date format on web
  const index = html.indexOf(todayMark);
  console.log('Personare Context for date/ Aries:');
  // Find all <p> tags with long content
  const pTags = html.match(/<p>[\s\S]{50,}<\/p>/g);
  if (pTags) {
    console.log('First 3 long <p> tags:\n', pTags.slice(0, 3));
  }
}

main();
