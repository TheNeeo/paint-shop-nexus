
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Upload, Package, DollarSign, AlertTriangle, Hash, Tag, Layers, IndianRupee, ImageIcon, FileText, ToggleRight } from "lucide-react";
import { FormSectionHeader } from "@/components/shared/FormSectionHeader";
import { FormFieldLabel } from "@/components/shared/FormFieldLabel";

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductCreated: (product: any) => void;
}

interface ProductVariant {
  id: string;
  name: string;
  purchaseRate: number;
  saleRate: number;
  quantity: number;
}

export function NewProductModal({ isOpen, onClose, onProductCreated }: NewProductModalProps) {
  const [productData, setProductData] = useState({
    name: "",
    category: "",
    hsnCode: "",
    unit: "",
    purchaseRate: "",
    saleRate: "",
    mrp: "",
    stockQuantity: "",
    thresholdQuantity: "",
    status: "Active",
    description: "",
  });

  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [imagePreview, setImagePreview] = useState("");

  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: Date.now().toString(),
      name: "",
      purchaseRate: 0,
      saleRate: 0,
      quantity: 0,
    };
    setVariants([...variants, newVariant]);
  };

  const removeVariant = (id: string) => {
    setVariants(variants.filter(variant => variant.id !== id));
  };

  const updateVariant = (id: string, field: keyof ProductVariant, value: any) => {
    setVariants(variants.map(variant => 
      variant.id === id ? { ...variant, [field]: value } : variant
    ));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productData.name || !productData.category || !productData.saleRate) {
      alert("Please fill all required fields");
      return;
    }

    const newProduct = {
      id: Date.now().toString(),
      ...productData,
      variants,
      image: imagePreview,
      createdAt: new Date().toISOString(),
    };

    console.log("Creating new product:", newProduct);
    onProductCreated(newProduct);
    
    // Reset form
    setProductData({
      name: "",
      category: "",
      hsnCode: "",
      unit: "",
      purchaseRate: "",
      saleRate: "",
      mrp: "",
      stockQuantity: "",
      thresholdQuantity: "",
      status: "Active",
      description: "",
    });
    setVariants([]);
    setImagePreview("");
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-black text-xl flex items-center gap-2">
            <Package className="h-6 w-6 text-green-600" />
            Add New Product
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Product Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl border-2 border-green-200 shadow-sm">
                <FormSectionHeader icon={Package} title="Main Product Details" color="emerald" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FormFieldLabel icon={Tag} label="Product Name" required color="emerald" />
                    <Input
                      placeholder="Enter product name"
                      value={productData.name}
                      onChange={(e) => setProductData({...productData, name: e.target.value})}
                      className="bg-white border-2 border-green-300 focus:border-green-500"
                      required
                    />
                  </div>

                  <div>
                    <FormFieldLabel icon={Hash} label="HSN Code" required color="blue" />
                    <Input
                      placeholder="e.g., HSN12345"
                      value={productData.hsnCode}
                      onChange={(e) => setProductData({...productData, hsnCode: e.target.value})}
                      className="bg-white border-2 border-green-300 focus:border-green-500"
                      required
                    />
                  </div>

                  <div>
                    <FormFieldLabel icon={Layers} label="Category" required color="purple" />
                    <Select 
                      value={productData.category} 
                      onValueChange={(value) => setProductData({...productData, category: value})}
                    >
                      <SelectTrigger className="bg-white border-2 border-green-300">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tools">Tools</SelectItem>
                        <SelectItem value="Paint">Paint</SelectItem>
                        <SelectItem value="Canvas">Canvas</SelectItem>
                        <SelectItem value="Brushes">Brushes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <FormFieldLabel icon={Tag} label="Unit" required color="cyan" />
                    <Select 
                      value={productData.unit} 
                      onValueChange={(value) => setProductData({...productData, unit: value})}
                    >
                      <SelectTrigger className="bg-white border-2 border-green-300">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ltr">Ltr (Litre)</SelectItem>
                        <SelectItem value="Kg">Kg (Kilogram)</SelectItem>
                        <SelectItem value="NOS">NOS (Numbers)</SelectItem>
                        <SelectItem value="Piece">Piece</SelectItem>
                        <SelectItem value="Set">Set</SelectItem>
                        <SelectItem value="Pack">Pack</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <FormFieldLabel icon={Hash} label="Stock Quantity" required color="orange" />
                    <Input
                      type="number"
                      placeholder="Available quantity"
                      value={productData.stockQuantity}
                      onChange={(e) => setProductData({...productData, stockQuantity: e.target.value})}
                      className="bg-white border-2 border-green-300 focus:border-green-500"
                      required
                    />
                  </div>

                  <div>
                    <FormFieldLabel icon={ToggleRight} label="Status" color="indigo" />
                    <Select 
                      value={productData.status} 
                      onValueChange={(value) => setProductData({...productData, status: value})}
                    >
                      <SelectTrigger className="bg-white border-2 border-green-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl border-2 border-blue-200 shadow-sm">
                <FormSectionHeader icon={DollarSign} title="Pricing Details" color="blue" />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <FormFieldLabel icon={IndianRupee} label="Purchase Rate" required color="blue" />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Buying price"
                      value={productData.purchaseRate}
                      onChange={(e) => setProductData({...productData, purchaseRate: e.target.value})}
                      className="bg-white border-2 border-blue-300 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <FormFieldLabel icon={IndianRupee} label="Sale Rate" required color="emerald" />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Selling price"
                      value={productData.saleRate}
                      onChange={(e) => setProductData({...productData, saleRate: e.target.value})}
                      className="bg-white border-2 border-blue-300 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <FormFieldLabel icon={IndianRupee} label="MRP" color="amber" />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Maximum retail price"
                      value={productData.mrp}
                      onChange={(e) => setProductData({...productData, mrp: e.target.value})}
                      className="bg-white border-2 border-blue-300 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Stock Management */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border-2 border-orange-200 shadow-sm">
                <FormSectionHeader icon={AlertTriangle} title="Stock Management" color="orange" />
                
                <div>
                  <FormFieldLabel icon={AlertTriangle} label="Threshold Quantity" color="orange" />
                  <Input
                    type="number"
                    placeholder="Low stock alert quantity"
                    value={productData.thresholdQuantity}
                    onChange={(e) => setProductData({...productData, thresholdQuantity: e.target.value})}
                    className="bg-white border-2 border-orange-300 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Product Image */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl border-2 border-green-200 shadow-sm h-fit sticky top-4">
                <FormSectionHeader icon={ImageIcon} title="Product Image" color="pink" />
                
                <div className="space-y-4">
                  <Input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-green-300 rounded-xl cursor-pointer hover:border-green-400 bg-green-50/50"
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <div className="flex flex-col items-center space-y-3">
                        <Upload className="h-12 w-12 text-green-400" />
                        <div className="text-center">
                          <span className="text-sm text-green-600 font-medium block">Upload Product Image</span>
                          <span className="text-sm text-blue-600 font-medium">Browse Image</span>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Product Variants */}
          <div className="bg-white p-6 rounded-xl border-2 border-purple-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <FormSectionHeader icon={Layers} title="Product Variants" color="purple" />
              <Button 
                type="button" 
                onClick={addVariant} 
                variant="outline" 
                size="sm"
                className="border-purple-500 text-purple-600 hover:bg-purple-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Variant
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
                
                {variants.map((variant) => (
                  <div key={variant.id} className="grid grid-cols-5 gap-4 p-4 border-2 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                    <Input
                      placeholder="e.g., Small Size"
                      value={variant.name}
                      onChange={(e) => updateVariant(variant.id, "name", e.target.value)}
                      className="bg-white border-2 border-purple-300"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={variant.purchaseRate}
                      onChange={(e) => updateVariant(variant.id, "purchaseRate", Number(e.target.value))}
                      className="bg-white border-2 border-purple-300"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={variant.saleRate}
                      onChange={(e) => updateVariant(variant.id, "saleRate", Number(e.target.value))}
                      className="bg-white border-2 border-purple-300"
                    />
                    <Input
                      type="number"
                      placeholder="0"
                      value={variant.quantity}
                      onChange={(e) => updateVariant(variant.id, "quantity", Number(e.target.value))}
                      className="bg-white border-2 border-purple-300"
                    />
                    <Button
                      type="button"
                      onClick={() => removeVariant(variant.id)}
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

          {/* Description */}
          <div className="bg-white p-6 rounded-xl border-2 border-green-200 shadow-sm">
            <h3 className="text-lg font-semibold text-green-800 mb-4">Description</h3>
            <Textarea
              placeholder="Enter detailed product description..."
              rows={4}
              value={productData.description}
              onChange={(e) => setProductData({...productData, description: e.target.value})}
              className="bg-white border-2 border-green-300 focus:border-green-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t-2 border-green-100">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
              Create Product
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
