
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
USING (bucket_id = 'player_images');

CREATE POLICY "Admin Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'player_images');

-- Ensure article_images bucket exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('article_images', 'article_images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow public access to article_images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'article_images');

CREATE POLICY "Admin Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'article_images');
