-- 1. Create news_categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.news_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Add image_url to news table (fixing the error from screenshot)
ALTER TABLE IF EXISTS public.news ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 3. Create 'content' bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('content', 'content', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Set up storage policies for 'content' bucket
-- Allow public access to read files
CREATE POLICY "Public Access" ON storage.objects
    FOR SELECT USING (bucket_id = 'content');

-- Allow authenticated users to upload files
CREATE POLICY "Auth Upload" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'content' AND auth.role() = 'authenticated');

-- Allow authenticated users to update/delete their own files (optional but good)
CREATE POLICY "Auth Update/Delete" ON storage.objects
    FOR ALL USING (bucket_id = 'content' AND auth.role() = 'authenticated');
