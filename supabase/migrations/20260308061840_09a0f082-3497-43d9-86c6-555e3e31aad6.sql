
CREATE TABLE public.cash_receipts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  receipt_no TEXT NOT NULL,
  receipt_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payer_name TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  payment_mode TEXT NOT NULL DEFAULT 'cash',
  reason TEXT,
  notes TEXT,
  created_by_user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.cash_receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own cash_receipts" ON public.cash_receipts
  FOR ALL TO authenticated
  USING (created_by_user_id = auth.uid())
  WITH CHECK (created_by_user_id = auth.uid());
