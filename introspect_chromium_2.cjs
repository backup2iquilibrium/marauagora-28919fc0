const chromium = require('@sparticuz/chromium');
async function run() {
  console.log('Chromium:', chromium);
  console.log('Instance?', new chromium());
  console.log('Args:', chromium.args);
  console.log('Args Array?', Array.isArray(chromium.args));
  console.log('executablePath type:', typeof chromium.executablePath);
  if (typeof chromium.executablePath === 'function') {
    console.log('executablePath result type:', typeof (await chromium.executablePath()));
  }
}
run();
