import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const PAGE_SIZE = 500;

type PageResult<T> = {
  data: T[] | null;
  error: { message: string } | null;
};

async function fetchAllPages<T>(
  fetchPage: (from: number, to: number) => PromiseLike<PageResult<T>>,
): Promise<T[]> {
  const rows: T[] = [];

  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await fetchPage(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    if (!data?.length) break;

    rows.push(...data);
    if (data.length < PAGE_SIZE) break;
  }

  return rows;
}

export function useFinanceData() {
  return useQuery({
    queryKey: ["finance-data"],
    queryFn: async () => {
      const [sales, purchases, expenses, receipts, stockAdjustments] = await Promise.all([
        fetchAllPages((from, to) =>
          supabase
            .from("sales")
            .select("id, invoice_number, invoice_date, customer_name, total_amount, subtotal, tax_amount, discount_amount, paid_amount, pending_amount, payment_mode, payment_status, status, created_at")
            .order("invoice_date", { ascending: true })
            .range(from, to),
        ),
        fetchAllPages((from, to) =>
          supabase
            .from("purchases")
            .select("id, invoice_number, purchase_date, vendor_id, total_amount, paid_amount, balance_amount, payment_method, status, created_at, vendors(name)")
            .order("purchase_date", { ascending: true })
            .range(from, to),
        ),
        fetchAllPages((from, to) =>
          supabase
            .from("expenses")
            .select("id, date, type, amount, payment_mode, description, ref_no, created_at")
            .order("date", { ascending: true })
            .range(from, to),
        ),
        fetchAllPages((from, to) =>
          supabase
            .from("cash_receipts")
            .select("id, receipt_no, receipt_date, payer_name, amount, payment_mode, reason, notes, created_at")
            .order("receipt_date", { ascending: true })
            .range(from, to),
        ),
        fetchAllPages((from, to) =>
          supabase
            .from("stock_adjustments")
            .select("id, product_id, adjustment_type, quantity, reason, reference_id, created_at, products(name)")
            .order("created_at", { ascending: true })
            .range(from, to),
        ),
      ]);

      return { sales, purchases, expenses, receipts, stockAdjustments };
    },
    staleTime: 20_000,
  });
}
