
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
import { Plus, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NewSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Product {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export function NewSaleModal({ isOpen, onClose }: NewSaleModalProps) {
  const [customer, setCustomer] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(18);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState("");
  const [notes, setNotes] = useState("");

  const addProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, field: keyof Product, value: any) => {
    setProducts(products.map(product => {
      if (product.id === id) {
        const updated = { ...product, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return product;
    }));
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const subtotal = products.reduce((sum, product) => sum + product.total, 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxAmount = ((subtotal - discountAmount) * tax) / 100;
  const grandTotal = subtotal - discountAmount + taxAmount;
  const pendingAmount = grandTotal - paidAmount;

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving sale...", {
      customer,
      products,
      subtotal,
      discount,
      tax,
      grandTotal,
      paidAmount,
      paymentMode,
      notes,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-black">New Sale</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Selection */}
          <div className="space-y-2">
            <Label className="text-black">Customer</Label>
            <Select value={customer} onValueChange={setCustomer}>
              <SelectTrigger>
                <SelectValue placeholder="Select Customer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="john-doe">John Doe</SelectItem>
                <SelectItem value="jane-smith">Jane Smith</SelectItem>
                <SelectItem value="bob-johnson">Bob Johnson</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-black">Products</Label>
              <Button onClick={addProduct} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            {products.map((product) => (
              <div key={product.id} className="grid grid-cols-12 gap-4 items-end p-4 border rounded-lg bg-gray-50">
                <div className="col-span-4">
                  <Label className="text-black">Product Name</Label>
                  <Select
                    value={product.name}
                    onValueChange={(value) => updateProduct(product.id, 'name', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paint-brush">Paint Brush Set</SelectItem>
                      <SelectItem value="wall-paint">Wall Paint</SelectItem>
                      <SelectItem value="roller-set">Roller Set</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label className="text-black">Quantity</Label>
                  <Input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => updateProduct(product.id, 'quantity', Number(e.target.value))}
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-black">Unit Price</Label>
                  <Input
                    type="number"
                    value={product.unitPrice}
                    onChange={(e) => updateProduct(product.id, 'unitPrice', Number(e.target.value))}
                  />
                </div>
                <div className="col-span-3">
                  <Label className="text-black">Total</Label>
                  <Input value={`₹${product.total}`} disabled />
                </div>
                <div className="col-span-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeProduct(product.id)}
                    className="text-red-600"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Calculations */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-black">Discount (%)</Label>
                  <Input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label className="text-black">Tax (%)</Label>
                  <Input
                    type="number"
                    value={tax}
                    onChange={(e) => setTax(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 bg-slate-100 p-4 rounded-lg border">
              <div className="flex justify-between text-black">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-black">
                <span>Discount:</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-black">
                <span>Tax:</span>
                <span>₹{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-black">
                <span>Grand Total:</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-black">Paid Amount</Label>
              <Input
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
              />
            </div>
            <div>
              <Label className="text-black">Payment Mode</Label>
              <Select value={paymentMode} onValueChange={setPaymentMode}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Payment Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="credit-card">Credit Card</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {pendingAmount > 0 && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-orange-100 text-orange-800">
                  Pending Amount: ₹{pendingAmount.toFixed(2)}
                </Badge>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <Label className="text-black">Notes (Optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Sale
            </Button>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              Save & Print Invoice
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
