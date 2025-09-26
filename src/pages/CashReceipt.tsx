import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Plus, Download, Filter } from "lucide-react";
import { CashReceiptHeader } from "@/components/cash-receipt/CashReceiptHeader";
import { CashReceiptSummary } from "@/components/cash-receipt/CashReceiptSummary";
import { CashReceiptFilters } from "@/components/cash-receipt/CashReceiptFilters";
import { CashReceiptTable } from "@/components/cash-receipt/CashReceiptTable";
import { AddEditReceiptModal } from "@/components/cash-receipt/AddEditReceiptModal";

export default function CashReceipt() {
  const [isNewReceiptModalOpen, setIsNewReceiptModalOpen] = useState(false);
  const [editingReceipt, setEditingReceipt] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: null,
    payerName: "",
    paymentMode: "all",
    search: "",
  });

  const handleAddReceipt = () => {
    setEditingReceipt(null);
    setIsNewReceiptModalOpen(true);
  };

  const handleEditReceipt = (receipt: any) => {
    setEditingReceipt(receipt);
    setIsNewReceiptModalOpen(true);
  };

  const handleExportCSV = () => {
    console.log("Exporting CSV...");
  };

  return (
    <AppLayout>
      <div 
        className="space-y-6 min-h-screen" 
        style={{ 
          background: "linear-gradient(135deg, #f8fffe 0%, #f0fdf4 50%, #ecfdf5 100%)",
          borderRadius: "12px",
          padding: "24px"
        }}
      >
        {/* Top Page Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 
              className="text-3xl font-bold" 
              style={{ color: "#16583f" }}
            >
              Cash Receipts
            </h1>
            <Breadcrumb className="mt-2">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/sales">Sales Management</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Cash Receipt</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleExportCSV}
              style={{
                borderColor: "#7DBE3C",
                color: "#16583f",
                backgroundColor: "rgba(125, 190, 60, 0.1)"
              }}
              className="hover:bg-opacity-20"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button 
              onClick={handleAddReceipt}
              style={{ 
                backgroundColor: "#7DBE3C",
                color: "white"
              }}
              className="hover:opacity-90"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Receipt
            </Button>
          </div>
        </div>

        {/* Cash Summary Cards */}
        <CashReceiptSummary />

        {/* Search & Filter Bar */}
        <CashReceiptFilters filters={filters} onFiltersChange={setFilters} />

        {/* Receipt Table */}
        <CashReceiptTable 
          filters={filters} 
          onEditReceipt={handleEditReceipt}
        />

        {/* Add/Edit Receipt Modal */}
        <AddEditReceiptModal
          isOpen={isNewReceiptModalOpen}
          onClose={() => setIsNewReceiptModalOpen(false)}
          receipt={editingReceipt}
        />
      </div>
    </AppLayout>
  );
}