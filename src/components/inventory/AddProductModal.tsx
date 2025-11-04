
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Plus, X, Package, DollarSign, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CategoryForm } from "@/components/category/CategoryForm";
import { AddEditVendorModal } from "@/components/vendor/AddEditVendorModal";
import bucketIcon from "@/assets/bucket-icon.png";

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
    parent_product_id: "",
    preferred_vendor_id: ""
  });
  
  const [variants, setVariants] = useState([{ name: "", image_url: "", current_stock: 0, threshold_qty: 0 }]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Auto-calculate main product stock from variants
  useEffect(() => {
    if (!formData.is_variant && variants.some(v => v.name.trim())) {
      const totalStock = variants.reduce((sum, v) => sum + (v.current_stock || 0), 0);
      setFormData(prev => ({ ...prev, current_stock: totalStock }));
    }
  }, [variants, formData.is_variant]);

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

  const { data: vendors } = useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const { data } = await supabase
        .from("vendors")
        .select("*")
        .order("name");
      return data || [];
    }
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (categoryData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("categories")
        .insert([{ 
          name: categoryData.name, 
          description: categoryData.description,
          created_by_user_id: user.id 
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setFormData(prev => ({ ...prev, category_id: data.id }));
      setIsCategoryModalOpen(false);
      toast({
        title: "Success",
        description: "Category created successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Product name is required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.category_id) {
      toast({
        title: "Validation Error",
        description: "Please select a category",
        variant: "destructive"
      });
      return;
    }

    if (formData.unit_price < 0) {
      toast({
        title: "Validation Error",
        description: "Unit price cannot be negative",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to add products",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      if (formData.is_variant && !formData.parent_product_id) {
        toast({
          title: "Error",
          description: "Please select a parent product for variant",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Insert main product with created_by_user_id
      const { data: product, error } = await supabase
        .from("products")
        .insert([{ ...formData, created_by_user_id: user.id }])
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
            is_variant: true,
            created_by_user_id: user.id
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
      parent_product_id: "",
      preferred_vendor_id: ""
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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20 border-0 shadow-2xl rounded-2xl animate-fade-in">
        <DialogHeader className="pb-6 border-b border-border/50">
          <DialogTitle className="flex items-center gap-4 text-2xl">
            <div className="relative">
              <img 
                src={bucketIcon} 
                alt="Add Product" 
                className="w-12 h-12 animate-[bounce_2s_ease-in-out_infinite]"
              />
            </div>
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent font-bold">
              Add New Product
            </span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 pt-2">
          {/* Main Product Details Section */}
          <div className="space-y-6 p-6 rounded-xl bg-gradient-to-br from-blue-50/50 to-cyan-50/30 dark:from-blue-950/20 dark:to-cyan-950/10 border border-blue-100/50 dark:border-blue-900/30 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Main Product Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="Enter product name"
                  className="h-12 transition-all duration-200 hover:border-primary/50 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">Category *</Label>
                <Select 
                  value={formData.category_id} 
                  onValueChange={(value) => {
                    if (value === "ADD_NEW") {
                      setIsCategoryModalOpen(true);
                    } else {
                      setFormData({...formData, category_id: value});
                    }
                  }}
                >
                  <SelectTrigger className="h-12 transition-all duration-200 hover:border-primary/50">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-[100]">
                    <SelectItem 
                      value="ADD_NEW" 
                      className="text-primary font-semibold border-b border-border mb-1"
                    >
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        + Add New Category
                      </div>
                    </SelectItem>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hsn_code" className="text-sm font-medium">HSN Code</Label>
                <Input
                  id="hsn_code"
                  value={formData.hsn_code}
                  onChange={(e) => setFormData({...formData, hsn_code: e.target.value})}
                  placeholder="Enter HSN code"
                  className="h-12 transition-all duration-200 hover:border-primary/50 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit" className="text-sm font-medium">Unit *</Label>
                <Select 
                  value={formData.unit} 
                  onValueChange={(value) => setFormData({...formData, unit: value})}
                >
                  <SelectTrigger className="h-12 transition-all duration-200 hover:border-primary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="space-y-6 p-6 rounded-xl bg-gradient-to-br from-emerald-50/50 to-green-50/30 dark:from-emerald-950/20 dark:to-green-950/10 border border-emerald-100/50 dark:border-emerald-900/30 animate-fade-in" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Pricing & Quantity</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="purchase_qty" className="text-sm font-medium">Purchase Qty</Label>
                <Input
                  id="purchase_qty"
                  type="number"
                  value={formData.purchase_qty}
                  onChange={(e) => setFormData({...formData, purchase_qty: parseInt(e.target.value) || 0})}
                  placeholder="Enter purchase quantity"
                  className="h-12 transition-all duration-200 hover:border-primary/50 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit_price" className="text-sm font-medium">Unit Price</Label>
                <Input
                  id="unit_price"
                  type="number"
                  step="0.01"
                  value={formData.unit_price}
                  onChange={(e) => setFormData({...formData, unit_price: parseFloat(e.target.value) || 0})}
                  placeholder="Enter unit price"
                  className="h-12 transition-all duration-200 hover:border-primary/50 focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Stock Management Section */}
          <div className="space-y-6 p-6 rounded-xl bg-gradient-to-br from-orange-50/50 to-amber-50/30 dark:from-orange-950/20 dark:to-amber-950/10 border border-orange-100/50 dark:border-orange-900/30 animate-fade-in" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Stock Management</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="current_stock" className="text-sm font-medium">
                  Current Stock {!formData.is_variant && variants.some(v => v.name.trim()) && "(Auto-calculated from variants)"}
                </Label>
                <Input
                  id="current_stock"
                  type="number"
                  value={formData.current_stock}
                  onChange={(e) => setFormData({...formData, current_stock: parseInt(e.target.value) || 0})}
                  placeholder="Enter current stock"
                  className="h-12 transition-all duration-200 hover:border-primary/50 focus:border-primary"
                  disabled={!formData.is_variant && variants.some(v => v.name.trim())}
                />
                {!formData.is_variant && variants.some(v => v.name.trim()) && (
                  <p className="text-xs text-muted-foreground">
                    Stock is automatically calculated as sum of variant stocks
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="threshold_qty" className="text-sm font-medium">Threshold Qty</Label>
                <Input
                  id="threshold_qty"
                  type="number"
                  value={formData.threshold_qty}
                  onChange={(e) => setFormData({...formData, threshold_qty: parseInt(e.target.value) || 0})}
                  placeholder="Enter threshold quantity"
                  className="h-12 transition-all duration-200 hover:border-primary/50 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferred_vendor" className="text-sm font-medium">Preferred Vendor</Label>
                <Select
                  value={formData.preferred_vendor_id}
                  onValueChange={(value) => {
                    if (value === "ADD_NEW") {
                      setIsVendorModalOpen(true);
                    } else {
                      setFormData({...formData, preferred_vendor_id: value});
                    }
                  }}
                >
                  <SelectTrigger className="h-12 transition-all duration-200 hover:border-primary/50">
                    <SelectValue placeholder="Select vendor (optional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-[100]">
                    {vendors?.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </SelectItem>
                    ))}
                    <SelectItem 
                      value="ADD_NEW" 
                      className="text-primary font-semibold border-t border-border mt-1 pt-2"
                    >
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        + Add New Vendor
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Product Image Section */}
          <div className="space-y-4 p-6 rounded-xl bg-gradient-to-br from-purple-50/50 to-pink-50/30 dark:from-purple-950/20 dark:to-pink-950/10 border border-purple-100/50 dark:border-purple-900/30 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Upload className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Product Image</h3>
            </div>
            
            <div className="flex gap-3">
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                placeholder="Enter image URL or upload"
                className="h-12 transition-all duration-200 hover:border-primary/50 focus:border-primary"
              />
              <Button 
                type="button" 
                variant="outline" 
                className="h-12 px-6 border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-all duration-300 group"
              >
                <Upload className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </Button>
            </div>
            
            {formData.image_url && (
              <div className="mt-4 p-2 border-2 border-dashed border-border rounded-lg">
                <img 
                  src={formData.image_url} 
                  alt="Preview" 
                  className="w-24 h-24 object-cover rounded-lg mx-auto"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/96?text=Invalid+URL';
                  }}
                />
              </div>
            )}
          </div>

          {/* Product Variants Section */}
          {!formData.is_variant && (
            <div className="space-y-6 p-6 rounded-xl bg-gradient-to-br from-indigo-50/50 to-blue-50/30 dark:from-indigo-950/20 dark:to-blue-950/10 border border-indigo-100/50 dark:border-indigo-900/30 animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10">
                    <Package className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Product Variants</h3>
                </div>
                <Button
                  type="button"
                  onClick={addVariant}
                  variant="outline"
                  className="h-10 border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 group"
                >
                  <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  Add Variant
                </Button>
              </div>

              <div className="space-y-4">
                {variants.map((variant, index) => (
                  <div 
                    key={index} 
                    className="p-5 border-2 border-border/50 rounded-xl bg-background/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 animate-fade-in"
                    style={{animationDelay: `${0.5 + index * 0.1}s`}}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-base font-semibold">Variant {index + 1}</Label>
                      {variants.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeVariant(index)}
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Variant Name</Label>
                        <Input
                          value={variant.name}
                          onChange={(e) => updateVariant(index, "name", e.target.value)}
                          placeholder="e.g., Red, Large, 500ml"
                          className="h-11 transition-all duration-200 hover:border-primary/50 focus:border-primary"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Image URL</Label>
                        <Input
                          value={variant.image_url}
                          onChange={(e) => updateVariant(index, "image_url", e.target.value)}
                          placeholder="Enter variant image URL"
                          className="h-11 transition-all duration-200 hover:border-primary/50 focus:border-primary"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Current Stock</Label>
                        <Input
                          type="number"
                          value={variant.current_stock}
                          onChange={(e) => updateVariant(index, "current_stock", parseInt(e.target.value) || 0)}
                          placeholder="0"
                          className="h-11 transition-all duration-200 hover:border-primary/50 focus:border-primary"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Threshold Qty</Label>
                        <Input
                          type="number"
                          value={variant.threshold_qty}
                          onChange={(e) => updateVariant(index, "threshold_qty", parseInt(e.target.value) || 0)}
                          placeholder="0"
                          className="h-11 transition-all duration-200 hover:border-primary/50 focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t-2 border-border/50 mt-8">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="h-12 px-8 border-2 hover:bg-muted transition-all duration-300"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="h-12 px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  Add Product
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>

      {/* Add New Category Modal */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent className="max-w-md bg-background">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <CategoryForm 
            onSubmit={(data) => createCategoryMutation.mutate(data)}
            onClose={() => setIsCategoryModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Add New Vendor Modal */}
      <AddEditVendorModal
        isOpen={isVendorModalOpen}
        onClose={() => {
          setIsVendorModalOpen(false);
          queryClient.invalidateQueries({ queryKey: ["vendors"] });
        }}
      />
    </Dialog>
  );
}
