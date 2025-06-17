
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
import { Plus, Trash2, Upload } from "lucide-react";

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
      unit: product?.unit || "",
      unitPrice: product?.unitPrice || "",
      stockQuantity: product?.stockQuantity || "",
      description: product?.description || "",
      baseCode: product?.baseCode || "",
    },
  });

  const addVariant = () => {
    setVariants([...variants, { name: "", unitPrice: "", stockQuantity: "" }]);
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
    <div className="space-y-6 bg-white p-8 rounded-2xl border-2 border-green-200 shadow-xl">
      <div className="border-b-2 border-green-100 pb-4">
        <h2 className="text-2xl font-bold text-green-800">
          {product ? "Edit Product" : "Add New Product"}
        </h2>
        <p className="text-gray-600 mt-1">Fill in the details below to {product ? "update" : "create"} your product</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Product Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-green-700 font-semibold">Product Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter product name" 
                      {...field} 
                      className="bg-white border-2 border-green-300 focus:border-green-500 focus:ring-green-500 rounded-lg" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="baseCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-green-700 font-semibold">Base Code</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., PB001" 
                      {...field} 
                      className="bg-white border-2 border-green-300 focus:border-green-500 focus:ring-green-500 rounded-lg" 
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
                  <FormLabel className="text-green-700 font-semibold">Category *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white border-2 border-green-300 focus:border-green-500 focus:ring-green-500 rounded-lg">
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
                  <FormLabel className="text-green-700 font-semibold">Unit of Measure *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white border-2 border-green-300 focus:border-green-500 focus:ring-green-500 rounded-lg">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border-green-200">
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
              name="unitPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-green-700 font-semibold">Unit Price *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      {...field} 
                      className="bg-white border-2 border-green-300 focus:border-green-500 focus:ring-green-500 rounded-lg" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stockQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-green-700 font-semibold">Stock Quantity *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...field} 
                      className="bg-white border-2 border-green-300 focus:border-green-500 focus:ring-green-500 rounded-lg" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-green-700 font-semibold">Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter product description" 
                    rows={3} 
                    {...field} 
                    className="bg-white border-2 border-green-300 focus:border-green-500 focus:ring-green-500 rounded-lg" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload */}
          <div className="space-y-4">
            <Label className="text-green-700 font-semibold text-lg">Product Image</Label>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Label
                  htmlFor="image-upload"
                  className="flex items-center justify-center w-full h-40 border-2 border-dashed border-green-300 rounded-xl cursor-pointer hover:border-green-400 bg-green-50/50 transition-colors"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="h-10 w-10 text-green-400 mb-3" />
                      <span className="text-sm text-green-600 font-medium">Click to upload image</span>
                    </div>
                  )}
                </Label>
              </div>
            </div>
          </div>

          {/* Product Variants */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-semibold text-green-700">Product Variants</Label>
              <Button 
                type="button" 
                onClick={addVariant} 
                variant="outline" 
                size="sm"
                className="border-green-500 text-green-600 hover:bg-green-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Variant
              </Button>
            </div>

            {variants.map((variant, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 border-2 rounded-xl bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                <div>
                  <Label className="text-green-700 font-medium">Variant Name</Label>
                  <Input
                    placeholder="e.g., Small Size"
                    value={variant.name}
                    onChange={(e) => updateVariant(index, "name", e.target.value)}
                    className="bg-white border-2 border-green-300 focus:border-green-500 focus:ring-green-500 rounded-lg mt-1"
                  />
                </div>
                <div>
                  <Label className="text-green-700 font-medium">Unit Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={variant.unitPrice}
                    onChange={(e) => updateVariant(index, "unitPrice", e.target.value)}
                    className="bg-white border-2 border-green-300 focus:border-green-500 focus:ring-green-500 rounded-lg mt-1"
                  />
                </div>
                <div>
                  <Label className="text-green-700 font-medium">Stock Quantity</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={variant.stockQuantity}
                    onChange={(e) => updateVariant(index, "stockQuantity", e.target.value)}
                    className="bg-white border-2 border-green-300 focus:border-green-500 focus:ring-green-500 rounded-lg mt-1"
                  />
                </div>
                <div className="flex items-end">
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
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t-2 border-green-100">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
            >
              {product ? "Update Product" : "Save Product"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
