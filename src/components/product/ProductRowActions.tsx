
import React from "react";
import { motion } from "framer-motion";
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
      <Dialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="opacity-70 hover:opacity-100 hover:bg-green-100 transition-all duration-200 group"
                  onClick={() => onSetSelectedProduct(product)}
                >
                  <Eye className="h-4 w-4 text-green-600 group-hover:scale-110 transition-transform duration-200" />
                </Button>
              </motion.div>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <span className="text-xs font-medium">View details</span>
          </TooltipContent>
        </Tooltip>
        <DialogContent className="max-w-3xl">
          <ProductPreview product={selectedProduct} />
        </DialogContent>
      </Dialog>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="opacity-70 hover:opacity-100 hover:bg-blue-100 transition-all duration-200 group"
            >
              <Edit className="h-4 w-4 text-blue-600 group-hover:rotate-12 transition-transform duration-200" />
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <span className="text-xs font-medium">Edit product</span>
        </TooltipContent>
      </Tooltip>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="opacity-70 hover:opacity-100 hover:bg-gray-100 transition-all duration-200"
            >
              <MoreHorizontal className="h-4 w-4 text-gray-600" />
            </Button>
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white border-2 border-gray-200 shadow-xl" align="end">
          <DropdownMenuItem className="hover:bg-blue-50 cursor-pointer transition-colors duration-150">
            <Copy className="h-4 w-4 mr-2 text-blue-600" />
            <span className="font-medium">Duplicate</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-orange-50 cursor-pointer transition-colors duration-150">
            <Archive className="h-4 w-4 mr-2 text-orange-600" />
            <span className="font-medium">Archive</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600 hover:bg-red-50 cursor-pointer transition-colors duration-150">
            <Trash2 className="h-4 w-4 mr-2" />
            <span className="font-medium">Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
