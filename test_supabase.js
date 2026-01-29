
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manual .env parser
function parseEnv(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const config = {};
  for (const line of lines) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.substring(1, value.length - 1);
      }
      config[match[1]] = value;
    }
  }
  return config;
}

// Load .env
const envPath = path.resolve(__dirname, '.env');
const envConfig = parseEnv(envPath);

const SUPABASE_URL = envConfig.VITE_SUPABASE_URL;
const SUPABASE_KEY = envConfig.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials in .env');
  process.exit(1);
}

async function testConnection() {
  console.log(`Checking connection to: ${SUPABASE_URL}`);

  try {
    // We try to fetch the OpenApi spec which lists tables
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    if (response.ok) {
      console.log('✅ Connection successful!');
      const data = await response.json();
      console.log('\n--- Live Tables ---');

      const tables = new Set();

      if (data.definitions) {
        Object.keys(data.definitions).forEach(table => tables.add(table));
      }

      if (data.paths) {
        Object.keys(data.paths).forEach(p => {
          if (p !== '/' && !p.includes('rpc/')) {
            tables.add(p.replace(/\//g, ''));
          }
        });
      }

      if (tables.size > 0) {
        Array.from(tables).sort().forEach(table => console.log(`- ${table}`));
      } else {
        console.log('No tables found or accessible.');
      }

    } else {
      console.error(`❌ Connection failed with status: ${response.status}`);
      const text = await response.text();
      console.error(`Error details: ${text}`);
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

testConnection();
