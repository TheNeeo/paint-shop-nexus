
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { SupplierSelection } from '@/components/purchase-order/SupplierSelection';
import { OrderInformation } from '@/components/purchase-order/OrderInformation';
import { ProductSelection } from '@/components/purchase-order/ProductSelection';
import { OrderSummary } from '@/components/purchase-order/OrderSummary';
import { TermsConditions } from '@/components/purchase-order/TermsConditions';
import { ActionButtons } from '@/components/purchase-order/ActionButtons';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import purchaseOrderIcon from '@/assets/purchase-order-icon.png';

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
  const navigate = useNavigate();
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
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Main Form Container */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            {/* Form Header with Icon and Close Button */}
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 px-6 py-4 border-b border-pink-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-md">
                  <img src={purchaseOrderIcon} alt="Purchase Order" className="w-6 h-6 filter brightness-0 invert" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-pink-800">Purchase Order Form</h2>
                  <p className="text-pink-600 text-sm">Complete all sections to generate your purchase order</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/purchase/reorder')}
                className="h-8 w-8 rounded-full hover:bg-pink-100 text-pink-600 hover:text-pink-800"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Form Content */}
            <div className="p-6">
              {/* Supplier and Order Info Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <SupplierSelection 
                  selectedSupplier={selectedSupplier}
                  setSelectedSupplier={setSelectedSupplier}
                />
                <OrderInformation />
              </div>
              
              {/* Product Selection */}
              <div className="mb-8">
                <ProductSelection 
                  products={products}
                  updateProduct={updateProduct}
                  removeProduct={removeProduct}
                  addProduct={addProduct}
                />
              </div>
              
              {/* Bottom Section: Order Summary and Terms */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div>
                  <TermsConditions />
                </div>
                <div>
                  <OrderSummary 
                    orderSummary={orderSummary}
                    setOrderSummary={setOrderSummary}
                  />
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-center">
                  <div className="w-full max-w-md">
                    <ActionButtons />
                  </div>
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
