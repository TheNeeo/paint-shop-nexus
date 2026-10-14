import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { VendorHistoryHeader } from "@/components/vendor/VendorHistoryHeader";
import { VendorHistorySummary } from "@/components/vendor/VendorHistorySummary";
import { VendorHistoryFilters } from "@/components/vendor/VendorHistoryFilters";
import { VendorHistoryTable } from "@/components/vendor/VendorHistoryTable";

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

const VendorHistory: React.FC = () => {
  const [filters, setFilters] = useState<FilterType>({
    search: "",
    dateRange: "",
    category: "",
    outstanding: "",
  });

  // Mock data for vendor history
  const vendorHistoryData: VendorHistoryData[] = [
    {
      id: "1",
      vendorName: "Asian Paints Ltd",
      mobile: "+91 98765 43210",
      gstNo: "27AAAAA0000A1Z5",
      totalOrders: 45,
      totalAmount: 125000,
      lastPurchase: "2024-01-15",
      outstanding: 15000,
      status: "Active",
      purchaseOrders: [
        { poNumber: "PO-2024-001", date: "2024-01-15", amount: 25000, paymentStatus: "Paid" },
        { poNumber: "PO-2024-002", date: "2024-01-10", amount: 15000, paymentStatus: "Pending" },
      ],
    },
    {
      id: "2",
      vendorName: "Berger Paints",
      mobile: "+91 87654 32109",
      gstNo: "19BBBBB1111B2Z6",
      totalOrders: 32,
      totalAmount: 95000,
      lastPurchase: "2024-01-12",
      outstanding: 0,
      status: "Active",
      purchaseOrders: [
        { poNumber: "PO-2024-003", date: "2024-01-12", amount: 35000, paymentStatus: "Paid" },
      ],
    },
    {
      id: "3",
      vendorName: "Nerolac Paints",
      mobile: "+91 76543 21098",
      gstNo: "36CCCCC2222C3Z7",
      totalOrders: 28,
      totalAmount: 78000,
      lastPurchase: "2024-01-08",
      outstanding: 12000,
      status: "Active",
      purchaseOrders: [
        { poNumber: "PO-2024-004", date: "2024-01-08", amount: 18000, paymentStatus: "Overdue" },
      ],
    },
  ];

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
