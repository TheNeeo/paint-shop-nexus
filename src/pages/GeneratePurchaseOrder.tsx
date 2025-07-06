
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { PurchaseOrderHeader } from '@/components/purchase-order/PurchaseOrderHeader';
import { SupplierSelection } from '@/components/purchase-order/SupplierSelection';
import { OrderInformation } from '@/components/purchase-order/OrderInformation';
import { ProductSelection } from '@/components/purchase-order/ProductSelection';
import { OrderSummary } from '@/components/purchase-order/OrderSummary';
import { TermsConditions } from '@/components/purchase-order/TermsConditions';
import { ActionButtons } from '@/components/purchase-order/ActionButtons';

export interface PurchaseOrderProduct {
  id: string;
  name: string;
  category: string;
  hsnCode: string;
  unit: string;
  currentStock: number;
  quantity: number;
  rate: number;
  totalAmount: number;
  imageUrl?: string;
}

export interface OrderSummaryData {
  subtotal: number;
  discount: number;
  discountType: 'percentage' | 'amount';
  taxAmount: number;
  freightCharges: number;
  grandTotal: number;
}

export interface SupplierData {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
}

const GeneratePurchaseOrder = () => {
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierData | null>(null);
  const [products, setProducts] = useState<PurchaseOrderProduct[]>([
    {
      id: '1',
      name: 'Wall Paint Premium',
      category: 'Paint',
      hsnCode: '32091000',
      unit: 'Ltr',
      currentStock: 5,
      quantity: 50,
      rate: 250,
      totalAmount: 12500,
    }
  ]);
  const [orderSummary, setOrderSummary] = useState<OrderSummaryData>({
    subtotal: 0,
    discount: 0,
    discountType: 'percentage',
    taxAmount: 0,
    freightCharges: 0,
    grandTotal: 0,
  });

  const updateProduct = (productId: string, updates: Partial<PurchaseOrderProduct>) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, ...updates, totalAmount: (updates.quantity || product.quantity) * (updates.rate || product.rate) }
        : product
    ));
  };

  const removeProduct = (productId: string) => {
    setProducts(prev => prev.filter(product => product.id !== productId));
  };

  const addProduct = () => {
    const newProduct: PurchaseOrderProduct = {
      id: `new-${Date.now()}`,
      name: '',
      category: '',
      hsnCode: '',
      unit: 'Nos',
      currentStock: 0,
      quantity: 1,
      rate: 0,
      totalAmount: 0,
    };
    setProducts(prev => [...prev, newProduct]);
  };

  // Calculate order summary
  React.useEffect(() => {
    const subtotal = products.reduce((sum, product) => sum + product.totalAmount, 0);
    const discountAmount = orderSummary.discountType === 'percentage' 
      ? (subtotal * orderSummary.discount / 100)
      : orderSummary.discount;
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = afterDiscount * 0.18; // 18% GST
    const grandTotal = afterDiscount + taxAmount + orderSummary.freightCharges;

    setOrderSummary(prev => ({
      ...prev,
      subtotal,
      taxAmount,
      grandTotal,
    }));
  }, [products, orderSummary.discount, orderSummary.discountType, orderSummary.freightCharges]);

  return (
    <AppLayout>
      <div className="min-h-screen bg-pink-50 p-6 space-y-6">
        <PurchaseOrderHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SupplierSelection 
              selectedSupplier={selectedSupplier}
              setSelectedSupplier={setSelectedSupplier}
            />
            
            <OrderInformation />
            
            <ProductSelection 
              products={products}
              updateProduct={updateProduct}
              removeProduct={removeProduct}
              addProduct={addProduct}
            />
          </div>
          
          <div className="space-y-6">
            <OrderSummary 
              orderSummary={orderSummary}
              setOrderSummary={setOrderSummary}
            />
            
            <TermsConditions />
            
            <ActionButtons />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default GeneratePurchaseOrder;
