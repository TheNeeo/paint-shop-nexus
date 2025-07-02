
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Check } from "lucide-react";

interface ProductLineFormProps {
  onAddProduct: (productLine: any) => void;
  onCancel: () => void;
}

export function ProductLineForm({ onAddProduct, onCancel }: ProductLineFormProps) {
  const [formData, setFormData] = useState({
    productName: "",
    hsnCode: "",
    quantity: 1,
    unit: "PCS",
    rate: 0,
    gstPercent: 18,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productName || formData.rate <= 0) {
      alert("Please fill all required fields");
      return;
    }

    const baseAmount = formData.quantity * formData.rate;
    const amount = baseAmount + (baseAmount * formData.gstPercent / 100);

    const productLine = {
      id: Date.now().toString(),
      ...formData,
      amount,
    };

    onAddProduct(productLine);
    
    // Reset form
    setFormData({
      productName: "",
      hsnCode: "",
      quantity: 1,
      unit: "PCS",
      rate: 0,
      gstPercent: 18,
    });
  };

  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-blue-800">Add New Product Line</h3>
        <Button variant="outline" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-blue-700 font-semibold">Product Name *</Label>
            <Select 
              value={formData.productName} 
              onValueChange={(value) => setFormData({...formData, productName: value})}
            >
              <SelectTrigger className="bg-white border-blue-300">
                <SelectValue placeholder="Select Product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paint-brush">Paint Brush Set</SelectItem>
                <SelectItem value="wall-paint">Wall Paint</SelectItem>
                <SelectItem value="roller-set">Roller Set</SelectItem>
                <SelectItem value="primer">Primer</SelectItem>
                <SelectItem value="custom">+ Add Custom Product</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-blue-700 font-semibold">HSN Code</Label>
            <Input
              value={formData.hsnCode}
              onChange={(e) => setFormData({...formData, hsnCode: e.target.value})}
              placeholder="Enter HSN Code"
              className="bg-white border-blue-300"
            />
          </div>

          <div>
            <Label className="text-blue-700 font-semibold">Quantity *</Label>
            <Input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})}
              className="bg-white border-blue-300"
            />
          </div>

          <div>
            <Label className="text-blue-700 font-semibold">Unit</Label>
            <Select 
              value={formData.unit} 
              onValueChange={(value) => setFormData({...formData, unit: value})}
            >
              <SelectTrigger className="bg-white border-blue-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PCS">PCS</SelectItem>
                <SelectItem value="KG">KG</SelectItem>
                <SelectItem value="LTR">LTR</SelectItem>
                <SelectItem value="MTR">MTR</SelectItem>
                <SelectItem value="BOX">BOX</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-blue-700 font-semibold">Rate (₹) *</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.rate}
              onChange={(e) => setFormData({...formData, rate: Number(e.target.value)})}
              placeholder="0.00"
              className="bg-white border-blue-300"
            />
          </div>

          <div>
            <Label className="text-blue-700 font-semibold">GST %</Label>
            <Select 
              value={formData.gstPercent.toString()} 
              onValueChange={(value) => setFormData({...formData, gstPercent: Number(value)})}
            >
              <SelectTrigger className="bg-white border-blue-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0%</SelectItem>
                <SelectItem value="5">5%</SelectItem>
                <SelectItem value="12">12%</SelectItem>
                <SelectItem value="18">18%</SelectItem>
                <SelectItem value="28">28%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-blue-200">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            <Check className="h-4 w-4 mr-2" />
            Add Product Line
          </Button>
        </div>
      </form>
    </div>
  );
}
