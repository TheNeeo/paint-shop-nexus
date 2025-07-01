
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { ChevronRight, Edit } from "lucide-react";

interface ProductVariantRowsProps {
  variants: any[];
  getStockStatus: (quantity: number) => { status: string; color: string };
}

export function ProductVariantRows({ variants, getStockStatus }: ProductVariantRowsProps) {
  return (
    <>
      {variants?.map((variant, index) => (
        <TableRow key={variant.id} className="bg-gradient-to-r from-green-50/30 to-green-50/10 border-l-4 border-green-300 hover:from-green-50/50 hover:to-green-50/20">
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell>
            <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center border border-green-200">
              <span className="text-xs font-medium text-green-700">{index + 1}</span>
            </div>
          </TableCell>
          <TableCell className="pl-8">
            <div className="flex items-center gap-2">
              <ChevronRight className="h-3 w-3 text-green-400" />
              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-700">{variant.name}</span>
                <div className="text-xs text-gray-500">SKU: {variant.sku}</div>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <span className="text-sm text-gray-600">-</span>
          </TableCell>
          <TableCell>
            <span className="text-sm font-medium text-green-700">${variant.unitPrice.toFixed(2)}</span>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <span className="text-sm">{variant.stockQuantity}</span>
              <Badge className={`text-xs ${getStockStatus(variant.stockQuantity).color}`}>
                {getStockStatus(variant.stockQuantity).status}
              </Badge>
            </div>
          </TableCell>
          <TableCell>
            <span className="text-xs text-gray-500">Variant data</span>
          </TableCell>
          <TableCell>
            <Button 
              variant="ghost" 
              size="sm" 
              className="opacity-60 hover:opacity-100 hover:bg-green-100"
            >
              <Edit className="h-3 w-3 text-green-600" />
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
