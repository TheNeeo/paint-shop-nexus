import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Upload, FileText, X } from "lucide-react";

interface ExpenseReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: any;
}

export const ExpenseReportModal = ({ isOpen, onClose, expense }: ExpenseReportModalProps) => {
  if (!expense) return null;

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Rent": "bg-blue-100 text-blue-800",
      "Transport": "bg-green-100 text-green-800",
      "Utilities": "bg-yellow-100 text-yellow-800",
      "Marketing": "bg-purple-100 text-purple-800",
      "Office": "bg-gray-100 text-gray-800",
      "Food": "bg-orange-100 text-orange-800",
      "Travel": "bg-indigo-100 text-indigo-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getPaymentModeColor = (mode: string) => {
    const colors: { [key: string]: string } = {
      "Cash": "bg-emerald-100 text-emerald-800",
      "UPI": "bg-blue-100 text-blue-800",
      "Bank": "bg-purple-100 text-purple-800",
      "Card": "bg-pink-100 text-pink-800",
      "Cheque": "bg-amber-100 text-amber-800"
    };
    return colors[mode] || "bg-gray-100 text-gray-800";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-turquoise-200">
        <DialogHeader>
          <DialogTitle className="text-turquoise-800 text-xl flex items-center justify-between">
            Expense Details
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-turquoise-600 hover:text-turquoise-800 hover:bg-turquoise-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Expense Details Card */}
          <Card className="border-turquoise-200">
            <CardHeader className="bg-turquoise-50">
              <CardTitle className="text-turquoise-800 flex items-center justify-between">
                <span>{expense.title}</span>
                {expense.isHighExpense && (
                  <Badge className="bg-red-100 text-red-800">High Expense</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-turquoise-700">Date</label>
                  <p className="text-turquoise-900 font-semibold">
                    {new Date(expense.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-turquoise-700">Amount</label>
                  <p className="text-turquoise-900 font-bold text-lg">
                    ₹{expense.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-turquoise-700">Category</label>
                  <div className="mt-1">
                    <Badge className={getCategoryColor(expense.category)}>
                      {expense.category}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-turquoise-700">Payment Mode</label>
                  <div className="mt-1">
                    <Badge className={getPaymentModeColor(expense.paymentMode)}>
                      {expense.paymentMode}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-turquoise-700">Paid To</label>
                  <p className="text-turquoise-900">{expense.paidTo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-turquoise-700">Reference No.</label>
                  <p className="text-turquoise-900">{expense.referenceNo || 'N/A'}</p>
                </div>
              </div>
              
              <Separator className="bg-turquoise-200" />
              
              <div>
                <label className="text-sm font-medium text-turquoise-700">Description</label>
                <p className="text-turquoise-900 mt-1">{expense.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Attachments Section */}
          <Card className="border-turquoise-200">
            <CardHeader className="bg-turquoise-50">
              <CardTitle className="text-turquoise-800 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Attachments & Receipts
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="border-2 border-dashed border-turquoise-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-turquoise-400 mx-auto mb-2" />
                <p className="text-turquoise-600 mb-2">No receipts uploaded</p>
                <Button className="bg-turquoise-600 hover:bg-turquoise-700 text-white">
                  Upload Receipt
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-turquoise-300 text-turquoise-700 hover:bg-turquoise-50"
            >
              Close
            </Button>
            <Button className="bg-turquoise-600 hover:bg-turquoise-700 text-white">
              Edit Expense
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};