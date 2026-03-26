-- ═══════════════════════════════════════════════════════════
-- Tabelas para o módulo "Quem Somos" gerenciável pelo admin
-- ═══════════════════════════════════════════════════════════

-- 1. Configurações gerais da página (hero, texto introdutório)
CREATE TABLE IF NOT EXISTS public.about_page (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title  TEXT NOT NULL DEFAULT 'Marau Agora: A voz da nossa comunidade',
  hero_subtitle TEXT NOT NULL DEFAULT 'Seu portal confiável para notícias locais, cultura, esportes e eventos em Marau e região.',
  hero_image_url TEXT,
  intro_text  TEXT,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Apenas uma linha
INSERT INTO public.about_page (id) VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- 2. Missão / Visão / Valores
CREATE TABLE IF NOT EXISTS public.about_values (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  icon        TEXT NOT NULL DEFAULT 'flag',
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.about_values (title, description, icon, sort_order) VALUES
  ('Missão', 'Informar com isenção, agilidade e responsabilidade social, contribuindo para o desenvolvimento de Marau.', 'flag', 10),
  ('Visão', 'Ser a principal referência em jornalismo local no norte do RS, reconhecido pela credibilidade.', 'eye', 20),
  ('Valores', 'Ética inegociável, transparência total e compromisso inabalável com a comunidade marauense.', 'badge-check', 30)
ON CONFLICT DO NOTHING;

-- 3. Timeline / Nossa Jornada
CREATE TABLE IF NOT EXISTS public.about_timeline (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year        TEXT NOT NULL,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.about_timeline (year, title, description, sort_order) VALUES
  ('2010', 'O Início do Blog', 'Tudo começou como um pequeno blog opinativo sobre a política local, escrito por um grupo de estudantes de jornalismo apaixonados por Marau.', 10),
  ('2015', 'Lançamento do Portal', 'Profissionalização da equipe e lançamento do site oficial, ampliando a cobertura para esportes, cultura e segurança pública.', 20),
  ('2023', 'Expansão Regional', 'O Marau Agora se consolida como uma das maiores fontes de informação da região, inaugurando sua nova sede e estúdio de podcast.', 30)
ON CONFLICT DO NOTHING;

-- 4. Equipe
CREATE TABLE IF NOT EXISTS public.about_team (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  role        TEXT NOT NULL,
  bio         TEXT,
  photo_url   TEXT,
  social_instagram TEXT,
  social_email TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.about_team (name, role, sort_order) VALUES
  ('Ana Souza', 'Editora-Chefe', 10),
  ('Carlos Mendes', 'Jornalista Político', 20),
  ('Julia Lima', 'Cultura e Lazer', 30),
  ('Roberto Silva', 'Esportes', 40)
ON CONFLICT DO NOTHING;

-- ─── RLS ────────────────────────────────────────────────────
ALTER TABLE public.about_page     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_values   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_team     ENABLE ROW LEVEL SECURITY;

-- Leitura pública
CREATE POLICY "Public read about_page"     ON public.about_page     FOR SELECT USING (true);
CREATE POLICY "Public read about_values"   ON public.about_values   FOR SELECT USING (true);
CREATE POLICY "Public read about_timeline" ON public.about_timeline FOR SELECT USING (true);
CREATE POLICY "Public read about_team"     ON public.about_team     FOR SELECT USING (true);

-- Escrita restrita a admins
CREATE POLICY "Admin write about_page"     ON public.about_page     FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin write about_values"   ON public.about_values   FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin write about_timeline" ON public.about_timeline FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin write about_team"     ON public.about_team     FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
