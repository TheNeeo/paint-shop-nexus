
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AppLayout from '@/components/layout/AppLayout';
import { PurchaseFilters } from '@/components/purchase/PurchaseFilters';
import { PurchaseTable } from '@/components/purchase/PurchaseTable';
import { PurchaseSummary } from '@/components/purchase/PurchaseSummary';
import { NewPurchaseModal } from '@/components/purchase/NewPurchaseModal';
import { PurchaseInvoiceModal } from '@/components/purchase/PurchaseInvoiceModal';
import { Purchase } from '@/types/purchase';
import { supabase } from "@/integrations/supabase/client";
import { exportToCSV } from "@/lib/exportUtils";
import { toast } from "sonner";
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
import { Plus, Download, ShoppingCart, Activity } from "lucide-react";
import dashboardHomeIcon from "@/assets/dashboard-home-icon.png";
import purchaseActivityIcon from "@/assets/purchase-activity-icon.png";

// Theme colors
const THEME_PRIMARY = "#1e40af"; // Dark blue
const THEME_SECONDARY = "#3b82f6"; // Blue
const THEME_LIGHT = "#dbeafe"; // Light blue
const THEME_BORDER = "#93c5fd"; // Blue border

const PurchaseManagement = () => {
  const navigate = useNavigate();
  const [isNewPurchaseModalOpen, setIsNewPurchaseModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleNewPurchase = () => {
    setIsNewPurchaseModalOpen(true);
  };

  const handleViewInvoice = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setIsInvoiceModalOpen(true);
  };

  const handlePurchaseCreated = () => {
    setRefreshTrigger(prev => prev + 1);
    setIsNewPurchaseModalOpen(false);
  };

  const handleExportCSV = async () => {
    try {
      const { data, error } = await supabase.from('purchases').select('invoice_number, purchase_date, total_amount, paid_amount, balance_amount, payment_method, status').order('purchase_date', { ascending: false });
      if (error) throw error;
      if (!data || data.length === 0) { toast.error("No purchase data to export"); return; }
      const formatted = data.map(p => ({ Invoice: p.invoice_number, Date: p.purchase_date, Total: p.total_amount, Paid: p.paid_amount, Balance: p.balance_amount, 'Payment Method': p.payment_method || 'N/A', Status: p.status }));
      exportToCSV(formatted, 'purchases_export');
      toast.success("Purchase data exported successfully!");
    } catch (err) { toast.error("Failed to export purchase data"); }
  };

  return (
    <AppLayout>
      <div className="w-full bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen p-6">
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
                    <span className="text-orange-600 font-medium">Purchase Management</span>
                  </BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="flex items-center gap-1.5">
                    <Activity className="h-4 w-4" style={{ color: THEME_PRIMARY }} />
                    <span className="font-semibold" style={{ color: THEME_PRIMARY }}>Purchase Activity</span>
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
              background: `linear-gradient(to right, ${THEME_LIGHT}, #eff6ff, #eef2ff)`,
              borderColor: THEME_BORDER
            }}
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: THEME_PRIMARY }}></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-2xl sm:text-4xl font-bold flex items-center gap-3"
                    style={{ color: THEME_PRIMARY }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <img 
                        src={purchaseActivityIcon} 
                        alt="Purchase Activity" 
                        className="h-10 w-10 sm:h-12 sm:w-12 object-contain" 
                        style={{ mixBlendMode: 'multiply' }}
                      />
                    </motion.div>
                    Purchase Activity
                  </motion.h1>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  >
                    <Badge 
                      className="text-white border-none text-sm px-4 py-1 shadow-md"
                      style={{ background: `linear-gradient(to right, ${THEME_PRIMARY}, ${THEME_SECONDARY})` }}
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
                  style={{ color: '#1e3a8a' }}
                >
                  Smarter purchasing, simplified. 🛒
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
                    borderColor: THEME_BORDER,
                    color: THEME_PRIMARY
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={handleNewPurchase} 
                    className="shadow-lg hover:shadow-xl border-2 transition-all duration-300 relative overflow-hidden group text-white"
                    style={{ 
                      background: `linear-gradient(to right, ${THEME_PRIMARY}, ${THEME_SECONDARY})`,
                      borderColor: THEME_BORDER
                    }}
                  >
                    <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                    <Plus className="h-4 w-4 mr-2 relative z-10" />
                    <span className="relative z-10">New Purchase</span>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Purchase Summary Cards */}
          <PurchaseSummary />
          
          {/* Filters */}
          <PurchaseFilters />
          
          {/* Purchase Table */}
          <PurchaseTable 
            onViewInvoice={handleViewInvoice}
            refreshTrigger={refreshTrigger}
          />
          
          {/* Modals */}
          <NewPurchaseModal
            isOpen={isNewPurchaseModalOpen}
            onClose={() => setIsNewPurchaseModalOpen(false)}
            onPurchaseCreated={handlePurchaseCreated}
          />
          
          <PurchaseInvoiceModal
            isOpen={isInvoiceModalOpen}
            onClose={() => setIsInvoiceModalOpen(false)}
            purchase={selectedPurchase}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default PurchaseManagement;
