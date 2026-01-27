-- Tabelas base de conteúdo para busca do portal

-- 1) Notícias
CREATE TABLE IF NOT EXISTS public.news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text,
  body text,
  category_slug text NOT NULL DEFAULT 'noticias',
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  search_vector tsvector
);

-- 2) Vagas
CREATE TABLE IF NOT EXISTS public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text,
  employment_type text,
  description text,
  location text,
  posted_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  search_vector tsvector
);

-- 3) Pontos da cidade
CREATE TABLE IF NOT EXISTS public.city_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  category text,
  tags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  search_vector tsvector
);

-- 4) Eventos
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  venue text,
  description text,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  search_vector tsvector
);

-- RLS
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.city_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Leitura pública (portal)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='news' AND policyname='Public can read news') THEN
    CREATE POLICY "Public can read news" ON public.news FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='jobs' AND policyname='Public can read jobs') THEN
    CREATE POLICY "Public can read jobs" ON public.jobs FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='city_points' AND policyname='Public can read city_points') THEN
    CREATE POLICY "Public can read city_points" ON public.city_points FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='events' AND policyname='Public can read events') THEN
    CREATE POLICY "Public can read events" ON public.events FOR SELECT USING (true);
  END IF;
END $$;

-- Mutação apenas admin (usando has_role)
DO $$
BEGIN
  -- news
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='news' AND policyname='Admins can insert news') THEN
    CREATE POLICY "Admins can insert news" ON public.news FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='news' AND policyname='Admins can update news') THEN
    CREATE POLICY "Admins can update news" ON public.news FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='news' AND policyname='Admins can delete news') THEN
    CREATE POLICY "Admins can delete news" ON public.news FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;

  -- jobs
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='jobs' AND policyname='Admins can insert jobs') THEN
    CREATE POLICY "Admins can insert jobs" ON public.jobs FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='jobs' AND policyname='Admins can update jobs') THEN
    CREATE POLICY "Admins can update jobs" ON public.jobs FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='jobs' AND policyname='Admins can delete jobs') THEN
    CREATE POLICY "Admins can delete jobs" ON public.jobs FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;

  -- city_points
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='city_points' AND policyname='Admins can insert city_points') THEN
    CREATE POLICY "Admins can insert city_points" ON public.city_points FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='city_points' AND policyname='Admins can update city_points') THEN
    CREATE POLICY "Admins can update city_points" ON public.city_points FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='city_points' AND policyname='Admins can delete city_points') THEN
    CREATE POLICY "Admins can delete city_points" ON public.city_points FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;

  -- events
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='events' AND policyname='Admins can insert events') THEN
    CREATE POLICY "Admins can insert events" ON public.events FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='events' AND policyname='Admins can update events') THEN
    CREATE POLICY "Admins can update events" ON public.events FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='events' AND policyname='Admins can delete events') THEN
    CREATE POLICY "Admins can delete events" ON public.events FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

-- Função de atualização de timestamps
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Função de indexação de busca (tsvector)
CREATE OR REPLACE FUNCTION public.set_search_vector()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  doc text;
BEGIN
  doc := '';

  -- news
  IF TG_TABLE_NAME = 'news' THEN
    doc := coalesce(NEW.title,'') || ' ' || coalesce(NEW.excerpt,'') || ' ' || coalesce(NEW.body,'') || ' ' || coalesce(NEW.category_slug,'');
  ELSIF TG_TABLE_NAME = 'jobs' THEN
    doc := coalesce(NEW.title,'') || ' ' || coalesce(NEW.company,'') || ' ' || coalesce(NEW.employment_type,'') || ' ' || coalesce(NEW.description,'') || ' ' || coalesce(NEW.location,'');
  ELSIF TG_TABLE_NAME = 'city_points' THEN
    doc := coalesce(NEW.name,'') || ' ' || coalesce(NEW.description,'') || ' ' || coalesce(NEW.category,'') || ' ' || array_to_string(coalesce(NEW.tags,'{}'), ' ');
  ELSIF TG_TABLE_NAME = 'events' THEN
    doc := coalesce(NEW.title,'') || ' ' || coalesce(NEW.venue,'') || ' ' || coalesce(NEW.description,'');
  END IF;

  NEW.search_vector := to_tsvector('portuguese', doc);
  RETURN NEW;
END;
$$;

-- Triggers updated_at + search_vector
DO $$
BEGIN
  -- news
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='trg_news_updated_at') THEN
    CREATE TRIGGER trg_news_updated_at BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='trg_news_search_vector') THEN
    CREATE TRIGGER trg_news_search_vector BEFORE INSERT OR UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION public.set_search_vector();
  END IF;

  -- jobs
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='trg_jobs_updated_at') THEN
    CREATE TRIGGER trg_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='trg_jobs_search_vector') THEN
    CREATE TRIGGER trg_jobs_search_vector BEFORE INSERT OR UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.set_search_vector();
  END IF;

  -- city_points
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='trg_city_points_updated_at') THEN
    CREATE TRIGGER trg_city_points_updated_at BEFORE UPDATE ON public.city_points FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='trg_city_points_search_vector') THEN
    CREATE TRIGGER trg_city_points_search_vector BEFORE INSERT OR UPDATE ON public.city_points FOR EACH ROW EXECUTE FUNCTION public.set_search_vector();
  END IF;

  -- events
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='trg_events_updated_at') THEN
    CREATE TRIGGER trg_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='trg_events_search_vector') THEN
    CREATE TRIGGER trg_events_search_vector BEFORE INSERT OR UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.set_search_vector();
  END IF;
