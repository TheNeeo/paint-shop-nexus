
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus, Trash, ShoppingCart, User, Package, Hash, IndianRupee, Calculator,
  Percent, Receipt, Wallet, CreditCard, FileText, Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FormSectionHeader } from "@/components/shared/FormSectionHeader";
import { FormFieldLabel } from "@/components/shared/FormFieldLabel";

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
    setProducts([...products, { id: Date.now().toString(), name: "", quantity: 1, unitPrice: 0, total: 0 }]);
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

  const removeProduct = (id: string) => setProducts(products.filter(p => p.id !== id));

  const subtotal = products.reduce((sum, product) => sum + product.total, 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxAmount = ((subtotal - discountAmount) * tax) / 100;
  const grandTotal = subtotal - discountAmount + taxAmount;
  const pendingAmount = grandTotal - paidAmount;

  const handleSave = () => {
    console.log("Saving sale...", { customer, products, subtotal, discount, tax, grandTotal, paidAmount, paymentMode, notes });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ShoppingCart className="h-5 w-5 text-blue-600" /> New Sale
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer */}
          <div>
            <FormSectionHeader icon={User} title="Customer Information" color="blue" />
            <div className="space-y-2">
              <FormFieldLabel icon={User} label="Customer" required color="blue" />
              <Select value={customer} onValueChange={setCustomer}>
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue placeholder="Select Customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john-doe">John Doe</SelectItem>
                  <SelectItem value="jane-smith">Jane Smith</SelectItem>
                  <SelectItem value="bob-johnson">Bob Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products */}
          <div>
            <div className="flex justify-between items-center">
              <FormSectionHeader icon={Package} title="Products" color="emerald" />
              <Button onClick={addProduct} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" /> Add Product
              </Button>
            </div>

            <div className="space-y-3">
              {products.map((product) => (
                <div key={product.id} className="grid grid-cols-12 gap-4 items-end p-4 border rounded-lg bg-blue-50 border-blue-200">
                  <div className="col-span-4">
                    <FormFieldLabel icon={Package} label="Product Name" required color="blue" />
                    <Select value={product.name} onValueChange={(value) => updateProduct(product.id, 'name', value)}>
                      <SelectTrigger className="bg-white border-gray-300">
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
                    <FormFieldLabel icon={Hash} label="Quantity" required color="emerald" />
                    <Input type="number" value={product.quantity}
                      onChange={(e) => updateProduct(product.id, 'quantity', Number(e.target.value))}
                      className="bg-white border-gray-300" />
                  </div>
                  <div className="col-span-2">
                    <FormFieldLabel icon={IndianRupee} label="Unit Price" required color="amber" />
                    <Input type="number" value={product.unitPrice}
                      onChange={(e) => updateProduct(product.id, 'unitPrice', Number(e.target.value))}
                      className="bg-white border-gray-300" />
                  </div>
                  <div className="col-span-3">
                    <FormFieldLabel icon={Calculator} label="Total" color="purple" />
                    <Input value={`₹${product.total}`} disabled className="bg-gray-100 border-gray-300" />
                  </div>
                  <div className="col-span-1">
                    <Button variant="outline" size="sm" onClick={() => removeProduct(product.id)} className="text-red-600 border-red-300 hover:bg-red-50">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calculations */}
          <div>
            <FormSectionHeader icon={Calculator} title="Calculations & Summary" color="amber" />
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FormFieldLabel icon={Percent} label="Discount (%)" color="orange" />
                    <Input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="bg-white border-gray-300" />
                  </div>
                  <div>
                    <FormFieldLabel icon={Receipt} label="Tax (%)" color="amber" />
                    <Input type="number" value={tax} onChange={(e) => setTax(Number(e.target.value))} className="bg-white border-gray-300" />
                  </div>
                </div>
              </div>

              <div className="space-y-2 bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex justify-between font-medium"><span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between font-medium"><span>Discount:</span><span>-₹{discountAmount.toFixed(2)}</span></div>
                <div className="flex justify-between font-medium"><span>Tax:</span><span>₹{taxAmount.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-lg border-t border-green-300 pt-2"><span>Grand Total:</span><span>₹{grandTotal.toFixed(2)}</span></div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div>
            <FormSectionHeader icon={Wallet} title="Payment Information" color="purple" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormFieldLabel icon={IndianRupee} label="Paid Amount" color="emerald" />
                <Input type="number" value={paidAmount} onChange={(e) => setPaidAmount(Number(e.target.value))} className="bg-white border-gray-300" />
              </div>
              <div>
                <FormFieldLabel icon={CreditCard} label="Payment Mode" color="purple" />
                <Select value={paymentMode} onValueChange={setPaymentMode}>
                  <SelectTrigger className="bg-white border-gray-300">
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
          </div>

          {pendingAmount > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                Pending Amount: ₹{pendingAmount.toFixed(2)}
              </Badge>
            </div>
          )}

          <div>
            <FormFieldLabel icon={FileText} label="Notes (Optional)" color="slate" />
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add any additional notes..." className="bg-white border-gray-300" />
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">Save Sale</Button>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">Save & Print Invoice</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
