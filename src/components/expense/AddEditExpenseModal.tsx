import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Save } from "lucide-react";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle save logic here
    console.log("Saving expense:", formData);
    onOpenChange(false);
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-green-800">
            {expense ? "Edit Expense" : "Add New Expense"}
          </DialogTitle>
        </DialogHeader>

        <Card className="border-green-200">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-green-700">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-green-700">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.amount || ""}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>

                {/* Expense Type */}
                <div className="space-y-2">
                  <Label className="text-green-700">Expense Type</Label>
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
                        <SelectTrigger className="border-green-300 focus:border-green-500 focus:ring-green-500">
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
                            <div className="flex items-center text-green-600">
                              <Plus className="w-4 h-4 mr-2" />
                              Add New Type
                            </div>
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
                        className="border-green-300 focus:border-green-500 focus:ring-green-500"
                      />
                      <Button 
                        type="button"
                        onClick={handleAddNewType}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Add
                      </Button>
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setShowNewTypeForm(false)}
                        className="border-green-300 text-green-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                {/* Payment Mode */}
                <div className="space-y-2">
                  <Label className="text-green-700">Payment Mode</Label>
                  <Select 
                    value={formData.paymentMode} 
                    onValueChange={(value) => setFormData({ ...formData, paymentMode: value })}
                  >
                    <SelectTrigger className="border-green-300 focus:border-green-500 focus:ring-green-500">
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

                {/* Reference/Bill Number */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="refNo" className="text-green-700">Reference / Bill Number</Label>
                  <Input
                    id="refNo"
                    value={formData.refNo}
                    onChange={(e) => setFormData({ ...formData, refNo: e.target.value })}
                    placeholder="Enter reference or bill number"
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description" className="text-green-700">Notes / Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter detailed description of the expense"
                    className="border-green-300 focus:border-green-500 focus:ring-green-500 min-h-[100px]"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4 border-t border-green-200">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Expense
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};