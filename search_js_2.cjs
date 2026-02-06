const fs = require('fs');

const content = fs.readFileSync('temp_roos.js', 'utf8');

// Search for ws_roos_script usage
const index = content.indexOf('ws_roos_script');
if (index !== -1) {
    console.log('Found ws_roos_script usage at index:', index);
    const start = Math.max(0, index - 100);
    const end = Math.min(content.length, index + 500);
    console.log(content.substring(start, end));
} else {
    console.log('ws_roos_script not found');
}

// Also search for "admin-ajax.php" just in case
const index2 = content.indexOf('admin-ajax.php');
if (index2 !== -1) {
    console.log('Found admin-ajax.php usage at index:', index2);
    const start = Math.max(0, index2 - 100);
    const end = Math.min(content.length, index2 + 500);
    console.log(content.substring(start, end));
} else {
    console.log('admin-ajax.php not found');
}
