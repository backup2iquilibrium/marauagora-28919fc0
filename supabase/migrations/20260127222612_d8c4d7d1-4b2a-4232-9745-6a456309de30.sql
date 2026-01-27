-- Publicidade: espaços e campanhas

-- 1) Enum de status de campanha
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ad_campaign_status') THEN
    CREATE TYPE public.ad_campaign_status AS ENUM ('draft', 'active', 'paused', 'ended');
  END IF;
END $$;

-- 2) Tabela de espaços publicitários
CREATE TABLE IF NOT EXISTS public.ad_spaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  size_label text NOT NULL,          -- ex: 728x90
  device_label text NOT NULL,        -- ex: Desktop / Mobile / Responsivo
  monthly_price_cents integer NULL,  -- opcional, para exibir no painel
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3) Tabela de campanhas
CREATE TABLE IF NOT EXISTS public.ad_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  client_name text NOT NULL,
  space_id uuid NOT NULL REFERENCES public.ad_spaces(id) ON DELETE RESTRICT,
  status public.ad_campaign_status NOT NULL DEFAULT 'draft',
  starts_at date NULL,
  ends_at date NULL,
  notes text NULL,
  impressions bigint NOT NULL DEFAULT 0,
  clicks bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_ad_spaces_active_sort ON public.ad_spaces (is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_space ON public.ad_campaigns (space_id);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_status ON public.ad_campaigns (status);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_dates ON public.ad_campaigns (starts_at, ends_at);

-- 4) RLS
ALTER TABLE public.ad_spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_campaigns ENABLE ROW LEVEL SECURITY;

-- 5) Políticas (admin-only)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ad_spaces' AND policyname='Admins can manage ad_spaces'
  ) THEN
    CREATE POLICY "Admins can manage ad_spaces"
    ON public.ad_spaces
    FOR ALL
    USING (public.has_role(auth.uid(), 'admin'::public.app_role))
    WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ad_campaigns' AND policyname='Admins can manage ad_campaigns'
  ) THEN
    CREATE POLICY "Admins can manage ad_campaigns"
    ON public.ad_campaigns
    FOR ALL
    USING (public.has_role(auth.uid(), 'admin'::public.app_role))
    WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;

-- 6) Triggers updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_ad_spaces_set_updated_at'
  ) THEN
    CREATE TRIGGER trg_ad_spaces_set_updated_at
    BEFORE UPDATE ON public.ad_spaces
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_ad_campaigns_set_updated_at'
  ) THEN
    CREATE TRIGGER trg_ad_campaigns_set_updated_at
    BEFORE UPDATE ON public.ad_campaigns
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;