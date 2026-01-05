
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
import { Badge } from "@/components/ui/badge";
import { Plus, Download, Activity, ShoppingCart } from "lucide-react";
import { SalesFilters } from "@/components/sales/SalesFilters";
import { SalesTable } from "@/components/sales/SalesTable";
import { NewInvoiceModal } from "@/components/sales/NewInvoiceModal";
import { InvoiceViewer } from "@/components/sales/InvoiceViewer";
import { SalesSummary } from "@/components/sales/SalesSummary";
import { SalesChart } from "@/components/sales/SalesChart";
import dashboardHomeIcon from "@/assets/dashboard-home-icon.png";
import salesActivityIcon from "@/assets/sales-activity-icon.png";

export default function SalesManagement() {
  const navigate = useNavigate();
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
      <div className="w-full bg-gradient-to-br from-pink-50 via-white to-rose-50 min-h-screen p-6">
        <div className="space-y-6">
          {/* Breadcrumb - Outside Header Box */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-3"
          >
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink 
                    onClick={() => navigate("/")} 
                    className="cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1.5"
                  >
                    <img src={dashboardHomeIcon} alt="Dashboard" className="h-5 w-5 object-contain bg-transparent" style={{ mixBlendMode: 'multiply' }} />
                    <span className="text-cyan-600 font-medium">Dashboard</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="flex items-center gap-1.5">
                    <ShoppingCart className="h-4 w-4 text-orange-400" />
                    <span className="text-orange-600 font-medium">Sales Management</span>
                  </BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="flex items-center gap-1.5">
                    <Activity className="h-4 w-4" style={{ color: '#af0568' }} />
                    <span className="font-semibold" style={{ color: '#af0568' }}>Sales Activity</span>
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </motion.div>

          {/* Enhanced Animated Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl p-6 mb-8 shadow-lg border-2 relative overflow-hidden"
            style={{ 
              background: 'linear-gradient(to right, #fce7f3, #fdf2f8, #fff1f2)',
              borderColor: '#f9a8d4'
            }}
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: '#af0568' }}></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-pink-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-2xl sm:text-4xl font-bold flex items-center gap-3"
                    style={{ color: '#831843' }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <img 
                        src={salesActivityIcon} 
                        alt="Sales Activity" 
                        className="h-10 w-10 sm:h-12 sm:w-12 object-contain" 
                        style={{ mixBlendMode: 'multiply' }}
                      />
                    </motion.div>
                    Sales Activity
                  </motion.h1>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  >
                    <Badge 
                      className="text-white border-none text-sm px-4 py-1 shadow-md"
                      style={{ background: 'linear-gradient(to right, #af0568, #db2777)' }}
                    >
                      Live Tracking
                    </Badge>
                  </motion.div>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-sm italic"
                  style={{ color: '#9d174d' }}
                >
                  Neo Color Factory ~ The Colors of Your Dreams 🎨
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-2"
              >
                <Button 
                  variant="outline" 
                  onClick={handleExportCSV}
                  className="bg-white transition-all duration-300 shadow-sm hover:shadow-md group"
                  style={{ 
                    borderColor: '#f9a8d4',
                    color: '#af0568'
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={() => setIsNewInvoiceModalOpen(true)} 
                    className="shadow-lg hover:shadow-xl border-2 transition-all duration-300 relative overflow-hidden group text-white"
                    style={{ 
                      background: 'linear-gradient(to right, #af0568, #db2777)',
                      borderColor: '#f472b6'
                    }}
                  >
                    <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                    <Plus className="h-4 w-4 mr-2 relative z-10" />
                    <span className="relative z-10">New Invoice</span>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Sales Summary Cards */}
          <SalesSummary />

          {/* Sales Chart */}
          <SalesChart />

          {/* Search & Filter Bar - Between Chart and Table */}
          <SalesFilters filters={filters} onFiltersChange={setFilters} />

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
      </div>
    </AppLayout>
  );
}
