
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { ReorderHeader } from '@/components/reorder/ReorderHeader';
import { ReorderSummaryCards } from '@/components/reorder/ReorderSummaryCards';
import { ReorderFilters } from '@/components/reorder/ReorderFilters';
import { ReorderTable } from '@/components/reorder/ReorderTable';
import { BulkActionBar } from '@/components/reorder/BulkActionBar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface ReorderProduct {
  id: string;
  name: string;
  category: string;
  hsnCode: string;
  unit: string;
  currentStock: number;
  minThreshold: number;
  suggestedQty: number;
  purchaseRate: number;
  supplierName: string;
  status: 'critical' | 'low' | 'normal';
}

const ReorderProductList = () => {
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [stockStatusFilter, setStockStatusFilter] = useState('all');

  // Mock data for demonstration
  const mockProducts: ReorderProduct[] = [
    {
      id: '1',
      name: 'Wall Paint Premium',
      category: 'Paint',
      hsnCode: '32091000',
      unit: 'Ltr',
      currentStock: 5,
      minThreshold: 20,
      suggestedQty: 50,
      purchaseRate: 250,
      supplierName: 'Asian Paints Ltd',
      status: 'critical'
    },
    {
      id: '2',
      name: 'Brush Set Professional',
      category: 'Tools',
      hsnCode: '96034010',
      unit: 'Set',
      currentStock: 12,
      minThreshold: 25,
      suggestedQty: 40,
      purchaseRate: 150,
      supplierName: 'Tools India',
      status: 'low'
    },
    {
      id: '3',
      name: 'Roller Kit Standard',
      category: 'Tools',
      hsnCode: '96034020',
      unit: 'Set',
      currentStock: 8,
      minThreshold: 15,
      suggestedQty: 30,
      purchaseRate: 180,
      supplierName: 'Tools India',
      status: 'low'
    }
  ];

  const totalEstimatedCost = selectedProducts.reduce((total, productId) => {
    const product = mockProducts.find(p => p.id === productId);
    return total + (product ? product.suggestedQty * product.purchaseRate : 0);
  }, 0);

  return (
    <AppLayout>
      <div className="p-6 space-y-6 bg-pink-50 min-h-screen">
        <ReorderHeader />
        <ReorderSummaryCards products={mockProducts} />
        <ReorderFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          supplierFilter={supplierFilter}
          setSupplierFilter={setSupplierFilter}
          stockStatusFilter={stockStatusFilter}
          setStockStatusFilter={setStockStatusFilter}
        />
        <ReorderTable 
          products={mockProducts}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
          searchTerm={searchTerm}
          categoryFilter={categoryFilter}
          supplierFilter={supplierFilter}
          stockStatusFilter={stockStatusFilter}
        />
        
        {selectedProducts.length > 0 && (
          <BulkActionBar 
            selectedCount={selectedProducts.length}
            totalCost={totalEstimatedCost}
            onClearSelection={() => setSelectedProducts([])}
            onAddToPurchaseOrder={() => {
              console.log('Adding to purchase order:', selectedProducts);
              // Handle add to purchase order
            }}
          />
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-6 border-t border-pink-200">
          <Button
            variant="outline"
            onClick={() => navigate('/purchase')}
            className="border-pink-300 text-pink-700 hover:bg-pink-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Purchase Management
          </Button>
          <p className="text-sm text-pink-600">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default ReorderProductList;
