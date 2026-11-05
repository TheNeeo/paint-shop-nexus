import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, Printer, TrendingUp, TrendingDown, DollarSign, Wallet, Plus, BookOpen, RefreshCw, BarChart3, Search, Filter, Clock, Tag, AlignLeft, IndianRupee, CreditCard, Calculator } from "lucide-react";
import { TableHeaderCell } from "@/components/shared/TableHeaderCell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { exportToCSV } from "@/lib/exportUtils";
import { useFinanceData } from "@/hooks/useFinanceData";
import { supabase } from "@/integrations/supabase/client";
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
  date: string;
  time: string;
  createdAt: string;
  type: "Sale" | "Purchase" | "Expense" | "Receipt" | "Adjustment";
  description: string;
  debit: number;
  credit: number;
  paymentMode: string;
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

const formatPaymentMode = (mode?: string | null) => {
  if (!mode) return "N/A";
  const normalized = mode.toLowerCase().replace(/[\s-]+/g, "_");
  const labels: Record<string, string> = {
    cash: "Cash",
    upi: "UPI",
    bank: "Bank Transfer",
    bank_transfer: "Account Transfer",
    account_transfer: "Account Transfer",
    cheque: "Cheque",
    card: "Card",
    credit_card: "Card",
  };
  return labels[normalized] || mode;
};

const formatTransactionTime = (createdAt: string) => {
  const parsed = new Date(createdAt);
  return Number.isNaN(parsed.getTime()) ? "—" : format(parsed, "HH:mm");
};

