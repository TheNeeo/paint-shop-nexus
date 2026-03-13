import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, Printer, TrendingUp, TrendingDown, DollarSign, Wallet, Plus, BookOpen, RefreshCw, BarChart3, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronDown, ChevronRight } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import AddNewTransactionModal from "@/components/daybook/AddNewTransactionModal";
import dashboardHomeIcon from "@/assets/smart-home-3d-icon-6.png";
import dayBookIcon from "@/assets/day-book-icon.png";

const THEME = {
  primary: '#8a5a9e',
  primaryDark: '#6b3f80',
  primaryLight: '#BB8ED0',
  primaryLighter: '#d9bfe6',
  primaryLightest: '#f3eaf7',
  border: '#BB8ED0',
  gradientFrom: '#d9bfe6',
  gradientMid: '#f3eaf7',
  gradientTo: '#faf5fc',
};

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
  const navigate = useNavigate();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [dailyNotes, setDailyNotes] = useState("");
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [typeFilter, setTypeFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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
      id: "1", time: "09:15", type: "Sale", description: "Paint Sale - Asian Paints",
      debit: 0, credit: 15000, paymentMode: "UPI", balance: 90000,
      details: { invoiceNo: "INV-001", customerName: "Raj Kumar", productName: "Asian Paints Premium", unit: "10L", amount: 1500, totalAmount: 15000, notes: "Bulk order for residential project" }
    },
    {
      id: "2", time: "11:30", type: "Purchase", description: "Paint Stock Purchase",
      debit: 12000, credit: 0, paymentMode: "Account Transfer", balance: 78000,
      details: { invoiceNo: "PUR-001", customerName: "Berger Paints Ltd", productName: "Various Paint Colors", unit: "Multiple", amount: 12000, totalAmount: 12000, notes: "Monthly stock replenishment" }
    },
    {
      id: "3", time: "14:45", type: "Expense", description: "Shop Rent Payment",
      debit: 8000, credit: 0, paymentMode: "Cash", balance: 70000,
      details: { invoiceNo: "EXP-001", notes: "Monthly shop rent for March 2024" }
    },
    {
      id: "4", time: "16:20", type: "Sale", description: "Brush & Tools Sale",
      debit: 0, credit: 2500, paymentMode: "Cash", balance: 72500,
      details: { invoiceNo: "INV-002", customerName: "Amit Sharma", productName: "Paint Brushes & Rollers", unit: "Set", amount: 2500, totalAmount: 2500 }
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Sale": return { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' };
      case "Purchase": return { bg: '#dbeafe', text: '#1e40af', border: '#bfdbfe' };
      case "Expense": return { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' };
      case "Receipt": return { bg: '#f3e8ff', text: '#6b21a8', border: '#e9d5ff' };
      case "Adjustment": return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' };
      default: return { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' };
    }
  };

  const getPaymentModeColor = (mode: string) => {
    switch (mode) {
      case "Cash": return { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' };
      case "UPI": return { bg: '#dbeafe', text: '#1d4ed8', border: '#bfdbfe' };
      case "Account Transfer": return { bg: '#f3e8ff', text: '#7c3aed', border: '#e9d5ff' };
      case "Cheque": return { bg: '#fce7f3', text: '#be185d', border: '#fbcfe8' };
      default: return { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
  };

  const totalDebit = transactions.reduce((sum, t) => sum + t.debit, 0);
  const totalCredit = transactions.reduce((sum, t) => sum + t.credit, 0);
  const netBalance = totalCredit - totalDebit;

  const summaryCards = [
    { title: "Account Balance", value: summaryData.accountBalance, icon: Wallet, gradient: "from-rose-400 via-pink-400 to-red-400" },
    { title: "Cash in Hand", value: summaryData.cashInHand, icon: DollarSign, gradient: "from-amber-400 via-orange-400 to-red-400" },
    { title: "Opening Balance", value: summaryData.openingBalance, icon: BookOpen, gradient: "from-violet-400 via-purple-400 to-indigo-400" },
    { title: "Total Cash In", value: summaryData.totalCashIn, icon: TrendingUp, gradient: "from-emerald-400 via-green-400 to-teal-400" },
    { title: "Total Cash Out", value: summaryData.totalCashOut, icon: TrendingDown, gradient: "from-red-400 via-rose-500 to-pink-500" },
    { title: "Closing Balance", value: summaryData.closingBalance, icon: BookOpen, gradient: "from-fuchsia-400 via-pink-500 to-rose-500" },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen p-6 space-y-6" style={{ background: `linear-gradient(to bottom right, ${THEME.primaryLightest}, ${THEME.primaryLighter}, #fff)` }}>

        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-3"
        >
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => navigate("/")}
                  className="cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1.5"
                >
                  <img src={dashboardHomeIcon} alt="Dashboard" className="h-5 w-5 object-contain bg-transparent" style={{ mixBlendMode: 'multiply' }} />
                  <span className="text-cyan-600 font-medium">Dashboard</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-1.5">
                  <BarChart3 className="h-4 w-4 text-orange-400" />
                  <span className="text-orange-600 font-medium">Reports & Analytics</span>
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-1.5">
                  <img src={dayBookIcon} alt="Day Book" className="h-5 w-5 object-contain" style={{ mixBlendMode: 'multiply' }} />
                  <span className="font-semibold" style={{ color: THEME.primary }}>Day Book</span>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl p-6 mb-8 shadow-lg border-2 relative overflow-hidden"
          style={{
            background: `linear-gradient(to right, ${THEME.gradientFrom}, ${THEME.gradientMid}, ${THEME.gradientTo})`,
            borderColor: THEME.border,
          }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: THEME.primary }}></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full blur-3xl animate-pulse delay-1000" style={{ backgroundColor: THEME.border }}></div>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-2xl sm:text-4xl font-bold flex items-center gap-3"
                  style={{ color: THEME.primaryDark }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <img src={dayBookIcon} alt="Day Book" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
                  </motion.div>
                  <div className="flex flex-col">
                    <span>Day Book</span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="text-sm font-normal italic ml-[1.5ch]"
                      style={{ color: THEME.primary }}
                    >
                      Track all daily transactions and cash flow
                    </motion.span>
                  </div>
                </motion.h1>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" style={{ borderColor: THEME.border, color: THEME.primaryDark }}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" style={{ borderColor: THEME.border, color: THEME.primaryDark }}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" style={{ borderColor: THEME.border, color: THEME.primaryDark }}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button
                size="sm"
                onClick={() => setIsAddTransactionOpen(true)}
                style={{ backgroundColor: THEME.primary, color: '#fff' }}
                className="hover:opacity-90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {summaryCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
              >
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-white/90 mb-1">{card.title}</h3>
                  <p className="text-2xl font-bold text-white">{formatCurrency(card.value)}</p>
                </div>
                <div className="absolute right-4 bottom-4 opacity-80">
                  <Icon className="h-16 w-16 text-white/40" strokeWidth={1.5} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Card className="border-2 shadow-sm" style={{ borderColor: THEME.primaryLighter }}>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" style={{ color: THEME.primary }} />
                  <span className="text-sm font-semibold" style={{ color: THEME.primaryDark }}>Filters:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 flex-1">
                  {/* Date From */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="justify-start text-left font-normal" style={{ borderColor: THEME.border }}>
                        <CalendarIcon className="mr-2 h-4 w-4" style={{ color: THEME.primary }} />
                        {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "From Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} /></PopoverContent>
                  </Popover>
                  {/* Date To */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="justify-start text-left font-normal" style={{ borderColor: THEME.border }}>
                        <CalendarIcon className="mr-2 h-4 w-4" style={{ color: THEME.primary }} />
                        {dateTo ? format(dateTo, "dd/MM/yyyy") : "To Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={dateTo} onSelect={setDateTo} /></PopoverContent>
                  </Popover>
                  {/* Type Filter */}
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="h-9" style={{ borderColor: THEME.border }}>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Sale">Sale</SelectItem>
                      <SelectItem value="Purchase">Purchase</SelectItem>
                      <SelectItem value="Expense">Expense</SelectItem>
                      <SelectItem value="Receipt">Receipt</SelectItem>
                      <SelectItem value="Adjustment">Adjustment</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* Payment Filter */}
                  <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                    <SelectTrigger className="h-9" style={{ borderColor: THEME.border }}>
                      <SelectValue placeholder="Payment Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Modes</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="Account Transfer">Account Transfer</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: THEME.primary }} />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 h-9"
                      style={{ borderColor: THEME.border }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Transaction Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <Card className="border-2 shadow-sm" style={{ borderColor: THEME.primaryLighter }}>
            <CardHeader>
              <CardTitle className="text-xl font-semibold" style={{ color: THEME.primaryDark }}>Transaction Details</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow style={{ backgroundColor: THEME.primaryLightest, borderBottomColor: THEME.border }}>
                      <TableHead className="text-center w-12"><div className="w-4"></div></TableHead>
                      <TableHead className="font-semibold w-20" style={{ color: THEME.primaryDark }}>Time</TableHead>
                      <TableHead className="font-semibold w-32" style={{ color: THEME.primaryDark }}>Type</TableHead>
                      <TableHead className="font-semibold min-w-[200px]" style={{ color: THEME.primaryDark }}>Description</TableHead>
                      <TableHead className="font-semibold text-right w-28" style={{ color: THEME.primaryDark }}>Debit</TableHead>
                      <TableHead className="font-semibold text-right w-28" style={{ color: THEME.primaryDark }}>Credit</TableHead>
                      <TableHead className="font-semibold w-40" style={{ color: THEME.primaryDark }}>Payment Mode</TableHead>
                      <TableHead className="font-semibold text-right w-28" style={{ color: THEME.primaryDark }}>Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => {
                      const typeColor = getTypeColor(transaction.type);
                      const payColor = getPaymentModeColor(transaction.paymentMode);
                      return (
                        <React.Fragment key={transaction.id}>
                          <TableRow
                            className="cursor-pointer transition-colors"
                            style={{ borderBottomColor: THEME.primaryLighter }}
                            onClick={() => setExpandedRow(expandedRow === transaction.id ? null : transaction.id)}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = THEME.primaryLightest}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                          >
                            <TableCell className="text-center w-12">
                              {expandedRow === transaction.id ? (
                                <ChevronDown className="h-4 w-4 mx-auto" style={{ color: THEME.primary }} />
                              ) : (
                                <ChevronRight className="h-4 w-4 mx-auto" style={{ color: THEME.primary }} />
                              )}
                            </TableCell>
                            <TableCell className="font-medium w-20" style={{ color: THEME.primaryDark }}>{transaction.time}</TableCell>
                            <TableCell className="w-32">
                              <Badge variant="outline" style={{ backgroundColor: typeColor.bg, color: typeColor.text, borderColor: typeColor.border }}>
                                {transaction.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="min-w-[200px]" style={{ color: '#374151' }}>{transaction.description}</TableCell>
                            <TableCell className="text-right font-medium w-28 text-red-600">
                              {transaction.debit > 0 ? formatCurrency(transaction.debit) : '-'}
                            </TableCell>
                            <TableCell className="text-right font-medium w-28 text-green-600">
                              {transaction.credit > 0 ? formatCurrency(transaction.credit) : '-'}
                            </TableCell>
                            <TableCell className="w-40">
                              <Badge variant="outline" style={{ backgroundColor: payColor.bg, color: payColor.text, borderColor: payColor.border }}>
                                {transaction.paymentMode}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-semibold w-28" style={{ color: THEME.primaryDark }}>
                              {formatCurrency(transaction.balance)}
                            </TableCell>
                          </TableRow>
                          {expandedRow === transaction.id && transaction.details && (
                            <TableRow style={{ backgroundColor: THEME.primaryLightest }}>
                              <TableCell colSpan={8}>
                                <div className="py-4 px-6 rounded-lg mx-4" style={{ backgroundColor: `${THEME.primaryLighter}30` }}>
                                  <h4 className="font-semibold mb-3" style={{ color: THEME.primaryDark }}>Transaction Details</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                    {transaction.details.invoiceNo && (
                                      <div><span className="text-gray-600">Invoice No:</span><p className="font-medium" style={{ color: THEME.primaryDark }}>{transaction.details.invoiceNo}</p></div>
                                    )}
                                    {transaction.details.customerName && (
                                      <div><span className="text-gray-600">Customer/Vendor:</span><p className="font-medium" style={{ color: THEME.primaryDark }}>{transaction.details.customerName}</p></div>
                                    )}
                                    {transaction.details.productName && (
                                      <div><span className="text-gray-600">Product:</span><p className="font-medium" style={{ color: THEME.primaryDark }}>{transaction.details.productName}</p></div>
                                    )}
                                    {transaction.details.unit && (
                                      <div><span className="text-gray-600">Unit:</span><p className="font-medium" style={{ color: THEME.primaryDark }}>{transaction.details.unit}</p></div>
                                    )}
                                    {transaction.details.amount && (
                                      <div><span className="text-gray-600">Amount:</span><p className="font-medium" style={{ color: THEME.primaryDark }}>{formatCurrency(transaction.details.amount)}</p></div>
                                    )}
                                    {transaction.details.totalAmount && (
                                      <div><span className="text-gray-600">Total Amount:</span><p className="font-medium" style={{ color: THEME.primaryDark }}>{formatCurrency(transaction.details.totalAmount)}</p></div>
                                    )}
                                    {transaction.details.notes && (
                                      <div className="md:col-span-2"><span className="text-gray-600">Notes:</span><p className="font-medium" style={{ color: THEME.primaryDark }}>{transaction.details.notes}</p></div>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Daily Notes */}
        <Card className="border-2 shadow-sm" style={{ borderColor: THEME.primaryLighter }}>
          <CardHeader>
            <CardTitle className="text-xl font-semibold" style={{ color: THEME.primaryDark }}>Daily Notes / Remarks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Add your daily notes and remarks here..."
              value={dailyNotes}
              onChange={(e) => setDailyNotes(e.target.value)}
              className="min-h-[100px]"
              style={{ borderColor: THEME.border }}
            />
            <Button style={{ backgroundColor: THEME.primary, color: '#fff' }} className="hover:opacity-90">
              Save Remarks
            </Button>
          </CardContent>
        </Card>

        {/* Footer Totals */}
        <Card className="border-2 shadow-sm" style={{ borderColor: THEME.primaryLighter, background: `linear-gradient(to right, ${THEME.primaryLightest}, #fff)` }}>
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
                  <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(netBalance)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="text-sm font-medium" style={{ color: THEME.primaryDark }}>
                  {new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
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
    </AppLayout>
  );
};

export default DayBook;
