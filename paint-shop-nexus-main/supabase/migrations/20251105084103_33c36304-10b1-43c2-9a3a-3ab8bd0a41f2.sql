-- Add purchase_price and sale_price columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS purchase_price numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS sale_price numeric DEFAULT 0;