-- Add category_id column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS category_id integer;

-- Update existing companies to have a default category if needed
UPDATE public.profiles 
SET category_id = 1 
WHERE role = 'Company' AND category_id IS NULL;
