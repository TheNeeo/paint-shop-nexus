
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface ProductFooterProps {
  totalProducts: number;
  totalValue: number;
  lowStockCount: number;
}

export function ProductFooter({ totalProducts, totalValue, lowStockCount }: ProductFooterProps) {
  return (
    <Card className="bg-gradient-to-r from-gray-50 to-white border border-gray-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-center text-sm">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-600" />
              <span>Total Products: <strong className="text-blue-900">{totalProducts}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span>Total Stock Value: <strong className="text-green-900">${totalValue.toFixed(2)}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span>Low Stock Items: <strong className="text-yellow-900">{lowStockCount}</strong></span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <CheckCircle className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