const DayBook = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: financeData, isLoading, isError, refetch, dataUpdatedAt } = useFinanceData();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [typeFilter, setTypeFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const allTransactions = useMemo(() => {
    if (!financeData) return [];

    const rows: Omit<Transaction, "balance">[] = [];

    financeData.sales.forEach((sale) => {
      const amountReceived = Number(sale.paid_amount) || 0;
      if (sale.status === "draft" || amountReceived <= 0) return;
      rows.push({
        id: `sale-${sale.id}`,
        date: sale.invoice_date,
        time: formatTransactionTime(sale.created_at),
        createdAt: sale.created_at,
        type: "Sale",
        description: `Sale payment ${sale.invoice_number}`,
        debit: 0,
        credit: amountReceived,
        paymentMode: formatPaymentMode(sale.payment_mode),
        details: {
          invoiceNo: sale.invoice_number,
          customerName: sale.customer_name || "Walk-in",
          amount: amountReceived,
          totalAmount: Number(sale.total_amount) || 0,
          notes: sale.pending_amount ? `Pending balance: ₹${Number(sale.pending_amount).toLocaleString("en-IN")}` : undefined,
        },
      });
    });

    financeData.purchases.forEach((purchase) => {
      const amountPaid = Number(purchase.paid_amount) || 0;
      if (amountPaid <= 0) return;
      rows.push({
        id: `purchase-${purchase.id}`,
        date: purchase.purchase_date,
        time: formatTransactionTime(purchase.created_at),
        createdAt: purchase.created_at,
        type: "Purchase",
        description: `Purchase payment ${purchase.invoice_number}`,
        debit: amountPaid,
        credit: 0,
        paymentMode: formatPaymentMode(purchase.payment_method),
        details: {
          invoiceNo: purchase.invoice_number,
          customerName: purchase.vendors?.name || undefined,
          amount: amountPaid,
          totalAmount: Number(purchase.total_amount) || 0,
          notes: purchase.balance_amount ? `Pending balance: ₹${Number(purchase.balance_amount).toLocaleString("en-IN")}` : undefined,
        },
      });
    });

    financeData.expenses.forEach((expense) => {
      const amount = Number(expense.amount) || 0;
      if (amount <= 0) return;
      rows.push({
        id: `expense-${expense.id}`,
        date: expense.date,
        time: formatTransactionTime(expense.created_at),
        createdAt: expense.created_at,
        type: "Expense",
        description: expense.description || expense.type,
        debit: amount,
        credit: 0,
        paymentMode: formatPaymentMode(expense.payment_mode),
        details: {
          invoiceNo: expense.ref_no || undefined,
          amount,
          totalAmount: amount,
          notes: expense.type,
        },
      });
    });

    financeData.receipts.forEach((receipt) => {
      const amount = Number(receipt.amount) || 0;
      if (amount <= 0) return;
      rows.push({
        id: `receipt-${receipt.id}`,
        date: receipt.receipt_date,
        time: formatTransactionTime(receipt.created_at),
        createdAt: receipt.created_at,
        type: "Receipt",
        description: receipt.reason || `Cash receipt ${receipt.receipt_no}`,
        debit: 0,
        credit: amount,
        paymentMode: formatPaymentMode(receipt.payment_mode),
        details: {
          invoiceNo: receipt.receipt_no,
          customerName: receipt.payer_name,
          amount,
          totalAmount: amount,
          notes: receipt.notes || undefined,
        },
      });
    });

    financeData.stockAdjustments.forEach((adjustment) => {
      rows.push({
        id: `adjustment-${adjustment.id}`,
        date: adjustment.created_at.slice(0, 10),
        time: formatTransactionTime(adjustment.created_at),
        createdAt: adjustment.created_at,
        type: "Adjustment",
        description: adjustment.reason || `Stock ${adjustment.adjustment_type}`,
        debit: 0,
        credit: 0,
        paymentMode: "N/A",
        details: {
          productName: adjustment.products?.name || `Product ${adjustment.product_id.slice(0, 8)}`,
          notes: `${adjustment.adjustment_type}: ${adjustment.quantity} units`,
        },
      });
    });

    rows.sort((left, right) => left.date.localeCompare(right.date) || left.createdAt.localeCompare(right.createdAt));
    let runningBalance = 0;
    return rows.map((row) => {
      runningBalance += row.credit - row.debit;
      return { ...row, balance: runningBalance };
    });
  }, [financeData]);

  const fromDate = dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined;
  const toDate = dateTo ? format(dateTo, "yyyy-MM-dd") : undefined;
  const periodTransactions = allTransactions.filter((transaction) =>
    (!fromDate || transaction.date >= fromDate) && (!toDate || transaction.date <= toDate),
  );
  const visibleTransactions = periodTransactions.filter((transaction) => {
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    const matchesPayment = paymentFilter === "all" || transaction.paymentMode === paymentFilter;
    const searchText = `${transaction.description} ${transaction.details?.invoiceNo || ""} ${transaction.details?.customerName || ""} ${transaction.details?.productName || ""}`.toLowerCase();
    return matchesType && matchesPayment && searchText.includes(searchQuery.toLowerCase());
  }).slice().reverse();
  const openingBalance = fromDate
    ? allTransactions.filter((transaction) => transaction.date < fromDate).reduce((sum, transaction) => sum + transaction.credit - transaction.debit, 0)
    : 0;
  const totalCashIn = periodTransactions.reduce((sum, transaction) => sum + transaction.credit, 0);
  const totalCashOut = periodTransactions.reduce((sum, transaction) => sum + transaction.debit, 0);
  const closingBalance = openingBalance + totalCashIn - totalCashOut;
  const accountBalance = allTransactions.at(-1)?.balance || 0;
  const cashInHand = allTransactions
    .filter((transaction) => transaction.paymentMode === "Cash")
    .reduce((sum, transaction) => sum + transaction.credit - transaction.debit, 0);

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
      case "Account Transfer":
      case "Bank Transfer": return { bg: '#f3e8ff', text: '#7c3aed', border: '#e9d5ff' };
      case "Card": return { bg: '#cffafe', text: '#155e75', border: '#a5f3fc' };
      case "Cheque": return { bg: '#fce7f3', text: '#be185d', border: '#fbcfe8' };
      default: return { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
  };

  const totalDebit = visibleTransactions.reduce((sum, transaction) => sum + transaction.debit, 0);
  const totalCredit = visibleTransactions.reduce((sum, transaction) => sum + transaction.credit, 0);
  const netBalance = totalCredit - totalDebit;

  const summaryCards = [
    { title: "Account Balance", value: accountBalance, icon: Wallet, gradient: "from-rose-400 via-pink-400 to-red-400" },
    { title: "Cash in Hand", value: cashInHand, icon: DollarSign, gradient: "from-amber-400 via-orange-400 to-red-400" },
    { title: "Opening Balance", value: openingBalance, icon: BookOpen, gradient: "from-violet-400 via-purple-400 to-indigo-400" },
    { title: "Total Cash In", value: totalCashIn, icon: TrendingUp, gradient: "from-emerald-400 via-green-400 to-teal-400" },
    { title: "Total Cash Out", value: totalCashOut, icon: TrendingDown, gradient: "from-red-400 via-rose-500 to-pink-500" },
    { title: "Closing Balance", value: closingBalance, icon: BookOpen, gradient: "from-fuchsia-400 via-pink-500 to-rose-500" },
  ];

  const handleExportCSV = () => {
    if (visibleTransactions.length === 0) {
      toast.error("No transactions to export");
      return;
    }

    exportToCSV(visibleTransactions.map((transaction) => ({
      Date: transaction.date,
      Time: transaction.time,
      Type: transaction.type,
      Description: transaction.description,
      Debit: transaction.debit,
      Credit: transaction.credit,
      "Payment Mode": transaction.paymentMode,
      Balance: transaction.balance,
    })), "day_book");
  };

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
              <Button variant="outline" size="sm" onClick={() => void refetch()} disabled={isLoading} style={{ borderColor: THEME.border, color: THEME.primaryDark }}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportCSV} style={{ borderColor: THEME.border, color: THEME.primaryDark }}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.print()} style={{ borderColor: THEME.border, color: THEME.primaryDark }}>
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

        <p className="text-sm text-muted-foreground">
          Balances start at ₹0 and include recorded invoice payments, receipts, purchases, and expenses. Keep a payment in either the invoice or standalone receipt flow, not both.
        </p>

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
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                      <SelectItem value="Card">Card</SelectItem>
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
                      <TableHeaderCell icon={CalendarIcon} label="Date" textColor={THEME.primaryDark} iconColor="#0ea5e9" className="w-28" />
                      <TableHeaderCell icon={Clock} label="Time" textColor={THEME.primaryDark} iconColor="#0ea5e9" className="w-20" />
                      <TableHeaderCell icon={Tag} label="Type" textColor={THEME.primaryDark} iconColor="#8b5cf6" className="w-32" />
                      <TableHeaderCell icon={AlignLeft} label="Description" textColor={THEME.primaryDark} iconColor="#ec4899" className="min-w-[200px]" />
                      <TableHeaderCell icon={TrendingDown} label="Debit" textColor={THEME.primaryDark} iconColor="#ef4444" align="right" className="text-right w-28" />
                      <TableHeaderCell icon={TrendingUp} label="Credit" textColor={THEME.primaryDark} iconColor="#10b981" align="right" className="text-right w-28" />
                      <TableHeaderCell icon={CreditCard} label="Payment Mode" textColor={THEME.primaryDark} iconColor="#0d9488" className="w-40" />
                      <TableHeaderCell icon={Calculator} label="Balance" textColor={THEME.primaryDark} iconColor="#f59e0b" align="right" className="text-right w-28" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow><TableCell colSpan={9} className="py-8 text-center text-gray-500">Loading transactions…</TableCell></TableRow>
                    ) : isError ? (
                      <TableRow><TableCell colSpan={9} className="py-8 text-center text-red-600">Could not load transactions. Check database access and try refreshing.</TableCell></TableRow>
                    ) : visibleTransactions.length === 0 ? (
                      <TableRow><TableCell colSpan={9} className="py-8 text-center text-gray-500">No transactions found for these filters.</TableCell></TableRow>
                    ) : visibleTransactions.map((transaction) => {
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
                            <TableCell className="font-medium w-28" style={{ color: THEME.primaryDark }}>{new Date(`${transaction.date}T00:00:00`).toLocaleDateString("en-IN")}</TableCell>
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
                              <TableCell colSpan={9}>
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
                  {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : "Not loaded"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddNewTransactionModal
        open={isAddTransactionOpen}
        onOpenChange={setIsAddTransactionOpen}
        onSaved={() => {
          void queryClient.invalidateQueries({ queryKey: ["finance-data"] });
        }}
      />
    </AppLayout>
  );
};

export default DayBook;
