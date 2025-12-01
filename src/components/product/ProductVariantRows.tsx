import React from "react";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { ChevronRight } from "lucide-react";
import { VariantRowActions } from "./VariantRowActions";

interface ProductVariantRowsProps {
  variants: any[];
  getStockStatus: (quantity: number) => { status: string; color: string };
  onSetSelectedProduct?: (product: any) => void;
}

export function ProductVariantRows({ variants, getStockStatus, onSetSelectedProduct = () => {} }: ProductVariantRowsProps) {
  if (!variants || variants.length === 0) return null;

  return (
    <>
      {variants.map((variant, index) => (
        <TableRow
          key={variant.id}
          className="bg-gray-50/60 hover:bg-gray-100/60 border-l-4 border-gray-300 transition-colors duration-150"
        >
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell>
            <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center border border-gray-300">
              <span className="text-xs font-medium text-gray-600">V{index + 1}</span>
            </div>
          </TableCell>
          <TableCell className="pl-12">
            <div className="flex items-center gap-2">
              <ChevronRight className="h-3 w-3 text-gray-400" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-gray-200 text-gray-700 border-gray-300 text-xs font-medium px-2 py-0">
                    VARIANT
                  </Badge>
                  <span className="text-sm font-medium text-gray-700">{variant.name}</span>
                </div>
                {variant.baseCode && (
                  <div className="text-xs text-gray-500">Code: {variant.baseCode}</div>
                )}
              </div>
            </div>
          </TableCell>
          <TableCell>
            <span className="text-xs text-gray-500">-</span>
          </TableCell>
          <TableCell>
            <span className="text-sm font-medium text-green-700">₹{Number(variant.unitPrice || variant.sale_price || 0).toFixed(2)}</span>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <span className="text-sm">{variant.stockQuantity || variant.current_stock || 0}</span>
              <Badge className={`text-xs ${getStockStatus(variant.stockQuantity || variant.current_stock || 0).color}`}>
                {getStockStatus(variant.stockQuantity || variant.current_stock || 0).status}
              </Badge>
            </div>
          </TableCell>
          <TableCell>
            <div className="text-xs text-gray-500">
              {variant.totalSales || 0} sold
            </div>
          </TableCell>
          <TableCell>
            {variant.remainingWarranty ? (
              <Badge className={`text-xs font-medium ${
                variant.remainingWarranty === "Expired"
                  ? "bg-red-100 text-red-800 border border-red-200"
                  : "bg-green-100 text-green-800 border border-green-200"
              }`}>
                {variant.remainingWarranty}
              </Badge>
            ) : (
              <span className="text-xs text-gray-500">-</span>
            )}
          </TableCell>
          <TableCell>
            <VariantRowActions
              variant={variant}
              onSetSelectedProduct={onSetSelectedProduct}
            />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
