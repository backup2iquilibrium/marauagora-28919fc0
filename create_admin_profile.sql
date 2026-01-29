-- Script para criar usuário administrador
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Primeiro, vamos verificar se o usuário existe
-- O usuário já foi criado com ID: b40c2f2b-1a16-46d0-a658-fa7d4eb07766

-- 2. Criar perfil (ignorando RLS)
INSERT INTO public.profiles (id, display_name, is_verified, created_at, updated_at)
VALUES (
  'b40c2f2b-1a16-46d0-a658-fa7d4eb07766',
  'Administrador',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE
SET 
  display_name = EXCLUDED.display_name,
  is_verified = EXCLUDED.is_verified,
  updated_at = NOW();

-- 3. Atribuir role de admin
INSERT INTO public.user_roles (user_id, role, created_at)
VALUES (
  'b40c2f2b-1a16-46d0-a658-fa7d4eb07766',
  'admin',
  NOW()
)
ON CONFLICT (user_id, role) DO NOTHING;

-- 4. Verificar se foi criado corretamente
SELECT 
  p.id,
  p.display_name,
  p.is_verified,
  ur.role
FROM public.profiles p
LEFT JOIN public.user_roles ur ON p.id = ur.user_id
WHERE p.id = 'b40c2f2b-1a16-46d0-a658-fa7d4eb07766';
