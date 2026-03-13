import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, Edit, Star, Plus, MoreHorizontal } from "lucide-react";
import { ProductPreview } from "@/components/product/ProductPreview";
import { EditProductModal } from "@/components/inventory/EditProductModal";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ProductRowActionsProps {
  product: any;
  selectedProduct: any;
  onSetSelectedProduct: (product: any) => void;
}

export function ProductRowActions({ product, selectedProduct, onSetSelectedProduct }: ProductRowActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) return;
    try {
      // Delete variants first
      await supabase.from("products").delete().eq("parent_product_id", product.id);
      const { error } = await supabase.from("products").delete().eq("id", product.id);
      if (error) throw error;
      toast.success(`${product.name} deleted!`);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  // Build DB product shape for EditProductModal
  const dbProduct = {
    id: product.id,
    name: product.name,
    category_id: product.categoryId || "",
    hsn_code: product.baseCode || "",
    unit: product.unit || "PC",
    purchase_qty: 0,
    sale_qty: product.totalSales || 0,
    current_stock: product.stockQuantity || 0,
    threshold_qty: 0,
    unit_price: product.unitPrice || 0,
    image_url: product.image || "",
  };

  return (
    <div className="flex gap-1 items-center">
      {/* View */}
      <Dialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="sm" className="opacity-70 hover:opacity-100 hover:bg-green-100 group" onClick={() => onSetSelectedProduct(product)}>
                  <Eye className="h-4 w-4 text-green-600" />
                </Button>
              </motion.div>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent><span className="text-xs font-medium">View details</span></TooltipContent>
        </Tooltip>
        <DialogContent className="max-w-3xl"><ProductPreview product={selectedProduct} /></DialogContent>
      </Dialog>

      {/* Edit */}
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" size="sm" className="opacity-70 hover:opacity-100 hover:bg-blue-100 group" onClick={() => setIsEditOpen(true)}>
              <Edit className="h-4 w-4 text-blue-600" />
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent><span className="text-xs font-medium">Edit product</span></TooltipContent>
      </Tooltip>

      {/* More Options */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" size="sm" className="opacity-70 hover:opacity-100 hover:bg-gray-100"><MoreHorizontal className="h-4 w-4 text-gray-600" /></Button>
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white border-2 border-gray-200 shadow-xl" align="end">
          <DropdownMenuItem className="text-red-600 hover:bg-red-50 cursor-pointer" onClick={handleDelete}>
            <span className="font-medium">Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Modal */}
      <EditProductModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} product={dbProduct} />
    </div>
  );
}
