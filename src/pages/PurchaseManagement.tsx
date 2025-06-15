
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PurchaseHeader } from '@/components/purchase/PurchaseHeader';
import { PurchaseFilters } from '@/components/purchase/PurchaseFilters';
import { PurchaseTable } from '@/components/purchase/PurchaseTable';
import { PurchaseSummary } from '@/components/purchase/PurchaseSummary';
import { NewPurchaseModal } from '@/components/purchase/NewPurchaseModal';
import { PurchaseInvoiceModal } from '@/components/purchase/PurchaseInvoiceModal';

export interface Purchase {
  id: string;
  invoice_number: string;
  vendor_id: string;
  vendor_name: string;
  purchase_date: string;
  total_amount: number;
  paid_amount: number;
  balance_amount: number;
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

const PurchaseManagement = () => {
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

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <PurchaseHeader onNewPurchase={handleNewPurchase} />
        <PurchaseFilters />
        <PurchaseTable 
          onViewInvoice={handleViewInvoice}
          refreshTrigger={refreshTrigger}
        />
        <PurchaseSummary />
        
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
    </AppLayout>
  );
};

export default PurchaseManagement;
