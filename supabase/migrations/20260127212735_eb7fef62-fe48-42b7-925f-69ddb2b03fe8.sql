-- Categorias de serviços públicos
CREATE TABLE IF NOT EXISTS public.public_service_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  icon text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_public_service_categories_sort ON public.public_service_categories (sort_order, name);

-- Serviços
CREATE TABLE IF NOT EXISTS public.public_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  category_slug text REFERENCES public.public_service_categories(slug) ON UPDATE CASCADE ON DELETE SET NULL,
  summary text,
  details text,
  phone text,
  address text,
  hours_label text,
  status_badge text, -- ex: 'Aberto Agora', 'Fecha em Breve', 'Informativo'
  is_featured boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  views_count bigint NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_public_services_published ON public.public_services (is_published, is_featured);
CREATE INDEX IF NOT EXISTS idx_public_services_category ON public.public_services (category_slug);
CREATE INDEX IF NOT EXISTS idx_public_services_sort ON public.public_services (sort_order, created_at DESC);

-- Ações/links (botões) do serviço
CREATE TABLE IF NOT EXISTS public.public_service_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES public.public_services(id) ON DELETE CASCADE,
  label text NOT NULL,
  href text NOT NULL,
  icon text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_public_service_actions_service ON public.public_service_actions (service_id, sort_order);

-- Links úteis (cards simples)
CREATE TABLE IF NOT EXISTS public.public_service_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  label text NOT NULL,
  href text NOT NULL,
  icon text,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_public_service_links_sort ON public.public_service_links (is_published, sort_order);

-- Números de emergência
CREATE TABLE IF NOT EXISTS public.emergency_numbers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  number text NOT NULL,
  icon text,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_emergency_numbers_sort ON public.emergency_numbers (is_published, sort_order);

-- Triggers updated_at (função public.set_updated_at() já existe)
DROP TRIGGER IF EXISTS set_updated_at_public_service_categories ON public.public_service_categories;
CREATE TRIGGER set_updated_at_public_service_categories
BEFORE UPDATE ON public.public_service_categories
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_public_services ON public.public_services;
CREATE TRIGGER set_updated_at_public_services
BEFORE UPDATE ON public.public_services
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_public_service_links ON public.public_service_links;
CREATE TRIGGER set_updated_at_public_service_links
BEFORE UPDATE ON public.public_service_links
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_emergency_numbers ON public.emergency_numbers;
CREATE TRIGGER set_updated_at_emergency_numbers
BEFORE UPDATE ON public.emergency_numbers
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.public_service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_service_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_service_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_numbers ENABLE ROW LEVEL SECURITY;

-- Leitura pública
DROP POLICY IF EXISTS "Public can read categories" ON public.public_service_categories;
CREATE POLICY "Public can read categories"
ON public.public_service_categories
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Public can read published services" ON public.public_services;
CREATE POLICY "Public can read published services"
ON public.public_services
FOR SELECT
USING (is_published = true);

DROP POLICY IF EXISTS "Public can read actions for published services" ON public.public_service_actions;
CREATE POLICY "Public can read actions for published services"
ON public.public_service_actions
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.public_services s
    WHERE s.id = service_id
      AND s.is_published = true
  )
);

DROP POLICY IF EXISTS "Public can read published links" ON public.public_service_links;
CREATE POLICY "Public can read published links"
ON public.public_service_links
FOR SELECT
USING (is_published = true);

DROP POLICY IF EXISTS "Public can read emergency numbers" ON public.emergency_numbers;
CREATE POLICY "Public can read emergency numbers"
ON public.emergency_numbers
FOR SELECT
USING (is_published = true);

-- Admin CRUD
-- categories
DROP POLICY IF EXISTS "Admins can insert service categories" ON public.public_service_categories;
CREATE POLICY "Admins can insert service categories"
ON public.public_service_categories
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update service categories" ON public.public_service_categories;
CREATE POLICY "Admins can update service categories"
ON public.public_service_categories
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can delete service categories" ON public.public_service_categories;
CREATE POLICY "Admins can delete service categories"
ON public.public_service_categories
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- services
DROP POLICY IF EXISTS "Admins can insert public services" ON public.public_services;
CREATE POLICY "Admins can insert public services"
ON public.public_services
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update public services" ON public.public_services;
CREATE POLICY "Admins can update public services"
ON public.public_services
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can delete public services" ON public.public_services;
CREATE POLICY "Admins can delete public services"
ON public.public_services
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- actions
DROP POLICY IF EXISTS "Admins can insert public service actions" ON public.public_service_actions;
CREATE POLICY "Admins can insert public service actions"
ON public.public_service_actions
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update public service actions" ON public.public_service_actions;
CREATE POLICY "Admins can update public service actions"
ON public.public_service_actions
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can delete public service actions" ON public.public_service_actions;
CREATE POLICY "Admins can delete public service actions"
ON public.public_service_actions
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- links
DROP POLICY IF EXISTS "Admins can insert public service links" ON public.public_service_links;
CREATE POLICY "Admins can insert public service links"
ON public.public_service_links
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update public service links" ON public.public_service_links;
CREATE POLICY "Admins can update public service links"
ON public.public_service_links
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can delete public service links" ON public.public_service_links;
CREATE POLICY "Admins can delete public service links"
ON public.public_service_links
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- emergency
DROP POLICY IF EXISTS "Admins can insert emergency numbers" ON public.emergency_numbers;
CREATE POLICY "Admins can insert emergency numbers"
ON public.emergency_numbers
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update emergency numbers" ON public.emergency_numbers;
CREATE POLICY "Admins can update emergency numbers"
ON public.emergency_numbers
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can delete emergency numbers" ON public.emergency_numbers;
CREATE POLICY "Admins can delete emergency numbers"
ON public.emergency_numbers
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::public.app_role));
