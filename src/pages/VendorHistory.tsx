import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { VendorHistoryHeader } from "@/components/vendor/VendorHistoryHeader";
import { VendorHistorySummary } from "@/components/vendor/VendorHistorySummary";
import { VendorHistoryFilters } from "@/components/vendor/VendorHistoryFilters";
import { VendorHistoryTable } from "@/components/vendor/VendorHistoryTable";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface VendorHistoryData {
  id: string;
  vendorName: string;
  mobile: string;
  gstNo: string;
  totalOrders: number;
  totalAmount: number;
  lastPurchase: string;
  outstanding: number;
  status: "Active" | "Inactive";
  purchaseOrders: Array<{
    poNumber: string;
    date: string;
    amount: number;
    paymentStatus: "Paid" | "Pending" | "Overdue";
  }>;
}

export interface FilterType {
  search: string;
  dateRange: string;
  category: string;
  outstanding: string;
}

const mapPaymentStatus = (status: string | null): "Paid" | "Pending" | "Overdue" => {
  const s = (status || "").toLowerCase();
  if (s === "paid") return "Paid";
  if (s === "overdue") return "Overdue";
  return "Pending";
};

const VendorHistory: React.FC = () => {
  const [filters, setFilters] = useState<FilterType>({
    search: "",
    dateRange: "",
    category: "",
    outstanding: "",
  });

  const [vendorHistoryData, setVendorHistoryData] = useState<VendorHistoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const { data: vendors, error: vendorsError } = await supabase
          .from("vendors")
          .select("id, name, contact_person, email, phone, address, gst_number, status")
          .order("created_at", { ascending: false });

        if (vendorsError) throw vendorsError;

        const { data: purchases, error: purchasesError } = await supabase
          .from("purchases")
          .select("invoice_number, purchase_date, total_amount, status, balance_amount, vendor_id");

        if (purchasesError) throw purchasesError;

        const mapped: VendorHistoryData[] = (vendors || []).map((v) => {
          const vendorPurchases = (purchases || []).filter((p) => p.vendor_id === v.id);
          const totalOrders = vendorPurchases.length;
          const totalAmount = vendorPurchases.reduce((sum, p) => sum + (p.total_amount || 0), 0);
          const outstanding = vendorPurchases.reduce((sum, p) => sum + (p.balance_amount || 0), 0);
          const lastPurchase = vendorPurchases.length > 0
            ? new Date(Math.max(...vendorPurchases.map((p) => new Date(p.purchase_date).getTime()))).toISOString().split('T')[0]
            : "";

          return {
            id: v.id,
            vendorName: v.name,
            mobile: v.phone || "",
            gstNo: v.gst_number || "",
            totalOrders,
            totalAmount,
            lastPurchase,
            outstanding,
            status: (v.status === "Inactive" ? "Inactive" : "Active") as "Active" | "Inactive",
            purchaseOrders: vendorPurchases
              .sort((a, b) => new Date(b.purchase_date).getTime() - new Date(a.purchase_date).getTime())
              .map((p) => ({
                poNumber: p.invoice_number,
                date: p.purchase_date,
                amount: p.total_amount || 0,
                paymentStatus: mapPaymentStatus(p.status),
              })),
          };
        });

        setVendorHistoryData(mapped);
      } catch (error) {
        console.error("Error fetching vendors:", error);
        toast.error("Failed to load vendors");
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6 p-6 min-h-screen" style={{ background: 'linear-gradient(to bottom right, #e8f5f5, #f0fafa)' }}>
        <VendorHistoryHeader vendorCount={vendorHistoryData.length} />
        <VendorHistorySummary vendors={vendorHistoryData} />
        <VendorHistoryFilters filters={filters} setFilters={setFilters} />
        <VendorHistoryTable vendors={vendorHistoryData} filters={filters} />
      </div>
    </AppLayout>
  );
};

export default VendorHistory;
