-- Políticas explícitas para bloquear mutações via client (defesa em profundidade)

-- contact_messages: bloquear INSERT/UPDATE/DELETE para qualquer role via PostgREST
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='contact_messages' AND policyname='No direct insert on contact_messages'
  ) THEN
    CREATE POLICY "No direct insert on contact_messages"
    ON public.contact_messages
    FOR INSERT
    WITH CHECK (false);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='contact_messages' AND policyname='No direct update on contact_messages'
  ) THEN
    CREATE POLICY "No direct update on contact_messages"
    ON public.contact_messages
    FOR UPDATE
    USING (false);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='contact_messages' AND policyname='No direct delete on contact_messages'
  ) THEN
    CREATE POLICY "No direct delete on contact_messages"
    ON public.contact_messages
    FOR DELETE
    USING (false);
  END IF;
END $$;

-- contact_message_rate_limits: bloquear INSERT/UPDATE/DELETE para qualquer role via PostgREST
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='contact_message_rate_limits' AND policyname='No direct insert on contact_message_rate_limits'
  ) THEN
    CREATE POLICY "No direct insert on contact_message_rate_limits"
    ON public.contact_message_rate_limits
    FOR INSERT
    WITH CHECK (false);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='contact_message_rate_limits' AND policyname='No direct update on contact_message_rate_limits'
  ) THEN
    CREATE POLICY "No direct update on contact_message_rate_limits"
    ON public.contact_message_rate_limits
    FOR UPDATE
    USING (false);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='contact_message_rate_limits' AND policyname='No direct delete on contact_message_rate_limits'
  ) THEN
    CREATE POLICY "No direct delete on contact_message_rate_limits"
    ON public.contact_message_rate_limits
    FOR DELETE
    USING (false);
  END IF;
END $$;
