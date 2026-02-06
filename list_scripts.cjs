const fs = require('fs');

const content = fs.readFileSync('temp_roos.html', 'utf8');
const regex = /<script[^>]+src=["']([^"']+)["']/g;

let match;
while ((match = regex.exec(content)) !== null) {
    console.log(match[1]);
}

// Check JS file size
try {
    const stats = fs.statSync('temp_roos.js');
    console.log(`\ntemp_roos.js size: ${stats.size} bytes`);
} catch (e) {
    console.log('temp_roos.js does not exist');
}
