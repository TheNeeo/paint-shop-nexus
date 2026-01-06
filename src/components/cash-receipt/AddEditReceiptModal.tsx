import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, Save, Printer } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import addCashReceiptIcon from "@/assets/add-cash-receipt-icon.png";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const THEME_PRIMARY = "#16583f";
const THEME_SECONDARY = "#7DBE3C";
const THEME_BG = "#dcfce7";
const THEME_BORDER = "#86efac";

// Validation schema
const receiptSchema = z.object({
  receiptDate: z.date({ message: "Receipt date is required" }),
  payerName: z
    .string()
    .trim()
    .min(1, "Payer name is required")
    .max(100, "Payer name must be less than 100 characters"),
  reason: z
    .string()
    .trim()
    .min(1, "Reason for payment is required")
    .max(200, "Reason must be less than 200 characters"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number",
    })
    .refine((val) => Number(val) <= 99999999.99, {
      message: "Amount must be less than ₹10 crores",
    }),
  paymentMode: z.string().min(1, "Payment mode is required"),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
});

type ReceiptFormValues = z.infer<typeof receiptSchema>;

interface AddEditReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt?: any;
}

export function AddEditReceiptModal({ isOpen, onClose, receipt }: AddEditReceiptModalProps) {
  const [signatureFile, setSignatureFile] = useState<File | null>(null);

  const form = useForm<ReceiptFormValues>({
    resolver: zodResolver(receiptSchema),
    defaultValues: {
      receiptDate: new Date(),
      payerName: "",
      reason: "",
      amount: "",
      paymentMode: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (receipt) {
      form.reset({
        receiptDate: new Date(receipt.date),
        payerName: receipt.payerName,
        reason: receipt.reason,
        amount: receipt.amount.toString(),
        paymentMode: receipt.paymentMode.toLowerCase().replace(" ", "_"),
        notes: receipt.notes || "",
      });
    } else {
      form.reset({
        receiptDate: new Date(),
        payerName: "",
        reason: "",
        amount: "",
        paymentMode: "",
        notes: "",
      });
    }
    setSignatureFile(null);
  }, [receipt, isOpen, form]);

  const onSubmit = (data: ReceiptFormValues) => {
    console.log("Receipt data:", { ...data, signatureFile });
    onClose();
  };

  const handleSaveAndPrint = () => {
    form.handleSubmit((data) => {
      console.log("Save and print receipt:", { ...data, signatureFile });
      onClose();
    })();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSignatureFile(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
        style={{ borderTop: `4px solid ${THEME_SECONDARY}` }}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <img 
              src={addCashReceiptIcon} 
              alt="Add Cash Receipt" 
              className="w-10 h-10 object-contain"
            />
            <div>
              <DialogTitle 
                className="text-xl font-bold"
                style={{ color: THEME_PRIMARY }}
              >
                {receipt ? "Edit Receipt" : "Add New Receipt"}
              </DialogTitle>
              <DialogDescription>
                Fill in the receipt details below. All fields marked with * are required.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Receipt Date */}
              <FormField
                control={form.control}
                name="receiptDate"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel style={{ color: THEME_PRIMARY }}>Receipt Date *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            style={{ borderColor: THEME_SECONDARY }}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" style={{ color: THEME_PRIMARY }} />
                            {field.value ? format(field.value, "PPP") : "Pick a date"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payer Name */}
              <FormField
                control={form.control}
                name="payerName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel style={{ color: THEME_PRIMARY }}>Payer Name *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter payer name"
                        style={{ borderColor: THEME_SECONDARY }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Amount */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel style={{ color: THEME_PRIMARY }}>Amount *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Enter amount"
                        style={{ borderColor: THEME_SECONDARY }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Mode */}
              <FormField
                control={form.control}
                name="paymentMode"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel style={{ color: THEME_PRIMARY }}>Payment Mode *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger style={{ borderColor: THEME_SECONDARY }}>
                          <SelectValue placeholder="Select payment mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Reason for Payment */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel style={{ color: THEME_PRIMARY }}>Reason for Payment *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter reason for payment"
                      style={{ borderColor: THEME_SECONDARY }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes / Remarks */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel style={{ color: THEME_PRIMARY }}>Notes / Remarks</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter any additional notes or remarks"
                      rows={3}
                      style={{ borderColor: THEME_SECONDARY }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Upload Signature / Stamp */}
            <div className="space-y-2">
              <FormLabel style={{ color: THEME_PRIMARY }}>Upload Signature / Stamp (Optional)</FormLabel>
              <div className="flex items-center gap-2">
                <Input
                  id="signature"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ borderColor: THEME_SECONDARY }}
                />
                <Upload className="h-4 w-4" style={{ color: THEME_PRIMARY }} />
              </div>
              {signatureFile && (
                <p className="text-sm" style={{ color: THEME_PRIMARY }}>
                  Selected: {signatureFile.name}
                </p>
              )}
            </div>

            <DialogFooter className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                style={{ borderColor: THEME_SECONDARY, color: THEME_PRIMARY }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveAndPrint}
                style={{ 
                  backgroundColor: THEME_PRIMARY,
                  color: "white"
                }}
                className="hover:opacity-90"
              >
                <Printer className="h-4 w-4 mr-2" />
                Save & Print
              </Button>
              <Button
                type="submit"
                style={{ 
                  backgroundColor: THEME_SECONDARY,
                  color: "white"
                }}
                className="hover:opacity-90"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Receipt
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}