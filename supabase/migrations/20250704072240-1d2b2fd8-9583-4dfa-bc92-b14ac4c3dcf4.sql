
-- Create categories table for inventory
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  hsn_code TEXT,
  unit TEXT NOT NULL DEFAULT 'PC',
  image_url TEXT,
  purchase_qty INTEGER NOT NULL DEFAULT 0,
  sale_qty INTEGER NOT NULL DEFAULT 0,
  current_stock INTEGER NOT NULL DEFAULT 0,
  threshold_qty INTEGER NOT NULL DEFAULT 0,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  parent_product_id UUID REFERENCES public.products(id),
  is_variant BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on categories" 
  ON public.categories 
  FOR ALL 
  USING (true);

-- Add RLS policies for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on products" 
  ON public.products 
  FOR ALL 
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_parent_product_id ON public.products(parent_product_id);
CREATE INDEX idx_products_hsn_code ON public.products(hsn_code);

-- Insert some default categories
INSERT INTO public.categories (name, description) VALUES 
('Paint', 'Paint products and related items'),
('Accessories', 'Paint accessories and tools'),
('Primer', 'Primer and base coat products'),
('Thinner', 'Thinners and solvents');

-- Insert some sample products
INSERT INTO public.products (name, category_id, hsn_code, unit, purchase_qty, sale_qty, current_stock, threshold_qty, unit_price, is_variant) 
SELECT 
  'Apcolite 4L', 
  c.id, 
  '32081010', 
  'Ltr', 
  100, 
  25, 
  75, 
  10, 
  450.00,
  false
FROM public.categories c WHERE c.name = 'Paint' LIMIT 1;

-- Add some variants for the main product
INSERT INTO public.products (name, category_id, hsn_code, unit, purchase_qty, sale_qty, current_stock, threshold_qty, unit_price, parent_product_id, is_variant)
SELECT 
  'BW1 - Brilliant White', 
  p.category_id,
  null,
  'Ltr', 
  50, 
  12, 
  38, 
  5, 
  450.00,
  p.id,
  true
FROM public.products p WHERE p.name = 'Apcolite 4L' LIMIT 1;

INSERT INTO public.products (name, category_id, hsn_code, unit, purchase_qty, sale_qty, current_stock, threshold_qty, unit_price, parent_product_id, is_variant)
SELECT 
  'BW11 - Snow White', 
  p.category_id,
  null,
  'Ltr', 
  30, 
  8, 
  22, 
  3, 
  450.00,
  p.id,
  true
FROM public.products p WHERE p.name = 'Apcolite 4L' LIMIT 1;
