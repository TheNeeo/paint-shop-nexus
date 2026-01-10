-- Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  mobile text NOT NULL,
  email text,
  gst_no text,
  address text NOT NULL,
  customer_type text NOT NULL CHECK (customer_type IN ('retail', 'wholesale')),
  total_sales numeric(15, 2) DEFAULT 0,
  outstanding_balance numeric(15, 2) DEFAULT 0,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_by_user_id uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text NOT NULL,
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  invoice_date date NOT NULL,
  subtotal numeric(15, 2) NOT NULL DEFAULT 0,
  tax_amount numeric(15, 2) NOT NULL DEFAULT 0,
  discount_amount numeric(15, 2) NOT NULL DEFAULT 0,
  total_amount numeric(15, 2) NOT NULL,
  paid_amount numeric(15, 2) NOT NULL DEFAULT 0,
  balance_amount numeric(15, 2) NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('paid', 'partial', 'pending')),
  payment_mode text,
  notes text,
  is_gst_inclusive boolean DEFAULT false,
  created_by_user_id uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  hsn_code text,
  quantity numeric(10, 2) NOT NULL,
  unit text,
  rate numeric(15, 2) NOT NULL,
  gst_percent numeric(5, 2) DEFAULT 0,
  amount numeric(15, 2) NOT NULL,
  created_by_user_id uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_customers_created_by ON public.customers(created_by_user_id);
CREATE INDEX IF NOT EXISTS idx_customers_status ON public.customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_mobile ON public.customers(mobile);

CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON public.invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_created_by ON public.invoices(created_by_user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON public.invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_payment_status ON public.invoices(payment_status);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON public.invoices(invoice_date);

CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON public.invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_product_id ON public.invoice_items(product_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_created_by ON public.invoice_items(created_by_user_id);

-- Add table constraints
ALTER TABLE public.customers ADD CONSTRAINT positive_total_sales CHECK (total_sales >= 0);
ALTER TABLE public.customers ADD CONSTRAINT non_negative_outstanding_balance CHECK (outstanding_balance >= 0);
ALTER TABLE public.customers ADD CONSTRAINT valid_customer_name CHECK (length(trim(name)) > 0 AND length(name) <= 200);
ALTER TABLE public.customers ADD CONSTRAINT valid_email_format CHECK (email IS NULL OR email = '' OR email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

ALTER TABLE public.invoices ADD CONSTRAINT non_negative_subtotal CHECK (subtotal >= 0);
ALTER TABLE public.invoices ADD CONSTRAINT non_negative_tax_amount CHECK (tax_amount >= 0);
ALTER TABLE public.invoices ADD CONSTRAINT non_negative_discount_amount CHECK (discount_amount >= 0);
ALTER TABLE public.invoices ADD CONSTRAINT non_negative_total_amount CHECK (total_amount >= 0);
ALTER TABLE public.invoices ADD CONSTRAINT non_negative_paid_amount CHECK (paid_amount >= 0);
ALTER TABLE public.invoices ADD CONSTRAINT non_negative_balance_amount CHECK (balance_amount >= 0);
ALTER TABLE public.invoices ADD CONSTRAINT valid_invoice_number CHECK (length(trim(invoice_number)) > 0 AND length(invoice_number) <= 50);

ALTER TABLE public.invoice_items ADD CONSTRAINT positive_quantity CHECK (quantity > 0);
ALTER TABLE public.invoice_items ADD CONSTRAINT positive_rate CHECK (rate > 0);
ALTER TABLE public.invoice_items ADD CONSTRAINT non_negative_gst_percent CHECK (gst_percent >= 0 AND gst_percent <= 100);
ALTER TABLE public.invoice_items ADD CONSTRAINT positive_amount CHECK (amount >= 0);
ALTER TABLE public.invoice_items ADD CONSTRAINT valid_product_name CHECK (length(trim(product_name)) > 0 AND length(product_name) <= 200);

-- Enable RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for customers table
CREATE POLICY "Users can view their own customers"
ON public.customers
FOR SELECT
USING (
  auth.uid() = created_by_user_id OR
  EXISTS (
    SELECT 1 FROM profiles p1, profiles p2
    WHERE p1.user_id = auth.uid()
      AND p2.user_id = customers.created_by_user_id
      AND p1.company_name = p2.company_name
      AND p1.company_name IS NOT NULL
  )
);

CREATE POLICY "Users can create their own customers"
ON public.customers
FOR INSERT
WITH CHECK (auth.uid() = created_by_user_id);

CREATE POLICY "Users can update their own customers"
ON public.customers
FOR UPDATE
USING (
  auth.uid() = created_by_user_id OR
  EXISTS (
    SELECT 1 FROM profiles p1, profiles p2
    WHERE p1.user_id = auth.uid()
      AND p2.user_id = customers.created_by_user_id
      AND p1.company_name = p2.company_name
      AND p1.company_name IS NOT NULL
  )
);

CREATE POLICY "Users can delete their own customers"
ON public.customers
FOR DELETE
USING (auth.uid() = created_by_user_id);

-- Create RLS policies for invoices table
CREATE POLICY "Users can view their own invoices"
ON public.invoices
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM customers c
    WHERE c.id = invoices.customer_id
      AND (c.created_by_user_id = auth.uid() OR
           EXISTS (
             SELECT 1 FROM profiles p1, profiles p2
             WHERE p1.user_id = auth.uid()
               AND p2.user_id = c.created_by_user_id
               AND p1.company_name = p2.company_name
               AND p1.company_name IS NOT NULL
           ))
  )
);

CREATE POLICY "Users can create invoices for their customers"
ON public.invoices
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM customers c
    WHERE c.id = invoices.customer_id
      AND (c.created_by_user_id = auth.uid() OR
           EXISTS (
             SELECT 1 FROM profiles p1, profiles p2
             WHERE p1.user_id = auth.uid()
               AND p2.user_id = c.created_by_user_id
               AND p1.company_name = p2.company_name
               AND p1.company_name IS NOT NULL
           ))
  )
);