END $$;

-- Índices de busca
CREATE INDEX IF NOT EXISTS idx_news_search_vector ON public.news USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_jobs_search_vector ON public.jobs USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_city_points_search_vector ON public.city_points USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_events_search_vector ON public.events USING GIN(search_vector);

-- Tipo e função unificada de busca
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'portal_search_result' AND typnamespace = 'public'::regnamespace) THEN
    CREATE TYPE public.portal_search_result AS (
      item_type text,
      item_id uuid,
      title text,
      excerpt text,
      route text,
      published_at timestamptz,
      rank real
    );
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.search_portal(
  q text,
  category text DEFAULT 'all',
  sort text DEFAULT 'relevance',
  page_size int DEFAULT 10,
  page_offset int DEFAULT 0
)
RETURNS SETOF public.portal_search_result
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  WITH query AS (
    SELECT
      NULLIF(trim(coalesce(q,'')), '') AS q,
      CASE
        WHEN lower(coalesce(category,'all')) IN ('all','news','jobs','points','events') THEN lower(category)
        ELSE 'all'
      END AS category,
      CASE
        WHEN lower(coalesce(sort,'relevance')) IN ('relevance','newest','oldest') THEN lower(sort)
        ELSE 'relevance'
      END AS sort
  ),
  ts AS (
    SELECT
      CASE WHEN q IS NULL THEN NULL
           ELSE websearch_to_tsquery('portuguese', q)
      END AS tsq,
      category,
      sort
    FROM query
  ),
  unioned AS (
    -- news
    SELECT
      'news'::text AS item_type,
      n.id AS item_id,
      n.title,
      n.excerpt,
      ('/noticia/' || n.slug) AS route,
      n.published_at,
      CASE
        WHEN (SELECT tsq FROM ts) IS NULL THEN 0
        ELSE ts_rank(n.search_vector, (SELECT tsq FROM ts))
      END AS rank
    FROM public.news n
    WHERE (SELECT category FROM ts) IN ('all','news')
      AND (
        (SELECT tsq FROM ts) IS NULL
        OR n.search_vector @@ (SELECT tsq FROM ts)
        OR n.title ILIKE '%' || (SELECT q FROM query) || '%'
      )

    UNION ALL

    -- jobs
    SELECT
      'jobs'::text,
      j.id,
      j.title,
      (coalesce(j.company,'') || CASE WHEN j.company IS NULL THEN '' ELSE ' • ' END || coalesce(j.employment_type,''))::text AS excerpt,
      ('/vagas/' || j.id::text) AS route,
      j.posted_at AS published_at,
      CASE
        WHEN (SELECT tsq FROM ts) IS NULL THEN 0
        ELSE ts_rank(j.search_vector, (SELECT tsq FROM ts))
      END AS rank
    FROM public.jobs j
    WHERE (SELECT category FROM ts) IN ('all','jobs')
      AND (
        (SELECT tsq FROM ts) IS NULL
        OR j.search_vector @@ (SELECT tsq FROM ts)
        OR j.title ILIKE '%' || (SELECT q FROM query) || '%'
      )

    UNION ALL

    -- points
    SELECT
      'points'::text,
      p.id,
      p.name AS title,
      p.description AS excerpt,
      ('/pontos')::text AS route,
      p.created_at AS published_at,
      CASE
        WHEN (SELECT tsq FROM ts) IS NULL THEN 0
        ELSE ts_rank(p.search_vector, (SELECT tsq FROM ts))
      END AS rank
    FROM public.city_points p
    WHERE (SELECT category FROM ts) IN ('all','points')
      AND (
        (SELECT tsq FROM ts) IS NULL
        OR p.search_vector @@ (SELECT tsq FROM ts)
        OR p.name ILIKE '%' || (SELECT q FROM query) || '%'
      )

    UNION ALL

    -- events
    SELECT
      'events'::text,
      e.id,
      e.title,
      (coalesce(e.venue,'') || CASE WHEN e.venue IS NULL THEN '' ELSE ' • ' END || to_char(e.starts_at, 'DD Mon YYYY'))::text AS excerpt,
      ('/categoria/eventos')::text AS route,
      e.starts_at AS published_at,
      CASE
        WHEN (SELECT tsq FROM ts) IS NULL THEN 0
        ELSE ts_rank(e.search_vector, (SELECT tsq FROM ts))
      END AS rank
    FROM public.events e
    WHERE (SELECT category FROM ts) IN ('all','events')
      AND (
        (SELECT tsq FROM ts) IS NULL
        OR e.search_vector @@ (SELECT tsq FROM ts)
        OR e.title ILIKE '%' || (SELECT q FROM query) || '%'
      )
  )
  SELECT *
  FROM unioned
  ORDER BY
    CASE WHEN (SELECT sort FROM ts) = 'relevance' THEN rank END DESC NULLS LAST,
    CASE WHEN (SELECT sort FROM ts) = 'newest' THEN published_at END DESC NULLS LAST,
    CASE WHEN (SELECT sort FROM ts) = 'oldest' THEN published_at END ASC NULLS LAST,
    published_at DESC
  LIMIT greatest(1, page_size)
  OFFSET greatest(0, page_offset);
$$;

GRANT EXECUTE ON FUNCTION public.search_portal(text, text, text, int, int) TO anon, authenticated;
