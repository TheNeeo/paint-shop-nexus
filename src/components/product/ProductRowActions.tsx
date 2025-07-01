
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Eye,
  Edit,
  MoreHorizontal,
  Copy,
  Archive,
  Trash2,
} from "lucide-react";
import { ProductPreview } from "@/components/product/ProductPreview";

interface ProductRowActionsProps {
  product: any;
  selectedProduct: any;
  onSetSelectedProduct: (product: any) => void;
}

export function ProductRowActions({ product, selectedProduct, onSetSelectedProduct }: ProductRowActionsProps) {
  return (
    <div className="flex gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-60 hover:opacity-100 hover:bg-green-100"
                onClick={() => onSetSelectedProduct(product)}
              >
                <Eye className="h-4 w-4 text-green-600" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <ProductPreview product={selectedProduct} />
            </DialogContent>
          </Dialog>
        </TooltipTrigger>
        <TooltipContent>View details</TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="opacity-60 hover:opacity-100 hover:bg-green-100"
          >
            <Edit className="h-4 w-4 text-green-600" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Edit product</TooltipContent>
      </Tooltip>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="opacity-60 hover:opacity-100 hover:bg-green-100"
          >
            <MoreHorizontal className="h-4 w-4 text-gray-600" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white" align="end">
          <DropdownMenuItem>
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
