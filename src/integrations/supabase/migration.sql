
-- Add image_url column to fantasy_picks table if it doesn't exist
ALTER TABLE fantasy_picks 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add match_id column to fantasy_picks table if it doesn't exist
ALTER TABLE fantasy_picks 
ADD COLUMN IF NOT EXISTS match_id UUID REFERENCES upcoming_matches(id);

-- Add stats column to fantasy_picks table if it doesn't exist
ALTER TABLE fantasy_picks 
ADD COLUMN IF NOT EXISTS stats TEXT;

-- Create storage bucket for player images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('player_images', 'player_images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow public access to player_images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'player_images')
ON CONFLICT DO NOTHING;

CREATE POLICY "Admin Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'player_images')
ON CONFLICT DO NOTHING;

-- Ensure article_images bucket exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('article_images', 'article_images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for article_images with ON CONFLICT DO NOTHING to avoid errors
-- This allows both authenticated and anonymous users to access the bucket
CREATE POLICY "Public Access for article_images"
ON storage.objects FOR SELECT
USING (bucket_id = 'article_images')
ON CONFLICT DO NOTHING;

CREATE POLICY "Everyone can upload to article_images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'article_images')
ON CONFLICT DO NOTHING;

CREATE POLICY "Everyone can update article_images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'article_images')
ON CONFLICT DO NOTHING;

CREATE POLICY "Everyone can delete article_images"
ON storage.objects FOR DELETE
USING (bucket_id = 'article_images')
ON CONFLICT DO NOTHING;
