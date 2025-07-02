
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
import { SalesFilters } from "@/components/sales/SalesFilters";
import { SalesTable } from "@/components/sales/SalesTable";
import { NewInvoiceModal } from "@/components/sales/NewInvoiceModal";
import { InvoiceViewer } from "@/components/sales/InvoiceViewer";
import { SalesSummary } from "@/components/sales/SalesSummary";
import { SalesChart } from "@/components/sales/SalesChart";

export default function SalesManagement() {
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);
  const [isInvoiceViewerOpen, setIsInvoiceViewerOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [filters, setFilters] = useState({
    customer: "all",
    status: "all",
    paymentMode: "all",
    search: "",
    dateRange: null,
  });

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsInvoiceViewerOpen(true);
  };

  const handleExportCSV = () => {
    // Export functionality
    console.log("Exporting CSV...");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Top Page Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Management</h1>
            <Breadcrumb className="mt-2">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/sales">Sales Management</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Sales Activity</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleExportCSV}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => setIsNewInvoiceModalOpen(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
          </div>
        </div>

        {/* Sales Summary Cards */}
        <SalesSummary />

        {/* Search & Filter Bar */}
        <SalesFilters filters={filters} onFiltersChange={setFilters} />

        {/* Sales Chart */}
        <SalesChart />

        {/* Sales Invoice Table */}
        <SalesTable filters={filters} onViewInvoice={handleViewInvoice} />

        {/* Modals */}
        <NewInvoiceModal
          isOpen={isNewInvoiceModalOpen}
          onClose={() => setIsNewInvoiceModalOpen(false)}
        />

        <InvoiceViewer
          isOpen={isInvoiceViewerOpen}
          onClose={() => setIsInvoiceViewerOpen(false)}
          invoice={selectedInvoice}
        />
      </div>
    </AppLayout>
  );
}
