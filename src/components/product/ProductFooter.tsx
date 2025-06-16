
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  DollarSign,
  AlertTriangle,
  Clock,
} from "lucide-react";

interface ProductFooterProps {
  totalProducts: number;
  totalValue: number;
  lowStockCount: number;
}

export function ProductFooter({
  totalProducts,
  totalValue,
  lowStockCount,
}: ProductFooterProps) {
  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 shadow-sm">
      <div className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">
                Total Products:
              </span>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                {totalProducts}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Total Stock Value:
              </span>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                ${totalValue.toFixed(2)}
              </Badge>
            </div>

            {lowStockCount > 0 && (
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-700">
                  Low Stock Items:
                </span>
                <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                  {lowStockCount}
                </Badge>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
