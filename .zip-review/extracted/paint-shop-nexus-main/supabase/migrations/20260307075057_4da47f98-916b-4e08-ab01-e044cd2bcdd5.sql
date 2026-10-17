
-- Categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3b82f6',
  created_by_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Vendors table
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  gst_number TEXT,
  status TEXT DEFAULT 'active',
  created_by_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  hsn_code TEXT,
  unit TEXT DEFAULT 'PC',
  purchase_qty NUMERIC DEFAULT 0,
  sale_qty NUMERIC DEFAULT 0,
  current_stock NUMERIC DEFAULT 0,
  threshold_qty NUMERIC DEFAULT 0,
  unit_price NUMERIC DEFAULT 0,
  purchase_price NUMERIC DEFAULT 0,
  sale_price NUMERIC DEFAULT 0,
  mrp NUMERIC DEFAULT 0,
  image_url TEXT DEFAULT '',
  is_variant BOOLEAN DEFAULT false,
  parent_product_id UUID REFERENCES public.products(id),
  preferred_vendor_id UUID REFERENCES public.vendors(id),
  status TEXT DEFAULT 'active',
  description TEXT,
  manufacture_date TEXT,
  warranty_years NUMERIC DEFAULT 0,
  expiry_date TEXT,
  remaining_warranty TEXT,
  created_by_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  gst_no TEXT,
  address TEXT,
  customer_type TEXT DEFAULT 'retail',
  total_sales NUMERIC DEFAULT 0,
  outstanding_balance NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_by_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Purchases table
CREATE TABLE public.purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id),
  purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
  subtotal NUMERIC DEFAULT 0,
  tax_amount NUMERIC DEFAULT 0,
  discount_amount NUMERIC DEFAULT 0,
  total_amount NUMERIC DEFAULT 0,
  paid_amount NUMERIC DEFAULT 0,
  balance_amount NUMERIC DEFAULT 0,
  payment_method TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  invoice_file_url TEXT,
  created_by_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Purchase items table
CREATE TABLE public.purchase_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_id UUID REFERENCES public.purchases(id) ON DELETE CASCADE NOT NULL,
  product_name TEXT NOT NULL,
  product_id UUID REFERENCES public.products(id),
  quantity NUMERIC DEFAULT 0,
  unit_price NUMERIC DEFAULT 0,
  tax_rate NUMERIC DEFAULT 0,
  discount_rate NUMERIC DEFAULT 0,
  total_amount NUMERIC DEFAULT 0,
  created_by_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Sales table
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL,
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  customer_id UUID REFERENCES public.customers(id),
  customer_name TEXT,
  subtotal NUMERIC DEFAULT 0,
  tax_amount NUMERIC DEFAULT 0,
  discount_amount NUMERIC DEFAULT 0,
  total_amount NUMERIC DEFAULT 0,
  paid_amount NUMERIC DEFAULT 0,
  pending_amount NUMERIC DEFAULT 0,
  payment_mode TEXT,
  payment_status TEXT DEFAULT 'pending',
  is_gst_inclusive BOOLEAN DEFAULT false,
  notes TEXT,
  created_by_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Sale items table
CREATE TABLE public.sale_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID REFERENCES public.sales(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  hsn_code TEXT,
  quantity NUMERIC DEFAULT 0,
  unit TEXT DEFAULT 'PC',
  rate NUMERIC DEFAULT 0,
  gst_percent NUMERIC DEFAULT 0,
  amount NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Expenses table
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  type TEXT NOT NULL,
  amount NUMERIC DEFAULT 0,
  payment_mode TEXT,
  description TEXT,
  ref_no TEXT,
  created_by_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Stock adjustments table
CREATE TABLE public.stock_adjustments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  adjustment_type TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  reason TEXT,
  reference_id UUID,
  created_by_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_adjustments ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can CRUD their own data
CREATE POLICY "Users can manage own categories" ON public.categories FOR ALL TO authenticated USING (created_by_user_id = auth.uid()) WITH CHECK (created_by_user_id = auth.uid());
CREATE POLICY "Users can manage own vendors" ON public.vendors FOR ALL TO authenticated USING (created_by_user_id = auth.uid()) WITH CHECK (created_by_user_id = auth.uid());
CREATE POLICY "Users can manage own products" ON public.products FOR ALL TO authenticated USING (created_by_user_id = auth.uid()) WITH CHECK (created_by_user_id = auth.uid());
CREATE POLICY "Users can manage own customers" ON public.customers FOR ALL TO authenticated USING (created_by_user_id = auth.uid()) WITH CHECK (created_by_user_id = auth.uid());
CREATE POLICY "Users can manage own purchases" ON public.purchases FOR ALL TO authenticated USING (created_by_user_id = auth.uid()) WITH CHECK (created_by_user_id = auth.uid());
CREATE POLICY "Users can manage own purchase_items" ON public.purchase_items FOR ALL TO authenticated USING (created_by_user_id = auth.uid()) WITH CHECK (created_by_user_id = auth.uid());
CREATE POLICY "Users can manage own sales" ON public.sales FOR ALL TO authenticated USING (created_by_user_id = auth.uid()) WITH CHECK (created_by_user_id = auth.uid());
CREATE POLICY "Users can view own sale_items" ON public.sale_items FOR ALL TO authenticated USING (sale_id IN (SELECT id FROM public.sales WHERE created_by_user_id = auth.uid()));
CREATE POLICY "Users can manage own expenses" ON public.expenses FOR ALL TO authenticated USING (created_by_user_id = auth.uid()) WITH CHECK (created_by_user_id = auth.uid());
CREATE POLICY "Users can manage own stock_adjustments" ON public.stock_adjustments FOR ALL TO authenticated USING (created_by_user_id = auth.uid()) WITH CHECK (created_by_user_id = auth.uid());

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.sales;
ALTER PUBLICATION supabase_realtime ADD TABLE public.purchases;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.customers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.expenses;
