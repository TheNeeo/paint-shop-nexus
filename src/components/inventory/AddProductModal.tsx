
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UNITS = ["Ltr", "ML", "Kg", "PC", "Bag", "Nos"];

export function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
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
    image_url: "",
    is_variant: false,
    parent_product_id: ""
  });
  
  const [variants, setVariants] = useState([{ name: "", image_url: "", current_stock: 0, threshold_qty: 0 }]);
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

  const { data: parentProducts } = useQuery({
    queryKey: ["parent-products"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .is("parent_product_id", null)
        .order("name");
      return data || [];
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formData.is_variant && !formData.parent_product_id) {
        toast({
          title: "Error",
          description: "Please select a parent product for variant",
          variant: "destructive"
        });
        return;
      }

      // Insert main product
      const { data: product, error } = await supabase
        .from("products")
        .insert([formData])
        .select()
        .single();

      if (error) throw error;

      // Insert variants if it's a main product
      if (!formData.is_variant && variants.some(v => v.name.trim())) {
        const variantData = variants
          .filter(v => v.name.trim())
          .map(variant => ({
            ...variant,
            parent_product_id: product.id,
            category_id: formData.category_id,
            unit: formData.unit,
            unit_price: formData.unit_price,
            is_variant: true
          }));

        if (variantData.length > 0) {
          const { error: variantError } = await supabase
            .from("products")
            .insert(variantData);

          if (variantError) throw variantError;
        }
      }

      toast({
        title: "Success",
        description: "Product added successfully"
      });

      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-summary"] });
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category_id: "",
      hsn_code: "",
      unit: "PC",
      purchase_qty: 0,
      sale_qty: 0,
      current_stock: 0,
      threshold_qty: 0,
      unit_price: 0,
      image_url: "",
      is_variant: false,
      parent_product_id: ""
    });
    setVariants([{ name: "", image_url: "", current_stock: 0, threshold_qty: 0 }]);
  };

  const addVariant = () => {
    setVariants([...variants, { name: "", image_url: "", current_stock: 0, threshold_qty: 0 }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-2 border-cyan-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-cyan-800">
            Add New Product
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

          {!formData.is_variant && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-cyan-700 text-lg">Product Variants</Label>
                <Button
                  type="button"
                  onClick={addVariant}
                  variant="outline"
                  className="border-cyan-200 text-cyan-700 hover:bg-cyan-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Variant
                </Button>
              </div>

              {variants.map((variant, index) => (
                <div key={index} className="p-4 border border-cyan-200 rounded-lg bg-cyan-50">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-cyan-700 font-medium">Variant {index + 1}</Label>
                    {variants.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeVariant(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-cyan-600">Variant Name</Label>
                      <Input
                        value={variant.name}
                        onChange={(e) => updateVariant(index, "name", e.target.value)}
                        placeholder="Enter variant name"
                        className="border-cyan-300 focus:border-cyan-500 bg-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-cyan-600">Image URL</Label>
                      <Input
                        value={variant.image_url}
                        onChange={(e) => updateVariant(index, "image_url", e.target.value)}
                        placeholder="Enter variant image URL"
                        className="border-cyan-300 focus:border-cyan-500 bg-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-cyan-600">Current Stock</Label>
                      <Input
                        type="number"
                        value={variant.current_stock}
                        onChange={(e) => updateVariant(index, "current_stock", parseInt(e.target.value) || 0)}
                        placeholder="Enter current stock"
                        className="border-cyan-300 focus:border-cyan-500 bg-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-cyan-600">Threshold Qty</Label>
                      <Input
                        type="number"
                        value={variant.threshold_qty}
                        onChange={(e) => updateVariant(index, "threshold_qty", parseInt(e.target.value) || 0)}
                        placeholder="Enter threshold quantity"
                        className="border-cyan-300 focus:border-cyan-500 bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

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
              {isLoading ? "Adding..." : "Add Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
