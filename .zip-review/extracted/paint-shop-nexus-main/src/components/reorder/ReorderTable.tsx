
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Plus, ChevronDown, ChevronRight, Hash, Package, FileText, Ruler, Boxes, AlertTriangle, ShoppingCart, IndianRupee, Calculator, Truck, Settings } from 'lucide-react';
import { TableHeaderCell } from '@/components/shared/TableHeaderCell';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ReorderProduct } from '@/pages/ReorderProductList';
import { cn } from '@/lib/utils';

interface ReorderTableProps {
  products: ReorderProduct[];
  selectedProducts: string[];
  setSelectedProducts: (products: string[]) => void;
  searchTerm: string;
  categoryFilter: string;
  supplierFilter: string;
  stockStatusFilter: string;
}

export function ReorderTable({
  products,
  selectedProducts,
  setSelectedProducts,
  searchTerm,
  categoryFilter,
  supplierFilter,
  stockStatusFilter,
}: ReorderTableProps) {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [editableQty, setEditableQty] = useState<{[key: string]: number}>({});

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.hsnCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || product.category.toLowerCase() === categoryFilter;
    const matchesSupplier = !supplierFilter || product.supplierName.toLowerCase().includes(supplierFilter);
    const matchesStatus = stockStatusFilter === 'all' || product.status === stockStatusFilter;
    
    return matchesSearch && matchesCategory && matchesSupplier && matchesStatus;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const toggleRowExpansion = (productId: string) => {
    setExpandedRows(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const updateSuggestedQty = (productId: string, qty: number) => {
    setEditableQty(prev => ({ ...prev, [productId]: qty }));
  };

  const getRowClassName = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-red-50 border-red-200 hover:bg-red-100';
      case 'low':
        return 'bg-pink-50 border-pink-200 hover:bg-pink-100';
      default:
        return 'hover:bg-pink-50';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'critical':
        return <Badge variant="destructive" className="bg-red-600">Critical</Badge>;
      case 'low':
        return <Badge className="bg-pink-600">Low Stock</Badge>;
      default:
        return <Badge variant="secondary">Normal</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-pink-200 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-pink-100 sticky top-0 z-10">
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-12"></TableHead>
              <TableHeaderCell icon={Hash} label="S.No" textColor="#9d174d" iconColor="#64748b" />
              <TableHeaderCell icon={Package} label="Product Name" textColor="#9d174d" iconColor="#f97316" />
              <TableHeaderCell icon={FileText} label="HSN Code" textColor="#9d174d" iconColor="#ec4899" />
              <TableHeaderCell icon={Ruler} label="Unit" textColor="#9d174d" iconColor="#0d9488" />
              <TableHeaderCell icon={Boxes} label="Current Stock" textColor="#9d174d" iconColor="#0ea5e9" />
              <TableHeaderCell icon={AlertTriangle} label="Min Threshold" textColor="#9d174d" iconColor="#ef4444" />
              <TableHeaderCell icon={ShoppingCart} label="Suggested Qty" textColor="#9d174d" iconColor="#1e40af" />
              <TableHeaderCell icon={IndianRupee} label="Purchase Rate" textColor="#9d174d" iconColor="#f59e0b" />
              <TableHeaderCell icon={Calculator} label="Total Cost" textColor="#9d174d" iconColor="#8b5cf6" />
              <TableHeaderCell icon={Truck} label="Supplier" textColor="#9d174d" iconColor="#10b981" />
              <TableHeaderCell icon={Settings} label="Actions" textColor="#9d174d" iconColor="#64748b" align="center" className="text-center" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product, index) => {
              const isSelected = selectedProducts.includes(product.id);
              const isExpanded = expandedRows.includes(product.id);
              const suggestedQty = editableQty[product.id] ?? product.suggestedQty;
              const totalCost = suggestedQty * product.purchaseRate;
              
              return (
                <React.Fragment key={product.id}>
                  <TableRow className={cn(getRowClassName(product.status), "transition-colors")}>
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRowExpansion(product.id)}
                        className="p-1 hover:bg-pink-200"
                      >
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium text-pink-800">{index + 1}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <Badge variant="outline" className="text-xs border-pink-300 text-pink-700">
                          {product.category}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{product.hsnCode}</TableCell>
                    <TableCell className="text-gray-600">{product.unit}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{product.currentStock}</span>
                        {getStatusBadge(product.status)}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{product.minThreshold}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={suggestedQty}
                        onChange={(e) => updateSuggestedQty(product.id, parseInt(e.target.value) || 0)}
                        className="w-20 border-pink-300 focus:border-pink-500 focus:ring-pink-500"
                        min="0"
                      />
                    </TableCell>
                    <TableCell className="text-gray-600">₹{product.purchaseRate}</TableCell>
                    <TableCell className="font-medium text-pink-800">₹{totalCost.toLocaleString()}</TableCell>
                    <TableCell className="text-gray-600">{product.supplierName}</TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-pink-300 text-pink-700 hover:bg-pink-100"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-pink-600 hover:bg-pink-700 text-white"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {isExpanded && (
                    <TableRow className="bg-pink-25">
                      <TableCell colSpan={13} className="p-4">
                        <div className="bg-pink-25 rounded-lg p-4 border border-pink-200">
                          <h4 className="font-medium text-pink-800 mb-2">Product Details</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-pink-600 font-medium">Last Purchase:</span>
                              <p className="text-gray-600">2024-01-15</p>
                            </div>
                            <div>
                              <span className="text-pink-600 font-medium">Average Consumption:</span>
                              <p className="text-gray-600">15 units/month</p>
                            </div>
                            <div>
                              <span className="text-pink-600 font-medium">Lead Time:</span>
                              <p className="text-gray-600">5-7 days</p>
                            </div>
                            <div>
                              <span className="text-pink-600 font-medium">Storage Location:</span>
                              <p className="text-gray-600">Warehouse A-1</p>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
