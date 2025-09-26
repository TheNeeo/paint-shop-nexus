import React, { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, Save, Printer } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AddEditReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt?: any;
}

export function AddEditReceiptModal({ isOpen, onClose, receipt }: AddEditReceiptModalProps) {
  const [formData, setFormData] = useState({
    receiptDate: new Date(),
    payerName: "",
    reason: "",
    amount: "",
    paymentMode: "",
    notes: "",
    signatureFile: null as File | null,
  });

  useEffect(() => {
    if (receipt) {
      setFormData({
        receiptDate: new Date(receipt.date),
        payerName: receipt.payerName,
        reason: receipt.reason,
        amount: receipt.amount.toString(),
        paymentMode: receipt.paymentMode.toLowerCase().replace(" ", "_"),
        notes: receipt.notes || "",
        signatureFile: null,
      });
    } else {
      setFormData({
        receiptDate: new Date(),
        payerName: "",
        reason: "",
        amount: "",
        paymentMode: "",
        notes: "",
        signatureFile: null,
      });
    }
  }, [receipt, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Receipt data:", formData);
    onClose();
  };

  const handleSaveAndPrint = () => {
    console.log("Save and print receipt:", formData);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, signatureFile: file });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
        style={{ borderTop: "4px solid #7DBE3C" }}
      >
        <DialogHeader>
          <DialogTitle 
            className="text-xl font-bold"
            style={{ color: "#16583f" }}
          >
            {receipt ? "Edit Receipt" : "Add New Receipt"}
          </DialogTitle>
          <DialogDescription>
            Fill in the receipt details below. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Receipt Date */}
            <div className="space-y-2">
              <Label htmlFor="receiptDate">Receipt Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.receiptDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.receiptDate ? format(formData.receiptDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.receiptDate}
                    onSelect={(date) => date && setFormData({ ...formData, receiptDate: date })}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Payer Name */}
            <div className="space-y-2">
              <Label htmlFor="payerName">Payer Name *</Label>
              <Input
                id="payerName"
                value={formData.payerName}
                onChange={(e) => setFormData({ ...formData, payerName: e.target.value })}
                placeholder="Enter payer name"
                required
                className="focus:border-[#7DBE3C] focus:ring-[#7DBE3C]"
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="Enter amount"
                required
                className="focus:border-[#7DBE3C] focus:ring-[#7DBE3C]"
              />
            </div>

            {/* Payment Mode */}
            <div className="space-y-2">
              <Label htmlFor="paymentMode">Payment Mode *</Label>
              <Select
                value={formData.paymentMode}
                onValueChange={(value) => setFormData({ ...formData, paymentMode: value })}
                required
              >
                <SelectTrigger className="focus:border-[#7DBE3C] focus:ring-[#7DBE3C]">
                  <SelectValue placeholder="Select payment mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reason for Payment */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Payment *</Label>
            <Input
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Enter reason for payment"
              required
              className="focus:border-[#7DBE3C] focus:ring-[#7DBE3C]"
            />
          </div>

          {/* Notes / Remarks */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes / Remarks</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Enter any additional notes or remarks"
              rows={3}
              className="focus:border-[#7DBE3C] focus:ring-[#7DBE3C]"
            />
          </div>

          {/* Upload Signature / Stamp */}
          <div className="space-y-2">
            <Label htmlFor="signature">Upload Signature / Stamp (Optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="signature"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="focus:border-[#7DBE3C] focus:ring-[#7DBE3C]"
              />
              <Upload className="h-4 w-4 text-gray-400" />
            </div>
            {formData.signatureFile && (
              <p className="text-sm text-gray-600">
                Selected: {formData.signatureFile.name}
              </p>
            )}
          </div>

          <DialogFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveAndPrint}
              style={{ 
                backgroundColor: "#16583f",
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
                backgroundColor: "#7DBE3C",
                color: "white"
              }}
              className="hover:opacity-90"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Receipt
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}