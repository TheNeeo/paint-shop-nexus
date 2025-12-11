import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { ChevronRight, Eye, Edit, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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
    name: product.name,
    id: `${categoryName.toLowerCase()}-${product.id}`,
  }));
};

const getStockStatus = (stock: number) => {
  if (stock <= 10) return { status: "Low Stock", color: "bg-red-100 text-red-800 border-red-200" };
  if (stock <= 30) return { status: "Medium", color: "bg-coral-100 text-coral-800 border-coral-200" };
  return { status: "In Stock", color: "bg-green-100 text-green-800 border-green-200" };
};

interface ProductRowsProps {
  categoryName: string;
  categoryColor: string;
  allCategories: any[];
  onMoveCategory?: (productId: string, targetCategoryId: string) => void;
}

export function ProductRows({ categoryName, categoryColor, allCategories, onMoveCategory }: ProductRowsProps) {
  const products = getMockProducts(categoryName);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <>
      {/* Products Header */}
      <TableRow className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-400">
        <TableCell></TableCell>
        <TableCell className="font-semibold text-green-900">Product Name</TableCell>
        <TableCell className="font-semibold text-green-900">SKU</TableCell>
        <TableCell className="font-semibold text-green-900">Price</TableCell>
        <TableCell className="font-semibold text-green-900">Stock</TableCell>
        <TableCell className="font-semibold text-green-900">Status</TableCell>
        <TableCell></TableCell>
        <TableCell className="font-semibold text-green-900">Actions</TableCell>
      </TableRow>
      
      {/* Product Rows */}
      {products.map((product, index) => (
        <TableRow 
          key={product.id} 
          className="bg-gradient-to-r from-green-50/30 to-green-50/10 border-l-4 border-green-200 hover:from-green-50/50 hover:to-green-50/20"
        >
          <TableCell className="pl-8">
            <ChevronRight className="h-3 w-3 text-green-400" />
          </TableCell>
          <TableCell className="pl-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-medium text-gray-800">{product.name}</span>
            </div>
          </TableCell>
          <TableCell>
            <span className="text-sm text-gray-600 font-mono">{product.sku}</span>
          </TableCell>
          <TableCell>
            <span className="text-sm font-semibold text-green-600">${product.price}</span>
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
                className="h-6 w-6 p-0 opacity-60 hover:opacity-100 hover:bg-green-100"
              >
                <Eye className="h-3 w-3 text-green-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-60 hover:opacity-100 hover:bg-green-100"
              >
                <Edit className="h-3 w-3 text-green-600" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
