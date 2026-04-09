-- ═══════════════════════════════════════════════════════════
-- Criação da tabela site_settings para configurações globais
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.site_settings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key         TEXT NOT NULL UNIQUE,
  value       JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 1. Leitura pública (para Expediente, Links, etc.)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='site_settings' AND policyname='Allow public read access to site_settings'
  ) THEN
    CREATE POLICY "Allow public read access to site_settings" 
    ON public.site_settings FOR SELECT USING (true);
  END IF;
END $$;

-- 2. Escrita restrita a administradores
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='site_settings' AND policyname='Admins can manage site_settings'
  ) THEN
    CREATE POLICY "Admins can manage site_settings" 
    ON public.site_settings FOR ALL 
    TO authenticated 
    USING (public.has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

-- Trigger para atualizar o timestamp updated_at automaticamente
-- Nota: A função set_updated_at() já deve existir das migrações anteriores
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='trg_site_settings_updated_at') THEN
    CREATE TRIGGER trg_site_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- Inserção de dados iniciais para o Expediente (se não existir)
INSERT INTO public.site_settings (key, value)
VALUES (
  'expediente_info',
  '{
    "company_name": "Marau Agora Comunicações LTDA",
    "cnpj": "00.000.000/0000-00",
    "address": "Av. Júlio Borella, 777 - 3 andar - Marau - RS",
    "phone": "(54) 92000-1320",
    "email": "marauagorars@gmail.com",
    "director": "Direção Geral",
    "editor": "Redação"
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;
