
export interface Purchase {
  id: string;
  invoice_number: string;
  vendor_id: string;
  vendor_name: string;
  purchase_date: string;
  total_amount: number;
  paid_amount: number;
  balance_amount: number;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  status: 'pending' | 'received' | 'returned';
  payment_method?: string;
  notes?: string;
  created_at: string;
}

export interface PurchaseItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  discount_rate: number;
  total_amount: number;
}

export interface Vendor {
  id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  gst_number?: string;
}
