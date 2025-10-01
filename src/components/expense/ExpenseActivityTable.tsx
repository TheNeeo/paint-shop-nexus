import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

interface Expense {
  id: number;
  date: string;
  type: string;
  amount: number;
  paymentMode: string;
  description: string;
  refNo: string;
}

interface ExpenseActivityTableProps {
  onEditExpense: (expense: Expense) => void;
}

export const ExpenseActivityTable = ({ onEditExpense }: ExpenseActivityTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data
  const expenses: Expense[] = [
    {
      id: 1,
      date: "2024-01-25",
      type: "Transport",
      amount: 850,
      paymentMode: "UPI",
      description: "Fuel for delivery truck",
      refNo: "TXN001"
    },
    {
      id: 2,
      date: "2024-01-24",
      type: "Utilities",
      amount: 2500,
      paymentMode: "Bank",
      description: "Electricity bill payment",
      refNo: "BILL202401"
    },
    {
      id: 3,
      date: "2024-01-23",
      type: "Office",
      amount: 1200,
      paymentMode: "Cash",
      description: "Office stationery purchase",
      refNo: "CASH001"
    },
    {
      id: 4,
      date: "2024-01-22",
      type: "Rent",
      amount: 8500,
      paymentMode: "Cheque",
      description: "Monthly office rent",
      refNo: "CHQ001"
    },
    {
      id: 5,
      date: "2024-01-21",
      type: "Marketing",
      amount: 3200,
      paymentMode: "UPI",
      description: "Social media advertising",
      refNo: "ADV001"
    }
  ];

  const totalPages = Math.ceil(expenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExpenses = expenses.slice(startIndex, endIndex);

  const getExpenseTypeBadge = (type: string) => {
    const colors = {
      "Transport": "bg-green-100 text-green-700",
      "Utilities": "bg-blue-100 text-blue-700", 
      "Office": "bg-purple-100 text-purple-700",
      "Rent": "bg-orange-100 text-orange-700",
      "Marketing": "bg-pink-100 text-pink-700",
      "Maintenance": "bg-coral-100 text-coral-700"
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-700";
  };

  const getPaymentModeBadge = (mode: string) => {
    const colors = {
      "UPI": "bg-green-100 text-green-700",
      "Bank": "bg-blue-100 text-blue-700",
      "Cash": "bg-coral-100 text-coral-700",
      "Cheque": "bg-purple-100 text-purple-700",
      "Card": "bg-pink-100 text-pink-700"
    };
    return colors[mode as keyof typeof colors] || "bg-gray-100 text-gray-700";
  };

  return (
    <Card className="bg-white border-green-200">
      <CardHeader>
        <CardTitle className="text-green-800">Expense Records</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-green-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-green-50">
                <TableHead className="text-green-700 font-semibold">S.No</TableHead>
                <TableHead className="text-green-700 font-semibold">Date</TableHead>
                <TableHead className="text-green-700 font-semibold">Expense Type</TableHead>
                <TableHead className="text-green-700 font-semibold">Amount</TableHead>
                <TableHead className="text-green-700 font-semibold">Payment Mode</TableHead>
                <TableHead className="text-green-700 font-semibold">Description</TableHead>
                <TableHead className="text-green-700 font-semibold">Ref/Bill No</TableHead>
                <TableHead className="text-green-700 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentExpenses.map((expense, index) => (
                <TableRow key={expense.id} className="hover:bg-green-25 transition-colors">
                  <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={getExpenseTypeBadge(expense.type)}>
                      {expense.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-green-700">₹{expense.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getPaymentModeBadge(expense.paymentMode)}>
                      {expense.paymentMode}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate" title={expense.description}>
                    {expense.description}
                  </TableCell>
                  <TableCell className="text-gray-600">{expense.refNo}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-green-600 hover:bg-green-50"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onEditExpense(expense)}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-green-600">
            Showing {startIndex + 1} to {Math.min(endIndex, expenses.length)} of {expenses.length} entries
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                  className={currentPage === i + 1 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "border-green-300 text-green-700 hover:bg-green-50"
                  }
                >
                  {i + 1}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};