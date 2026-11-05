
import React, { useState } from "react";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductLineForm, type InvoiceProductLine } from "./ProductLineForm";
import { AddProductModal } from "@/components/inventory/AddProductModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FormSectionHeader } from "@/components/shared/FormSectionHeader";
import { FormFieldLabel } from "@/components/shared/FormFieldLabel";
import { format } from "date-fns";

interface NewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewInvoiceModal({ isOpen, onClose }: NewInvoiceModalProps) {
  const queryClient = useQueryClient();
  const [invoiceDate, setInvoiceDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [customerId, setCustomerId] = useState("");
  const [productLines, setProductLines] = useState<InvoiceProductLine[]>([]);
  const [discount, setDiscount] = useState(0);
  const [isGstInclusive, setIsGstInclusive] = useState(false);
  const [paymentMode, setPaymentMode] = useState("");
  const [notes, setNotes] = useState("");
  const [paidAmount, setPaidAmount] = useState(0);
  const [showProductLineForm, setShowProductLineForm] = useState(false);
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data: customers = [], isLoading: customersLoading } = useQuery({
    queryKey: ["active-customers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("customers").select("id, name, status").eq("status", "active").order("name");
      if (error) throw error;
      return data || [];
    },
    enabled: isOpen,
  });
  const addProductLine = (productLine: InvoiceProductLine) => {
    setProductLines((current) => [...current, productLine]);
    setShowProductLineForm(false);
  };

  const removeProductLine = (id: string) => {
    setProductLines((current) => current.filter((line) => line.id !== id));
  };

  const subtotal = productLines.reduce((sum, line) => sum + line.amount, 0);
  const discountAmount = (subtotal * discount) / 100;
  const discountedSubtotal = subtotal - discountAmount;
  const discountFactor = subtotal > 0 ? discountedSubtotal / subtotal : 0;
  const totalGst = productLines.reduce((sum, line) => {
    const discountedLineAmount = line.amount * discountFactor;
    return sum + (isGstInclusive
      ? discountedLineAmount * line.gstPercent / (100 + line.gstPercent)
      : discountedLineAmount * line.gstPercent / 100);
  }, 0);
  const grandTotal = isGstInclusive ? discountedSubtotal : discountedSubtotal + totalGst;
  const pendingAmount = grandTotal - paidAmount;

