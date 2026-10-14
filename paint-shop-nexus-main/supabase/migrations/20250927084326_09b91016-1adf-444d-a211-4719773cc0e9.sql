-- Fix security issue: Restrict access to financial purchase data
-- Update purchases table RLS policy to require authentication
DROP POLICY "Allow all operations on purchases" ON public.purchases;

CREATE POLICY "Authenticated users can access purchase data" 
ON public.purchases 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- Also fix related purchase_items table for consistency
DROP POLICY "Allow all operations on purchase_items" ON public.purchase_items;

CREATE POLICY "Authenticated users can access purchase items" 
ON public.purchase_items 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- Fix vendors table as it contains sensitive business partner information
DROP POLICY "Allow all operations on vendors" ON public.vendors;

CREATE POLICY "Authenticated users can access vendor data" 
ON public.vendors 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- Fix products and categories tables for business data protection
DROP POLICY "Allow all operations on products" ON public.products;

CREATE POLICY "Authenticated users can access product data" 
ON public.products 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY "Allow all operations on categories" ON public.categories;

CREATE POLICY "Authenticated users can access category data" 
ON public.categories 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);