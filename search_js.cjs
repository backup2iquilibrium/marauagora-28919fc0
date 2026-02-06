const fs = require('fs');

const content = fs.readFileSync('temp_roos.js', 'utf8');

// Regex to find "action" key in object literals commonly used in jQuery ajax
// Looking for something like: action: "get_quotes" or action:"get_quotes"
const regex = /action\s*:\s*["']([^"']+)["']/g;

let match;
while ((match = regex.exec(content)) !== null) {
    console.log(`Found action: ${match[1]}`);
    // Print context
    const start = Math.max(0, match.index - 50);
    const end = Math.min(content.length, match.index + 50);
    console.log(`Context: ...${content.substring(start, end)}...`);
    console.log('---');
}

// Also look for quotes related keywords near ajax keywords
const quotesRegex = /(?:soja|milho|trigo|cota|quote).{0,100}(?:ajax|post|get).{0,100}action/gi;
let match2;
// Reset regex index if I used one... but I created new one
// Just regex search
// Since file is huge/minified, maybe just search for "action" and filter
