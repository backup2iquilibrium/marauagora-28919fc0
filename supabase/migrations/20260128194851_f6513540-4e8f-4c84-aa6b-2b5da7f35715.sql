-- Create table to store media/thumbnail for classified ads (used in Admin Classificados UI)
CREATE TABLE IF NOT EXISTS public.classified_ad_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id UUID NOT NULL REFERENCES public.classified_ads(id) ON DELETE CASCADE,
  kind TEXT NOT NULL DEFAULT 'image',
  media_url TEXT NOT NULL,
  thumbnail_url TEXT NULL,
  width INTEGER NULL,
  height INTEGER NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_classified_ad_media_ad_id ON public.classified_ad_media(ad_id);
CREATE INDEX IF NOT EXISTS idx_classified_ad_media_sort_order ON public.classified_ad_media(sort_order);

ALTER TABLE public.classified_ad_media ENABLE ROW LEVEL SECURITY;

-- Admins can manage all media
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='classified_ad_media' AND policyname='Admins can manage classified_ad_media'
  ) THEN
    CREATE POLICY "Admins can manage classified_ad_media"
    ON public.classified_ad_media
    FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'::public.app_role))
    WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;

-- Owners can read media for their own ads
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='classified_ad_media' AND policyname='Owners can read media for own classified ads'
  ) THEN
    CREATE POLICY "Owners can read media for own classified ads"
    ON public.classified_ad_media
    FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1
        FROM public.classified_ads a
        WHERE a.id = classified_ad_media.ad_id
          AND a.owner_user_id IS NOT NULL
          AND a.owner_user_id = auth.uid()
      )
    );
  END IF;
END $$;

-- Owners can insert media for their own ads
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='classified_ad_media' AND policyname='Owners can insert media for own classified ads'
  ) THEN
    CREATE POLICY "Owners can insert media for own classified ads"
    ON public.classified_ad_media
    FOR INSERT
    TO authenticated
    WITH CHECK (
      EXISTS (
        SELECT 1
        FROM public.classified_ads a
        WHERE a.id = classified_ad_media.ad_id
          AND a.owner_user_id IS NOT NULL
          AND a.owner_user_id = auth.uid()
      )
    );
  END IF;
END $$;

-- Owners can update/delete media for their own ads ONLY while ad is pending (matches moderation flow)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='classified_ad_media' AND policyname='Owners can update own pending classified ad media'
  ) THEN
    CREATE POLICY "Owners can update own pending classified ad media"
    ON public.classified_ad_media
    FOR UPDATE
    TO authenticated
    USING (
      EXISTS (
        SELECT 1
        FROM public.classified_ads a
        WHERE a.id = classified_ad_media.ad_id
          AND a.owner_user_id IS NOT NULL
          AND a.owner_user_id = auth.uid()
          AND a.status = 'pending'
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1
        FROM public.classified_ads a
        WHERE a.id = classified_ad_media.ad_id
          AND a.owner_user_id IS NOT NULL
          AND a.owner_user_id = auth.uid()
          AND a.status = 'pending'
      )
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='classified_ad_media' AND policyname='Owners can delete own pending classified ad media'
  ) THEN
    CREATE POLICY "Owners can delete own pending classified ad media"
    ON public.classified_ad_media
    FOR DELETE
    TO authenticated
    USING (
      EXISTS (
        SELECT 1
        FROM public.classified_ads a
        WHERE a.id = classified_ad_media.ad_id
          AND a.owner_user_id IS NOT NULL
          AND a.owner_user_id = auth.uid()
          AND a.status = 'pending'
      )
    );
  END IF;
END $$;

-- Public can read media for active ads (no PII)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='classified_ad_media' AND policyname='Public can read media for active classified ads'
  ) THEN
    CREATE POLICY "Public can read media for active classified ads"
    ON public.classified_ad_media
    FOR SELECT
    TO anon, authenticated
    USING (
      EXISTS (
        SELECT 1
        FROM public.classified_ads a
        WHERE a.id = classified_ad_media.ad_id
          AND a.status = 'active'
      )
    );
  END IF;
END $$;