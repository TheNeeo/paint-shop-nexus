import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, Save, X, Clock, Tag, FileText, IndianRupee, CreditCard, Hash, User, Package, Layers, MessageSquare, Info } from "lucide-react";
import { FormSectionHeader } from "@/components/shared/FormSectionHeader";
import { FormFieldLabel } from "@/components/shared/FormFieldLabel";

interface AddNewTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddNewTransactionModal: React.FC<AddNewTransactionModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    type: "",
    description: "",
    amount: "",
    paymentMode: "",
    invoiceNo: "",
    customerName: "",
    productName: "",
    unit: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Transaction Data:", formData);
    onOpenChange(false);
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      type: "",
      description: "",
      amount: "",
      paymentMode: "",
      invoiceNo: "",
      customerName: "",
      productName: "",
      unit: "",
      notes: "",
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-coral-200 pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <div className="p-2 bg-coral-100 rounded-lg">
              <CalendarIcon className="h-5 w-5" style={{ color: '#F56E75' }} />
            </div>
            Add New Transaction
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Basic Information */}
          <Card className="border-coral-200/30">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="date" className="text-gray-700 font-medium">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className="border-coral-200 focus:border-coral-400"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time" className="text-gray-700 font-medium">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleChange('time', e.target.value)}
                    className="border-coral-200 focus:border-coral-400"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type" className="text-gray-700 font-medium">Transaction Type</Label>
                  <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                    <SelectTrigger className="border-coral-200 focus:border-coral-400">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sale">Sale</SelectItem>
                      <SelectItem value="Purchase">Purchase</SelectItem>
                      <SelectItem value="Expense">Expense</SelectItem>
                      <SelectItem value="Receipt">Receipt</SelectItem>
                      <SelectItem value="Adjustment">Adjustment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Details */}
          <Card className="border-coral-200/30">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="description" className="text-gray-700 font-medium">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="border-coral-200 focus:border-coral-400"
                    placeholder="Transaction description"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="amount" className="text-gray-700 font-medium">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleChange('amount', e.target.value)}
                    className="border-coral-200 focus:border-coral-400"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="paymentMode" className="text-gray-700 font-medium">Payment Mode</Label>
                  <Select value={formData.paymentMode} onValueChange={(value) => handleChange('paymentMode', value)}>
                    <SelectTrigger className="border-coral-200 focus:border-coral-400">
                      <SelectValue placeholder="Select payment mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="Account Transfer">Account Transfer</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="border-coral-200/30">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoiceNo" className="text-gray-700 font-medium">Invoice/Bill Number</Label>
                  <Input
                    id="invoiceNo"
                    value={formData.invoiceNo}
                    onChange={(e) => handleChange('invoiceNo', e.target.value)}
                    className="border-coral-200 focus:border-coral-400"
                    placeholder="INV-001"
                  />
                </div>
                <div>
                  <Label htmlFor="customerName" className="text-gray-700 font-medium">Customer/Vendor Name</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => handleChange('customerName', e.target.value)}
                    className="border-coral-200 focus:border-coral-400"
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <Label htmlFor="productName" className="text-gray-700 font-medium">Product/Service</Label>
                  <Input
                    id="productName"
                    value={formData.productName}
                    onChange={(e) => handleChange('productName', e.target.value)}
                    className="border-coral-200 focus:border-coral-400"
                    placeholder="Product or service name"
                  />
                </div>
                <div>
                  <Label htmlFor="unit" className="text-gray-700 font-medium">Unit/Quantity</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => handleChange('unit', e.target.value)}
                    className="border-coral-200 focus:border-coral-400"
                    placeholder="e.g., 10L, 5 pieces"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="notes" className="text-gray-700 font-medium">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    className="border-coral-200 focus:border-coral-400 min-h-[80px]"
                    placeholder="Add any additional notes or remarks..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-coral-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-coral-200 text-coral-700 hover:bg-coral-50"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-coral-500 hover:bg-coral-600 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Transaction
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewTransactionModal;