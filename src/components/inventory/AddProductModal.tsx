import React, { useState, useEffect } from "react";
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
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Plus, X, Package, DollarSign, TrendingUp, FileText, Hash, FolderTree, Box, Activity, IndianRupee, ShoppingCart, AlertTriangle, Building2, Package2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
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
    purchase_price: 0,
    sale_price: 0,
    image_url: "",
    is_variant: false,
    parent_product_id: "",
    preferred_vendor_id: ""
  });
  
  const [variants, setVariants] = useState([{ name: "", image_url: "", current_stock: 0, threshold_qty: 0, purchase_price: 0, sale_price: 0, mrp: 0 }]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [variantDragging, setVariantDragging] = useState<number | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showLowStockAlert, setShowLowStockAlert] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Auto-calculate main product stock from variants (Condition 3 & 4)
  useEffect(() => {
    if (!formData.is_variant && variants.some(v => v.name.trim())) {
      const totalStock = variants.reduce((sum, v) => sum + (v.current_stock || 0), 0);
      const totalPurchaseQty = variants.reduce((sum, v) => sum + (v.current_stock || 0), 0);
      setFormData(prev => ({ 
        ...prev, 
        current_stock: totalStock,
        purchase_qty: totalPurchaseQty 
      }));
    }
  }, [variants, formData.is_variant]);

  // Threshold Alert Logic
  useEffect(() => {
    if (formData.current_stock > 0 && formData.threshold_qty > 0) {
      setShowLowStockAlert(formData.current_stock <= formData.threshold_qty);
    } else {
      setShowLowStockAlert(false);
    }
  }, [formData.current_stock, formData.threshold_qty]);

  // Check for existing products to determine if it's new or old (for stock logic)
  const { data: existingProduct } = useQuery({
    queryKey: ["existing-product", formData.hsn_code],
    queryFn: async () => {
      if (!formData.hsn_code) return null;
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("hsn_code", formData.hsn_code)
        .maybeSingle();
      return data;
    },
    enabled: !!formData.hsn_code
  });

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

  // Create vendor mutation
  const createVendorMutation = useMutation({
    mutationFn: async (vendorData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("vendors")
        .insert([{ 
          ...vendorData,
          created_by_user_id: user.id 
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      setFormData(prev => ({ ...prev, preferred_vendor_id: data.id }));
      setIsVendorModalOpen(false);
      toast({
        title: "Success",
        description: "Vendor created successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create vendor",
        variant: "destructive"
      });
    }
  });

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = "Product name is required";
    }
    
    if (!formData.hsn_code.trim()) {
      errors.hsn_code = "HSN/Product code is required";
    }
    
    if (!formData.category_id) {
      errors.category_id = "Category is required";
    }
    
    if (!formData.preferred_vendor_id) {
      errors.preferred_vendor_id = "Preferred vendor is required";
    }
    
    if (formData.purchase_price <= 0) {
      errors.purchase_price = "Purchase rate must be greater than 0";
    }
    
    if (formData.sale_price <= 0) {
      errors.sale_price = "Sales rate must be greater than 0";
    }
    
    if (formData.mrp <= 0) {
      errors.mrp = "MRP must be greater than 0";
    }
    
    if (formData.purchase_qty <= 0) {
      errors.purchase_qty = "Purchase quantity must be greater than 0";
    }
    
    if (formData.threshold_qty <= 0) {
      errors.threshold_qty = "Threshold quantity must be greater than 0";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields correctly",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicate HSN code
    if (existingProduct) {
      toast({
        title: "Validation Error",
        description: "HSN code already exists. Please use a unique code.",
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

      // Smart Inventory Logic Implementation
      // Condition 1 & 2: New or Old Main Product (No Variants)
      // If no variants, current_stock = purchase_qty for new products
      // For old products, it would be added in purchase entry, not here
      
      const hasVariants = variants.some(v => v.name.trim());
      let calculatedStock = formData.purchase_qty;
      
      if (hasVariants) {
        // Condition 3: New Main Product with Variants
        // Total stock = sum of variant stocks
        calculatedStock = variants.reduce((sum, v) => sum + (v.current_stock || 0), 0);
      }

      // Insert main product with created_by_user_id
      // Convert empty string UUIDs to null
      const productData = {
        ...formData,
        current_stock: calculatedStock,
        parent_product_id: formData.parent_product_id || null,
        preferred_vendor_id: formData.preferred_vendor_id || null,
        created_by_user_id: user.id
      };

      const { data: product, error } = await supabase
        .from("products")
        .insert([productData])
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
    } catch (error: any) {
      const errorMessage = error?.message || error?.error_description || JSON.stringify(error);
      console.error("Error adding product:", errorMessage, error);
      toast({
        title: "Error",
        description: errorMessage || "Failed to add product",
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
      purchase_price: 0,
      sale_price: 0,
      image_url: "",
      is_variant: false,
      parent_product_id: "",
      preferred_vendor_id: ""
    });
    setVariants([{ name: "", image_url: "", current_stock: 0, threshold_qty: 0, purchase_price: 0, sale_price: 0 }]);
    setValidationErrors({});
    setShowLowStockAlert(false);
  };

  // Calculate profit margin
  const calculateProfitMargin = () => {
    if (formData.purchase_price > 0 && formData.sale_price > 0) {
      return ((formData.sale_price - formData.purchase_price) / formData.purchase_price * 100).toFixed(2);
    }
    return "0.00";
  };

  // Get stock color indicator
  const getStockColor = (currentStock: number, threshold: number) => {
    if (currentStock === 0) return "text-red-500";
    if (currentStock <= threshold) return "text-yellow-500";
    return "text-green-500";
  };

  const addVariant = () => {
    setVariants([...variants, { name: "", image_url: "", current_stock: 0, threshold_qty: 0, purchase_price: 0, sale_price: 0, mrp: 0 }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const handleMainImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({...formData, image_url: reader.result as string});
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please drop an image file",
        variant: "destructive"
      });
    }
  };

  const handleVariantImageDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setVariantDragging(null);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateVariant(index, "image_url", reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please drop an image file",
        variant: "destructive"
      });
    }
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
          <DialogDescription className="text-muted-foreground">
            Fill in the product details below to add a new item to your inventory.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 pt-2">
          {/* Main Product Details & Image Section - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Product Details - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-6 p-6 rounded-xl bg-gradient-to-br from-blue-50/50 to-cyan-50/30 dark:from-blue-950/20 dark:to-cyan-950/10 border border-blue-100/50 dark:border-blue-900/30 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Main Product Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Product / Item Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({...formData, name: e.target.value});
                      if (validationErrors.name) {
                        setValidationErrors(prev => ({...prev, name: ""}));
                      }
                    }}
                    required
                    placeholder="Enter product name"
                    className={`h-12 transition-all duration-200 hover:border-primary/50 focus:border-primary ${validationErrors.name ? 'border-red-500' : ''}`}
                  />
                  {validationErrors.name && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {validationErrors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hsn_code" className="text-sm font-medium flex items-center gap-2">
                    <Hash className="w-4 h-4 text-primary" />
                    HSN / Product Code *
                  </Label>
                  <Input
                    id="hsn_code"
                    value={formData.hsn_code}
                    onChange={(e) => {
                      setFormData({...formData, hsn_code: e.target.value});
                      if (validationErrors.hsn_code) {
                        setValidationErrors(prev => ({...prev, hsn_code: ""}));
                      }
                    }}
                    required
                    placeholder="Enter HSN code"
                    className={`h-12 transition-all duration-200 hover:border-primary/50 focus:border-primary ${validationErrors.hsn_code ? 'border-red-500' : ''}`}
                  />
                  {validationErrors.hsn_code && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {validationErrors.hsn_code}
                    </p>
                  )}
                  {existingProduct && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      HSN code already exists
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium flex items-center gap-2">
                    <FolderTree className="w-4 h-4 text-primary" />
                    Category *
                  </Label>
                  <Select 
                    value={formData.category_id} 
                    onValueChange={(value) => {
                      if (value === "ADD_NEW") {
                        setIsCategoryModalOpen(true);
                      } else {
                        setFormData({...formData, category_id: value});
                        if (validationErrors.category_id) {
                          setValidationErrors(prev => ({...prev, category_id: ""}));
                        }
                      }
                    }}
                  >
                    <SelectTrigger className={`h-12 transition-all duration-200 hover:border-primary/50 ${validationErrors.category_id ? 'border-red-500' : ''}`}>
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
                  {validationErrors.category_id && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {validationErrors.category_id}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit" className="text-sm font-medium flex items-center gap-2">
                    <Box className="w-4 h-4 text-primary" />
                    Unit Of Measurement *
                  </Label>
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

                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="status" className="text-sm font-medium flex items-center gap-2">
                      <Activity className="w-4 h-4 text-primary" />
                      Status
                    </Label>
                    <div className="flex items-center gap-3">
                      <Switch
                        id="status"
                        checked={formData.status === "active"}
                        onCheckedChange={(checked) => setFormData({...formData, status: checked ? "active" : "inactive"})}
                      />
                      <span className="text-sm font-medium">
                        {formData.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Image - Takes 1 column */}
            <div className="space-y-4 p-6 rounded-xl bg-gradient-to-br from-purple-50/50 to-pink-50/30 dark:from-purple-950/20 dark:to-pink-950/10 border border-purple-100/50 dark:border-purple-900/30 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Upload className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">📸 Product Image</h3>
              </div>
              
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                  isDragging 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                }`}
                onDrop={handleMainImageDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
              >
                <input
                  type="file"
                  id="main_image_upload"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData({...formData, image_url: reader.result as string});
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                
                {formData.image_url ? (
                  <div className="space-y-3">
                    <img 
                      src={formData.image_url} 
                      alt="Preview" 
                      className="w-full h-40 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/200?text=Invalid+Image';
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData({...formData, image_url: ""})}
                      className="w-full"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Drop image here</p>
                      <p className="text-xs text-muted-foreground">or</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('main_image_upload')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Browse
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pricing & Quantity Section */}
          <div className="space-y-6 p-6 rounded-xl bg-gradient-to-br from-emerald-50/50 to-green-50/30 dark:from-emerald-950/20 dark:to-green-950/10 border border-emerald-100/50 dark:border-emerald-900/30 animate-fade-in" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Pricing & Quantity Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="purchase_price" className="text-sm font-medium flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-primary" />
                  Purchase Rate (INR) *
                </Label>
                <Input
                  id="purchase_price"
                  type="number"
                  step="0.01"
                  value={formData.purchase_price === 0 ? "" : formData.purchase_price}
                  onChange={(e) => {
                    setFormData({...formData, purchase_price: e.target.value === "" ? 0 : parseFloat(e.target.value)});
                    if (validationErrors.purchase_price) {
                      setValidationErrors(prev => ({...prev, purchase_price: ""}));
                    }
                  }}
                  required
                  placeholder="Enter purchase price"
                  className={`h-12 transition-all duration-200 hover:border-primary/50 focus:border-primary ${validationErrors.purchase_price ? 'border-red-500' : ''}`}
                />
                {validationErrors.purchase_price && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {validationErrors.purchase_price}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sale_price" className="text-sm font-medium flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-primary" />
                  Sales Rate (INR) *
                </Label>
                <Input
                  id="sale_price"
                  type="number"
                  step="0.01"
                  value={formData.sale_price === 0 ? "" : formData.sale_price}
                  onChange={(e) => {
                    setFormData({...formData, sale_price: e.target.value === "" ? 0 : parseFloat(e.target.value)});
                    if (validationErrors.sale_price) {
                      setValidationErrors(prev => ({...prev, sale_price: ""}));
                    }
                  }}
                  required
                  placeholder="Enter selling price"
                  className={`h-12 transition-all duration-200 hover:border-primary/50 focus:border-primary ${validationErrors.sale_price ? 'border-red-500' : ''}`}
                />
                {validationErrors.sale_price && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {validationErrors.sale_price}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mrp" className="text-sm font-medium flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-primary" />
                  MRP (INR) *
                </Label>
                <Input
                  id="mrp"
                  type="number"
                  step="0.01"
                  value={formData.mrp === 0 ? "" : formData.mrp}
                  onChange={(e) => {
                    setFormData({...formData, mrp: e.target.value === "" ? 0 : parseFloat(e.target.value)});
                    if (validationErrors.mrp) {
                      setValidationErrors(prev => ({...prev, mrp: ""}));
                    }
                  }}
                  required
                  placeholder="Enter MRP"
                  className={`h-12 transition-all duration-200 hover:border-primary/50 focus:border-primary ${validationErrors.mrp ? 'border-red-500' : ''}`}
                />
                {validationErrors.mrp && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {validationErrors.mrp}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchase_qty" className="text-sm font-medium flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-primary" />
                  Purchase Quantity *
                </Label>
                <Input
                  id="purchase_qty"
                  type="number"
                  value={formData.purchase_qty === 0 ? "" : formData.purchase_qty}
                  onChange={(e) => {
                    const newQty = e.target.value === "" ? 0 : parseInt(e.target.value);
                    setFormData({...formData, purchase_qty: newQty, current_stock: newQty});
                    if (validationErrors.purchase_qty) {
                      setValidationErrors(prev => ({...prev, purchase_qty: ""}));
                    }
                  }}
                  required
                  placeholder="Enter purchase quantity"
                  className={`h-12 transition-all duration-200 hover:border-primary/50 focus:border-primary ${validationErrors.purchase_qty ? 'border-red-500' : ''}`}
                />
                {validationErrors.purchase_qty && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {validationErrors.purchase_qty}
                  </p>
                )}
              </div>

              {/* Profit Margin Display */}
              {formData.purchase_price > 0 && formData.sale_price > 0 && (
                <div className="md:col-span-2 p-4 rounded-lg bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-sm font-medium text-foreground">Profit Margin</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {calculateProfitMargin()}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ₹{(formData.sale_price - formData.purchase_price).toFixed(2)} per unit
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
                <Label htmlFor="current_stock" className="text-sm font-medium flex items-center gap-2">
                  <Package2 className="w-4 h-4 text-primary" />
                  Current Stock * {!formData.is_variant && variants.some(v => v.name.trim()) && "(Auto-calculated)"}
                </Label>
                <div className="relative">
                  <Input
                    id="current_stock"
                    type="number"
                    value={formData.current_stock === 0 ? "" : formData.current_stock}
                    onChange={(e) => setFormData({...formData, current_stock: e.target.value === "" ? 0 : parseInt(e.target.value)})}
                    required
                    placeholder="Enter current stock"
                    className={`h-12 transition-all duration-200 hover:border-primary/50 focus:border-primary ${
                      getStockColor(formData.current_stock, formData.threshold_qty)
                    }`}
                    disabled={!formData.is_variant && variants.some(v => v.name.trim())}
                  />
                </div>
                {!formData.is_variant && variants.some(v => v.name.trim()) && (
                  <p className="text-xs text-muted-foreground">
                    Stock is automatically calculated as sum of variant stocks
                  </p>
                )}
                {showLowStockAlert && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                      Low stock warning! Current stock is below threshold.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="threshold_qty" className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-primary" />
                  Threshold Quantity *
                </Label>
                <Input
                  id="threshold_qty"
                  type="number"
                  value={formData.threshold_qty === 0 ? "" : formData.threshold_qty}
                  onChange={(e) => {
                    setFormData({...formData, threshold_qty: e.target.value === "" ? 0 : parseInt(e.target.value)});
                    if (validationErrors.threshold_qty) {
                      setValidationErrors(prev => ({...prev, threshold_qty: ""}));
                    }
                  }}
                  required
                  placeholder="Enter threshold quantity"
                  className={`h-12 transition-all duration-200 hover:border-primary/50 focus:border-primary ${validationErrors.threshold_qty ? 'border-red-500' : ''}`}
                />
                {validationErrors.threshold_qty && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {validationErrors.threshold_qty}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="preferred_vendor" className="text-sm font-medium flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  Preferred Vendor *
                </Label>
                <Select
                  value={formData.preferred_vendor_id}
                  onValueChange={(value) => {
                    if (value === "ADD_NEW") {
                      setIsVendorModalOpen(true);
                    } else {
                      setFormData({...formData, preferred_vendor_id: value});
                      if (validationErrors.preferred_vendor_id) {
                        setValidationErrors(prev => ({...prev, preferred_vendor_id: ""}));
                      }
                    }
                  }}
                >
                  <SelectTrigger className={`h-12 transition-all duration-200 hover:border-primary/50 ${validationErrors.preferred_vendor_id ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select vendor" />
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
                {validationErrors.preferred_vendor_id && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {validationErrors.preferred_vendor_id}
                  </p>
                )}
              </div>
            </div>
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
                    
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                      {/* Variant details on left - 3 columns */}
                      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            Variant Name
                          </Label>
                          <Input
                            value={variant.name}
                            onChange={(e) => updateVariant(index, "name", e.target.value)}
                            placeholder="e.g., Red, Large, 500ml"
                            className="h-11 transition-all duration-200 hover:border-primary/50 focus:border-primary"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium flex items-center gap-2">
                            <IndianRupee className="w-4 h-4 text-primary" />
                            Purchase Rate (INR)
                          </Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={variant.purchase_price === 0 ? "" : variant.purchase_price}
                            onChange={(e) => updateVariant(index, "purchase_price", e.target.value === "" ? 0 : parseFloat(e.target.value))}
                            placeholder="0.00"
                            className="h-11 transition-all duration-200 hover:border-primary/50 focus:border-primary"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium flex items-center gap-2">
                            <IndianRupee className="w-4 h-4 text-primary" />
                            Sales Rate (INR)
                          </Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={variant.sale_price === 0 ? "" : variant.sale_price}
                            onChange={(e) => updateVariant(index, "sale_price", e.target.value === "" ? 0 : parseFloat(e.target.value))}
                            placeholder="0.00"
                            className="h-11 transition-all duration-200 hover:border-primary/50 focus:border-primary"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium flex items-center gap-2">
                            <Package2 className="w-4 h-4 text-primary" />
                            Current Stock
                          </Label>
                          <Input
                            type="number"
                            value={variant.current_stock === 0 ? "" : variant.current_stock}
                            onChange={(e) => updateVariant(index, "current_stock", e.target.value === "" ? 0 : parseInt(e.target.value))}
                            placeholder="0"
                            className="h-11 transition-all duration-200 hover:border-primary/50 focus:border-primary"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium flex items-center gap-2">
                            <IndianRupee className="w-4 h-4 text-primary" />
                            MRP (INR)
                          </Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={variant.mrp === 0 ? "" : variant.mrp}
                            onChange={(e) => updateVariant(index, "mrp", e.target.value === "" ? 0 : parseFloat(e.target.value))}
                            placeholder="0.00"
                            className="h-11 transition-all duration-200 hover:border-primary/50 focus:border-primary"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-primary" />
                            Threshold Quantity
                          </Label>
                          <Input
                            type="number"
                            value={variant.threshold_qty === 0 ? "" : variant.threshold_qty}
                            onChange={(e) => updateVariant(index, "threshold_qty", e.target.value === "" ? 0 : parseInt(e.target.value))}
                            placeholder="0"
                            className="h-11 transition-all duration-200 hover:border-primary/50 focus:border-primary"
                          />
                        </div>
                      </div>

                      {/* Variant Image on right */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <Upload className="w-4 h-4 text-primary" />
                          📸 Variant Image
                        </Label>
                        <div
                          className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-all duration-300 ${
                            variantDragging === index 
                              ? 'border-primary bg-primary/10' 
                              : 'border-border hover:border-primary/50'
                          }`}
                          onDrop={(e) => handleVariantImageDrop(e, index)}
                          onDragOver={(e) => { e.preventDefault(); setVariantDragging(index); }}
                          onDragLeave={() => setVariantDragging(null)}
                        >
                          <input
                            type="file"
                            id={`variant_image_${index}`}
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  updateVariant(index, "image_url", reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          
                          {variant.image_url ? (
                            <div className="space-y-2">
                              <img 
                                src={variant.image_url} 
                                alt="Variant" 
                                className="w-full h-32 object-cover rounded"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => updateVariant(index, "image_url", "")}
                                className="w-full"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => document.getElementById(`variant_image_${index}`)?.click()}
                                className="text-xs"
                              >
                                Drop or Browse
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Description & Notes Section */}
          <div className="space-y-6 p-6 rounded-xl bg-gradient-to-br from-slate-50/50 to-gray-50/30 dark:from-slate-950/20 dark:to-gray-950/10 border border-slate-100/50 dark:border-slate-900/30 animate-fade-in" style={{animationDelay: '0.5s'}}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-slate-500/10">
                <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Product Description & Notes</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter product description and notes..."
                className="min-h-[120px] transition-all duration-200 hover:border-primary/50 focus:border-primary resize-none"
              />
            </div>
          </div>

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
        onSuccess={(vendor) => {
          // Set the newly created vendor as the preferred vendor
          setFormData(prev => ({ ...prev, preferred_vendor_id: vendor.id }));
          // Clear validation error for vendor field
          if (validationErrors.preferred_vendor_id) {
            setValidationErrors(prev => ({...prev, preferred_vendor_id: ""}));
          }
        }}
      />
    </Dialog>
  );
}
