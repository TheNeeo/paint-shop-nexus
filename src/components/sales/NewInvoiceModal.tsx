
import React, { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Download, Save, FileText, Calendar, User, Package, Receipt, Wallet, CreditCard, IndianRupee, Percent, ToggleLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductLineForm } from "./ProductLineForm";
import { NewProductModal } from "./NewProductModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FormSectionHeader } from "@/components/shared/FormSectionHeader";
import { FormFieldLabel } from "@/components/shared/FormFieldLabel";

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
  const [customerId, setCustomerId] = useState("");
  const [productLines, setProductLines] = useState<ProductLine[]>([]);
  const [discount, setDiscount] = useState(0);
  const [isGstInclusive, setIsGstInclusive] = useState(false);
  const [paymentMode, setPaymentMode] = useState("");
  const [notes, setNotes] = useState("");
  const [paidAmount, setPaidAmount] = useState(0);
  const [showProductLineForm, setShowProductLineForm] = useState(false);
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      supabase.from('customers').select('id, name').eq('status', 'active').order('name')
        .then(({ data }) => setCustomers(data || []));
    }
  }, [isOpen]);

  const addProductLine = (productLine: ProductLine) => {
    setProductLines([...productLines, productLine]);
    setShowProductLineForm(false);
  };

  const removeProductLine = (id: string) => {
    setProductLines(productLines.filter(line => line.id !== id));
  };

  const handleNewProductCreated = (product: any) => {
    console.log("New product created:", product);
  };

  const subtotal = productLines.reduce((sum, line) => sum + (line.quantity * line.rate), 0);
  const totalGst = productLines.reduce((sum, line) => sum + (line.quantity * line.rate * line.gstPercent / 100), 0);
  const discountAmount = (subtotal * discount) / 100;
  const grandTotal = isGstInclusive ? subtotal - discountAmount : subtotal + totalGst - discountAmount;
  const pendingAmount = grandTotal - paidAmount;

  const handleSaveInvoice = async () => {
    if (!customerName && !customerId) {
      toast.error("Please select a customer");
      return;
    }
    if (productLines.length === 0) {
      toast.error("Please add at least one product");
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;
      const paymentStatus = paidAmount >= grandTotal ? 'paid' : paidAmount > 0 ? 'partial' : 'pending';

      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert([{
          invoice_number: invoiceNumber,
          invoice_date: invoiceDate,
          customer_id: customerId || null,
          customer_name: customers.find(c => c.id === customerId)?.name || customerName,
          subtotal,
          tax_amount: totalGst,
          discount_amount: discountAmount,
          total_amount: grandTotal,
          paid_amount: paidAmount,
          pending_amount: pendingAmount,
          payment_mode: paymentMode || null,
          payment_status: paymentStatus,
          is_gst_inclusive: isGstInclusive,
          notes: notes || null,
          created_by_user_id: user.id,
        }])
        .select()
        .single();

      if (saleError) throw saleError;

      // Insert sale items
      const saleItems = productLines.map(line => ({
        sale_id: sale!.id,
        product_name: line.productName,
        hsn_code: line.hsnCode,
        quantity: line.quantity,
        unit: line.unit,
        rate: line.rate,
        gst_percent: line.gstPercent,
        amount: line.amount,
      }));

      const { error: itemsError } = await supabase.from('sale_items').insert(saleItems);
      if (itemsError) throw itemsError;

      // Decrease inventory stock for each product sold
      for (const line of productLines) {
        const { data: product } = await supabase
          .from('products')
          .select('id, current_stock')
          .eq('name', line.productName)
          .maybeSingle();

        if (product) {
          await supabase.from('products')
            .update({ current_stock: Math.max(0, Number(product.current_stock) - line.quantity) })
            .eq('id', product.id);
        }
      }

      // Update customer total_sales
      if (customerId) {
        const { data: cust } = await supabase.from('customers').select('total_sales').eq('id', customerId).single();
        if (cust) {
          await supabase.from('customers').update({ total_sales: Number(cust.total_sales) + grandTotal }).eq('id', customerId);
        }
      }

      toast.success(`Invoice ${invoiceNumber} created successfully!`);
      onClose();
      resetForm();
    } catch (err: any) {
      console.error("Error saving invoice:", err);
      toast.error(err.message || "Failed to save invoice");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setProductLines([]);
    setCustomerName("");
    setCustomerId("");
    setDiscount(0);
    setPaidAmount(0);
    setPaymentMode("");
    setNotes("");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Receipt className="h-5 w-5 text-blue-600" /> Create New Invoice
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <FormSectionHeader icon={FileText} title="Invoice Details" color="blue" />
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <FormFieldLabel icon={Calendar} label="Invoice Date" required color="blue" />
                  <Input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="bg-white border-gray-300" />
                </div>
                <div>
                  <FormFieldLabel icon={User} label="Customer Name" required color="emerald" />
                  <Select value={customerId} onValueChange={(val) => { setCustomerId(val); setCustomerName(''); }}>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder="Select Customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <FormSectionHeader icon={Package} title="Product Details" color="emerald" />
                <div className="flex gap-2">
                  <Button onClick={() => setShowNewProductModal(true)} size="sm" variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                    <Plus className="h-4 w-4 mr-2" /> New Product
                  </Button>
                  <Button onClick={() => setShowProductLineForm(true)} size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" /> Add Product Line
                  </Button>
                </div>
              </div>

              {showProductLineForm && (
                <ProductLineForm onAddProduct={addProductLine} onCancel={() => setShowProductLineForm(false)} />
              )}

              {productLines.length > 0 && (
                <div className="grid grid-cols-12 gap-2 p-3 bg-gray-100 rounded-lg font-semibold text-sm text-gray-700">
                  <div className="col-span-3">Product Name</div>
                  <div className="col-span-1">HSN</div>
                  <div className="col-span-1">Qty</div>
                  <div className="col-span-1">Unit</div>
                  <div className="col-span-2">Rate (₹)</div>
                  <div className="col-span-1">GST %</div>
                  <div className="col-span-2">Amount (₹)</div>
                  <div className="col-span-1">Action</div>
                </div>
              )}

              {productLines.map((line) => (
                <div key={line.id} className="grid grid-cols-12 gap-2 p-3 border rounded-lg bg-green-50 border-green-200">
                  <div className="col-span-3 flex items-center"><span className="text-sm font-medium">{line.productName}</span></div>
                  <div className="col-span-1 flex items-center"><span className="text-sm">{line.hsnCode}</span></div>
                  <div className="col-span-1 flex items-center"><span className="text-sm">{line.quantity}</span></div>
                  <div className="col-span-1 flex items-center"><span className="text-sm">{line.unit}</span></div>
                  <div className="col-span-2 flex items-center"><span className="text-sm">₹{line.rate.toFixed(2)}</span></div>
                  <div className="col-span-1 flex items-center"><span className="text-sm">{line.gstPercent}%</span></div>
                  <div className="col-span-2 flex items-center"><span className="text-sm font-semibold">₹{line.amount.toFixed(2)}</span></div>
                  <div className="col-span-1">
                    <Button variant="outline" size="sm" onClick={() => removeProductLine(line.id)} className="text-red-600 border-red-300 hover:bg-red-50">Remove</Button>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <FormSectionHeader icon={Receipt} title="Tax & Discount" color="amber" />
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 border rounded-lg">
                    <div>
                      <FormFieldLabel icon={ToggleLeft} label="Tax Inclusive/Exclusive" color="amber" />
                      <p className="text-sm text-gray-600">{isGstInclusive ? "Prices include GST" : "GST added to prices"}</p>
                    </div>
                    <Switch checked={isGstInclusive} onCheckedChange={setIsGstInclusive} />
                  </div>
                  <div>
                    <FormFieldLabel icon={Percent} label="Discount (%)" color="orange" />
                    <Input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="bg-white border-gray-300" />
                  </div>
                </div>
                <div className="space-y-3 bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800">Invoice Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span></div>
                    {!isGstInclusive && <div className="flex justify-between"><span>GST:</span><span>₹{totalGst.toFixed(2)}</span></div>}
                    <div className="flex justify-between"><span>Discount:</span><span>-₹{discountAmount.toFixed(2)}</span></div>
                    <div className="flex justify-between font-bold text-lg border-t border-green-300 pt-2"><span>Grand Total:</span><span>₹{grandTotal.toFixed(2)}</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <FormSectionHeader icon={Wallet} title="Payment Information" color="purple" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormFieldLabel icon={CreditCard} label="Payment Mode" color="purple" />
                  <Select value={paymentMode} onValueChange={setPaymentMode}>
                    <SelectTrigger className="bg-white border-gray-300"><SelectValue placeholder="Select Payment Mode" /></SelectTrigger>
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
                  <FormFieldLabel icon={IndianRupee} label="Paid Amount" color="emerald" />
                  <Input type="number" value={paidAmount} onChange={(e) => setPaidAmount(Number(e.target.value))} className="bg-white border-gray-300" />
                </div>
              </div>
            </div>

            {pendingAmount > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Pending: ₹{pendingAmount.toFixed(2)}</Badge>
              </div>
            )}

            <div>
              <FormFieldLabel icon={FileText} label="Notes (Optional)" color="slate" />
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes..." className="bg-white border-gray-300" rows={3} />
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button variant="outline" onClick={onClose} className="border-gray-300 hover:bg-gray-50">Cancel</Button>
              <Button onClick={handleSaveInvoice} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save Invoice'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <NewProductModal isOpen={showNewProductModal} onClose={() => setShowNewProductModal(false)} onProductCreated={handleNewProductCreated} />
    </>
  );
}
