
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Plus, Trash2, Upload, Package, DollarSign, AlertTriangle } from "lucide-react";
import bucketIcon from "@/assets/bucket-icon.png";

interface ProductFormProps {
  onClose: () => void;
  product?: any;
}

export function ProductForm({ onClose, product }: ProductFormProps) {
  const [variants, setVariants] = useState(product?.variants || []);
  const [imagePreview, setImagePreview] = useState(product?.image || "");

  const form = useForm({
    defaultValues: {
      name: product?.name || "",
      category: product?.category || "",
      hsnCode: product?.hsnCode || "",
      unit: product?.unit || "",
      purchaseRate: product?.purchaseRate || "",
      saleRate: product?.saleRate || "",
      mrp: product?.mrp || "",
      stockQuantity: product?.stockQuantity || "",
      thresholdQuantity: product?.thresholdQuantity || "",
      status: product?.status || "Active",
      description: product?.description || "",
    },
  });

  const addVariant = () => {
    setVariants([...variants, { name: "", purchaseRate: "", saleRate: "", quantity: "" }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: string, value: string) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: any) => {
    console.log("Form data:", { ...data, variants, image: imagePreview });
    onClose();
  };

  return (
    <div className="space-y-8 p-2">
      <div className="border-b-2 border-border/50 pb-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <img 
            src={bucketIcon} 
            alt="Add Product" 
            className="w-14 h-14 animate-[bounce_2s_ease-in-out_infinite]"
          />
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {product ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">Fill in the details below to {product ? "update" : "create"} your product</p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Product Details */}
            <div className="lg:col-span-2 space-y-8">
              <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50/50 to-cyan-50/30 dark:from-blue-950/20 dark:to-cyan-950/10 border border-blue-100/50 dark:border-blue-900/30 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Main Product Details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-700 font-semibold flex items-center gap-1">
                          🔑 Product / Item Name *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter product name" 
                            {...field} 
                            className="h-12 transition-all duration-200 hover:border-primary/50 focus:border-primary" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hsnCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-700 font-semibold flex items-center gap-1">
                          📦 HSN / Item No. *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., HSN12345" 
                            {...field} 
                            className="h-12 transition-all duration-200 hover:border-primary/50 focus:border-primary" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-700 font-semibold flex items-center gap-1">
                          🎨 Category *
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 transition-all duration-200 hover:border-primary/50">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border-green-200">
                            <SelectItem value="Tools">Tools</SelectItem>
                            <SelectItem value="Paint">Paint</SelectItem>
                            <SelectItem value="Canvas">Canvas</SelectItem>
                            <SelectItem value="Brushes">Brushes</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-700 font-semibold flex items-center gap-1">
                          📏 Unit Of Measure *
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 transition-all duration-200 hover:border-primary/50">
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border-green-200">
                            <SelectItem value="Ltr">Ltr (Litre)</SelectItem>
                            <SelectItem value="Kg">Kg (Kilogram)</SelectItem>
                            <SelectItem value="NOS">NOS (Numbers)</SelectItem>
                            <SelectItem value="Piece">Piece</SelectItem>
                            <SelectItem value="Set">Set</SelectItem>
                            <SelectItem value="Pack">Pack</SelectItem>
                            <SelectItem value="Bottle">Bottle</SelectItem>
                            <SelectItem value="Tube">Tube</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stockQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-700 font-semibold flex items-center gap-1">
                          📦 Stock Quantity *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Available quantity" 
                            {...field} 
                            className="h-12 transition-all duration-200 hover:border-primary/50 focus:border-primary" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-700 font-semibold flex items-center gap-1">
                          ✅ Status
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 transition-all duration-200 hover:border-primary/50">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border-green-200">
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Pricing Section */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-50/50 to-green-50/30 dark:from-emerald-950/20 dark:to-green-950/10 border border-emerald-100/50 dark:border-emerald-900/30 animate-fade-in" style={{animationDelay: '0.1s'}}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Pricing Details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="purchaseRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700 font-semibold flex items-center gap-1">
                          💸 Purchase Rate *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="Buying price" 
                            {...field} 
                            className="h-12 transition-all duration-200 hover:border-primary/50 focus:border-primary" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="saleRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700 font-semibold flex items-center gap-1">
                          💰 Sale Rate *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="Selling price" 
                            {...field} 
                            className="h-12 transition-all duration-200 hover:border-primary/50 focus:border-primary" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mrp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700 font-semibold flex items-center gap-1">
                          🏷️ MRP
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="Maximum retail price" 
                            {...field} 
                            className="h-12 transition-all duration-200 hover:border-primary/50 focus:border-primary" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Stock Management */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-orange-50/50 to-amber-50/30 dark:from-orange-950/20 dark:to-amber-950/10 border border-orange-100/50 dark:border-orange-900/30 animate-fade-in" style={{animationDelay: '0.2s'}}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-orange-500/10">
                    <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Stock Management</h3>
                </div>
                
                <FormField
                  control={form.control}
                  name="thresholdQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-orange-700 font-semibold flex items-center gap-1">
                        ⚠️ Threshold Quantity
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Low stock alert quantity" 
                          {...field} 
                          className="h-12 transition-all duration-200 hover:border-primary/50 focus:border-primary" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Right Column - Product Image */}
            <div className="lg:col-span-1">
              <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50/50 to-pink-50/30 dark:from-purple-950/20 dark:to-pink-950/10 border border-purple-100/50 dark:border-purple-900/30 h-fit sticky top-4 animate-fade-in" style={{animationDelay: '0.3s'}}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Upload className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Product Image</h3>
                </div>
                
                <div className="space-y-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary transition-all duration-300 bg-background/50 hover:bg-primary/5"
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="flex flex-col items-center space-y-3">
                        <Upload className="h-12 w-12 text-muted-foreground group-hover:scale-110 transition-transform" />
                        <div className="text-center">
                          <span className="text-sm text-foreground font-medium block">Drag Product Image Here or</span>
                          <span className="text-sm text-primary font-medium">Browse Image</span>
                        </div>
                      </div>
                    )}
                  </Label>
                  <p className="text-xs text-muted-foreground text-center">Recommended: 400x400px, PNG/JPG format</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Variants */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-50/50 to-blue-50/30 dark:from-indigo-950/20 dark:to-blue-950/10 border border-indigo-100/50 dark:border-indigo-900/30 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10">
                  <Package className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Product Variants</h3>
              </div>
              <Button 
                type="button" 
                onClick={addVariant} 
                variant="outline" 
                size="sm"
                className="border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 group"
              >
                <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Add New Variant
              </Button>
            </div>

            {variants.length > 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-4 p-4 bg-primary/5 rounded-lg font-semibold text-foreground text-sm">
                  <div>Variant Name</div>
                  <div>Purchase Rate</div>
                  <div>Sale Rate</div>
                  <div>Quantity</div>
                  <div>Action</div>
                </div>
                
                {variants.map((variant, index) => (
                  <div 
                    key={index} 
                    className="grid grid-cols-5 gap-4 p-5 border-2 border-border/50 rounded-xl bg-background/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 animate-fade-in"
                    style={{animationDelay: `${0.5 + index * 0.1}s`}}
                  >
                    <Input
                      placeholder="e.g., Small Size"
                      value={variant.name}
                      onChange={(e) => updateVariant(index, "name", e.target.value)}
                      className="h-11 transition-all duration-200 hover:border-primary/50 focus:border-primary"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={variant.purchaseRate}
                      onChange={(e) => updateVariant(index, "purchaseRate", e.target.value)}
                      className="h-11 transition-all duration-200 hover:border-primary/50 focus:border-primary"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={variant.saleRate}
                      onChange={(e) => updateVariant(index, "saleRate", e.target.value)}
                      className="h-11 transition-all duration-200 hover:border-primary/50 focus:border-primary"
                    />
                    <Input
                      type="number"
                      placeholder="0"
                      value={variant.quantity}
                      onChange={(e) => updateVariant(index, "quantity", e.target.value)}
                      className="h-11 transition-all duration-200 hover:border-primary/50 focus:border-primary"
                    />
                    <Button
                      type="button"
                      onClick={() => removeVariant(index)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description - At the bottom */}
          <div className="p-6 rounded-xl bg-card border border-border animate-fade-in" style={{animationDelay: '0.5s'}}>
            <h3 className="text-lg font-semibold text-foreground mb-4">📝 Description / Notes</h3>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-green-700 font-semibold">More Details</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter detailed product description, specifications, usage instructions, or any additional notes..." 
                      rows={4} 
                      {...field} 
                      className="transition-all duration-200 hover:border-primary/50 focus:border-primary" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-8 border-t-2 border-border/50">
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
              className="h-12 px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              {product ? "Update Product" : "Save Product"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