  const handleSaveInvoice = async () => {
    if (!customerId) {
      toast.error("Select a customer or Walk-in Customer.");
      return;
    }
    if (productLines.length === 0) {
      toast.error("Add at least one inventory product.");
      return;
    }
    if (!Number.isFinite(discount) || discount < 0 || discount > 100) {
      toast.error("Discount must be between 0 and 100 percent.");
      return;
    }
    if (!Number.isFinite(paidAmount) || paidAmount < 0 || paidAmount > grandTotal) {
      toast.error("Paid amount must be between zero and the invoice total.");
      return;
    }

    setSaving(true);
    let saleId: string | null = null;
    const updatedStocks: Array<{ id: string; previousStock: number | null; nextStock: number }> = [];
    const adjustmentIds: string[] = [];

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error("Sign in before saving an invoice.");

      const productIds = Array.from(new Set(productLines.map((line) => line.productId)));
      const { data: selectedProducts, error: productError } = await supabase
        .from("products")
        .select("id, name, current_stock, is_variant, parent_product_id")
        .in("id", productIds);
      if (productError) throw productError;

      const productById = new Map((selectedProducts || []).map((product) => [product.id, product]));
      const stockDeltas = new Map<string, number>();
      for (const line of productLines) {
        const product = productById.get(line.productId);
        if (!product) throw new Error(`${line.productName} is no longer in inventory.`);
        stockDeltas.set(line.productId, (stockDeltas.get(line.productId) || 0) + line.quantity);
        if (product.is_variant && product.parent_product_id) {
          stockDeltas.set(product.parent_product_id, (stockDeltas.get(product.parent_product_id) || 0) + line.quantity);
        }
      }

      const parentIds = Array.from(stockDeltas.keys()).filter((id) => !productById.has(id));
      if (parentIds.length > 0) {
        const { data: parents, error: parentError } = await supabase
          .from("products")
          .select("id, name, current_stock, is_variant, parent_product_id")
          .in("id", parentIds);
        if (parentError) throw parentError;
        parents?.forEach((product) => productById.set(product.id, product));
      }

      for (const [productId, quantity] of stockDeltas) {
        const product = productById.get(productId);
        if (!product) throw new Error("An invoice product could not be checked against inventory.");
        const availableStock = Number(product.current_stock) || 0;
        if (quantity > availableStock) {
          throw new Error(`${product.name} has only ${availableStock} units available.`);
        }
      }

      const invoiceNumber = `INV-${invoiceDate.replaceAll("-", "")}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
      const paymentStatus = paidAmount >= grandTotal ? "paid" : paidAmount > 0 ? "partial" : "pending";
      const selectedCustomer = customerId === "walk-in" ? null : customers.find((customer) => customer.id === customerId);
      if (customerId !== "walk-in" && !selectedCustomer) throw new Error("The selected customer is no longer available.");

      const { data: sale, error: saleError } = await supabase
        .from("sales")
        .insert({
          invoice_number: invoiceNumber,
          invoice_date: invoiceDate,
          customer_id: selectedCustomer?.id || null,
          customer_name: selectedCustomer?.name || "Walk-in Customer",
          subtotal,
          tax_amount: totalGst,
          discount_amount: discountAmount,
          total_amount: grandTotal,
          paid_amount: paidAmount,
          pending_amount: pendingAmount,
          payment_mode: paymentMode || null,
          payment_status: paymentStatus,
          is_gst_inclusive: isGstInclusive,
          status: "final",
          notes: notes.trim() || null,
          created_by_user_id: user.id,
        })
        .select("id")
        .single();
      if (saleError) throw saleError;
      saleId = sale.id;

      const saleItems = productLines.map((line) => ({
        sale_id: sale.id,
        product_id: line.productId,
        product_name: line.productName,
        hsn_code: line.hsnCode || null,
        quantity: line.quantity,
        unit: line.unit,
        rate: line.rate,
        gst_percent: line.gstPercent,
        amount: line.amount,
      }));
      const { error: itemsError } = await supabase.from("sale_items").insert(saleItems);
      if (itemsError) throw itemsError;

      for (const [productId, quantity] of stockDeltas) {
        const product = productById.get(productId)!;
        const previousStock = product.current_stock;
        const currentStock = Number(previousStock) || 0;
        const nextStock = currentStock - quantity;
        const stockUpdate = previousStock === null
          ? await supabase.from("products").update({ current_stock: nextStock }).eq("id", productId).is("current_stock", null).select("id").maybeSingle()
          : await supabase.from("products").update({ current_stock: nextStock }).eq("id", productId).eq("current_stock", previousStock).select("id").maybeSingle();
        if (stockUpdate.error) throw stockUpdate.error;
        if (!stockUpdate.data) throw new Error(`Stock for ${product.name} changed while saving. Refresh and try again.`);
        updatedStocks.push({ id: productId, previousStock, nextStock });

        const { data: adjustment, error: adjustmentError } = await supabase
          .from("stock_adjustments")
          .insert({
            product_id: productId,
            quantity: -quantity,
            adjustment_type: "sale",
            reason: `Sale ${invoiceNumber}`,
            reference_id: sale.id,
            created_by_user_id: user.id,
          })
          .select("id")
          .single();
        if (adjustmentError) throw adjustmentError;
        adjustmentIds.push(adjustment.id);
      }

      if (selectedCustomer) {
        const { data: currentCustomer, error: customerError } = await supabase
          .from("customers")
          .select("total_sales, outstanding_balance")
          .eq("id", selectedCustomer.id)
          .single();
        if (customerError) throw customerError;
        const { error: customerUpdateError } = await supabase
          .from("customers")
          .update({
            total_sales: (Number(currentCustomer.total_sales) || 0) + grandTotal,
            outstanding_balance: (Number(currentCustomer.outstanding_balance) || 0) + pendingAmount,
          })
          .eq("id", selectedCustomer.id);
        if (customerUpdateError) throw customerUpdateError;
      }

      toast.success(`Invoice ${invoiceNumber} created.`);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["sales"] }),
        queryClient.invalidateQueries({ queryKey: ["finance-data"] }),
        queryClient.invalidateQueries({ queryKey: ["sales"] }),
        queryClient.invalidateQueries({ queryKey: ["products"] }),
        queryClient.invalidateQueries({ queryKey: ["active-customers"] }),
        queryClient.invalidateQueries({ queryKey: ["customers"] }),
      ]);
      resetForm();
      onClose();
    } catch (error) {
      let rollbackFailed = false;
      for (const update of updatedStocks.reverse()) {
        const { error: rollbackError } = await supabase
          .from("products")
          .update({ current_stock: update.previousStock })
          .eq("id", update.id)
          .eq("current_stock", update.nextStock);
        if (rollbackError) rollbackFailed = true;
      }
      if (adjustmentIds.length > 0) {
        const { error: adjustmentRollbackError } = await supabase.from("stock_adjustments").delete().in("id", adjustmentIds);
        if (adjustmentRollbackError) rollbackFailed = true;
      }
      if (saleId) {
        const { error: itemRollbackError } = await supabase.from("sale_items").delete().eq("sale_id", saleId);
        const { error: saleRollbackError } = await supabase.from("sales").delete().eq("id", saleId);
        if (itemRollbackError || saleRollbackError) rollbackFailed = true;
      }
      const message = error instanceof Error ? error.message : "Invoice could not be saved.";
      toast.error(rollbackFailed ? "Invoice save failed and automatic cleanup was incomplete. Check the invoice and stock before retrying." : message);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setProductLines([]);
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
                  <Select value={customerId} onValueChange={setCustomerId}>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder={customersLoading ? "Loading customers..." : "Select customer"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="walk-in">Walk-in Customer</SelectItem>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
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
                  <Button type="button" onClick={() => setShowNewProductModal(true)} size="sm" variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                    <Plus className="h-4 w-4 mr-2" /> New Product
                  </Button>
                  <Button type="button" onClick={() => setShowProductLineForm(true)} size="sm" className="bg-blue-600 hover:bg-blue-700">
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
                    <Input type="number" min="0" max="100" step="0.01" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="bg-white border-gray-300" />
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
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <FormFieldLabel icon={IndianRupee} label="Paid Amount" color="emerald" />
                  <Input type="number" min="0" max={grandTotal} step="0.01" value={paidAmount} onChange={(e) => setPaidAmount(Number(e.target.value))} className="bg-white border-gray-300" />
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

      <AddProductModal isOpen={showNewProductModal} onClose={() => setShowNewProductModal(false)} />
    </>
  );
}
