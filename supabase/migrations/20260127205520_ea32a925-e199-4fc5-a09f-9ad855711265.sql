-- Metadados de busca (contagens por tipo) para montar filtros/paginação

CREATE OR REPLACE FUNCTION public.search_portal_counts(
  q text,
  category text DEFAULT 'all'
)
RETURNS jsonb
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  WITH query AS (
    SELECT NULLIF(trim(coalesce(q,'')), '') AS q,
           CASE
             WHEN lower(coalesce(category,'all')) IN ('all','news','jobs','points','events') THEN lower(category)
             ELSE 'all'
           END AS category
  ),
  ts AS (
    SELECT CASE WHEN q IS NULL THEN NULL ELSE websearch_to_tsquery('portuguese', q) END AS tsq,
           category,
           q
    FROM query
  ),
  c_news AS (
    SELECT count(*)::int AS c
    FROM public.news n
    WHERE (SELECT category FROM ts) IN ('all','news')
      AND (
        (SELECT tsq FROM ts) IS NULL
        OR n.search_vector @@ (SELECT tsq FROM ts)
        OR n.title ILIKE '%' || (SELECT q FROM ts) || '%'
      )
  ),
  c_jobs AS (
    SELECT count(*)::int AS c
    FROM public.jobs j
    WHERE (SELECT category FROM ts) IN ('all','jobs')
      AND (
        (SELECT tsq FROM ts) IS NULL
        OR j.search_vector @@ (SELECT tsq FROM ts)
        OR j.title ILIKE '%' || (SELECT q FROM ts) || '%'
      )
  ),
  c_points AS (
    SELECT count(*)::int AS c
    FROM public.city_points p
    WHERE (SELECT category FROM ts) IN ('all','points')
      AND (
        (SELECT tsq FROM ts) IS NULL
        OR p.search_vector @@ (SELECT tsq FROM ts)
        OR p.name ILIKE '%' || (SELECT q FROM ts) || '%'
      )
  ),
  c_events AS (
    SELECT count(*)::int AS c
    FROM public.events e
    WHERE (SELECT category FROM ts) IN ('all','events')
      AND (
        (SELECT tsq FROM ts) IS NULL
        OR e.search_vector @@ (SELECT tsq FROM ts)
        OR e.title ILIKE '%' || (SELECT q FROM ts) || '%'
      )
  )
  SELECT jsonb_build_object(
    'counts', jsonb_build_object(
      'news', (SELECT c FROM c_news),
      'jobs', (SELECT c FROM c_jobs),
      'points', (SELECT c FROM c_points),
      'events', (SELECT c FROM c_events)
    ),
    'total', (SELECT c FROM c_news) + (SELECT c FROM c_jobs) + (SELECT c FROM c_points) + (SELECT c FROM c_events)
  );
$$;

GRANT EXECUTE ON FUNCTION public.search_portal_counts(text, text) TO anon, authenticated;
