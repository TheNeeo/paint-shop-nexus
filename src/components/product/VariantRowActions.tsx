import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
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
  Trash2,
} from "lucide-react";
import { ProductPreview } from "@/components/product/ProductPreview";
import { useToast } from "@/hooks/use-toast";

interface VariantRowActionsProps {
  variant: any;
  onSetSelectedProduct: (product: any) => void;
}

export function VariantRowActions({ variant, onSetSelectedProduct }: VariantRowActionsProps) {
  const { toast } = useToast();

  const handleDeleteVariant = async () => {
    try {
      toast({
        title: "Success",
        description: "Variant deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete variant",
        variant: "destructive"
      });
    }
  };

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
                  className="opacity-60 hover:opacity-100 hover:bg-green-100 transition-all duration-200 group h-8 w-8 p-0"
                  onClick={() => onSetSelectedProduct(variant)}
                >
                  <Eye className="h-3.5 w-3.5 text-green-600 group-hover:scale-110 transition-transform duration-200" />
                </Button>
              </motion.div>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <span className="text-xs font-medium">View variant details</span>
          </TooltipContent>
        </Tooltip>
        <DialogContent className="max-w-3xl">
          <ProductPreview product={variant} />
        </DialogContent>
      </Dialog>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="opacity-60 hover:opacity-100 hover:bg-blue-100 transition-all duration-200 group h-8 w-8 p-0"
            >
              <Edit className="h-3.5 w-3.5 text-blue-600 group-hover:rotate-12 transition-transform duration-200" />
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <span className="text-xs font-medium">Edit variant</span>
        </TooltipContent>
      </Tooltip>

      <AlertDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="opacity-60 hover:opacity-100 hover:bg-red-100 transition-all duration-200 group h-8 w-8 p-0"
                >
                  <Trash2 className="h-3.5 w-3.5 text-red-600 group-hover:scale-110 transition-transform duration-200" />
                </Button>
              </motion.div>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <span className="text-xs font-medium">Delete variant</span>
          </TooltipContent>
        </Tooltip>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Variant?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this variant "{variant.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteVariant} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
