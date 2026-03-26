-- Add extra fields to emergency_numbers for better categorization
ALTER TABLE public.emergency_numbers
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS category    TEXT NOT NULL DEFAULT 'Emergência',
  ADD COLUMN IF NOT EXISTS city        TEXT NOT NULL DEFAULT 'Marau';

-- Pre-seed common useful numbers
INSERT INTO public.emergency_numbers (label, number, icon, category, sort_order, is_published) VALUES
  ('SAMU',                  '192',         'siren',  'Emergência',     10, true),
  ('Bombeiros',             '193',         'siren',  'Emergência',     20, true),
  ('Polícia Militar',       '190',         'shield', 'Emergência',     30, true),
  ('Polícia Civil',         '197',         'shield', 'Segurança',      40, true),
  ('Defesa Civil',          '199',         'shield', 'Emergência',     50, true),
  ('UPA / Pronto-Socorro',  '(54) 3342-xxxx', 'heart', 'Saúde',        60, true),
  ('Prefeitura Municipal',  '(54) 3342-xxxx', 'landmark', 'Administrativo', 70, true),
  ('Câmara de Vereadores',  '(54) 3342-xxxx', 'landmark', 'Administrativo', 80, true)
ON CONFLICT DO NOTHING;
