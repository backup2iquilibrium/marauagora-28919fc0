-- Enable RLS if not already enabled
ALTER TABLE public.ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_spaces ENABLE ROW LEVEL SECURITY;

-- 1) Add owner_user_id to campaigns (nullable to avoid breaking existing rows)
ALTER TABLE public.ad_campaigns
ADD COLUMN IF NOT EXISTS owner_user_id uuid;

-- Helpful index
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_owner_user_id
ON public.ad_campaigns (owner_user_id);

-- 2) Advertiser access policies
-- Allow authenticated users to read ad spaces (no PII)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'ad_spaces'
      AND policyname = 'Authenticated can read ad_spaces'
  ) THEN
    CREATE POLICY "Authenticated can read ad_spaces"
    ON public.ad_spaces
    FOR SELECT
    TO authenticated
    USING (true);
  END IF;
END$$;

-- Allow owners to read their own campaigns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'ad_campaigns'
      AND policyname = 'Owners can read own ad_campaigns'
  ) THEN
    CREATE POLICY "Owners can read own ad_campaigns"
    ON public.ad_campaigns
    FOR SELECT
    TO authenticated
    USING (owner_user_id = auth.uid());
  END IF;
END$$;

-- Allow owners to insert their own campaigns (defaults still apply)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'ad_campaigns'
      AND policyname = 'Owners can insert own ad_campaigns'
  ) THEN
    CREATE POLICY "Owners can insert own ad_campaigns"
    ON public.ad_campaigns
    FOR INSERT
    TO authenticated
    WITH CHECK (owner_user_id = auth.uid());
  END IF;
END$$;

-- Allow owners to update their own campaigns (status/fields still controlled by app)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'ad_campaigns'
      AND policyname = 'Owners can update own ad_campaigns'
  ) THEN
    CREATE POLICY "Owners can update own ad_campaigns"
    ON public.ad_campaigns
    FOR UPDATE
    TO authenticated
    USING (owner_user_id = auth.uid())
    WITH CHECK (owner_user_id = auth.uid());
  END IF;
END$$;
