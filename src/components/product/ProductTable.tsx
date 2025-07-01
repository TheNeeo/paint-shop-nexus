
import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ProductRowContent } from "./ProductRowContent";
import { ProductRowActions } from "./ProductRowActions";
import { ProductVariantRows } from "./ProductVariantRows";

interface ProductTableProps {
  products: any[];
  expandedRows: Set<string>;
  selectedProducts: Set<string>;
  onToggleRowExpansion: (id: string) => void;
  onToggleProductSelection: (id: string) => void;
  onSelectAllProducts: () => void;
  onSetSelectedProduct: (product: any) => void;
  selectedProduct: any;
  getCategoryColor: (category: string) => string;
  getStockStatus: (quantity: number) => { status: string; color: string };
}

export function ProductTable({
  products,
  expandedRows,
  selectedProducts,
  onToggleRowExpansion,
  onToggleProductSelection,
  onSelectAllProducts,
  onSetSelectedProduct,
  selectedProduct,
  getCategoryColor,
  getStockStatus,
}: ProductTableProps) {
  return (
    <Card className="shadow-lg overflow-hidden border-green-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-slate-100 to-slate-200 border-b-2 border-slate-300">
            <TableHead className="w-12 text-black font-bold text-sm">
              <Checkbox
                checked={selectedProducts.size === products.length && products.length > 0}
                onCheckedChange={onSelectAllProducts}
                className="border-green-500 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              />
            </TableHead>
            <TableHead className="w-12 text-black font-bold text-sm"></TableHead>
            <TableHead className="w-16 text-black font-bold text-sm">Image</TableHead>
            <TableHead className="text-black font-bold text-sm">Product Details</TableHead>
            <TableHead className="text-black font-bold text-sm">Unit</TableHead>
            <TableHead className="text-black font-bold text-sm">Pricing</TableHead>
            <TableHead className="text-black font-bold text-sm">Stock</TableHead>
            <TableHead className="text-black font-bold text-sm">Performance</TableHead>
            <TableHead className="w-32 text-black font-bold text-sm">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white">
          {products.map((product) => (
            <React.Fragment key={product.id}>
              <TableRow className="hover:bg-green-50/50 transition-colors group border-b border-gray-100">
                <TableCell className="bg-white">
                  <Checkbox
                    checked={selectedProducts.has(product.id)}
                    onCheckedChange={() => onToggleProductSelection(product.id)}
                    className="border-green-500 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                </TableCell>
                <TableCell className="bg-white">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleRowExpansion(product.id)}
                    className="opacity-60 group-hover:opacity-100 transition-opacity hover:bg-green-100"
                  >
                    {expandedRows.has(product.id) ? (
                      <ChevronDown className="h-4 w-4 text-green-600" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-green-600" />
                    )}
                  </Button>
                </TableCell>
                
                <ProductRowContent
                  product={product}
                  getCategoryColor={getCategoryColor}
                  getStockStatus={getStockStatus}
                  onToggleRowExpansion={onToggleRowExpansion}
                />
                
                <TableCell className="bg-white">
                  <ProductRowActions 
                    product={product}
                    selectedProduct={selectedProduct}
                    onSetSelectedProduct={onSetSelectedProduct}
                  />
                </TableCell>
              </TableRow>
              
              {/* Variant Rows */}
              {expandedRows.has(product.id) && (
                <ProductVariantRows 
                  variants={product.variants}
                  getStockStatus={getStockStatus}
                />
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
