-- Add image_url column to news table
ALTER TABLE IF EXISTS public.news
ADD COLUMN IF NOT EXISTS image_url text;

-- Add image_url column to events table to be sure
ALTER TABLE IF EXISTS public.events
ADD COLUMN IF NOT EXISTS image_url text;

-- Grant permissions if necessary (usually public has access based on policies, but explicit column grant might be needed if using column-level security)
-- Assuming standard policies apply to the whole table.
