import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://drgyofnpaaatarqydagr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZ3lvZm5wYWFhdGFycXlkYWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDA4NDMsImV4cCI6MjA4NTExNjg0M30.gH3nmAQ9xLicZBla0ZuiKRaMu9Jg0dZEt0axxPzXWU4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupAdmin() {
    const userId = 'b40c2f2b-1a16-46d0-a658-fa7d4eb07766';

    console.log('🔧 Configurando administrador...');
    console.log('👤 User ID:', userId);

    console.log('\n📋 INSTRUÇÕES:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✅ O usuário foi criado com sucesso no Supabase Auth!');
    console.log('\n📧 Email: marauagorars@gmail.com');
    console.log('🔑 Senha: Ktdg#1020');
    console.log('👤 User ID:', userId);

    console.log('\n⚠️  Para completar o cadastro como administrador, execute o seguinte SQL');
    console.log('   no Supabase Dashboard (SQL Editor):');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n-- 1. Criar perfil');
    console.log(`INSERT INTO public.profiles (id, display_name, is_verified, created_at, updated_at)
VALUES (
  '${userId}',
  'Administrador',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE
SET 
  display_name = EXCLUDED.display_name,
  is_verified = EXCLUDED.is_verified,
  updated_at = NOW();`);

    console.log('\n-- 2. Atribuir role de admin');
    console.log(`INSERT INTO public.user_roles (user_id, role, created_at)
VALUES (
  '${userId}',
  'admin',
  NOW()
)
ON CONFLICT (user_id, role) DO NOTHING;`);

    console.log('\n-- 3. Verificar');
    console.log(`SELECT 
  p.id,
  p.display_name,
  p.is_verified,
  ur.role
FROM public.profiles p
LEFT JOIN public.user_roles ur ON p.id = ur.user_id
WHERE p.id = '${userId}';`);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🌐 Acesse o Supabase Dashboard:');
    console.log('   https://supabase.com/dashboard/project/drgyofnpaaatarqydagr/sql/new');
    console.log('\n📝 Cole e execute os comandos SQL acima.');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    console.log('\n💡 ALTERNATIVA: O arquivo create_admin_profile.sql já contém esses comandos.');
}

setupAdmin();
