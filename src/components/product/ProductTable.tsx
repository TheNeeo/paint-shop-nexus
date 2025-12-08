import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronRight, Star, Package } from "lucide-react";
import { ProductRowActions } from "./ProductRowActions";
import { ProductVariantRows } from "./ProductVariantRows";

interface ProductTableProps {
  products: any[];
  expandedRows: Set<string>;
  selectedProducts: Set<string>;
  onToggleRowExpansion: (productId: string) => void;
  onToggleProductSelection: (productId: string) => void;
  onSelectAllProducts: () => void;
  onSetSelectedProduct: (product: any) => void;
  selectedProduct: any;
  getCategoryColor: (category: string, categoryColor?: string) => string;
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-2xl shadow-xl border-2 border-green-200 overflow-hidden"
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border-b-2 border-green-800">
            <TableHead className="text-white font-bold text-sm w-12">
              <Checkbox
                checked={selectedProducts.size === products.length && products.length > 0}
                onCheckedChange={onSelectAllProducts}
                className="border-2 border-white data-[state=checked]:bg-white data-[state=checked]:text-green-600"
              />
            </TableHead>
            <TableHead className="text-white font-bold text-sm w-12"></TableHead>
            <TableHead className="text-white font-bold text-sm w-12">#</TableHead>
            <TableHead className="text-white font-bold text-sm">Product Name</TableHead>
            <TableHead className="text-white font-bold text-sm">Category</TableHead>
            <TableHead className="text-white font-bold text-sm">Vendor Name</TableHead>
            <TableHead className="text-white font-bold text-sm">Unit Price</TableHead>
            <TableHead className="text-white font-bold text-sm">Stock</TableHead>
            <TableHead className="text-white font-bold text-sm">Sales</TableHead>
            <TableHead className="text-white font-bold text-sm">Warranty/Expiry</TableHead>
            <TableHead className="text-white font-bold text-sm w-40">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <React.Fragment key={product.id}>
              <TableRow className={`border-b border-green-100 transition-all duration-200 group hover:scale-[1.01] hover:shadow-md ${
                selectedProducts.has(product.id) 
                  ? 'bg-gradient-to-r from-green-100 via-green-50 to-emerald-100 border-l-4 border-l-green-500 shadow-inner' 
                  : 'hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100'
              }`}>
                <TableCell>
                  <Checkbox
                    checked={selectedProducts.has(product.id)}
                    onCheckedChange={() => onToggleProductSelection(product.id)}
                    className="border-2 border-green-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleRowExpansion(product.id)}
                    className="p-1 hover:bg-green-100 transition-all duration-200 hover:scale-110"
                  >
                    {expandedRows.has(product.id) ? (
                      <ChevronDown className="h-4 w-4 text-green-600" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-green-600" />
                    )}
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center border border-green-200 group-hover:bg-green-200 transition-colors duration-200">
                    <span className="text-xs font-medium text-green-700">{index + 1}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg border-2 border-green-200 object-cover group-hover:scale-110 group-hover:border-green-400 transition-all duration-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        {product.variants && product.variants.length > 0 && (
                          <Badge className="bg-green-500 text-white text-[10px] px-1.5 py-0">PARENT</Badge>
                        )}
                        <span className="font-semibold text-gray-800 group-hover:text-green-700 transition-colors duration-200">{product.name}</span>
                        {product.featured && (
                          <Star className="h-4 w-4 text-coral-500 fill-current animate-pulse" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500">Code: {product.baseCode}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`${getCategoryColor(product.category, product.categoryColor)} text-xs font-medium group-hover:scale-110 transition-transform duration-200`}>
                    {product.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-700">{product.vendorName || "-"}</span>
                </TableCell>
                <TableCell>
                  <span className="text-lg font-bold text-green-700 group-hover:text-green-800 transition-colors duration-200">₹{product.unitPrice.toFixed(2)}</span>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{product.stockQuantity}</span>
                      <Badge className={`text-xs ${getStockStatus(product.stockQuantity).color}`}>
                        {getStockStatus(product.stockQuantity).status}
                      </Badge>
                    </div>
                    {/* Stock Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          product.stockQuantity === 0 ? 'bg-red-500' : 
                          product.stockQuantity <= 10 ? 'bg-orange-500' : 
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min((product.stockQuantity / 150) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium text-gray-700">{product.totalSales} sold</div>
                    <div className="text-gray-500">⭐ {product.rating}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-600">
                    {product.expiryDate ? (
                      <div>
                        <div className="font-medium">Exp: {product.expiryDate}</div>
                        {product.remainingWarranty && (
                          <div className="text-xs text-gray-500">{product.remainingWarranty}</div>
                        )}
                      </div>
                    ) : (
                      "-"
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <ProductRowActions
                    product={product}
                    selectedProduct={selectedProduct}
                    onSetSelectedProduct={onSetSelectedProduct}
                  />
                </TableCell>
              </TableRow>

              {/* Product Variants */}
              {expandedRows.has(product.id) && product.variants && product.variants.length > 0 && (
                <ProductVariantRows
                  variants={product.variants}
                  getStockStatus={getStockStatus}
                />
              )}
            </React.Fragment>
          ))}
          
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <Package className="h-8 w-8 text-gray-300" />
                  <span>No products found</span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </motion.div>
  );
}
