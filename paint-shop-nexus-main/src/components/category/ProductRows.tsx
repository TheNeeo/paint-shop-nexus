
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { ChevronRight, Eye, Edit, MoveRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// Mock products data for each category
const getMockProducts = (categoryName: string) => {
  const baseProducts = [
    { id: "p1", name: "Premium Brush Set", sku: "BR001", price: 29.99, stock: 45, status: "Active" },
    { id: "p2", name: "Professional Canvas", sku: "CV001", price: 15.99, stock: 32, status: "Active" },
    { id: "p3", name: "Acrylic Paint - Red", sku: "AP001", price: 8.99, stock: 78, status: "Active" },
    { id: "p4", name: "Oil Paint - Blue", sku: "OP001", price: 12.99, stock: 23, status: "Low Stock" },
    { id: "p5", name: "Watercolor Set", sku: "WC001", price: 24.99, stock: 56, status: "Active" },
    { id: "p6", name: "Drawing Pencils", sku: "DP001", price: 6.99, stock: 89, status: "Active" },
    { id: "p7", name: "Palette Knife", sku: "PK001", price: 4.99, stock: 34, status: "Active" },
    { id: "p8", name: "Easel Stand", sku: "ES001", price: 89.99, stock: 12, status: "Low Stock" },
    { id: "p9", name: "Paint Thinner", sku: "PT001", price: 7.99, stock: 67, status: "Active" },
    { id: "p10", name: "Mixing Palette", sku: "MP001", price: 9.99, stock: 43, status: "Active" },
    { id: "p11", name: "Spray Varnish", sku: "SV001", price: 14.99, stock: 28, status: "Active" },
    { id: "p12", name: "Charcoal Sticks", sku: "CS001", price: 5.99, stock: 76, status: "Active" },
    { id: "p13", name: "Art Paper Pad", sku: "APP001", price: 11.99, stock: 54, status: "Active" },
    { id: "p14", name: "Color Wheel", sku: "CW001", price: 3.99, stock: 91, status: "Active" },
    { id: "p15", name: "Artist Apron", sku: "AA001", price: 19.99, stock: 37, status: "Active" },
  ];

  return baseProducts.map((product, index) => ({
    ...product,
    name: `${categoryName} - ${product.name}`,
    id: `${categoryName.toLowerCase()}-${product.id}`,
  }));
};

const getStockStatus = (stock: number) => {
  if (stock <= 10) return { status: "Low Stock", color: "bg-red-100 text-red-800 border-red-200" };
  if (stock <= 30) return { status: "Medium", color: "bg-coral-100 text-coral-800 border-coral-200" };
  return { status: "In Stock", color: "bg-green-100 text-green-800 border-green-200" };
};

interface Category {
  id: string;
  name: string;
  color: string;
}

interface ProductRowsProps {
  categoryName: string;
  categoryColor?: string;
  categoryId: string;
  allCategories: Category[];
}

const getColorClasses = (color: string) => {
  const colorMap: Record<string, { bg: string; border: string; text: string; light: string; dot: string }> = {
    blue: { bg: "from-blue-50 to-blue-100", border: "border-blue-400", text: "text-blue-900", light: "from-blue-50/30 to-blue-50/10", dot: "bg-blue-400" },
    green: { bg: "from-green-50 to-green-100", border: "border-green-400", text: "text-green-900", light: "from-green-50/30 to-green-50/10", dot: "bg-green-400" },
    red: { bg: "from-red-50 to-red-100", border: "border-red-400", text: "text-red-900", light: "from-red-50/30 to-red-50/10", dot: "bg-red-400" },
    yellow: { bg: "from-yellow-50 to-yellow-100", border: "border-yellow-400", text: "text-yellow-900", light: "from-yellow-50/30 to-yellow-50/10", dot: "bg-yellow-400" },
    purple: { bg: "from-purple-50 to-purple-100", border: "border-purple-400", text: "text-purple-900", light: "from-purple-50/30 to-purple-50/10", dot: "bg-purple-400" },
    pink: { bg: "from-pink-50 to-pink-100", border: "border-pink-400", text: "text-pink-900", light: "from-pink-50/30 to-pink-50/10", dot: "bg-pink-400" },
    orange: { bg: "from-orange-50 to-orange-100", border: "border-orange-400", text: "text-orange-900", light: "from-orange-50/30 to-orange-50/10", dot: "bg-orange-400" },
    cyan: { bg: "from-cyan-50 to-cyan-100", border: "border-cyan-400", text: "text-cyan-900", light: "from-cyan-50/30 to-cyan-50/10", dot: "bg-cyan-400" },
    indigo: { bg: "from-indigo-50 to-indigo-100", border: "border-indigo-400", text: "text-indigo-900", light: "from-indigo-50/30 to-indigo-50/10", dot: "bg-indigo-400" },
  };
  return colorMap[color] || colorMap.green;
};

export function ProductRows({ categoryName, categoryColor = "green", categoryId, allCategories }: ProductRowsProps) {
  const products = getMockProducts(categoryName);
  const colors = getColorClasses(categoryColor);

  const handleMoveProduct = (productId: string, productName: string, targetCategory: Category) => {
    // TODO: Implement actual move logic with database
    toast.success(`"${productName}" moved to "${targetCategory.name}"`);
  };

  const availableCategories = allCategories.filter(cat => cat.id !== categoryId);

  return (
    <>
      {/* Products Header */}
      <TableRow className={`bg-gradient-to-r ${colors.bg} border-l-4 ${colors.border}`}>
        <TableCell></TableCell>
        <TableCell className={`font-semibold ${colors.text}`}>Product Name</TableCell>
        <TableCell className={`font-semibold ${colors.text}`}>Product No/HSN Code</TableCell>
        <TableCell className={`font-semibold ${colors.text}`}>Price</TableCell>
        <TableCell className={`font-semibold ${colors.text}`}>Stock</TableCell>
        <TableCell className={`font-semibold ${colors.text}`}>Status</TableCell>
        <TableCell></TableCell>
        <TableCell className={`font-semibold ${colors.text}`}>Actions</TableCell>
      </TableRow>
      
      {/* Product Rows */}
      {products.map((product, index) => (
        <TableRow 
          key={product.id} 
          className={`bg-gradient-to-r ${colors.light} border-l-4 ${colors.border} hover:opacity-80`}
        >
          <TableCell className="pl-8">
            <ChevronRight className={`h-3 w-3 ${colors.text}`} />
          </TableCell>
          <TableCell className="pl-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 ${colors.dot} rounded-full`}></div>
              <span className="text-sm font-medium text-gray-800">{product.name}</span>
            </div>
          </TableCell>
          <TableCell>
            <span className="text-sm text-gray-600 font-mono">{product.sku}</span>
          </TableCell>
          <TableCell>
            <span className={`text-sm font-semibold ${colors.text}`}>₹{product.price}</span>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{product.stock}</span>
              <Badge className={`text-xs ${getStockStatus(product.stock).color}`}>
                {getStockStatus(product.stock).status}
              </Badge>
            </div>
          </TableCell>
          <TableCell>
            <Badge 
              className={
                product.status === "Active" 
                  ? "bg-green-100 text-green-800 border-green-200" 
                  : "bg-coral-100 text-coral-800 border-coral-200"
              }
            >
              {product.status}
            </Badge>
          </TableCell>
          <TableCell></TableCell>
          <TableCell>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 w-6 p-0 opacity-60 hover:opacity-100`}
                title="View"
              >
                <Eye className={`h-3 w-3 ${colors.text}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 w-6 p-0 opacity-60 hover:opacity-100`}
                title="Edit"
              >
                <Edit className={`h-3 w-3 ${colors.text}`} />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-6 w-6 p-0 opacity-60 hover:opacity-100`}
                    title="Move to another category"
                  >
                    <MoveRight className={`h-3 w-3 ${colors.text}`} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white z-50">
                  {availableCategories.length > 0 ? (
                    availableCategories.map((targetCategory) => (
                      <DropdownMenuItem
                        key={targetCategory.id}
                        onClick={() => handleMoveProduct(product.id, product.name, targetCategory)}
                        className="cursor-pointer flex items-center gap-2"
                      >
                        <div 
                          className={`w-3 h-3 rounded-full ${getColorClasses(targetCategory.color || 'green').dot}`}
                        />
                        {targetCategory.name}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem disabled className="text-gray-400">
                      No other categories
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
