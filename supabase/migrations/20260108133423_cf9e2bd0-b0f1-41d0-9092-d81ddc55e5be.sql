-- Fix: Add unique constraint on company_name to prevent cross-business data access
-- This ensures no two profiles can have the same company_name (when not null)
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_unique_company_name 
ON public.profiles (company_name) 
WHERE company_name IS NOT NULL;