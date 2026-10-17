import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Save, X, Calendar, IndianRupee, Tag, CreditCard, Hash, FileText, Receipt, StickyNote } from "lucide-react";
import addExpenseIcon from "@/assets/add-expense-icon.png";
import { FormSectionHeader } from "@/components/shared/FormSectionHeader";
import { FormFieldLabel } from "@/components/shared/FormFieldLabel";

const THEME = {
  primary: '#b5a34a',
  primaryLight: '#DDC57A',
  primaryLighter: '#eddda3',
  primaryLightest: '#faf6e6',
  border: '#DDC57A',
};

interface Expense {
  id?: number;
  date: string;
  type: string;
  amount: number;
  paymentMode: string;
  description: string;
  refNo: string;
}

interface AddEditExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense?: Expense | null;
}

export const AddEditExpenseModal = ({ open, onOpenChange, expense }: AddEditExpenseModalProps) => {
  const [formData, setFormData] = useState<Expense>({
    date: new Date().toISOString().split('T')[0],
    type: "",
    amount: 0,
    paymentMode: "",
    description: "",
    refNo: ""
  });

  const [showNewTypeForm, setShowNewTypeForm] = useState(false);
  const [newExpenseType, setNewExpenseType] = useState("");

  useEffect(() => {
    if (expense) {
      setFormData(expense);
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        type: "",
        amount: 0,
        paymentMode: "",
        description: "",
        refNo: ""
      });
    }
  }, [expense]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error("Not authenticated"); return; }

      const dbData = {
        date: formData.date,
        type: formData.type,
        amount: formData.amount,
        payment_mode: formData.paymentMode || null,
        description: formData.description || null,
        ref_no: formData.refNo || null,
        created_by_user_id: user.id,
      };

      if (expense?.id) {
        // For editing we'd need the real UUID, skipping for now
        toast.info("Edit not supported yet");
      } else {
        const { error } = await supabase.from('expenses').insert([dbData]);
        if (error) throw error;
        toast.success("Expense saved successfully!");
      }
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save expense");
    }
  };

  const handleAddNewType = () => {
    if (newExpenseType.trim()) {
      setFormData({ ...formData, type: newExpenseType });
      setNewExpenseType("");
      setShowNewTypeForm(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-2 z-[100]" style={{ borderColor: THEME.border }}>
        {/* Themed Header */}
        <div
          className="px-6 py-4 flex items-center gap-3"
          style={{ background: `linear-gradient(135deg, ${THEME.primaryLighter}, ${THEME.primaryLightest})` }}
        >
          <motion.img
            src={addExpenseIcon}
            alt="Add Expense"
            className="w-10 h-10 object-contain"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <DialogHeader className="p-0 space-y-0">
            <DialogTitle className="text-lg font-bold" style={{ color: THEME.primary }}>
              {expense ? "Edit Expense" : "Add New Expense"}
            </DialogTitle>
            <p className="text-sm" style={{ color: THEME.primary, opacity: 0.7 }}>
              {expense ? "Update expense details below" : "Fill in the details to add a new expense"}
            </p>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Section: Expense Information */}
            <div>
              <FormSectionHeader icon={Receipt} title="Expense Information" color="amber" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date */}
                <div className="space-y-1">
                  <FormFieldLabel icon={Calendar} label="Date" htmlFor="date" required color="amber" />
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="focus:ring-2"
                    style={{ borderColor: THEME.border, outlineColor: THEME.primaryLight }}
                    required
                  />
                </div>

                {/* Amount */}
                <div className="space-y-1">
                  <FormFieldLabel icon={IndianRupee} label="Amount (₹)" htmlFor="amount" required color="amber" />
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.amount || ""}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    style={{ borderColor: THEME.border }}
                    required
                  />
                </div>

                {/* Expense Type */}
                <div className="space-y-1">
                  <FormFieldLabel icon={Tag} label="Expense Type" required color="amber" />
                  {!showNewTypeForm ? (
                    <div className="flex gap-2">
                      <Select
                        value={formData.type}
                        onValueChange={(value) => {
                          if (value === "add-new") {
                            setShowNewTypeForm(true);
                          } else {
                            setFormData({ ...formData, type: value });
                          }
                        }}
                      >
                        <SelectTrigger style={{ borderColor: THEME.border }}>
                          <SelectValue placeholder="Select expense type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rent">Rent</SelectItem>
                          <SelectItem value="utilities">Utilities</SelectItem>
                          <SelectItem value="transport">Transport</SelectItem>
                          <SelectItem value="office">Office Supplies</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="add-new">
                            <span className="flex items-center" style={{ color: THEME.primary }}>
                              <Plus className="w-4 h-4 mr-2" />
                              Add New Type
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={newExpenseType}
                        onChange={(e) => setNewExpenseType(e.target.value)}
                        placeholder="Enter new expense type"
                        style={{ borderColor: THEME.border }}
                      />
                      <Button
                        type="button"
                        onClick={handleAddNewType}
                        className="text-white"
                        style={{ backgroundColor: THEME.primary }}
                      >
                        Add
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowNewTypeForm(false)}
                        style={{ borderColor: THEME.border, color: THEME.primary }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Payment Mode */}
                <div className="space-y-1">
                  <FormFieldLabel icon={CreditCard} label="Payment Mode" color="amber" />
                  <Select
                    value={formData.paymentMode}
                    onValueChange={(value) => setFormData({ ...formData, paymentMode: value })}
                  >
                    <SelectTrigger style={{ borderColor: THEME.border }}>
                      <SelectValue placeholder="Select payment mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Section: Additional Info */}
            <div>
              <FormSectionHeader icon={FileText} title="Additional Details" color="orange" />
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <FormFieldLabel icon={Hash} label="Reference / Bill Number" htmlFor="refNo" color="orange" />
                  <Input
                    id="refNo"
                    value={formData.refNo}
                    onChange={(e) => setFormData({ ...formData, refNo: e.target.value })}
                    placeholder="Enter reference or bill number"
                    style={{ borderColor: THEME.border }}
                  />
                </div>

                <div className="space-y-1">
                  <FormFieldLabel icon={StickyNote} label="Notes / Description" htmlFor="description" required color="orange" />
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter detailed description of the expense"
                    className="min-h-[100px]"
                    style={{ borderColor: THEME.border }}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-4" style={{ borderTopWidth: 1, borderColor: THEME.border }}>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                style={{ borderColor: THEME.border, color: THEME.primary }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="text-white"
                style={{ backgroundColor: THEME.primary }}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Expense
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
