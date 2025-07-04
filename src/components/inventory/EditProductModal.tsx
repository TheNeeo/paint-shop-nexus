
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}

const UNITS = ["Ltr", "ML", "Kg", "PC", "Bag", "Nos"];

export function EditProductModal({ isOpen, onClose, product }: EditProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    hsn_code: "",
    unit: "PC",
    purchase_qty: 0,
    sale_qty: 0,
    current_stock: 0,
    threshold_qty: 0,
    unit_price: 0,
    image_url: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").order("name");
      return data || [];
    }
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        category_id: product.category_id || "",
        hsn_code: product.hsn_code || "",
        unit: product.unit || "PC",
        purchase_qty: product.purchase_qty || 0,
        sale_qty: product.sale_qty || 0,
        current_stock: product.current_stock || 0,
        threshold_qty: product.threshold_qty || 0,
        unit_price: product.unit_price || 0,
        image_url: product.image_url || ""
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("products")
        .update(formData)
        .eq("id", product.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product updated successfully"
      });

      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-summary"] });
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-2 border-cyan-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-cyan-800">
            Edit Product: {product.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-cyan-700">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                placeholder="Enter product name"
                className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-200 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-cyan-700">Category *</Label>
              <Select 
                value={formData.category_id} 
                onValueChange={(value) => setFormData({...formData, category_id: value})}
              >
                <SelectTrigger className="border-cyan-200 focus:border-cyan-500 bg-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hsn_code" className="text-cyan-700">HSN Code</Label>
              <Input
                id="hsn_code"
                value={formData.hsn_code}
                onChange={(e) => setFormData({...formData, hsn_code: e.target.value})}
                placeholder="Enter HSN code"
                className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-200 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit" className="text-cyan-700">Unit *</Label>
              <Select 
                value={formData.unit} 
                onValueChange={(value) => setFormData({...formData, unit: value})}
              >
                <SelectTrigger className="border-cyan-200 focus:border-cyan-500 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {UNITS.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchase_qty" className="text-cyan-700">Purchase Qty</Label>
              <Input
                id="purchase_qty"
                type="number"
                value={formData.purchase_qty}
                onChange={(e) => setFormData({...formData, purchase_qty: parseInt(e.target.value) || 0})}
                placeholder="Enter purchase quantity"
                className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-200 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sale_qty" className="text-cyan-700">Sale Qty</Label>
              <Input
                id="sale_qty"
                type="number"
                value={formData.sale_qty}
                onChange={(e) => setFormData({...formData, sale_qty: parseInt(e.target.value) || 0})}
                placeholder="Enter sale quantity"
                className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-200 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current_stock" className="text-cyan-700">Current Stock</Label>
              <Input
                id="current_stock"
                type="number"
                value={formData.current_stock}
                onChange={(e) => setFormData({...formData, current_stock: parseInt(e.target.value) || 0})}
                placeholder="Enter current stock"
                className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-200 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="threshold_qty" className="text-cyan-700">Threshold Qty</Label>
              <Input
                id="threshold_qty"
                type="number"
                value={formData.threshold_qty}
                onChange={(e) => setFormData({...formData, threshold_qty: parseInt(e.target.value) || 0})}
                placeholder="Enter threshold quantity"
                className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-200 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit_price" className="text-cyan-700">Unit Price</Label>
              <Input
                id="unit_price"
                type="number"
                step="0.01"
                value={formData.unit_price}
                onChange={(e) => setFormData({...formData, unit_price: parseFloat(e.target.value) || 0})}
                placeholder="Enter unit price"
                className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-200 bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url" className="text-cyan-700">Image URL</Label>
            <div className="flex gap-2">
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                placeholder="Enter image URL"
                className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-200 bg-white"
              />
              <Button type="button" variant="outline" className="border-cyan-200 text-cyan-700 hover:bg-cyan-50">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-cyan-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-cyan-200 text-cyan-700 hover:bg-cyan-50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {isLoading ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
