
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { supabase } from '@/integrations/supabase/client';
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
  const [products, setProducts] = useState<ReorderProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLowStockProducts = async () => {
      setLoading(true);
      const { data: productsData, error } = await supabase
        .from('products')
        .select('*');

      if (error || !productsData) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const lowStock = productsData.filter(
        (p) => (p.current_stock ?? 0) <= (p.threshold_qty ?? 0)
      );

      const categoryIds = Array.from(new Set(lowStock.map(p => p.category_id).filter(Boolean))) as string[];
      const vendorIds = Array.from(new Set(lowStock.map(p => p.preferred_vendor_id).filter(Boolean))) as string[];

      const [categoriesRes, vendorsRes] = await Promise.all([
        categoryIds.length
          ? supabase.from('categories').select('id, name').in('id', categoryIds)
          : Promise.resolve({ data: [] as { id: string; name: string }[] }),
        vendorIds.length
          ? supabase.from('vendors').select('id, name').in('id', vendorIds)
          : Promise.resolve({ data: [] as { id: string; name: string }[] }),
      ]);

      const categoryMap = new Map((categoriesRes.data || []).map(c => [c.id, c.name]));
      const vendorMap = new Map((vendorsRes.data || []).map(v => [v.id, v.name]));

      const mapped: ReorderProduct[] = lowStock.map((p) => {
        const currentStock = p.current_stock ?? 0;
        const minThreshold = p.threshold_qty ?? 0;
        let status: ReorderProduct['status'] = 'normal';
        if (minThreshold > 0 && currentStock <= minThreshold * 0.5) {
          status = 'critical';
        } else if (currentStock <= minThreshold) {
          status = 'low';
        }

        return {
          id: p.id,
          name: p.name,
          category: p.category_id ? (categoryMap.get(p.category_id) || '') : '',
          hsnCode: p.hsn_code || '',
          unit: p.unit || '',
          currentStock,
          minThreshold,
          suggestedQty: Math.max(minThreshold - currentStock, 0) || minThreshold,
          purchaseRate: Number(p.purchase_price) || 0,
          supplierName: p.preferred_vendor_id ? (vendorMap.get(p.preferred_vendor_id) || '') : '',
          status,
        };
      });

      setProducts(mapped);
      setLoading(false);
    };

    fetchLowStockProducts();
  }, []);

  const totalEstimatedCost = selectedProducts.reduce((total, productId) => {
    const product = products.find(p => p.id === productId);
    return total + (product ? product.suggestedQty * product.purchaseRate : 0);
  }, 0);

  return (
    <AppLayout>
      <div className="w-full bg-gradient-to-br from-pink-50 via-white to-rose-50 min-h-screen p-6">
        <div className="space-y-6">
          <ReorderHeader />
          <ReorderSummaryCards products={products} />
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
          {!loading && products.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-pink-200 p-12 text-center text-gray-500">
              No low-stock products to reorder right now.
            </div>
          ) : (
            <ReorderTable 
              products={products}
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
              searchTerm={searchTerm}
              categoryFilter={categoryFilter}
              supplierFilter={supplierFilter}
              stockStatusFilter={stockStatusFilter}
            />
          )}
          
          {selectedProducts.length > 0 && (
            <BulkActionBar 
              selectedCount={selectedProducts.length}
              totalCost={totalEstimatedCost}
              onClearSelection={() => setSelectedProducts([])}
              onAddToPurchaseOrder={() => {
                console.log('Adding to purchase order:', selectedProducts);
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
      </div>
    </AppLayout>
  );
};

export default ReorderProductList;
