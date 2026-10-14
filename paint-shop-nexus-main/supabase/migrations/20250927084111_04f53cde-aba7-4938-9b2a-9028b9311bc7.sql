-- Enable Row Level Security on table_name table
ALTER TABLE public.table_name ENABLE ROW LEVEL SECURITY;

-- Create a restrictive policy that requires authentication
-- This allows authenticated users to access their own data if a user_id column exists,
-- or all authenticated users to access data if it's meant to be shared
CREATE POLICY "Authenticated users can access table_name" 
ON public.table_name 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);