-- Add Product Shelf Life columns to products table
ALTER TABLE public.products 
ADD COLUMN manufacture_date text DEFAULT NULL,
ADD COLUMN warranty_years integer DEFAULT 0,
ADD COLUMN expiry_date text DEFAULT NULL,
ADD COLUMN remaining_warranty text DEFAULT NULL;