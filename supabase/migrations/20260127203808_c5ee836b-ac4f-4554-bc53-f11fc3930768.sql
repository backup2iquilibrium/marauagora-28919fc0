-- Hardening de segurança para mensagens de contato (PII)

-- 1) Remove políticas conflitantes e mantém bloqueio total de SELECT via PostgREST
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'contact_messages'
      AND policyname = 'Authenticated can select their own contact_messages'
  ) THEN
    EXECUTE 'DROP POLICY "Authenticated can select their own contact_messages" ON public.contact_messages';
  END IF;
END $$;

-- 2) Garante que roles públicas não tenham privilégios diretos no table (mesmo com RLS)
REVOKE ALL ON TABLE public.contact_messages FROM anon;
REVOKE ALL ON TABLE public.contact_messages FROM authenticated;

-- 3) Mantém RLS habilitado (defesa em profundidade)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Observação: INSERT/UPDATE/DELETE continuam SEM políticas.
-- O frontend envia para uma Edge Function que insere com SUPABASE_SERVICE_ROLE_KEY.
