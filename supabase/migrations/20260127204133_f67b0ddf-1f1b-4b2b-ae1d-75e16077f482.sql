-- Anti-spam: rate limit para endpoint de contato

CREATE TABLE IF NOT EXISTS public.contact_message_rate_limits (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  window_start timestamptz not null default now(),
  count integer not null default 0,
  updated_at timestamptz not null default now()
);

CREATE INDEX IF NOT EXISTS idx_contact_message_rate_limits_window_start
  ON public.contact_message_rate_limits (window_start);

ALTER TABLE public.contact_message_rate_limits ENABLE ROW LEVEL SECURITY;

-- nunca expor isso via client
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='contact_message_rate_limits' AND policyname='No direct select on contact_message_rate_limits'
  ) THEN
    CREATE POLICY "No direct select on contact_message_rate_limits"
    ON public.contact_message_rate_limits
    FOR SELECT
    USING (false);
  END IF;
END $$;

REVOKE ALL ON TABLE public.contact_message_rate_limits FROM anon;
REVOKE ALL ON TABLE public.contact_message_rate_limits FROM authenticated;

-- user_roles hardening: impedir qualquer escrita via client
REVOKE ALL ON TABLE public.user_roles FROM anon;
REVOKE ALL ON TABLE public.user_roles FROM authenticated;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='user_roles' AND policyname='No direct insert on user_roles'
  ) THEN
    CREATE POLICY "No direct insert on user_roles"
    ON public.user_roles
    FOR INSERT
    WITH CHECK (false);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='user_roles' AND policyname='No direct update on user_roles'
  ) THEN
    CREATE POLICY "No direct update on user_roles"
    ON public.user_roles
    FOR UPDATE
    USING (false);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='user_roles' AND policyname='No direct delete on user_roles'
  ) THEN
    CREATE POLICY "No direct delete on user_roles"
    ON public.user_roles
    FOR DELETE
    USING (false);
  END IF;
END $$;
