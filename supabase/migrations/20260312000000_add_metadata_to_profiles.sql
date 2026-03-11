-- Add JSONB metadata column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- Ensure existing rows have an empty JSON object if they don't already
UPDATE public.profiles 
SET metadata = '{}'::jsonb 
WHERE metadata IS NULL;
