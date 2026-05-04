
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { X, TrendingUp, TrendingDown, AlertTriangle, Package, FileText, Hash, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FormFieldLabel } from "@/components/shared/FormFieldLabel";

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    current_stock: number;
    hsn_code?: string;
  } | null;
}

const REASON_CODES = [
  { value: "damaged", label: "Damaged/Broken", icon: "🔨" },
  { value: "expired", label: "Expired", icon: "⏰" },
  { value: "theft", label: "Theft/Loss", icon: "🔒" },
  { value: "count_correction", label: "Count Correction", icon: "📊" },
  { value: "return_to_vendor", label: "Return to Vendor", icon: "↩️" },
  { value: "customer_return", label: "Customer Return", icon: "📦" },
  { value: "internal_use", label: "Internal Use", icon: "🏢" },
  { value: "sample", label: "Sample/Demo", icon: "🎁" },
  { value: "other", label: "Other", icon: "📝" },
];

export function StockAdjustmentModal({ isOpen, onClose, product }: StockAdjustmentModalProps) {
  const [adjustmentType, setAdjustmentType] = useState<"increase" | "decrease">("decrease");
  const [quantity, setQuantity] = useState<number>(0);
  const [reasonCode, setReasonCode] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const newStock = adjustmentType === "increase" 
    ? (product?.current_stock || 0) + quantity 
    : (product?.current_stock || 0) - quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product) return;
    
    if (quantity <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid quantity greater than 0",
        variant: "destructive"
      });
      return;
    }

    if (!reasonCode) {
      toast({
        title: "Validation Error",
        description: "Please select a reason for adjustment",
        variant: "destructive"
      });
      return;
    }

    if (adjustmentType === "decrease" && quantity > product.current_stock) {
      toast({
        title: "Validation Error",
        description: "Cannot decrease stock below 0",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to make stock adjustments",
          variant: "destructive"
        });
        return;
      }

      const quantityChange = adjustmentType === "increase" ? quantity : -quantity;
      const calculatedNewStock = product.current_stock + quantityChange;

      // Insert stock adjustment record
      const { error: adjustmentError } = await supabase
        .from("stock_adjustments")
        .insert([{
          product_id: product.id,
          adjustment_type: adjustmentType,
          quantity: quantityChange,
          reason: `${reasonCode}: ${notes.trim() || 'N/A'}`,
          created_by_user_id: user.id
        }]);

      if (adjustmentError) throw adjustmentError;

      // Update product stock
      const { error: updateError } = await supabase
        .from("products")
        .update({ current_stock: calculatedNewStock })
        .eq("id", product.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: `Stock ${adjustmentType === "increase" ? "increased" : "decreased"} by ${quantity} units`
      });

      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-summary"] });
      queryClient.invalidateQueries({ queryKey: ["stock-adjustments"] });
      
      handleClose();
    } catch (error) {
      console.error("Error adjusting stock:", error);
      toast({
        title: "Error",
        description: "Failed to adjust stock",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setAdjustmentType("decrease");
    setQuantity(0);
    setReasonCode("");
    setNotes("");
    onClose();
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg bg-white border-2 rounded-2xl" style={{ borderColor: '#EADE71' }}>
        <DialogHeader className="pb-4 border-b" style={{ borderColor: '#EADE71' }}>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(to right, #a16207, #ca8a04)' }}>
                <Package className="w-5 h-5 text-white" />
              </div>
              <span style={{ color: '#78350f' }}>Stock Adjustment</span>
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600 mt-2">
            Quickly adjust inventory levels with reason tracking
          </DialogDescription>
        </DialogHeader>

        {/* Product Info Card */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border" style={{ borderColor: '#EADE71' }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-white border flex items-center justify-center" style={{ borderColor: '#EADE71' }}>
              <Package className="w-6 h-6" style={{ color: '#a16207' }} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              {product.hsn_code && (
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Hash className="w-3 h-3" /> {product.hsn_code}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Current Stock</p>
              <Badge className="text-lg font-bold px-3 py-1" style={{ background: '#EADE71', color: '#78350f' }}>
                {product.current_stock}
              </Badge>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* Adjustment Type Toggle */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Adjustment Type *</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={adjustmentType === "increase" ? "default" : "outline"}
                onClick={() => setAdjustmentType("increase")}
                className={`h-14 flex items-center gap-2 ${
                  adjustmentType === "increase" 
                    ? "bg-green-500 hover:bg-green-600 text-white" 
                    : "border-green-300 text-green-700 hover:bg-green-50"
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                <span>Increase Stock</span>
              </Button>
              <Button
                type="button"
                variant={adjustmentType === "decrease" ? "default" : "outline"}
                onClick={() => setAdjustmentType("decrease")}
                className={`h-14 flex items-center gap-2 ${
                  adjustmentType === "decrease" 
                    ? "bg-red-500 hover:bg-red-600 text-white" 
                    : "border-red-300 text-red-700 hover:bg-red-50"
                }`}
              >
                <TrendingDown className="w-5 h-5" />
                <span>Decrease Stock</span>
              </Button>
            </div>
          </div>

          {/* Quantity Input */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quantity *</Label>
            <Input
              type="number"
              min="1"
              value={quantity || ""}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              placeholder="Enter quantity to adjust"
              className="h-12 text-lg font-semibold"
              style={{ borderColor: '#EADE71' }}
            />
            {adjustmentType === "decrease" && quantity > product.current_stock && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Cannot exceed current stock ({product.current_stock})
              </p>
            )}
          </div>

          {/* New Stock Preview */}
          <div className="p-3 rounded-lg bg-gray-50 border flex items-center justify-between">
            <span className="text-sm text-gray-600">New Stock After Adjustment:</span>
            <Badge 
              className={`text-lg font-bold px-3 py-1 ${
                newStock < 0 ? "bg-red-100 text-red-800" :
                newStock <= 10 ? "bg-yellow-100 text-yellow-800" :
                "bg-green-100 text-green-800"
              }`}
            >
              {Math.max(0, newStock)}
            </Badge>
          </div>

          {/* Reason Code Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" style={{ color: '#a16207' }} />
              Reason for Adjustment *
            </Label>
            <Select value={reasonCode} onValueChange={setReasonCode}>
              <SelectTrigger className="h-12" style={{ borderColor: '#EADE71' }}>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {REASON_CODES.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value}>
                    <span className="flex items-center gap-2">
                      <span>{reason.icon}</span>
                      <span>{reason.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Additional Notes (Optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional details about this adjustment..."
              rows={3}
              maxLength={500}
              style={{ borderColor: '#EADE71' }}
            />
            <p className="text-xs text-gray-400 text-right">{notes.length}/500</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t" style={{ borderColor: '#EADE71' }}>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 h-12"
              style={{ borderColor: '#EADE71', color: '#a16207' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || quantity <= 0 || !reasonCode || (adjustmentType === "decrease" && quantity > product.current_stock)}
              className="flex-1 h-12 text-white shadow-lg"
              style={{ background: 'linear-gradient(to right, #a16207, #ca8a04)' }}
            >
              {isLoading ? "Adjusting..." : "Confirm Adjustment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
