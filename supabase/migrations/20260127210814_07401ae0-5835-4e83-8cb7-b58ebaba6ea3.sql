-- Agenda de Eventos: ajustes de schema + moderação (submissões)

-- 1) Ajustar tabela public.events para suportar filtros e destaque
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS is_free boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS city text NOT NULL DEFAULT 'Marau',
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS is_featured_week boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_events_starts_at ON public.events(starts_at);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);
CREATE INDEX IF NOT EXISTS idx_events_is_free ON public.events(is_free);
CREATE INDEX IF NOT EXISTS idx_events_featured_week ON public.events(is_featured_week) WHERE is_featured_week = true;

-- 2) Tabela de submissões para moderação (não publicar direto)
CREATE TABLE IF NOT EXISTS public.event_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  -- dados do evento
  title text NOT NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  venue text,
  category text,
  is_free boolean NOT NULL DEFAULT false,
  description text,
  city text NOT NULL DEFAULT 'Marau',

  -- dados do organizador (somente moderação)
  organizer_name text NOT NULL,
  organizer_contact text NOT NULL,

  status text NOT NULL DEFAULT 'pending', -- pending | approved | rejected
  notes text
);

ALTER TABLE public.event_submissions ENABLE ROW LEVEL SECURITY;

-- Hardening: impedir acesso direto via client (defesa em profundidade)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='event_submissions' AND policyname='No direct select on event_submissions'
  ) THEN
    CREATE POLICY "No direct select on event_submissions"
    ON public.event_submissions
    FOR SELECT
    USING (false);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='event_submissions' AND policyname='No direct insert on event_submissions'
  ) THEN
    CREATE POLICY "No direct insert on event_submissions"
    ON public.event_submissions
    FOR INSERT
    WITH CHECK (false);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='event_submissions' AND policyname='No direct update on event_submissions'
  ) THEN
    CREATE POLICY "No direct update on event_submissions"
    ON public.event_submissions
    FOR UPDATE
    USING (false);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='event_submissions' AND policyname='No direct delete on event_submissions'
  ) THEN
    CREATE POLICY "No direct delete on event_submissions"
    ON public.event_submissions
    FOR DELETE
    USING (false);
  END IF;

  -- Admins podem ler submissões (para moderação)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='event_submissions' AND policyname='Admins can read event_submissions'
  ) THEN
    CREATE POLICY "Admins can read event_submissions"
    ON public.event_submissions
    FOR SELECT
    TO authenticated
    USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

-- Trigger updated_at para submissões
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='trg_event_submissions_updated_at') THEN
    CREATE TRIGGER trg_event_submissions_updated_at
    BEFORE UPDATE ON public.event_submissions
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 3) Rate limit para submissões de eventos (anti-spam)
CREATE TABLE IF NOT EXISTS public.event_submission_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL,
  window_start timestamptz NOT NULL DEFAULT now(),
  count integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.event_submission_rate_limits ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='event_submission_rate_limits' AND policyname='No direct select on event_submission_rate_limits'
  ) THEN
    CREATE POLICY "No direct select on event_submission_rate_limits"
    ON public.event_submission_rate_limits
    FOR SELECT
    USING (false);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='event_submission_rate_limits' AND policyname='No direct insert on event_submission_rate_limits'
  ) THEN
    CREATE POLICY "No direct insert on event_submission_rate_limits"
    ON public.event_submission_rate_limits
    FOR INSERT
    WITH CHECK (false);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='event_submission_rate_limits' AND policyname='No direct update on event_submission_rate_limits'
  ) THEN
    CREATE POLICY "No direct update on event_submission_rate_limits"
    ON public.event_submission_rate_limits
    FOR UPDATE
    USING (false);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='event_submission_rate_limits' AND policyname='No direct delete on event_submission_rate_limits'
  ) THEN
    CREATE POLICY "No direct delete on event_submission_rate_limits"
    ON public.event_submission_rate_limits
    FOR DELETE
    USING (false);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_event_submission_rate_limits_key ON public.event_submission_rate_limits(key);
