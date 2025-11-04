-- Add preferred_vendor_id column to products table
ALTER TABLE products 
ADD COLUMN preferred_vendor_id uuid REFERENCES vendors(id);