CREATE POLICY "Users can update their own invoices"
ON public.invoices
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM customers c
    WHERE c.id = invoices.customer_id
      AND (c.created_by_user_id = auth.uid() OR
           EXISTS (
             SELECT 1 FROM profiles p1, profiles p2
             WHERE p1.user_id = auth.uid()
               AND p2.user_id = c.created_by_user_id
               AND p1.company_name = p2.company_name
               AND p1.company_name IS NOT NULL
           ))
  )
);

CREATE POLICY "Users can delete their own invoices"
ON public.invoices
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM customers c
    WHERE c.id = invoices.customer_id
      AND (c.created_by_user_id = auth.uid() OR
           EXISTS (
             SELECT 1 FROM profiles p1, profiles p2
             WHERE p1.user_id = auth.uid()
               AND p2.user_id = c.created_by_user_id
               AND p1.company_name = p2.company_name
               AND p1.company_name IS NOT NULL
           ))
  )
);

-- Create RLS policies for invoice_items table
CREATE POLICY "Users can view their own invoice items"
ON public.invoice_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM invoices i
    WHERE i.id = invoice_items.invoice_id
      AND EXISTS (
        SELECT 1 FROM customers c
        WHERE c.id = i.customer_id
          AND (c.created_by_user_id = auth.uid() OR
               EXISTS (
                 SELECT 1 FROM profiles p1, profiles p2
                 WHERE p1.user_id = auth.uid()
                   AND p2.user_id = c.created_by_user_id
                   AND p1.company_name = p2.company_name
                   AND p1.company_name IS NOT NULL
               ))
      )
  )
);

CREATE POLICY "Users can create their own invoice items"
ON public.invoice_items
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM invoices i
    WHERE i.id = invoice_items.invoice_id
      AND EXISTS (
        SELECT 1 FROM customers c
        WHERE c.id = i.customer_id
          AND (c.created_by_user_id = auth.uid() OR
               EXISTS (
                 SELECT 1 FROM profiles p1, profiles p2
                 WHERE p1.user_id = auth.uid()
                   AND p2.user_id = c.created_by_user_id
                   AND p1.company_name = p2.company_name
                   AND p1.company_name IS NOT NULL
               ))
      )
  )
);

CREATE POLICY "Users can update their own invoice items"
ON public.invoice_items
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM invoices i
    WHERE i.id = invoice_items.invoice_id
      AND EXISTS (
        SELECT 1 FROM customers c
        WHERE c.id = i.customer_id
          AND (c.created_by_user_id = auth.uid() OR
               EXISTS (
                 SELECT 1 FROM profiles p1, profiles p2
                 WHERE p1.user_id = auth.uid()
                   AND p2.user_id = c.created_by_user_id
                   AND p1.company_name = p2.company_name
                   AND p1.company_name IS NOT NULL
               ))
      )
  )
);

CREATE POLICY "Users can delete their own invoice items"
ON public.invoice_items
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM invoices i
    WHERE i.id = invoice_items.invoice_id
      AND EXISTS (
        SELECT 1 FROM customers c
        WHERE c.id = i.customer_id
          AND (c.created_by_user_id = auth.uid() OR
               EXISTS (
                 SELECT 1 FROM profiles p1, profiles p2
                 WHERE p1.user_id = auth.uid()
                   AND p2.user_id = c.created_by_user_id
                   AND p1.company_name = p2.company_name
                   AND p1.company_name IS NOT NULL
               ))
      )
  )
);
