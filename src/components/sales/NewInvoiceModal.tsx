
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
import { Switch } from "@/components/ui/switch";
import { Plus, Download, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductLineForm } from "./ProductLineForm";
import { NewProductModal } from "./NewProductModal";

interface NewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProductLine {
  id: string;
  productName: string;
  hsnCode: string;
  quantity: number;
  unit: string;
  rate: number;
  gstPercent: number;
  amount: number;
}

export function NewInvoiceModal({ isOpen, onClose }: NewInvoiceModalProps) {
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [customerName, setCustomerName] = useState("");
  const [productLines, setProductLines] = useState<ProductLine[]>([]);
  const [discount, setDiscount] = useState(0);
  const [isGstInclusive, setIsGstInclusive] = useState(false);
  const [paymentMode, setPaymentMode] = useState("");
  const [notes, setNotes] = useState("");
  const [paidAmount, setPaidAmount] = useState(0);
  const [showProductLineForm, setShowProductLineForm] = useState(false);
  const [showNewProductModal, setShowNewProductModal] = useState(false);

  const addProductLine = (productLine: ProductLine) => {
    setProductLines([...productLines, productLine]);
    setShowProductLineForm(false);
  };

  const removeProductLine = (id: string) => {
    setProductLines(productLines.filter(line => line.id !== id));
  };

  const handleNewProductCreated = (product: any) => {
    console.log("New product created:", product);
    // You can add logic here to refresh the product list or add the new product to invoice
  };

  const subtotal = productLines.reduce((sum, line) => {
    const baseAmount = line.quantity * line.rate;
    return sum + (isGstInclusive ? baseAmount : baseAmount);
  }, 0);

  const totalGst = productLines.reduce((sum, line) => {
    const baseAmount = line.quantity * line.rate;
    return sum + (baseAmount * line.gstPercent / 100);
  }, 0);

  const discountAmount = (subtotal * discount) / 100;
  const grandTotal = isGstInclusive ? subtotal - discountAmount : subtotal + totalGst - discountAmount;
  const pendingAmount = grandTotal - paidAmount;

  const handleSaveInvoice = () => {
    const invoiceData = {
      invoiceDate,
      customerName,
      productLines,
      subtotal,
      totalGst,
      discount,
      discountAmount,
      grandTotal,
      paidAmount,
      pendingAmount,
      paymentMode,
      isGstInclusive,
      notes,
    };
    
    console.log("Saving invoice...", invoiceData);
    onClose();
  };

  const handleSaveAndPrint = () => {
    handleSaveInvoice();
    console.log("Generating PDF...");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-black text-xl">Create New Invoice</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Invoice Header */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-black font-semibold">Invoice Date</Label>
                <Input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="bg-white border-gray-300"
                />
              </div>
              <div>
                <Label className="text-black font-semibold">Customer Name</Label>
                <Select value={customerName} onValueChange={setCustomerName}>
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder="Select or Add Customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="jane-smith">Jane Smith</SelectItem>
                    <SelectItem value="bob-johnson">Bob Johnson</SelectItem>
                    <SelectItem value="add-new">+ Add New Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Product Lines Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-black font-semibold text-lg">Product Details</Label>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setShowNewProductModal(true)} 
                    size="sm" 
                    variant="outline"
                    className="border-green-500 text-green-600 hover:bg-green-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Product
                  </Button>
                  <Button 
                    onClick={() => setShowProductLineForm(true)} 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product Line
                  </Button>
                </div>
              </div>

              {/* Show Product Line Form */}
              {showProductLineForm && (
                <ProductLineForm
                  onAddProduct={addProductLine}
                  onCancel={() => setShowProductLineForm(false)}
                />
              )}

              {/* Product Table Header */}
              {productLines.length > 0 && (
                <div className="grid grid-cols-12 gap-2 p-3 bg-gray-100 rounded-lg font-semibold text-sm text-gray-700">
                  <div className="col-span-2">Product Name</div>
                  <div className="col-span-1">HSN Code</div>
                  <div className="col-span-1">Qty</div>
                  <div className="col-span-1">Unit</div>
                  <div className="col-span-2">Rate (₹)</div>
                  <div className="col-span-1">GST %</div>
                  <div className="col-span-2">Amount (₹)</div>
                  <div className="col-span-1">Action</div>
                </div>
              )}

              {/* Product Lines */}
              {productLines.map((line) => (
                <div key={line.id} className="grid grid-cols-12 gap-2 p-3 border rounded-lg bg-green-50 border-green-200">
                  <div className="col-span-2 flex items-center">
                    <span className="text-sm font-medium">{line.productName}</span>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <span className="text-sm">{line.hsnCode}</span>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <span className="text-sm">{line.quantity}</span>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <span className="text-sm">{line.unit}</span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="text-sm">₹{line.rate.toFixed(2)}</span>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <span className="text-sm">{line.gstPercent}%</span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="text-sm font-semibold">₹{line.amount.toFixed(2)}</span>
                  </div>
                  <div className="col-span-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeProductLine(line.id)}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Tax Settings and Calculations */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div>
                    <Label className="text-black font-semibold">Tax Inclusive/Exclusive</Label>
                    <p className="text-sm text-gray-600">
                      {isGstInclusive ? "Prices include GST" : "GST will be added to prices"}
                    </p>
                  </div>
                  <Switch
                    checked={isGstInclusive}
                    onCheckedChange={setIsGstInclusive}
                  />
                </div>
                
                <div>
                  <Label className="text-black font-semibold">Discount (%)</Label>
                  <Input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="bg-white border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-3 bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800">Invoice Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  {!isGstInclusive && (
                    <div className="flex justify-between">
                      <span>GST:</span>
                      <span>₹{totalGst.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-green-300 pt-2">
                    <span>Grand Total:</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-black font-semibold">Payment Mode</Label>
                <Select value={paymentMode} onValueChange={setPaymentMode}>
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder="Select Payment Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="credit-card">Credit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-black font-semibold">Paid Amount</Label>
                <Input
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(Number(e.target.value))}
                  className="bg-white border-gray-300"
                />
              </div>
            </div>

            {pendingAmount > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                    Pending Amount: ₹{pendingAmount.toFixed(2)}
                  </Badge>
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <Label className="text-black font-semibold">Notes (Optional)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes, terms & conditions..."
                className="bg-white border-gray-300"
                rows={3}
              />
            </div>

            {/* Signature & Stamp Section */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <Label className="text-black font-semibold">Signature & Stamp</Label>
              <div className="mt-2 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
                <p>Signature and company stamp will be automatically added to PDF</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button variant="outline" onClick={onClose} className="border-gray-300 hover:bg-gray-50">
                Cancel
              </Button>
              <Button onClick={handleSaveInvoice} className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                Save Invoice
              </Button>
              <Button onClick={handleSaveAndPrint} className="bg-green-600 hover:bg-green-700">
                <Download className="h-4 w-4 mr-2" />
                Save & Download PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Product Modal */}
      <NewProductModal
        isOpen={showNewProductModal}
        onClose={() => setShowNewProductModal(false)}
        onProductCreated={handleNewProductCreated}
      />
    </>
  );
}
