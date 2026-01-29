import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://drgyofnpaaatarqydagr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZ3lvZm5wYWFhdGFycXlkYWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDA4NDMsImV4cCI6MjA4NTExNjg0M30.gH3nmAQ9xLicZBla0ZuiKRaMu9Jg0dZEt0axxPzXWU4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
  const email = 'marauagorars@gmail.com';
  const password = 'Ktdg#1020';

  console.log('🔄 Criando usuário administrador...');
  console.log('📧 Email:', email);

  try {
    // 1. Criar usuário no Supabase Auth
    console.log('\n1️⃣ Criando conta de autenticação...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: undefined,
        data: {
          display_name: 'Administrador'
        }
      }
    });

    if (authError) {
      console.error('❌ Erro ao criar usuário:', authError.message);
      
      // Se o usuário já existe, tentar fazer login para obter o ID
      if (authError.message.includes('already registered')) {
        console.log('\n⚠️  Usuário já existe. Tentando fazer login...');
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: email,
          password: password
        });

        if (loginError) {
          console.error('❌ Erro ao fazer login:', loginError.message);
          return;
        }

        if (loginData.user) {
          console.log('✅ Login realizado com sucesso!');
          console.log('👤 User ID:', loginData.user.id);
          
          // Continuar com a criação do perfil e role
          await createProfileAndRole(loginData.user.id);
        }
        return;
      }
      return;
    }

    if (authData.user) {
      console.log('✅ Usuário criado com sucesso!');
      console.log('👤 User ID:', authData.user.id);
      
      // 2. Criar perfil e role
      await createProfileAndRole(authData.user.id);
    }

  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

async function createProfileAndRole(userId) {
  try {
    // 2. Criar perfil
    console.log('\n2️⃣ Criando perfil...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        display_name: 'Administrador',
        is_verified: true
      }, {
        onConflict: 'id'
      })
      .select();

    if (profileError) {
      console.error('❌ Erro ao criar perfil:', profileError.message);
    } else {
      console.log('✅ Perfil criado/atualizado com sucesso!');
    }

    // 3. Atribuir role de admin
    console.log('\n3️⃣ Atribuindo role de administrador...');
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        role: 'admin'
      }, {
        onConflict: 'user_id,role'
      })
      .select();

    if (roleError) {
      console.error('❌ Erro ao atribuir role:', roleError.message);
    } else {
      console.log('✅ Role de administrador atribuída com sucesso!');
    }

    console.log('\n🎉 Processo concluído!');
    console.log('📧 Email: marauagorars@gmail.com');
    console.log('🔑 Senha: Ktdg#1020');
    console.log('👑 Role: admin');

  } catch (error) {
    console.error('❌ Erro ao criar perfil/role:', error);
  }
}

createAdminUser();
