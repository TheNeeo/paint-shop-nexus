import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Package, ChevronDown, ChevronRight, Eye } from "lucide-react";

interface CategoryTableProps {
  categories: any[];
  onEdit: (category: any) => void;
  onDelete: (categoryId: string) => void;
}

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

const getCategoryColor = (color: string) => {
  const colors = {
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    red: "bg-red-100 text-red-800 border-red-200",
    green: "bg-green-100 text-green-800 border-green-200",
    purple: "bg-purple-100 text-purple-800 border-purple-200",
    orange: "bg-orange-100 text-orange-800 border-orange-200",
    pink: "bg-pink-100 text-pink-800 border-pink-200",
    indigo: "bg-indigo-100 text-indigo-800 border-indigo-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };
  return colors[color] || "bg-slate-100 text-slate-800 border-slate-200";
};

const getColorDot = (color: string) => {
  const colors = {
    blue: "bg-blue-500",
    red: "bg-red-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    pink: "bg-pink-500",
    indigo: "bg-indigo-500",
    yellow: "bg-yellow-500",
  };
  return colors[color] || "bg-slate-500";
};

const getStockStatus = (stock: number) => {
  if (stock <= 10) return { status: "Low Stock", color: "bg-red-100 text-red-800 border-red-200" };
  if (stock <= 30) return { status: "Medium", color: "bg-yellow-100 text-yellow-800 border-yellow-200" };
  return { status: "In Stock", color: "bg-green-100 text-green-800 border-green-200" };
};

export function CategoryTable({ categories, onEdit, onDelete }: CategoryTableProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-slate-100 to-slate-200 border-b-2 border-slate-300">
            <TableHead className="text-black font-bold text-sm w-12"></TableHead>
            <TableHead className="text-black font-bold text-sm">Category</TableHead>
            <TableHead className="text-black font-bold text-sm">Description</TableHead>
            <TableHead className="text-black font-bold text-sm">Color</TableHead>
            <TableHead className="text-black font-bold text-sm">Products</TableHead>
            <TableHead className="text-black font-bold text-sm">Status</TableHead>
            <TableHead className="text-black font-bold text-sm">Created</TableHead>
            <TableHead className="text-black font-bold text-sm w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <React.Fragment key={category.id}>
              {/* Category Row */}
              <TableRow 
                className="hover:bg-green-50/50 transition-colors border-b border-gray-100 cursor-pointer"
                onClick={() => toggleCategoryExpansion(category.id)}
              >
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-6 w-6"
                  >
                    {expandedCategories.has(category.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
                
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getColorDot(category.color)}`} />
                    <span className="text-gray-900">{category.name}</span>
                  </div>
                </TableCell>
                
                <TableCell className="text-gray-600 max-w-xs">
                  <div className="truncate" title={category.description}>
                    {category.description}
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge className={`${getCategoryColor(category.color)} border`}>
                    {category.color.charAt(0).toUpperCase() + category.color.slice(1)}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {category.productCount}
                    </span>
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge 
                    variant={category.isActive ? "default" : "secondary"}
                    className={
                      category.isActive 
                        ? "bg-green-100 text-green-800 border-green-200" 
                        : "bg-gray-100 text-gray-800 border-gray-200"
                    }
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                
                <TableCell className="text-gray-500 text-sm">
                  {new Date(category.dateCreated).toLocaleDateString()}
                </TableCell>
                
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(category)}
                      className="h-8 w-8 p-0 hover:bg-green-100 hover:border-green-300 bg-green-50 border-green-200"
                    >
                      <Edit className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(category.id)}
                      className="h-8 w-8 p-0 hover:bg-green-100 hover:border-green-300 bg-green-50 border-green-200"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>

              {/* Products Rows (when expanded) */}
              {expandedCategories.has(category.id) && (
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
                  {getMockProducts(category.name).map((product, index) => (
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
                              : "bg-yellow-100 text-yellow-800 border-yellow-200"
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
              )}
            </React.Fragment>
          ))}
          
          {categories.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <Package className="h-8 w-8 text-gray-300" />
                  <span>No categories found</span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
