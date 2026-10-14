-- Create enum for application roles
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'staff');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

-- Create SECURITY DEFINER function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create helper function to check if user is admin or manager
CREATE OR REPLACE FUNCTION public.has_admin_or_manager_role(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'manager')
  )
$$;

-- Update vendors RLS policies to include role checks
DROP POLICY IF EXISTS "Users can delete own vendor data" ON public.vendors;
CREATE POLICY "Admins can delete vendor data"
ON public.vendors
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Update purchases RLS policies
DROP POLICY IF EXISTS "Users can delete accessible purchases" ON public.purchases;
CREATE POLICY "Admins and managers can delete purchases"
ON public.purchases
FOR DELETE
USING (
  public.has_admin_or_manager_role(auth.uid()) AND
  EXISTS (
    SELECT 1 FROM vendors v
    WHERE v.id = purchases.vendor_id
      AND (
        v.created_by_user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM profiles p1, profiles p2
          WHERE p1.user_id = auth.uid()
            AND p2.user_id = v.created_by_user_id
            AND p1.company_name = p2.company_name
            AND p1.company_name IS NOT NULL
        )
      )
  )
);

-- Update categories deletion policy
DROP POLICY IF EXISTS "Users can delete their own categories" ON public.categories;
CREATE POLICY "Admins and managers can delete categories"
ON public.categories
FOR DELETE
USING (
  public.has_admin_or_manager_role(auth.uid()) AND
  (
    auth.uid() = created_by_user_id
    OR EXISTS (
      SELECT 1 FROM profiles p1, profiles p2
      WHERE p1.user_id = auth.uid()
        AND p2.user_id = categories.created_by_user_id
        AND p1.company_name = p2.company_name
        AND p1.company_name IS NOT NULL
    )
  )
);

-- Update products deletion policy
DROP POLICY IF EXISTS "Users can delete their own products" ON public.products;
CREATE POLICY "Admins and managers can delete products"
ON public.products
FOR DELETE
USING (
  public.has_admin_or_manager_role(auth.uid()) AND
  (
    auth.uid() = created_by_user_id
    OR EXISTS (
      SELECT 1 FROM profiles p1, profiles p2
      WHERE p1.user_id = auth.uid()
        AND p2.user_id = products.created_by_user_id
        AND p1.company_name = p2.company_name
        AND p1.company_name IS NOT NULL
    )
  )
);