import React, { useState } from "react";
import { Calendar, Download, Printer, BookOpen, TrendingUp, TrendingDown, DollarSign, Wallet, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import AddNewTransactionModal from "@/components/daybook/AddNewTransactionModal";

interface Transaction {
  id: string;
  time: string;
  type: "Sale" | "Purchase" | "Expense" | "Receipt" | "Adjustment";
  description: string;
  debit: number;
  credit: number;
  paymentMode: "Cash" | "UPI" | "Account Transfer" | "Cheque";
  balance: number;
  details?: {
    invoiceNo?: string;
    customerName?: string;
    productName?: string;
    unit?: string;
    amount?: number;
    totalAmount?: number;
    notes?: string;
  };
}

const DayBook = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [dailyNotes, setDailyNotes] = useState("");
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);

  // Mock data
  const summaryData = {
    accountBalance: 85000,
    cashInHand: 25000,
    openingBalance: 75000,
    totalCashIn: 35000,
    totalCashOut: 25000,
    closingBalance: 85000,
  };

  const transactions: Transaction[] = [
    {
      id: "1",
      time: "09:15",
      type: "Sale",
      description: "Paint Sale - Asian Paints",
      debit: 0,
      credit: 15000,
      paymentMode: "UPI",
      balance: 90000,
      details: {
        invoiceNo: "INV-001",
        customerName: "Raj Kumar",
        productName: "Asian Paints Premium",
        unit: "10L",
        amount: 1500,
        totalAmount: 15000,
        notes: "Bulk order for residential project"
      }
    },
    {
      id: "2",
      time: "11:30",
      type: "Purchase",
      description: "Paint Stock Purchase",
      debit: 12000,
      credit: 0,
      paymentMode: "Account Transfer",
      balance: 78000,
      details: {
        invoiceNo: "PUR-001",
        customerName: "Berger Paints Ltd",
        productName: "Various Paint Colors",
        unit: "Multiple",
        amount: 12000,
        totalAmount: 12000,
        notes: "Monthly stock replenishment"
      }
    },
    {
      id: "3",
      time: "14:45",
      type: "Expense",
      description: "Shop Rent Payment",
      debit: 8000,
      credit: 0,
      paymentMode: "Cash",
      balance: 70000,
      details: {
        invoiceNo: "EXP-001",
        notes: "Monthly shop rent for March 2024"
      }
    },
    {
      id: "4",
      time: "16:20",
      type: "Sale",
      description: "Brush & Tools Sale",
      debit: 0,
      credit: 2500,
      paymentMode: "Cash",
      balance: 72500,
      details: {
        invoiceNo: "INV-002",
        customerName: "Amit Sharma",
        productName: "Paint Brushes & Rollers",
        unit: "Set",
        amount: 2500,
        totalAmount: 2500
      }
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Sale": return "bg-green-100 text-green-800 border-green-200";
      case "Purchase": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Expense": return "bg-red-100 text-red-800 border-red-200";
      case "Receipt": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Adjustment": return "bg-coral-100 text-coral-800 border-coral-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentModeColor = (mode: string) => {
    switch (mode) {
      case "Cash": return "bg-green-100 text-green-700 border-green-200";
      case "UPI": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Account Transfer": return "bg-purple-100 text-purple-700 border-purple-200";
      case "Cheque": return "bg-pink-100 text-pink-700 border-pink-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalDebit = transactions.reduce((sum, t) => sum + t.debit, 0);
  const totalCredit = transactions.reduce((sum, t) => sum + t.credit, 0);
  const netBalance = totalCredit - totalDebit;

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-coral-50/30 via-white to-coral-50/20">
        <div className="space-y-6 p-6">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border border-coral-200/30 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-coral-100 rounded-lg">
                    <BookOpen className="h-6 w-6" style={{ color: '#F56E75' }} />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900">Day Book</h1>
                </div>
                <nav className="flex text-sm text-gray-600">
                  <span>Dashboard</span>
                  <span className="mx-2">&gt;</span>
                  <span>Reports & Analytics</span>
                  <span className="mx-2">&gt;</span>
                  <span className="font-medium" style={{ color: '#F56E75' }}>Day Book</span>
                </nav>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-auto border-coral-200 focus:border-coral-400"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setIsAddTransactionOpen(true)}
                    className="bg-coral-500 hover:bg-coral-600 text-white"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Transaction
                  </Button>
                  <Button variant="outline" size="sm" className="border-coral-200 text-coral-700 hover:bg-coral-50">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button variant="outline" size="sm" className="border-coral-200 text-coral-700 hover:bg-coral-50">
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-400 via-pink-400 to-red-400 p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-white/90 mb-1">Account Balance</h3>
                <p className="text-2xl font-bold text-white">{formatCurrency(summaryData.accountBalance)}</p>
              </div>
              <div className="absolute right-4 bottom-4 opacity-80">
                <Wallet className="h-16 w-16 text-white/40" strokeWidth={1.5} />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-white/90 mb-1">Cash in Hand</h3>
                <p className="text-2xl font-bold text-white">{formatCurrency(summaryData.cashInHand)}</p>
              </div>
              <div className="absolute right-4 bottom-4 opacity-80">
                <DollarSign className="h-16 w-16 text-white/40" strokeWidth={1.5} />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-400 via-purple-400 to-indigo-400 p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-white/90 mb-1">Opening Balance</h3>
                <p className="text-2xl font-bold text-white">{formatCurrency(summaryData.openingBalance)}</p>
              </div>
              <div className="absolute right-4 bottom-4 opacity-80">
                <BookOpen className="h-16 w-16 text-white/40" strokeWidth={1.5} />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-400 via-green-400 to-teal-400 p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-white/90 mb-1">Total Cash In</h3>
                <p className="text-2xl font-bold text-white">{formatCurrency(summaryData.totalCashIn)}</p>
              </div>
              <div className="absolute right-4 bottom-4 opacity-80">
                <TrendingUp className="h-16 w-16 text-white/40" strokeWidth={1.5} />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-400 via-rose-500 to-pink-500 p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-white/90 mb-1">Total Cash Out</h3>
                <p className="text-2xl font-bold text-white">{formatCurrency(summaryData.totalCashOut)}</p>
              </div>
              <div className="absolute right-4 bottom-4 opacity-80">
                <TrendingDown className="h-16 w-16 text-white/40" strokeWidth={1.5} />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-fuchsia-400 via-pink-500 to-rose-500 p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-white/90 mb-1">Closing Balance</h3>
                <p className="text-2xl font-bold text-white">{formatCurrency(summaryData.closingBalance)}</p>
              </div>
              <div className="absolute right-4 bottom-4 opacity-80">
                <BookOpen className="h-16 w-16 text-white/40" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Transaction Table */}
          <Card className="border-coral-200/30">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Transaction Details</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-coral-50/50 border-b border-coral-200">
                      <TableHead className="text-center w-12">
                        <div className="w-4"></div>
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 w-20">Time</TableHead>
                      <TableHead className="font-semibold text-gray-700 w-32">Type</TableHead>
                      <TableHead className="font-semibold text-gray-700 min-w-[200px]">Description</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-right w-28">Debit</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-right w-28">Credit</TableHead>
                      <TableHead className="font-semibold text-gray-700 w-40">Payment Mode</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-right w-28">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <React.Fragment key={transaction.id}>
                        <TableRow 
                          className="hover:bg-coral-50/30 cursor-pointer border-b border-coral-100"
                          onClick={() => setExpandedRow(expandedRow === transaction.id ? null : transaction.id)}
                        >
                          <TableCell className="text-center w-12">
                            {expandedRow === transaction.id ? (
                              <ChevronDown className="h-4 w-4 text-gray-500 mx-auto" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-500 mx-auto" />
                            )}
                          </TableCell>
                          <TableCell className="font-medium text-gray-700 w-20">{transaction.time}</TableCell>
                          <TableCell className="w-32">
                            <Badge variant="outline" className={getTypeColor(transaction.type)}>
                              {transaction.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-700 min-w-[200px]">{transaction.description}</TableCell>
                          <TableCell className="text-right text-red-600 font-medium w-28">
                            {transaction.debit > 0 ? formatCurrency(transaction.debit) : '-'}
                          </TableCell>
                          <TableCell className="text-right text-green-600 font-medium w-28">
                            {transaction.credit > 0 ? formatCurrency(transaction.credit) : '-'}
                          </TableCell>
                          <TableCell className="w-40">
                            <Badge variant="outline" className={getPaymentModeColor(transaction.paymentMode)}>
                              {transaction.paymentMode}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold text-gray-900 w-28">
                            {formatCurrency(transaction.balance)}
                          </TableCell>
                        </TableRow>
                        {expandedRow === transaction.id && transaction.details && (
                          <TableRow className="bg-coral-25 border-b border-coral-100">
                            <TableCell colSpan={8}>
                              <div className="py-4 px-6 bg-coral-50/20 rounded-lg mx-4">
                                <h4 className="font-semibold text-gray-900 mb-3">Transaction Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                  {transaction.details.invoiceNo && (
                                    <div>
                                      <span className="text-gray-600">Invoice No:</span>
                                      <p className="font-medium text-gray-900">{transaction.details.invoiceNo}</p>
                                    </div>
                                  )}
                                  {transaction.details.customerName && (
                                    <div>
                                      <span className="text-gray-600">Customer/Vendor:</span>
                                      <p className="font-medium text-gray-900">{transaction.details.customerName}</p>
                                    </div>
                                  )}
                                  {transaction.details.productName && (
                                    <div>
                                      <span className="text-gray-600">Product:</span>
                                      <p className="font-medium text-gray-900">{transaction.details.productName}</p>
                                    </div>
                                  )}
                                  {transaction.details.unit && (
                                    <div>
                                      <span className="text-gray-600">Unit:</span>
                                      <p className="font-medium text-gray-900">{transaction.details.unit}</p>
                                    </div>
                                  )}
                                  {transaction.details.amount && (
                                    <div>
                                      <span className="text-gray-600">Amount:</span>
                                      <p className="font-medium text-gray-900">{formatCurrency(transaction.details.amount)}</p>
                                    </div>
                                  )}
                                  {transaction.details.totalAmount && (
                                    <div>
                                      <span className="text-gray-600">Total Amount:</span>
                                      <p className="font-medium text-gray-900">{formatCurrency(transaction.details.totalAmount)}</p>
                                    </div>
                                  )}
                                  {transaction.details.notes && (
                                    <div className="md:col-span-2">
                                      <span className="text-gray-600">Notes:</span>
                                      <p className="font-medium text-gray-900">{transaction.details.notes}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Daily Notes */}
          <Card className="border-coral-200/30">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Daily Notes / Remarks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Add your daily notes and remarks here..."
                value={dailyNotes}
                onChange={(e) => setDailyNotes(e.target.value)}
                className="min-h-[100px] border-coral-200 focus:border-coral-400"
              />
              <Button 
                className="bg-coral-500 hover:bg-coral-600 text-white"
                style={{ backgroundColor: '#F56E75' }}
              >
                Save Remarks
              </Button>
            </CardContent>
          </Card>

          {/* Footer Totals */}
          <Card className="border-coral-200/30 bg-gradient-to-r from-coral-50/50 to-white">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Total Debit</p>
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDebit)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Total Credit</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCredit)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Net Balance</p>
                    <p 
                      className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {formatCurrency(netBalance)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date().toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <AddNewTransactionModal 
          open={isAddTransactionOpen} 
          onOpenChange={setIsAddTransactionOpen}
        />
      </div>
    </AppLayout>
  );
};

export default DayBook;