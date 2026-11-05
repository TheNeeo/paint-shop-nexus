import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, Save, X, Tag, FileText, IndianRupee, CreditCard, Hash, User, MessageSquare, Info, Receipt } from "lucide-react";
import { FormSectionHeader } from "@/components/shared/FormSectionHeader";
import { FormFieldLabel } from "@/components/shared/FormFieldLabel";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AddNewTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
}

type TransactionForm = {
  date: string;
  type: "" | "Expense" | "Receipt";
  expenseType: string;
  description: string;
  amount: string;
  paymentMode: string;
  invoiceNo: string;
  customerName: string;
  notes: string;
};

const createEmptyForm = (): TransactionForm => ({
  date: new Date().toISOString().slice(0, 10),
  type: "",
  expenseType: "other",
  description: "",
  amount: "",
  paymentMode: "",
  invoiceNo: "",
  customerName: "",
  notes: "",
});

const AddNewTransactionModal: React.FC<AddNewTransactionModalProps> = ({
  open,
  onOpenChange,
  onSaved,
}) => {
  const [formData, setFormData] = useState<TransactionForm>(createEmptyForm);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = Number(formData.amount);

    if (!formData.type || !Number.isFinite(amount) || amount <= 0 || !formData.paymentMode) {
      toast.error("Choose a transaction type, payment mode, and a positive amount.");
      return;
    }

    if (formData.type === "Receipt" && !formData.customerName.trim()) {
      toast.error("Enter who paid this receipt.");
      return;
    }

    setSaving(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error("Sign in before adding a transaction.");

      if (formData.type === "Receipt") {
        const noteParts = [
          formData.invoiceNo.trim() ? `Reference: ${formData.invoiceNo.trim()}` : "",
          formData.notes.trim(),
        ].filter(Boolean);
        const { error } = await supabase.from("cash_receipts").insert({
          receipt_no: `CR-${Date.now().toString().slice(-8)}`,
          receipt_date: formData.date,
          payer_name: formData.customerName.trim(),
          amount,
          payment_mode: formData.paymentMode,
          reason: formData.description.trim(),
          notes: noteParts.join("\n") || null,
          created_by_user_id: user.id,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.from("expenses").insert({
          date: formData.date,
          type: formData.expenseType,
          amount,
          payment_mode: formData.paymentMode,
          description: formData.description.trim(),
          ref_no: formData.invoiceNo.trim() || null,
          created_by_user_id: user.id,
        });
        if (error) throw error;
      }

      toast.success(`${formData.type} saved.`);
      onSaved?.();
      setFormData(createEmptyForm());
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save this transaction.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = <K extends keyof TransactionForm>(field: K, value: TransactionForm[K]) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setFormData(createEmptyForm());
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-coral-200 pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <div className="p-2 bg-coral-100 rounded-lg">
              <CalendarIcon className="h-5 w-5 text-rose-500" />
            </div>
            Add Cash Transaction
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Basic Information */}
          <Card className="border-coral-200/30">
            <CardContent className="p-4">
              <FormSectionHeader icon={Info} title="Basic Information" color="rose" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormFieldLabel icon={CalendarIcon} label="Date" htmlFor="transaction-date" required color="blue" />
                  <Input id="transaction-date" type="date" value={formData.date} onChange={(event) => handleChange("date", event.target.value)} required />
                </div>
                <div>
                  <FormFieldLabel icon={Tag} label="Transaction Type" required color="purple" />
                  <Select value={formData.type} onValueChange={(value) => handleChange("type", value as TransactionForm["type"])}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Receipt">Receipt / Money In</SelectItem>
                      <SelectItem value="Expense">Expense / Money Out</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.type === "Expense" && (
                  <div>
                    <FormFieldLabel icon={Tag} label="Expense Category" required color="amber" />
                    <Select value={formData.expenseType} onValueChange={(value) => handleChange("expenseType", value)}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rent">Rent</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                        <SelectItem value="office">Office Supplies</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Transaction Details */}
          <Card className="border-coral-200/30">
            <CardContent className="p-4">
              <FormSectionHeader icon={FileText} title="Transaction Details" color="emerald" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <FormFieldLabel icon={FileText} label="Description / Reason" htmlFor="transaction-description" required color="emerald" />
                  <Input id="transaction-description" value={formData.description} onChange={(event) => handleChange("description", event.target.value)} placeholder="What was this transaction for?" required />
                </div>
                <div>
                  <FormFieldLabel icon={IndianRupee} label="Amount (₹)" htmlFor="transaction-amount" required color="amber" />
                  <Input id="transaction-amount" type="number" value={formData.amount} onChange={(event) => handleChange("amount", event.target.value)} placeholder="0.00" step="0.01" min="0.01" required />
                </div>
                <div>
                  <FormFieldLabel icon={CreditCard} label="Payment Mode" required color="purple" />
                  <Select value={formData.paymentMode} onValueChange={(value) => handleChange("paymentMode", value)}>
                    <SelectTrigger><SelectValue placeholder="Select payment mode" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="border-coral-200/30">
            <CardContent className="p-4">
              <FormSectionHeader icon={Receipt} title="Additional Information" color="indigo" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.type === "Receipt" && (
                  <div>
                    <FormFieldLabel icon={User} label="Payer Name" htmlFor="payer-name" required color="blue" />
                    <Input id="payer-name" value={formData.customerName} onChange={(event) => handleChange("customerName", event.target.value)} placeholder="Who paid?" required />
                  </div>
                )}
                <div className={formData.type === "Receipt" ? "" : "md:col-span-2"}>
                  <FormFieldLabel icon={Hash} label="Reference / Bill Number" htmlFor="transaction-reference" color="indigo" />
                  <Input id="transaction-reference" value={formData.invoiceNo} onChange={(event) => handleChange("invoiceNo", event.target.value)} placeholder="Optional reference" />
                </div>
                <div className="md:col-span-2">
                  <FormFieldLabel icon={MessageSquare} label="Notes" htmlFor="transaction-notes" color="slate" />
                  <Textarea id="transaction-notes" value={formData.notes} onChange={(event) => handleChange("notes", event.target.value)} className="min-h-[80px]" placeholder="Optional notes" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-coral-200">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={saving}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="bg-coral-500 hover:bg-coral-600 text-white">
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Transaction"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewTransactionModal;
