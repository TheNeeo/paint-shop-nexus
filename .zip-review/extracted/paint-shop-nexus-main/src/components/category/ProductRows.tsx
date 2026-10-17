
import React, { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  status: string;
}

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const colors = getColorClasses(categoryColor);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('id, name, hsn_code, sale_price, current_stock, status')
        .eq('category_id', categoryId);

      if (!error && data) {
        setProducts(data.map((p) => ({
          id: p.id,
          name: p.name,
          sku: p.hsn_code || '-',
          price: Number(p.sale_price) || 0,
          stock: p.current_stock ?? 0,
          status: p.status || 'Active',
        })));
      } else {
        setProducts([]);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [categoryId]);

  const handleMoveProduct = async (productId: string, productName: string, targetCategory: Category) => {
    const { error } = await supabase
      .from('products')
      .update({ category_id: targetCategory.id })
      .eq('id', productId);

    if (error) {
      toast.error(`Failed to move "${productName}"`);
      return;
    }

    setProducts(prev => prev.filter(p => p.id !== productId));
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

      {!loading && products.length === 0 && (
        <TableRow className={`bg-gradient-to-r ${colors.light} border-l-4 ${colors.border}`}>
          <TableCell colSpan={8} className="text-center py-6 text-gray-500">
            No products in this category.
          </TableCell>
        </TableRow>
      )}

      {/* Product Rows */}
      {products.map((product) => (
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
