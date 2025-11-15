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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Eye,
  Edit,
  Star,
  Package,
  Copy,
  Trash2,
} from "lucide-react";
import { ProductPreview } from "@/components/product/ProductPreview";
import { useToast } from "@/hooks/use-toast";

interface ProductRowActionsProps {
  product: any;
  selectedProduct: any;
  onSetSelectedProduct: (product: any) => void;
  isVariant?: boolean;
}

export function ProductRowActions({ product, selectedProduct, onSetSelectedProduct, isVariant = false }: ProductRowActionsProps) {
  const { toast } = useToast();
  const [isFeatured, setIsFeatured] = React.useState(product.featured || false);

  const handleFeatureToggle = () => {
    setIsFeatured(!isFeatured);
    toast({
      title: "Success",
      description: isFeatured ? "Product removed from featured" : "Product marked as featured"
    });
  };

  const handleDeleteProduct = async () => {
    try {
      toast({
        title: "Success",
        description: "Product deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      });
    }
  };

  const handleDuplicate = () => {
    toast({
      title: "Success",
      description: "Product duplicated successfully"
    });
  };

  return (
    <div className="flex gap-1 items-center">
      <Dialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-70 hover:opacity-100 hover:bg-green-100 transition-all duration-200 group h-9 w-9 p-0"
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
              className="opacity-70 hover:opacity-100 hover:bg-blue-100 transition-all duration-200 group h-9 w-9 p-0"
            >
              <Edit className="h-4 w-4 text-blue-600 group-hover:rotate-12 transition-transform duration-200" />
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <span className="text-xs font-medium">Edit product</span>
        </TooltipContent>
      </Tooltip>

      {!isVariant && (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-70 hover:opacity-100 hover:bg-yellow-100 transition-all duration-200 group h-9 w-9 p-0"
                  onClick={handleFeatureToggle}
                >
                  <Star className={`h-4 w-4 transition-all duration-200 ${isFeatured ? 'text-yellow-500 fill-current' : 'text-yellow-600'} group-hover:scale-110`} />
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <span className="text-xs font-medium">{isFeatured ? 'Unfeature' : 'Mark as featured'}</span>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-70 hover:opacity-100 hover:bg-purple-100 transition-all duration-200 group h-9 w-9 p-0"
                >
                  <Package className="h-4 w-4 text-purple-600 group-hover:scale-110 transition-transform duration-200" />
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <span className="text-xs font-medium">Add variant</span>
            </TooltipContent>
          </Tooltip>
        </>
      )}

      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-70 hover:opacity-100 hover:bg-gray-100 transition-all duration-200 h-9 w-9 p-0"
                >
                  <svg className="h-4 w-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="5" cy="12" r="2"/>
                    <circle cx="12" cy="12" r="2"/>
                    <circle cx="19" cy="12" r="2"/>
                  </svg>
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <span className="text-xs font-medium">More actions</span>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent className="bg-white border-2 border-gray-200 shadow-xl" align="end">
          {!isVariant && (
            <>
              <DropdownMenuItem className="hover:bg-blue-50 cursor-pointer transition-colors duration-150" onClick={handleDuplicate}>
                <Copy className="h-4 w-4 mr-2 text-blue-600" />
                <span className="text-sm font-medium">Duplicate</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="text-red-600 hover:bg-red-50 cursor-pointer transition-colors duration-150" onSelect={(e) => e.preventDefault()}>
                <Trash2 className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Delete</span>
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {isVariant ? 'Variant' : 'Product'}?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{product.name}"? {!isVariant && 'This will also delete all associated variants.'} This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex gap-3 justify-end">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteProduct} className="bg-red-600 hover:bg-red-700">
                  Delete
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
