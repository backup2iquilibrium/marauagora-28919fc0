const fs = require('fs');
const content = fs.readFileSync('d:\\BACKUP_APPS\\marauagora-28919fc0\\api\\quotes.ts', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
    console.log(`${i + 1}: ${line}`);
});
