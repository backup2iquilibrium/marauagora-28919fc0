const https = require('https');

const url = 'https://cdn.siterapido.rs/wp-content/themes/siterapido_2020/source/acf/js/posts.js?ver=6.9.1';

https.get(url, {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
}, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log(data);
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
