
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { PurchaseInvoiceForm } from '@/components/purchase/PurchaseInvoiceForm';
import { PurchaseInvoiceHistory } from '@/components/purchase/PurchaseInvoiceHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ShoppingCart, FileText, History, Plus } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { exportToCSV } from "@/lib/exportUtils";
import { toast } from "sonner";
import dashboardHomeIcon from '@/assets/dashboard-home-icon.png';
import purchaseInvoiceIcon from '@/assets/purchase-invoice-page-icon.png';

const PurchaseInvoice = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('create');

  const handleExportCSV = async () => {
    try {
      const { data, error } = await supabase.from('purchases').select('invoice_number, purchase_date, total_amount, paid_amount, balance_amount, status').order('purchase_date', { ascending: false });
      if (error) throw error;
      if (!data || data.length === 0) { toast.error("No invoice data to export"); return; }
      const formatted = data.map(p => ({ Invoice: p.invoice_number, Date: p.purchase_date, Total: p.total_amount, Paid: p.paid_amount, Balance: p.balance_amount, Status: p.status }));
      exportToCSV(formatted, 'purchase_invoices_export');
      toast.success("Purchase invoices exported successfully!");
    } catch (err) { toast.error("Failed to export purchase invoices"); }
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
                  <BreadcrumbLink 
                    onClick={() => navigate("/purchase/activity")} 
                    className="cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1.5"
                  >
                    <ShoppingCart className="h-4 w-4 text-orange-400" />
                    <span className="text-orange-600 font-medium">Purchase Management</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4" style={{ color: '#af0568' }} />
                    <span className="font-semibold" style={{ color: '#af0568' }}>Purchase Invoice</span>
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
                        src={purchaseInvoiceIcon} 
                        alt="Purchase Invoice" 
                        className="h-10 w-10 sm:h-12 sm:w-12 object-contain" 
                        style={{ mixBlendMode: 'multiply' }}
                      />
                    </motion.div>
                    Purchase Invoice
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
                      Invoice Management
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
                  Create and manage purchase invoices ~ Streamline your procurement 📋
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
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex gap-2 p-2 h-auto rounded-xl shadow-lg border-2"
                style={{ 
                  background: 'linear-gradient(to right, #fce7f3, #fdf2f8)',
                  borderColor: '#f9a8d4'
                }}
              >
                <TabsTrigger 
                  value="create" 
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 data-[state=active]:shadow-lg"
                  style={{ 
                    color: activeTab === 'create' ? 'white' : '#831843',
                    background: activeTab === 'create' ? 'linear-gradient(to right, #af0568, #db2777)' : 'transparent',
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Create Invoice
                </TabsTrigger>
                <TabsTrigger 
                  value="history" 
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 data-[state=active]:shadow-lg"
                  style={{ 
                    color: activeTab === 'history' ? 'white' : '#831843',
                    background: activeTab === 'history' ? 'linear-gradient(to right, #af0568, #db2777)' : 'transparent',
                  }}
                >
                  <History className="h-4 w-4" />
                  Invoice History
                </TabsTrigger>
              </TabsList>
            </motion.div>
            
            <TabsContent value="create" className="space-y-6 mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <PurchaseInvoiceForm />
              </motion.div>
            </TabsContent>
            
            <TabsContent value="history" className="space-y-6 mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <PurchaseInvoiceHistory />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default PurchaseInvoice;
