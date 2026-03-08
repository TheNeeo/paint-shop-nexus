import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Save, Printer } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import addCashReceiptIcon from "@/assets/add-cash-receipt-icon.png";

const THEME_PRIMARY = "#16583f";
const THEME_SECONDARY = "#7DBE3C";

const receiptSchema = z.object({
  receiptDate: z.date({ message: "Receipt date is required" }),
  payerName: z.string().trim().min(1, "Payer name is required").max(100),
  reason: z.string().trim().min(1, "Reason is required").max(200),
  amount: z.string().min(1, "Amount is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Must be positive" }),
  paymentMode: z.string().min(1, "Payment mode is required"),
  notes: z.string().max(500).optional(),
});

type ReceiptFormValues = z.infer<typeof receiptSchema>;

interface AddEditReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt?: any;
}

export function AddEditReceiptModal({ isOpen, onClose, receipt }: AddEditReceiptModalProps) {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

  const form = useForm<ReceiptFormValues>({
    resolver: zodResolver(receiptSchema),
    defaultValues: { receiptDate: new Date(), payerName: "", reason: "", amount: "", paymentMode: "", notes: "" },
  });

  useEffect(() => {
    if (receipt) {
      form.reset({
        receiptDate: new Date(receipt.receipt_date),
        payerName: receipt.payer_name,
        reason: receipt.reason || "",
        amount: String(receipt.amount),
        paymentMode: receipt.payment_mode,
        notes: receipt.notes || "",
      });
    } else {
      form.reset({ receiptDate: new Date(), payerName: "", reason: "", amount: "", paymentMode: "", notes: "" });
    }
  }, [receipt, isOpen, form]);

  const onSubmit = async (data: ReceiptFormValues) => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const payload = {
        receipt_date: format(data.receiptDate, "yyyy-MM-dd"),
        payer_name: data.payerName,
        reason: data.reason,
        amount: Number(data.amount),
        payment_mode: data.paymentMode,
        notes: data.notes || null,
        created_by_user_id: user.id,
      };

      if (receipt) {
        const { error } = await supabase.from("cash_receipts").update(payload).eq("id", receipt.id);
        if (error) throw error;
        toast.success("Receipt updated!");
      } else {
        const receiptNo = `CR-${Date.now().toString().slice(-8)}`;
        const { error } = await supabase.from("cash_receipts").insert({ ...payload, receipt_no: receiptNo });
        if (error) throw error;
        toast.success(`Receipt ${receiptNo} created!`);
      }

      queryClient.invalidateQueries({ queryKey: ["cash-receipts"] });
      queryClient.invalidateQueries({ queryKey: ["cash-receipt-stats"] });
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" style={{ borderTop: `4px solid ${THEME_SECONDARY}` }}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <img src={addCashReceiptIcon} alt="Cash Receipt" className="w-10 h-10 object-contain" />
            <div>
              <DialogTitle className="text-xl font-bold" style={{ color: THEME_PRIMARY }}>{receipt ? "Edit Receipt" : "Add New Receipt"}</DialogTitle>
              <DialogDescription>Fill in the receipt details below.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="receiptDate" render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel style={{ color: THEME_PRIMARY }}>Receipt Date *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")} style={{ borderColor: THEME_SECONDARY }}>
                          <CalendarIcon className="mr-2 h-4 w-4" style={{ color: THEME_PRIMARY }} />
                          {field.value ? format(field.value, "PPP") : "Pick a date"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus className="pointer-events-auto" /></PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="payerName" render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel style={{ color: THEME_PRIMARY }}>Payer Name *</FormLabel>
                  <FormControl><Input {...field} placeholder="Enter payer name" style={{ borderColor: THEME_SECONDARY }} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="amount" render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel style={{ color: THEME_PRIMARY }}>Amount *</FormLabel>
                  <FormControl><Input {...field} type="number" placeholder="Enter amount" style={{ borderColor: THEME_SECONDARY }} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="paymentMode" render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel style={{ color: THEME_PRIMARY }}>Payment Mode *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger style={{ borderColor: THEME_SECONDARY }}><SelectValue placeholder="Select payment mode" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="reason" render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel style={{ color: THEME_PRIMARY }}>Reason for Payment *</FormLabel>
                <FormControl><Input {...field} placeholder="Enter reason" style={{ borderColor: THEME_SECONDARY }} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel style={{ color: THEME_PRIMARY }}>Notes / Remarks</FormLabel>
                <FormControl><Textarea {...field} placeholder="Additional notes..." rows={3} style={{ borderColor: THEME_SECONDARY }} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <DialogFooter className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose} style={{ borderColor: THEME_SECONDARY, color: THEME_PRIMARY }}>Cancel</Button>
              <Button type="submit" disabled={saving} style={{ backgroundColor: THEME_SECONDARY, color: "white" }} className="hover:opacity-90">
                <Save className="h-4 w-4 mr-2" /> {saving ? "Saving..." : "Save Receipt"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
