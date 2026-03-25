-- Adicionando campos extras para Vagas de Emprego
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS slug text UNIQUE,
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS requirements text,
ADD COLUMN IF NOT EXISTS benefits text,
ADD COLUMN IF NOT EXISTS salary_range text;

-- Criar slugs para registros existentes se houver
UPDATE public.jobs SET slug = lower(replace(title, ' ', '-')) || '-' || substring(id::text, 1, 8) WHERE slug IS NULL;

-- Tornar slug obrigatório após preencher
ALTER TABLE public.jobs ALTER COLUMN slug SET NOT NULL;
