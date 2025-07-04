
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Edit, 
  Trash2, 
  ChevronDown, 
  ChevronRight,
  Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface InventoryTableProps {
  searchTerm: string;
  categoryFilter: string;
  stockStatusFilter: string;
  onEditProduct: (product: any) => void;
}

interface Product {
  id: string;
  name: string;
  category_id: string;
  hsn_code: string;
  unit: string;
  image_url: string;
  purchase_qty: number;
  sale_qty: number;
  current_stock: number;
  threshold_qty: number;
  unit_price: number;
  parent_product_id: string | null;
  is_variant: boolean;
  created_at: string;
  updated_at: string;
  categories?: { name: string };
  variants?: Product[];
}

export function InventoryTable({
  searchTerm,
  categoryFilter,
  stockStatusFilter,
  onEditProduct
}: InventoryTableProps) {
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", searchTerm, categoryFilter, stockStatusFilter],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select(`
          *,
          categories (name)
        `)
        .is("parent_product_id", null);

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%, hsn_code.ilike.%${searchTerm}%`);
      }

      if (categoryFilter) {
        query = query.eq("category_id", categoryFilter);
      }

      const { data: mainProducts } = await query.order("created_at", { ascending: false });
      
      if (!mainProducts) return [];

      // Fetch variants for each main product
      const productsWithVariants = await Promise.all(
        mainProducts.map(async (product) => {
          const { data: variants } = await supabase
            .from("products")
            .select("*")
            .eq("parent_product_id", product.id)
            .order("created_at", { ascending: false });
          
          return {
            ...product,
            variants: variants || []
          };
        })
      );

      return productsWithVariants;
    }
  });

  const toggleExpand = (productId: string) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedProducts(newExpanded);
  };

  const getStockStatus = (currentStock: number, threshold: number) => {
    if (currentStock === 0) return "out-of-stock";
    if (currentStock <= threshold) return "low-stock";
    return "in-stock";
  };

  const getStockBadge = (status: string) => {
    switch (status) {
      case "out-of-stock":
        return <Badge variant="destructive">Out of Stock</Badge>;
      case "low-stock":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Low Stock</Badge>;
      default:
        return <Badge variant="default" className="bg-green-100 text-green-800">In Stock</Badge>;
    }
  };

  const filteredProducts = products?.filter(product => {
    if (stockStatusFilter) {
      const status = getStockStatus(product.current_stock, product.threshold_qty);
      return status === stockStatusFilter;
    }
    return true;
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading inventory...</div>;
  }

  return (
    <div className="bg-white rounded-lg border border-cyan-200 shadow-sm overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-cyan-50">
            <TableHead className="w-12">S.No</TableHead>
            <TableHead>Product Details</TableHead>
            <TableHead className="w-20">Image</TableHead>
            <TableHead>HSN Code</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Purchase Qty</TableHead>
            <TableHead>Sale Qty</TableHead>
            <TableHead>Current Stock</TableHead>
            <TableHead>Threshold</TableHead>
            <TableHead>Total Value</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts?.map((product, index) => {
            const isExpanded = expandedProducts.has(product.id);
            const hasVariants = product.variants && product.variants.length > 0;
            const stockStatus = getStockStatus(product.current_stock, product.threshold_qty);
            const totalValue = product.current_stock * product.unit_price;

            return (
              <React.Fragment key={product.id}>
                <TableRow 
                  className={cn(
                    "hover:bg-cyan-50 transition-colors",
                    stockStatus === "low-stock" && "bg-red-50",
                    stockStatus === "out-of-stock" && "bg-red-100"
                  )}
                >
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {hasVariants && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand(product.id)}
                          className="p-1 h-6 w-6"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <Badge variant="outline" className="text-xs mt-1">
                          {product.categories?.name || "No Category"}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-md border"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-md border flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{product.hsn_code || "-"}</TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell>{product.purchase_qty}</TableCell>
                  <TableCell>{product.sale_qty}</TableCell>
                  <TableCell className="font-semibold">{product.current_stock}</TableCell>
                  <TableCell>{product.threshold_qty}</TableCell>
                  <TableCell className="font-semibold">₹{totalValue.toLocaleString()}</TableCell>
                  <TableCell>{getStockBadge(stockStatus)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onEditProduct(product)}
                        className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                
                {/* Variants/Sub-products */}
                {isExpanded && hasVariants && product.variants.map((variant: Product, vIndex: number) => {
                  const variantStockStatus = getStockStatus(variant.current_stock, variant.threshold_qty);
                  const variantTotalValue = variant.current_stock * variant.unit_price;
                  
                  return (
                    <TableRow 
                      key={variant.id} 
                      className={cn(
                        "bg-gray-50 hover:bg-cyan-25 transition-colors",
                        variantStockStatus === "low-stock" && "bg-red-25",
                        variantStockStatus === "out-of-stock" && "bg-red-50"
                      )}
                    >
                      <TableCell className="text-sm text-gray-500 pl-8">
                        {index + 1}.{vIndex + 1}
                      </TableCell>
                      <TableCell>
                        <div className="pl-6">
                          <div className="font-medium text-gray-800 text-sm">↳ {variant.name}</div>
                          <Badge variant="outline" className="text-xs mt-1 bg-cyan-50 text-cyan-700">
                            Variant
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {variant.image_url ? (
                          <img 
                            src={variant.image_url} 
                            alt={variant.name}
                            className="w-10 h-10 object-cover rounded-md border"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-md border flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">-</TableCell>
                      <TableCell className="text-sm">{variant.unit}</TableCell>
                      <TableCell className="text-sm">{variant.purchase_qty}</TableCell>
                      <TableCell className="text-sm">{variant.sale_qty}</TableCell>
                      <TableCell className="text-sm font-semibold">{variant.current_stock}</TableCell>
                      <TableCell className="text-sm">{variant.threshold_qty}</TableCell>
                      <TableCell className="text-sm font-semibold">₹{variantTotalValue.toLocaleString()}</TableCell>
                      <TableCell>{getStockBadge(variantStockStatus)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => onEditProduct(variant)}
                            className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
      
      {filteredProducts?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No products found matching your criteria.
        </div>
      )}
    </div>
  );
}
