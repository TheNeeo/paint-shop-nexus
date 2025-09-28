-- Add user association to vendors table for proper access control
ALTER TABLE public.vendors 
ADD COLUMN created_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Update existing vendor records to be associated with the first user (if any exist)
-- This prevents data loss for existing vendors
UPDATE public.vendors 
SET created_by_user_id = (
  SELECT id FROM auth.users LIMIT 1
) WHERE created_by_user_id IS NULL;

-- Drop the overly permissive existing policy
DROP POLICY IF EXISTS "Authenticated users can access vendor data" ON public.vendors;

-- Create secure RLS policies for vendor access
-- Users can view vendors they created OR vendors created by users from the same company
CREATE POLICY "Users can view accessible vendor data" 
ON public.vendors 
FOR SELECT 
USING (
  auth.uid() = created_by_user_id 
  OR 
  EXISTS (
    SELECT 1 FROM public.profiles p1, public.profiles p2
    WHERE p1.user_id = auth.uid() 
    AND p2.user_id = vendors.created_by_user_id
    AND p1.company_name = p2.company_name
    AND p1.company_name IS NOT NULL
  )
);

-- Users can only insert vendors with their own user ID
CREATE POLICY "Users can create vendor data" 
ON public.vendors 
FOR INSERT 
WITH CHECK (auth.uid() = created_by_user_id);

-- Users can only update vendors they created OR from same company  
CREATE POLICY "Users can update accessible vendor data" 
ON public.vendors 
FOR UPDATE 
USING (
  auth.uid() = created_by_user_id 
  OR 
  EXISTS (
    SELECT 1 FROM public.profiles p1, public.profiles p2
    WHERE p1.user_id = auth.uid() 
    AND p2.user_id = vendors.created_by_user_id
    AND p1.company_name = p2.company_name
    AND p1.company_name IS NOT NULL
  )
);

-- Users can only delete vendors they created
CREATE POLICY "Users can delete own vendor data" 
ON public.vendors 
FOR DELETE 
USING (auth.uid() = created_by_user_id);