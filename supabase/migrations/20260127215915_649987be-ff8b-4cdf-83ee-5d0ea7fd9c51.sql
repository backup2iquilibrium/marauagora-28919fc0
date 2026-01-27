-- NOTE: Postgres does not support CREATE POLICY IF NOT EXISTS, so we use DO blocks.

-- Profiles table for user metadata
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NULL,
  company_name text NULL,
  avatar_url text NULL,
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='Users can read own profile'
  ) THEN
    CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='Admins can read all profiles'
  ) THEN
    CREATE POLICY "Admins can read all profiles" ON public.profiles
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;

-- updated_at trigger
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email))
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_profile();


-- Classifieds
CREATE TABLE IF NOT EXISTS public.classified_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.classified_ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category_slug text NOT NULL REFERENCES public.classified_categories(slug),
  advertiser_name text NOT NULL,
  advertiser_email text NOT NULL,
  owner_user_id uuid NULL,
  status text NOT NULL DEFAULT 'pending',
  published_at timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_classified_ads_status ON public.classified_ads(status);
CREATE INDEX IF NOT EXISTS idx_classified_ads_category ON public.classified_ads(category_slug);
CREATE INDEX IF NOT EXISTS idx_classified_ads_created_at ON public.classified_ads(created_at);
CREATE INDEX IF NOT EXISTS idx_classified_ads_owner_user_id ON public.classified_ads(owner_user_id);

ALTER TABLE public.classified_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classified_ads ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- categories policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='classified_categories' AND policyname='Public can read active classified categories'
  ) THEN
    CREATE POLICY "Public can read active classified categories" ON public.classified_categories
    FOR SELECT USING (is_active = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='classified_categories' AND policyname='Admins can manage classified categories'
  ) THEN
    CREATE POLICY "Admins can manage classified categories" ON public.classified_categories
    FOR ALL
    USING (public.has_role(auth.uid(), 'admin'::public.app_role))
    WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;

  -- ads policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='classified_ads' AND policyname='Owners can read own classified ads'
  ) THEN
    CREATE POLICY "Owners can read own classified ads" ON public.classified_ads
    FOR SELECT USING (owner_user_id IS NOT NULL AND auth.uid() = owner_user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='classified_ads' AND policyname='Owners can insert own classified ads'
  ) THEN
    CREATE POLICY "Owners can insert own classified ads" ON public.classified_ads
    FOR INSERT WITH CHECK (owner_user_id IS NOT NULL AND auth.uid() = owner_user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='classified_ads' AND policyname='Owners can update own pending classified ads'
  ) THEN
    CREATE POLICY "Owners can update own pending classified ads" ON public.classified_ads
    FOR UPDATE
    USING (owner_user_id IS NOT NULL AND auth.uid() = owner_user_id AND status = 'pending')
    WITH CHECK (owner_user_id IS NOT NULL AND auth.uid() = owner_user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='classified_ads' AND policyname='Admins can manage all classified ads'
  ) THEN
    CREATE POLICY "Admins can manage all classified ads" ON public.classified_ads
    FOR ALL
    USING (public.has_role(auth.uid(), 'admin'::public.app_role))
    WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='classified_ads' AND policyname='Public can read active classified ads'
  ) THEN
    CREATE POLICY "Public can read active classified ads" ON public.classified_ads
    FOR SELECT USING (status = 'active');
  END IF;
END $$;

-- updated_at triggers
DROP TRIGGER IF EXISTS set_classified_categories_updated_at ON public.classified_categories;
CREATE TRIGGER set_classified_categories_updated_at
BEFORE UPDATE ON public.classified_categories
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_classified_ads_updated_at ON public.classified_ads;
CREATE TRIGGER set_classified_ads_updated_at
BEFORE UPDATE ON public.classified_ads
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
