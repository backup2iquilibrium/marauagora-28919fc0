-- Galerias
CREATE TABLE IF NOT EXISTS public.galleries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text,
  category text,
  city text NOT NULL DEFAULT 'Marau',
  cover_image_url text,
  media_kind text NOT NULL DEFAULT 'mixed', -- 'photos' | 'videos' | 'mixed'
  is_featured boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  views_count bigint NOT NULL DEFAULT 0,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_galleries_published_at ON public.galleries (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_galleries_city ON public.galleries (city);
CREATE INDEX IF NOT EXISTS idx_galleries_category ON public.galleries (category);
CREATE INDEX IF NOT EXISTS idx_galleries_featured ON public.galleries (is_featured) WHERE is_featured = true;

-- Itens (fotos/vídeos) da galeria
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id uuid NOT NULL REFERENCES public.galleries(id) ON DELETE CASCADE,
  kind text NOT NULL DEFAULT 'photo', -- 'photo' | 'video'
  title text,
  media_url text NOT NULL,
  thumbnail_url text,
  duration_seconds integer, -- para vídeos
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gallery_items_gallery_id ON public.gallery_items (gallery_id);
CREATE INDEX IF NOT EXISTS idx_gallery_items_sort ON public.gallery_items (gallery_id, sort_order, created_at);

-- updated_at trigger function já existe: public.set_updated_at()
DROP TRIGGER IF EXISTS set_updated_at_galleries ON public.galleries;
CREATE TRIGGER set_updated_at_galleries
BEFORE UPDATE ON public.galleries
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

-- Leitura pública apenas de publicadas
DROP POLICY IF EXISTS "Public can read published galleries" ON public.galleries;
CREATE POLICY "Public can read published galleries"
ON public.galleries
FOR SELECT
USING (is_published = true);

DROP POLICY IF EXISTS "Public can read gallery items" ON public.gallery_items;
CREATE POLICY "Public can read gallery items"
ON public.gallery_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.galleries g
    WHERE g.id = gallery_id
      AND g.is_published = true
  )
);

-- Admin CRUD
DROP POLICY IF EXISTS "Admins can insert galleries" ON public.galleries;
CREATE POLICY "Admins can insert galleries"
ON public.galleries
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update galleries" ON public.galleries;
CREATE POLICY "Admins can update galleries"
ON public.galleries
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can delete galleries" ON public.galleries;
CREATE POLICY "Admins can delete galleries"
ON public.galleries
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can insert gallery items" ON public.gallery_items;
CREATE POLICY "Admins can insert gallery items"
ON public.gallery_items
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update gallery items" ON public.gallery_items;
CREATE POLICY "Admins can update gallery items"
ON public.gallery_items
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can delete gallery items" ON public.gallery_items;
CREATE POLICY "Admins can delete gallery items"
ON public.gallery_items
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::public.app_role));
