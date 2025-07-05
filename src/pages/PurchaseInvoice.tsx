
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { PurchaseInvoiceForm } from '@/components/purchase/PurchaseInvoiceForm';
import { PurchaseInvoiceHistory } from '@/components/purchase/PurchaseInvoiceHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PurchaseInvoice = () => {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-pink-800">Purchase Invoice</h1>
          <p className="text-pink-600 mt-1">Create and manage purchase invoices</p>
        </div>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Invoice</TabsTrigger>
            <TabsTrigger value="history">Invoice History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="space-y-6">
            <PurchaseInvoiceForm />
          </TabsContent>
          
          <TabsContent value="history" className="space-y-6">
            <PurchaseInvoiceHistory />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default PurchaseInvoice;
