
-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS public.purchase_items;
DROP TABLE IF EXISTS public.purchases;
DROP TABLE IF EXISTS public.vendors;

-- Create vendors table
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  gst_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create purchases table
CREATE TABLE public.purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  vendor_id UUID REFERENCES public.vendors(id) NOT NULL,
  purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  paid_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  balance_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_method TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'received', 'returned')),
  notes TEXT,
  invoice_file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create purchase_items table
CREATE TABLE public.purchase_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_id UUID REFERENCES public.purchases(id) ON DELETE CASCADE NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  discount_rate DECIMAL(5,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for vendors
CREATE POLICY "Allow all operations on vendors" ON public.vendors FOR ALL USING (true);

-- Create RLS policies for purchases
CREATE POLICY "Allow all operations on purchases" ON public.purchases FOR ALL USING (true);

-- Create RLS policies for purchase_items
CREATE POLICY "Allow all operations on purchase_items" ON public.purchase_items FOR ALL USING (true);

-- Insert sample vendors
INSERT INTO public.vendors (name, contact_person, email, phone, address) VALUES
('ABC Suppliers', 'John Smith', 'john@abcsuppliers.com', '+91-9876543210', '123 Business Street, Mumbai'),
('XYZ Distributors', 'Jane Doe', 'jane@xyzdist.com', '+91-8765432109', '456 Trade Plaza, Delhi'),
('Premium Paints Co.', 'Mike Johnson', 'mike@premiumpaints.com', '+91-7654321098', '789 Industrial Area, Bangalore');

-- Insert sample purchases with unique invoice numbers
WITH vendor_data AS (
  SELECT id, ROW_NUMBER() OVER () as rn FROM public.vendors
)
INSERT INTO public.purchases (invoice_number, vendor_id, purchase_date, subtotal, tax_amount, total_amount, paid_amount, balance_amount, status) 
SELECT 
  'PUR-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD((1000 + generate_series)::text, 4, '0'),
  v.id,
  CURRENT_DATE - (generate_series || ' days')::interval,
  ROUND((random() * 50000 + 10000)::numeric, 2),
  ROUND((random() * 9000 + 1800)::numeric, 2),
  0,
  0,
  0,
  (ARRAY['pending', 'received', 'returned'])[floor(random() * 3 + 1)]
FROM generate_series(1, 5), vendor_data v
WHERE v.rn = ((generate_series - 1) % 3) + 1;

-- Update total_amount and balance_amount
UPDATE public.purchases SET 
  total_amount = subtotal + tax_amount,
  balance_amount = subtotal + tax_amount - paid_amount;
