-- Add color column to categories table for badge styling
ALTER TABLE public.categories 
ADD COLUMN color text DEFAULT 'green';