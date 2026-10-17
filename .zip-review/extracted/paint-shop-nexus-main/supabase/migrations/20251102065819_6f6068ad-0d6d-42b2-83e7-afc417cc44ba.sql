-- Fix 1: Add created_by_user_id to tables for proper ownership tracking
ALTER TABLE public.products ADD COLUMN created_by_user_id uuid REFERENCES auth.users(id);
ALTER TABLE public.categories ADD COLUMN created_by_user_id uuid REFERENCES auth.users(id);
ALTER TABLE public.purchase_items ADD COLUMN created_by_user_id uuid REFERENCES auth.users(id);

-- Update existing records to set created_by_user_id for purchases (already has the column based on schema)
-- For products, categories, and purchase_items, we'll need to backfill with a default user or null initially
-- Note: In production, you'd want to identify the actual creator from audit logs or session data

-- Fix 2: Add server-side validation constraints
-- Products table constraints
ALTER TABLE public.products ADD CONSTRAINT positive_unit_price CHECK (unit_price >= 0);
ALTER TABLE public.products ADD CONSTRAINT non_negative_purchase_qty CHECK (purchase_qty >= 0);
ALTER TABLE public.products ADD CONSTRAINT non_negative_sale_qty CHECK (sale_qty >= 0);
ALTER TABLE public.products ADD CONSTRAINT non_negative_current_stock CHECK (current_stock >= 0);
ALTER TABLE public.products ADD CONSTRAINT non_negative_threshold_qty CHECK (threshold_qty >= 0);
ALTER TABLE public.products ADD CONSTRAINT valid_name_length CHECK (length(trim(name)) > 0 AND length(name) <= 200);
ALTER TABLE public.products ADD CONSTRAINT valid_hsn_code CHECK (hsn_code IS NULL OR hsn_code ~ '^\d{4,8}$');

-- Purchases table constraints
ALTER TABLE public.purchases ADD CONSTRAINT non_negative_subtotal CHECK (subtotal >= 0);
ALTER TABLE public.purchases ADD CONSTRAINT non_negative_tax_amount CHECK (tax_amount >= 0);
ALTER TABLE public.purchases ADD CONSTRAINT non_negative_discount_amount CHECK (discount_amount >= 0);
ALTER TABLE public.purchases ADD CONSTRAINT non_negative_total_amount CHECK (total_amount >= 0);
ALTER TABLE public.purchases ADD CONSTRAINT non_negative_paid_amount CHECK (paid_amount >= 0);
ALTER TABLE public.purchases ADD CONSTRAINT non_negative_balance_amount CHECK (balance_amount >= 0);
ALTER TABLE public.purchases ADD CONSTRAINT valid_invoice_number CHECK (length(trim(invoice_number)) > 0 AND length(invoice_number) <= 50);

-- Purchase items table constraints
ALTER TABLE public.purchase_items ADD CONSTRAINT positive_quantity CHECK (quantity > 0);
ALTER TABLE public.purchase_items ADD CONSTRAINT positive_unit_price CHECK (unit_price > 0);
ALTER TABLE public.purchase_items ADD CONSTRAINT non_negative_tax_rate CHECK (tax_rate >= 0 AND tax_rate <= 100);
ALTER TABLE public.purchase_items ADD CONSTRAINT non_negative_discount_rate CHECK (discount_rate >= 0 AND discount_rate <= 100);
ALTER TABLE public.purchase_items ADD CONSTRAINT positive_total_amount CHECK (total_amount >= 0);
ALTER TABLE public.purchase_items ADD CONSTRAINT valid_product_name CHECK (length(trim(product_name)) > 0 AND length(product_name) <= 200);

-- Categories table constraints
ALTER TABLE public.categories ADD CONSTRAINT valid_category_name CHECK (length(trim(name)) > 0 AND length(name) <= 100);

