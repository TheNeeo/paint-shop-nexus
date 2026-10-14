-- Create stock_adjustments table to track inventory corrections
CREATE TABLE public.stock_adjustments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity_change INTEGER NOT NULL,
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  reason_code TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by_user_id UUID
);

-- Enable Row Level Security
ALTER TABLE public.stock_adjustments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own stock adjustments" 
ON public.stock_adjustments 
FOR SELECT 
USING (
  (auth.uid() = created_by_user_id) OR 
  (EXISTS (
    SELECT 1 FROM profiles p1, profiles p2 
    WHERE p1.user_id = auth.uid() 
    AND p2.user_id = stock_adjustments.created_by_user_id 
    AND p1.company_name = p2.company_name 
    AND p1.company_name IS NOT NULL
  ))
);

CREATE POLICY "Users can create stock adjustments" 
ON public.stock_adjustments 
FOR INSERT 
WITH CHECK (auth.uid() = created_by_user_id);

CREATE POLICY "Admins and managers can delete stock adjustments" 
ON public.stock_adjustments 
FOR DELETE 
USING (has_admin_or_manager_role(auth.uid()));