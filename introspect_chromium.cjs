const chromium = require('@sparticuz/chromium');
console.log('Keys:', Object.keys(chromium));
console.log('Default?', chromium.default ? Object.keys(chromium.default) : 'No default');
console.log('Type of args:', typeof chromium.args);
console.log('Type of defaultViewport:', typeof chromium.defaultViewport);
console.log('Type of headless:', typeof chromium.headless);
