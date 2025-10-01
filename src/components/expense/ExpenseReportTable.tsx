import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, Edit, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";

interface ExpenseReportTableProps {
  onViewExpense: (expense: any) => void;
}

export const ExpenseReportTable = ({ onViewExpense }: ExpenseReportTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  // Sample expense data
  const expenses = [
    {
      id: 1,
      date: "2024-01-15",
      title: "Office Rent",
      category: "Rent",
      description: "Monthly office space rental",
      amount: 25000,
      paymentMode: "Bank",
      paidTo: "Property Owner",
      referenceNo: "TXN123456",
      isHighExpense: true
    },
    {
      id: 2,
      date: "2024-01-14",
      title: "Fuel Expenses",
      category: "Transport",
      description: "Vehicle fuel for delivery",
      amount: 3500,
      paymentMode: "Cash",
      paidTo: "Petrol Pump",
      referenceNo: "",
      isHighExpense: false
    },
    {
      id: 3,
      date: "2024-01-13",
      title: "Internet Bill",
      category: "Utilities",
      description: "Monthly broadband charges",
      amount: 1200,
      paymentMode: "UPI",
      paidTo: "ISP Provider",
      referenceNo: "UPI789012",
      isHighExpense: false
    },
    {
      id: 4,
      date: "2024-01-12",
      title: "Marketing Campaign",
      category: "Marketing",
      description: "Social media advertising",
      amount: 15000,
      paymentMode: "Card",
      paidTo: "Ad Agency",
      referenceNo: "CARD345678",
      isHighExpense: true
    },
    {
      id: 5,
      date: "2024-01-11",
      title: "Office Supplies",
      category: "Office",
      description: "Stationery and supplies",
      amount: 2800,
      paymentMode: "Cash",
      paidTo: "Stationery Shop",
      referenceNo: "",
      isHighExpense: false
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Rent": "bg-blue-100 text-blue-800",
      "Transport": "bg-green-100 text-green-800",
      "Utilities": "bg-coral-100 text-coral-800",
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
      "Cheque": "bg-coral-100 text-coral-800"
    };
    return colors[mode] || "bg-gray-100 text-gray-800";
  };

  const filteredExpenses = expenses.filter(expense =>
    expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExpenses = filteredExpenses.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Card className="p-6 bg-white border-turquoise-200">
      {/* Inline Table Search */}
      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-turquoise-400 h-4 w-4" />
          <Input
            placeholder="Search in table..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-turquoise-300 focus:border-turquoise-500 focus:ring-turquoise-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-turquoise-50 hover:bg-turquoise-50">
              <TableHead className="text-turquoise-700 font-semibold">S.No</TableHead>
              <TableHead className="text-turquoise-700 font-semibold">Date</TableHead>
              <TableHead className="text-turquoise-700 font-semibold">Expense Title</TableHead>
              <TableHead className="text-turquoise-700 font-semibold">Category</TableHead>
              <TableHead className="text-turquoise-700 font-semibold">Description</TableHead>
              <TableHead className="text-turquoise-700 font-semibold">Amount</TableHead>
              <TableHead className="text-turquoise-700 font-semibold">Payment Mode</TableHead>
              <TableHead className="text-turquoise-700 font-semibold">Paid To</TableHead>
              <TableHead className="text-turquoise-700 font-semibold">Reference No.</TableHead>
              <TableHead className="text-turquoise-700 font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedExpenses.map((expense, index) => (
              <TableRow 
                key={expense.id} 
                className={`hover:bg-turquoise-50 ${
                  expense.isHighExpense ? 'bg-red-50 hover:bg-red-100' : ''
                }`}
              >
                <TableCell className="font-medium text-turquoise-900">
                  {startIndex + index + 1}
                </TableCell>
                <TableCell className="text-turquoise-800">
                  {new Date(expense.date).toLocaleDateString()}
                </TableCell>
                <TableCell className="font-medium text-turquoise-900">
                  {expense.title}
                </TableCell>
                <TableCell>
                  <Badge className={getCategoryColor(expense.category)}>
                    {expense.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-turquoise-700 max-w-xs truncate">
                  {expense.description}
                </TableCell>
                <TableCell className="font-semibold text-turquoise-900">
                  ₹{expense.amount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge className={getPaymentModeColor(expense.paymentMode)}>
                    {expense.paymentMode}
                  </Badge>
                </TableCell>
                <TableCell className="text-turquoise-700">
                  {expense.paidTo}
                </TableCell>
                <TableCell className="text-turquoise-600 text-sm">
                  {expense.referenceNo || '-'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onViewExpense(expense)}
                      className="text-turquoise-600 hover:text-turquoise-800 hover:bg-turquoise-100"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-800 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-turquoise-600">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredExpenses.length)} of{' '}
          {filteredExpenses.length} expenses
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="border-turquoise-300 text-turquoise-700 hover:bg-turquoise-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-turquoise-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="border-turquoise-300 text-turquoise-700 hover:bg-turquoise-50"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-turquoise-200 flex justify-between items-center text-sm text-turquoise-600">
        <div>
          <Button variant="link" className="text-turquoise-700 hover:text-turquoise-900 p-0">
            ← Back to Expense Management
          </Button>
        </div>
        <div>
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
    </Card>
  );
};