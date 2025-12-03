import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { ChevronRight, Edit, Eye } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProductVariantRowsProps {
  variants: any[];
  getStockStatus: (quantity: number) => { status: string; color: string };
}

export function ProductVariantRows({ variants, getStockStatus }: ProductVariantRowsProps) {
  if (!variants || variants.length === 0) return null;
  
  return (
    <>
      {variants.map((variant, index) => (
        <TableRow key={variant.id} className="bg-gradient-to-r from-green-50/50 to-green-50/20 border-l-4 border-green-400 hover:from-green-100/50 hover:to-green-50/30">
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell>
            <div className="w-6 h-6 bg-green-200 rounded-md flex items-center justify-center border border-green-300">
              <span className="text-[10px] font-medium text-green-800">{index + 1}</span>
            </div>
          </TableCell>
          <TableCell className="pl-8">
            <div className="flex items-center gap-2">
              <ChevronRight className="h-3 w-3 text-green-500" />
              <div className="flex items-center gap-3">
                {variant.image && (
                  <img
                    src={variant.image}
                    alt={variant.name}
                    className="w-8 h-8 rounded-lg border border-green-200 object-cover"
                  />
                )}
                <div className="space-y-0.5">
                  <span className="text-sm font-medium text-gray-700">{variant.name}</span>
                  <div className="text-xs text-gray-500">SKU: {variant.sku || variant.hsnCode || '-'}</div>
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <span className="text-sm text-gray-500">-</span>
          </TableCell>
          <TableCell>
            <span className="text-sm text-gray-500">{variant.vendorName || "-"}</span>
          </TableCell>
          <TableCell>
            <span className="text-sm font-medium text-green-700">₹{(variant.unitPrice || 0).toFixed(2)}</span>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <span className="text-sm">{variant.stockQuantity || variant.currentStock || 0}</span>
              <Badge className={`text-xs ${getStockStatus(variant.stockQuantity || variant.currentStock || 0).color}`}>
                {getStockStatus(variant.stockQuantity || variant.currentStock || 0).status}
              </Badge>
            </div>
          </TableCell>
          <TableCell>
            <span className="text-xs text-gray-500">-</span>
          </TableCell>
          <TableCell>
            <div className="text-xs text-gray-500">
              {variant.expiryDate ? (
                <div>
                  <div>Exp: {variant.expiryDate}</div>
                  {variant.remainingWarranty && (
                    <div>{variant.remainingWarranty}</div>
                  )}
                </div>
              ) : (
                "-"
              )}
            </div>
          </TableCell>
          <TableCell>
            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="opacity-60 hover:opacity-100 hover:bg-green-100 h-7 w-7 p-0"
                  >
                    <Eye className="h-3 w-3 text-green-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <span className="text-xs">View variant</span>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="opacity-60 hover:opacity-100 hover:bg-blue-100 h-7 w-7 p-0"
                  >
                    <Edit className="h-3 w-3 text-blue-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <span className="text-xs">Edit variant</span>
                </TooltipContent>
              </Tooltip>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
