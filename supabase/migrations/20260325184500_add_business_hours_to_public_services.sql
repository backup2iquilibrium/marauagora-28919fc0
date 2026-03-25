-- Adiciona coluna de horários estruturados para estabelecimentos do guia da cidade
ALTER TABLE public.public_services
ADD COLUMN IF NOT EXISTS business_hours jsonb DEFAULT '{}'::jsonb;
