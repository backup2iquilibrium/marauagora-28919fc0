import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://drgyofnpaaatarqydagr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZ3lvZm5wYWFhdGFycXlkYWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDA4NDMsImV4cCI6MjA4NTExNjg0M30.gH3nmAQ9xLicZBla0ZuiKRaMu9Jg0dZEt0axxPzXWU4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
  const email = 'marauagorars@gmail.com';
  const password = 'Ktdg#1020';

  console.log(`Trying to login with: ${email}`);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error('❌ Login Error Details:');
    console.error('   Message:', error.message);
    console.error('   Status:', error.status);
    console.error('   Name:', error.name);
  } else {
    console.log('✅ Login Successful!');
    console.log('   User ID:', data.user.id);
    console.log('   Email Confirmed At:', data.user.email_confirmed_at);
  }
}

testLogin();
