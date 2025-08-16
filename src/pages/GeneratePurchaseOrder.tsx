
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
      <div className="min-h-screen bg-white p-6">
        <PurchaseOrderHeader />
        
        {/* Main Form Container */}
        <div className="max-w-7xl mx-auto mt-6">
          <div className="bg-white border border-pink-200 rounded-lg shadow-sm">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 px-6 py-4 border-b border-pink-200">
              <h2 className="text-xl font-semibold text-pink-800">Purchase Order Form</h2>
              <p className="text-pink-600 text-sm mt-1">Complete all sections to generate your purchase order</p>
            </div>
            
            {/* Form Content */}
            <div className="p-6 space-y-8">
              {/* Supplier and Order Info Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SupplierSelection 
                  selectedSupplier={selectedSupplier}
                  setSelectedSupplier={setSelectedSupplier}
                />
                <OrderInformation />
              </div>
              
              {/* Product Selection */}
              <div className="border-t border-pink-200 pt-6">
                <ProductSelection 
                  products={products}
                  updateProduct={updateProduct}
                  removeProduct={removeProduct}
                  addProduct={addProduct}
                />
              </div>
              
              {/* Order Summary */}
              <div className="border-t border-pink-200 pt-6">
                <div className="max-w-md ml-auto">
                  <OrderSummary 
                    orderSummary={orderSummary}
                    setOrderSummary={setOrderSummary}
                  />
                </div>
              </div>
              
              {/* Terms & Conditions */}
              <div className="border-t border-pink-200 pt-6">
                <TermsConditions />
              </div>
              
              {/* Action Buttons */}
              <div className="border-t border-pink-200 pt-6">
                <div className="max-w-md ml-auto">
                  <ActionButtons />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default GeneratePurchaseOrder;
