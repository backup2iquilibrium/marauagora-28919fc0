-- Add missing columns to public.events for the admin agenda feature
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS city TEXT NOT NULL DEFAULT 'Marau',
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS is_free BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS is_featured_week BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS organizer TEXT,
  ADD COLUMN IF NOT EXISTS ticket_url TEXT,
  ADD COLUMN IF NOT EXISTS price_info TEXT;

-- Index for is_featured_week and city lookups
CREATE INDEX IF NOT EXISTS idx_events_city ON public.events(city);
CREATE INDEX IF NOT EXISTS idx_events_is_free ON public.events(is_free);
CREATE INDEX IF NOT EXISTS idx_events_featured_week ON public.events(is_featured_week) WHERE is_featured_week = true;
