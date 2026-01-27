-- =========================
-- Horoscope tables
-- =========================
CREATE TABLE IF NOT EXISTS public.zodiac_sign_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sign_slug text NOT NULL UNIQUE,
  sign_name text NOT NULL,
  date_range text NULL,
  icon text NULL,
  overview text NULL,
  love text NULL,
  career text NULL,
  health text NULL,
  traits jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.horoscopes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sign_slug text NOT NULL,
  for_date date NOT NULL,
  period text NOT NULL DEFAULT 'today',
  content text NOT NULL,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (sign_slug, for_date, period)
);

ALTER TABLE public.zodiac_sign_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horoscopes ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- Profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='zodiac_sign_profiles' AND policyname='Public can read published zodiac sign profiles'
  ) THEN
    CREATE POLICY "Public can read published zodiac sign profiles" ON public.zodiac_sign_profiles
    FOR SELECT USING (is_published = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='zodiac_sign_profiles' AND policyname='Admins can manage zodiac sign profiles'
  ) THEN
    CREATE POLICY "Admins can manage zodiac sign profiles" ON public.zodiac_sign_profiles
    FOR ALL
    USING (public.has_role(auth.uid(), 'admin'::public.app_role))
    WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;

  -- Horoscopes
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='horoscopes' AND policyname='Public can read published horoscopes'
  ) THEN
    CREATE POLICY "Public can read published horoscopes" ON public.horoscopes
    FOR SELECT USING (is_published = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='horoscopes' AND policyname='Admins can manage horoscopes'
  ) THEN
    CREATE POLICY "Admins can manage horoscopes" ON public.horoscopes
    FOR ALL
    USING (public.has_role(auth.uid(), 'admin'::public.app_role))
    WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;

-- =========================
-- Triggers: updated_at
-- =========================
-- Note: public.set_updated_at() already exists

-- Core content tables
DROP TRIGGER IF EXISTS set_city_points_updated_at ON public.city_points;
CREATE TRIGGER set_city_points_updated_at
BEFORE UPDATE ON public.city_points
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_news_updated_at ON public.news;
CREATE TRIGGER set_news_updated_at
BEFORE UPDATE ON public.news
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_jobs_updated_at ON public.jobs;
CREATE TRIGGER set_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_events_updated_at ON public.events;
CREATE TRIGGER set_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_galleries_updated_at ON public.galleries;
CREATE TRIGGER set_galleries_updated_at
BEFORE UPDATE ON public.galleries
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Services
DROP TRIGGER IF EXISTS set_public_services_updated_at ON public.public_services;
CREATE TRIGGER set_public_services_updated_at
BEFORE UPDATE ON public.public_services
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_public_service_categories_updated_at ON public.public_service_categories;
CREATE TRIGGER set_public_service_categories_updated_at
BEFORE UPDATE ON public.public_service_categories
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_public_service_links_updated_at ON public.public_service_links;
CREATE TRIGGER set_public_service_links_updated_at
BEFORE UPDATE ON public.public_service_links
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Emergency / events submissions
DROP TRIGGER IF EXISTS set_emergency_numbers_updated_at ON public.emergency_numbers;
CREATE TRIGGER set_emergency_numbers_updated_at
BEFORE UPDATE ON public.emergency_numbers
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_event_submissions_updated_at ON public.event_submissions;
CREATE TRIGGER set_event_submissions_updated_at
BEFORE UPDATE ON public.event_submissions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Classifieds (ensure present)
DROP TRIGGER IF EXISTS set_classified_categories_updated_at ON public.classified_categories;
CREATE TRIGGER set_classified_categories_updated_at
BEFORE UPDATE ON public.classified_categories
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_classified_ads_updated_at ON public.classified_ads;
CREATE TRIGGER set_classified_ads_updated_at
BEFORE UPDATE ON public.classified_ads
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Horoscope triggers
DROP TRIGGER IF EXISTS set_zodiac_sign_profiles_updated_at ON public.zodiac_sign_profiles;
CREATE TRIGGER set_zodiac_sign_profiles_updated_at
BEFORE UPDATE ON public.zodiac_sign_profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_horoscopes_updated_at ON public.horoscopes;
CREATE TRIGGER set_horoscopes_updated_at
BEFORE UPDATE ON public.horoscopes
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================
-- Triggers: search_vector maintenance
-- =========================
-- Note: public.set_search_vector() already exists

DROP TRIGGER IF EXISTS set_news_search_vector ON public.news;
CREATE TRIGGER set_news_search_vector
BEFORE INSERT OR UPDATE ON public.news
FOR EACH ROW EXECUTE FUNCTION public.set_search_vector();

DROP TRIGGER IF EXISTS set_jobs_search_vector ON public.jobs;
CREATE TRIGGER set_jobs_search_vector
BEFORE INSERT OR UPDATE ON public.jobs
FOR EACH ROW EXECUTE FUNCTION public.set_search_vector();

DROP TRIGGER IF EXISTS set_city_points_search_vector ON public.city_points;
CREATE TRIGGER set_city_points_search_vector
BEFORE INSERT OR UPDATE ON public.city_points
FOR EACH ROW EXECUTE FUNCTION public.set_search_vector();

DROP TRIGGER IF EXISTS set_events_search_vector ON public.events;
CREATE TRIGGER set_events_search_vector
BEFORE INSERT OR UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION public.set_search_vector();
