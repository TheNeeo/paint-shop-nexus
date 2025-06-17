
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
    <div className="space-y-6 bg-gradient-to-br from-green-50 via-white to-blue-50 p-8 rounded-2xl border-2 border-green-200 shadow-xl max-h-[85vh] overflow-y-auto">
      <div className="border-b-2 border-green-100 pb-4">
        <h2 className="text-2xl font-bold text-green-800 flex items-center gap-2">
          <Package className="h-6 w-6 text-green-600" />
          {product ? "Edit Product" : "Add New Product"}
        </h2>
        <p className="text-gray-600 mt-1">Fill in the details below to {product ? "update" : "create"} your product</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Product Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl border-2 border-green-200 shadow-sm">
                <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Main Product Details
                </h3>
                
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
                            className="bg-white border-2 border-green-300 focus:border-green-500 focus:ring-green-500 rounded-lg transition-all duration-200" 
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
                            className="bg-white border-2 border-green-300 focus:border-green-500 focus:ring-green-500 rounded-lg transition-all duration-200" 
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
                            <SelectTrigger className="bg-white border-2 border-green-300 focus:border-green-500 focus:ring-green-500 rounded-lg transition-all duration-200">
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
                            <SelectTrigger className="bg-white border-2 border-green-300 focus:border-green-500 focus:ring-green-500 rounded-lg transition-all duration-200">
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
                            className="bg-white border-2 border-green-300 focus:border-green-500 focus:ring-green-500 rounded-lg transition-all duration-200" 
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
                            <SelectTrigger className="bg-white border-2 border-green-300 focus:border-green-500 focus:ring-green-500 rounded-lg transition-all duration-200">
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
              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl border-2 border-blue-200 shadow-sm">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing Details
                </h3>
                
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
                            className="bg-white border-2 border-blue-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all duration-200" 
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
                            className="bg-white border-2 border-blue-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all duration-200" 
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
                            className="bg-white border-2 border-blue-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all duration-200" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Stock Management */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border-2 border-orange-200 shadow-sm">
                <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Stock Management
                </h3>
                
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
                          className="bg-white border-2 border-orange-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg transition-all duration-200" 
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
              <div className="bg-white p-6 rounded-xl border-2 border-green-200 shadow-sm h-fit sticky top-4">
                <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                  🖼️ Product Image
                </h3>
                
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
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-green-300 rounded-xl cursor-pointer hover:border-green-400 bg-green-50/50 transition-all duration-200 hover:bg-green-100/50"
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="flex flex-col items-center space-y-3">
                        <Upload className="h-12 w-12 text-green-400" />
                        <div className="text-center">
                          <span className="text-sm text-green-600 font-medium block">Drag Product Image Here or</span>
                          <span className="text-sm text-blue-600 font-medium">Browse Image</span>
                        </div>
                      </div>
                    )}
                  </Label>
                  <p className="text-xs text-gray-500 text-center">Recommended: 400x400px, PNG/JPG format</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Variants */}
          <div className="bg-white p-6 rounded-xl border-2 border-purple-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-purple-800 flex items-center gap-2">
                🔄 Product Variants
              </h3>
              <Button 
                type="button" 
                onClick={addVariant} 
                variant="outline" 
                size="sm"
                className="border-purple-500 text-purple-600 hover:bg-purple-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Variant
              </Button>
            </div>

            {variants.length > 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-4 p-4 bg-purple-50 rounded-lg font-semibold text-purple-800 text-sm">
                  <div>Variant Name</div>
                  <div>Purchase Rate</div>
                  <div>Sale Rate</div>
                  <div>Quantity</div>
                  <div>Action</div>
                </div>
                
                {variants.map((variant, index) => (
                  <div key={index} className="grid grid-cols-5 gap-4 p-4 border-2 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                    <Input
                      placeholder="e.g., Small Size"
                      value={variant.name}
                      onChange={(e) => updateVariant(index, "name", e.target.value)}
                      className="bg-white border-2 border-purple-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={variant.purchaseRate}
                      onChange={(e) => updateVariant(index, "purchaseRate", e.target.value)}
                      className="bg-white border-2 border-purple-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={variant.saleRate}
                      onChange={(e) => updateVariant(index, "saleRate", e.target.value)}
                      className="bg-white border-2 border-purple-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                    />
                    <Input
                      type="number"
                      placeholder="0"
                      value={variant.quantity}
                      onChange={(e) => updateVariant(index, "quantity", e.target.value)}
                      className="bg-white border-2 border-purple-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                    />
                    <Button
                      type="button"
                      onClick={() => removeVariant(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description - At the bottom */}
          <div className="bg-white p-6 rounded-xl border-2 border-green-200 shadow-sm">
            <h3 className="text-lg font-semibold text-green-800 mb-4">📝 Description / Notes</h3>
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
                      className="bg-white border-2 border-green-300 focus:border-green-500 focus:ring-green-500 rounded-lg transition-all duration-200" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t-2 border-green-100">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-gray-300 text-gray-600 hover:bg-gray-50 px-8"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg px-8"
            >
              {product ? "Update Product" : "Save Product"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
