const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env file to get credentials
const envPath = path.resolve(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

const getEnvValue = (key) => {
    const match = envContent.match(new RegExp(`${key}="?([^"\\n]+)"?`));
    return match ? match[1] : null;
};

const supabaseUrl = getEnvValue('VITE_SUPABASE_URL');
const supabaseKey = getEnvValue('VITE_SUPABASE_PUBLISHABLE_KEY');

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('Seeding quotes table...');

    const { error } = await supabase
        .from('quotes')
        .insert([
            {
                soja: 'R$ 120,50',
                milho: 'R$ 60,00',
                source: 'manual_seed_test'
            }
        ]);

    if (error) {
        console.error('Error seeding:', error);
    } else {
        console.log('Successfully inserted test quote into Supabase!');
        console.log('Soja: R$ 120,50 | Milho: R$ 60,00');
    }
}

seed();
