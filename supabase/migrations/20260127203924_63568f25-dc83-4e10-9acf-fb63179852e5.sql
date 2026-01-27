-- Roles (admin) + acesso seguro para ler mensagens de contato

-- 1) Enum de roles (idempotente)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
  END IF;
END $$;

-- 2) Tabela de roles (separada) - conforme recomendação de segurança
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz not null default now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Ninguém lê roles diretamente via client por enquanto (admin UI virá depois)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='user_roles' AND policyname='No direct select on user_roles'
  ) THEN
    CREATE POLICY "No direct select on user_roles"
    ON public.user_roles
    FOR SELECT
    USING (false);
  END IF;
END $$;

-- 3) Função security definer para checar role sem recursão
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4) Permite SELECT na tabela de mensagens apenas para authenticated (privilégio),
--    mas o acesso real é controlado pela policy de admin
GRANT SELECT ON TABLE public.contact_messages TO authenticated;

-- 5) Policy: somente admins podem ler mensagens
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='contact_messages' AND policyname='Admins can read contact messages'
  ) THEN
    CREATE POLICY "Admins can read contact messages"
    ON public.contact_messages
    FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;
