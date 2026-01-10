import React from "react";
import { Badge } from "@/components/ui/badge";
import { TableCell } from "@/components/ui/table";
import { Star, AlertTriangle, BarChart3 } from "lucide-react";

interface ProductRowContentProps {
  product: any;
  getCategoryColor: (category: string) => string;
  getStockStatus: (quantity: number) => { status: string; color: string };
  onToggleRowExpansion: (id: string) => void;
}

export function ProductRowContent({ 
  product, 
  getCategoryColor, 
  getStockStatus, 
  onToggleRowExpansion 
}: ProductRowContentProps) {
  return (
    <>
      <TableCell className="bg-white">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-12 h-12 object-cover rounded-lg border-2 border-green-200 shadow-sm"
          />
          {product.featured && (
            <Star className="absolute -top-1 -right-1 h-4 w-4 text-green-500 fill-current" />
          )}
        </div>
      </TableCell>
      
      <TableCell className="bg-white">
        <div className="space-y-1">
          <div className="font-medium text-gray-900 cursor-pointer hover:text-green-600 transition-colors"
               onClick={() => onToggleRowExpansion(product.id)}>
            {product.name}
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`text-xs ${getCategoryColor(product.category)}`}>
              {product.category}
            </Badge>
            <span className="text-xs text-gray-500">#{product.baseCode}</span>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating) 
                    ? "text-green-400 fill-current" 
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
          </div>
        </div>
      </TableCell>
      
      <TableCell className="bg-white">
        <span className="text-sm font-medium">{product.unit}</span>
      </TableCell>
      
      <TableCell className="bg-white">
        <div className="space-y-1">
          <div className="font-medium text-lg text-green-700">${(Number(product.unitPrice) || 0).toFixed(2)}</div>
          <div className="text-xs text-gray-500">
            Total: ${((Number(product.unitPrice) || 0) * (Number(product.stockQuantity) || 0)).toFixed(2)}
          </div>
        </div>
      </TableCell>
      
      <TableCell className="bg-white">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">{product.stockQuantity}</span>
            <Badge className={getStockStatus(product.stockQuantity).color}>
              {getStockStatus(product.stockQuantity).status}
            </Badge>
          </div>
          {product.stockQuantity <= 10 && product.stockQuantity > 0 && (
            <div className="text-xs text-coral-600 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Reorder soon
            </div>
          )}
        </div>
      </TableCell>
      
      <TableCell className="bg-white">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm">
            <BarChart3 className="h-3 w-3 text-green-600" />
            <span className="font-medium">{product.totalSales}</span>
            <span className="text-gray-500">sold</span>
          </div>
          <div className="text-xs text-gray-500">
            Last: {new Date(product.lastSold).toLocaleDateString()}
          </div>
        </div>
      </TableCell>
    </>
  );
}
