
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  Star,
} from "lucide-react";

interface ProductStatsProps {
  totalProducts: number;
  totalValue: number;
  lowStockCount: number;
  featuredCount: number;
}

export function ProductStats({ totalProducts, totalValue, lowStockCount, featuredCount }: ProductStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Products</p>
              <p className="text-2xl font-bold text-blue-900">{totalProducts}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Total Value</p>
              <p className="text-2xl font-bold text-green-900">${totalValue.toFixed(2)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-900">{lowStockCount}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Featured</p>
              <p className="text-2xl font-bold text-purple-900">{featuredCount}</p>
            </div>
            <Star className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
