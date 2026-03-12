-- Add image_url column to profiles table for easier access
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS image_url text;

-- Sync existing image from metadata to image_url if it exists
UPDATE public.profiles 
SET image_url = metadata->>'image'
WHERE metadata->>'image' IS NOT NULL;
