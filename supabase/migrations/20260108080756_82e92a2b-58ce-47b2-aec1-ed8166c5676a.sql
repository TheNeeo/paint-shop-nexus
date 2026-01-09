-- Fix 1: Update handle_new_user() to include company_name from signup metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, company_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'company_name', NULL)
  );
  RETURN NEW;
END;
$$;

-- Fix 2: Drop unused table_name table with overly permissive RLS policies
DROP TABLE IF EXISTS public.table_name CASCADE;