-- Vendors table constraints (additional validation)
ALTER TABLE public.vendors ADD CONSTRAINT valid_vendor_name CHECK (length(trim(name)) > 0 AND length(name) <= 100);
ALTER TABLE public.vendors ADD CONSTRAINT valid_gst_format CHECK (gst_number IS NULL OR gst_number = '' OR gst_number ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$');
ALTER TABLE public.vendors ADD CONSTRAINT valid_email_format CHECK (email IS NULL OR email = '' OR email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

-- Fix 3: Drop overly permissive RLS policies and create secure ones
-- Products table RLS
DROP POLICY IF EXISTS "Authenticated users can access product data" ON public.products;

CREATE POLICY "Users can view their own products"
ON public.products
FOR SELECT
USING (
  auth.uid() = created_by_user_id OR
  EXISTS (
    SELECT 1 FROM profiles p1, profiles p2
    WHERE p1.user_id = auth.uid()
      AND p2.user_id = products.created_by_user_id
      AND p1.company_name = p2.company_name
      AND p1.company_name IS NOT NULL
  )
);

CREATE POLICY "Users can create their own products"
ON public.products
FOR INSERT
WITH CHECK (auth.uid() = created_by_user_id);

CREATE POLICY "Users can update their own products"
ON public.products
FOR UPDATE
USING (
  auth.uid() = created_by_user_id OR
  EXISTS (
    SELECT 1 FROM profiles p1, profiles p2
    WHERE p1.user_id = auth.uid()
      AND p2.user_id = products.created_by_user_id
      AND p1.company_name = p2.company_name
      AND p1.company_name IS NOT NULL
  )
);

CREATE POLICY "Users can delete their own products"
ON public.products
FOR DELETE
USING (auth.uid() = created_by_user_id);

-- Categories table RLS
DROP POLICY IF EXISTS "Authenticated users can access category data" ON public.categories;

CREATE POLICY "Users can view their own categories"
ON public.categories
FOR SELECT
USING (
  auth.uid() = created_by_user_id OR
  EXISTS (
    SELECT 1 FROM profiles p1, profiles p2
    WHERE p1.user_id = auth.uid()
      AND p2.user_id = categories.created_by_user_id
      AND p1.company_name = p2.company_name
      AND p1.company_name IS NOT NULL
  )
);

CREATE POLICY "Users can create their own categories"
ON public.categories
FOR INSERT
WITH CHECK (auth.uid() = created_by_user_id);

CREATE POLICY "Users can update their own categories"
ON public.categories
FOR UPDATE
USING (
  auth.uid() = created_by_user_id OR
  EXISTS (
    SELECT 1 FROM profiles p1, profiles p2
    WHERE p1.user_id = auth.uid()
      AND p2.user_id = categories.created_by_user_id
      AND p1.company_name = p2.company_name
      AND p1.company_name IS NOT NULL
  )
);

CREATE POLICY "Users can delete their own categories"
ON public.categories
FOR DELETE
USING (auth.uid() = created_by_user_id);

-- Purchases table RLS (already has created_by_user_id based on vendor reference, but we need to track direct user ownership)
DROP POLICY IF EXISTS "Authenticated users can access purchase data" ON public.purchases;

CREATE POLICY "Users can view accessible purchases"
ON public.purchases
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM vendors v
    WHERE v.id = purchases.vendor_id
      AND (v.created_by_user_id = auth.uid() OR
           EXISTS (
             SELECT 1 FROM profiles p1, profiles p2
             WHERE p1.user_id = auth.uid()
               AND p2.user_id = v.created_by_user_id
               AND p1.company_name = p2.company_name
               AND p1.company_name IS NOT NULL
           ))
  )
);

CREATE POLICY "Users can create purchases with accessible vendors"
ON public.purchases
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM vendors v
    WHERE v.id = purchases.vendor_id
      AND (v.created_by_user_id = auth.uid() OR
           EXISTS (
             SELECT 1 FROM profiles p1, profiles p2
             WHERE p1.user_id = auth.uid()
               AND p2.user_id = v.created_by_user_id
               AND p1.company_name = p2.company_name
               AND p1.company_name IS NOT NULL
           ))
  )
);

CREATE POLICY "Users can update accessible purchases"
ON public.purchases
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM vendors v
    WHERE v.id = purchases.vendor_id
      AND (v.created_by_user_id = auth.uid() OR
           EXISTS (
             SELECT 1 FROM profiles p1, profiles p2
             WHERE p1.user_id = auth.uid()
               AND p2.user_id = v.created_by_user_id
               AND p1.company_name = p2.company_name
               AND p1.company_name IS NOT NULL
           ))
  )
);

CREATE POLICY "Users can delete accessible purchases"
ON public.purchases
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM vendors v
    WHERE v.id = purchases.vendor_id
      AND (v.created_by_user_id = auth.uid() OR
           EXISTS (
             SELECT 1 FROM profiles p1, profiles p2
             WHERE p1.user_id = auth.uid()
               AND p2.user_id = v.created_by_user_id
               AND p1.company_name = p2.company_name
               AND p1.company_name IS NOT NULL
           ))
  )
);

-- Purchase items table RLS
DROP POLICY IF EXISTS "Authenticated users can access purchase items" ON public.purchase_items;

CREATE POLICY "Users can view their own purchase items"
ON public.purchase_items
FOR SELECT
USING (
  auth.uid() = created_by_user_id OR
  EXISTS (
    SELECT 1 FROM profiles p1, profiles p2
    WHERE p1.user_id = auth.uid()
      AND p2.user_id = purchase_items.created_by_user_id
      AND p1.company_name = p2.company_name
      AND p1.company_name IS NOT NULL
  )
);

CREATE POLICY "Users can create their own purchase items"
ON public.purchase_items
FOR INSERT
WITH CHECK (auth.uid() = created_by_user_id);

CREATE POLICY "Users can update their own purchase items"
ON public.purchase_items
FOR UPDATE
USING (
  auth.uid() = created_by_user_id OR
  EXISTS (
    SELECT 1 FROM profiles p1, profiles p2
    WHERE p1.user_id = auth.uid()
      AND p2.user_id = purchase_items.created_by_user_id
      AND p1.company_name = p2.company_name
      AND p1.company_name IS NOT NULL
  )
);

CREATE POLICY "Users can delete their own purchase items"
ON public.purchase_items
FOR DELETE
USING (auth.uid() = created_by_user_id);