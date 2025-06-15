
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
import { Plus } from "lucide-react";
import { SalesFilters } from "@/components/sales/SalesFilters";
import { SalesTable } from "@/components/sales/SalesTable";
import { NewSaleModal } from "@/components/sales/NewSaleModal";
import { InvoiceViewer } from "@/components/sales/InvoiceViewer";
import { SalesSummary } from "@/components/sales/SalesSummary";
import { SalesChart } from "@/components/sales/SalesChart";

export default function SalesManagement() {
  const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false);
  const [isInvoiceViewerOpen, setIsInvoiceViewerOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [filters, setFilters] = useState({
    customer: "",
    status: "",
    search: "",
  });

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsInvoiceViewerOpen(true);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Area */}
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
                  <BreadcrumbPage>Sales</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <Button onClick={() => setIsNewSaleModalOpen(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            New Sale
          </Button>
        </div>

        {/* Filters */}
        <SalesFilters filters={filters} onFiltersChange={setFilters} />

        {/* Sales Chart */}
        <SalesChart />

        {/* Sales Table */}
        <SalesTable filters={filters} onViewInvoice={handleViewInvoice} />

        {/* Sales Summary */}
        <SalesSummary />

        {/* Modals */}
        <NewSaleModal
          isOpen={isNewSaleModalOpen}
          onClose={() => setIsNewSaleModalOpen(false)}
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
