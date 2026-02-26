import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, Printer, RefreshCw, DollarSign, FileText, TrendingUp, BarChart, BarChart3, Search, Filter, X, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AppLayout from "@/components/layout/AppLayout";
import { ExpenseReportModal } from "@/components/expense/ExpenseReportModal";
import dashboardHomeIcon from "@/assets/smart-home-3d-icon-8.png";
import expenseReportIcon from "@/assets/expense-report-icon.png";

const THEME = {
  primary: '#5a9e9d',
  primaryDark: '#3d7a79',
  primaryLight: '#91C4C3',
  primaryLighter: '#b8dada',
  primaryLightest: '#e8f4f4',
  border: '#91C4C3',
  gradientFrom: '#b8dada',
  gradientMid: '#e8f4f4',
  gradientTo: '#f5fafa',
};

const ExpenseReport = () => {
  const navigate = useNavigate();
  const [isExpenseReportModalOpen, setIsExpenseReportModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [paymentMode, setPaymentMode] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const itemsPerPage = 10;

  const expenses = [
    { id: 1, date: "2024-01-15", title: "Office Rent", category: "Rent", description: "Monthly office space rental", amount: 25000, paymentMode: "Bank", paidTo: "Property Owner", referenceNo: "TXN123456", isHighExpense: true },
    { id: 2, date: "2024-01-14", title: "Fuel Expenses", category: "Transport", description: "Vehicle fuel for delivery", amount: 3500, paymentMode: "Cash", paidTo: "Petrol Pump", referenceNo: "", isHighExpense: false },
    { id: 3, date: "2024-01-13", title: "Internet Bill", category: "Utilities", description: "Monthly broadband charges", amount: 1200, paymentMode: "UPI", paidTo: "ISP Provider", referenceNo: "UPI789012", isHighExpense: false },
    { id: 4, date: "2024-01-12", title: "Marketing Campaign", category: "Marketing", description: "Social media advertising", amount: 15000, paymentMode: "Card", paidTo: "Ad Agency", referenceNo: "CARD345678", isHighExpense: true },
    { id: 5, date: "2024-01-11", title: "Office Supplies", category: "Office", description: "Stationery and supplies", amount: 2800, paymentMode: "Cash", paidTo: "Stationery Shop", referenceNo: "", isHighExpense: false },
  ];

  const summaryCards = [
    { title: "Total Expenses", value: "₹1,25,450", icon: DollarSign, gradient: "from-cyan-400 via-teal-500 to-emerald-500" },
    { title: "Highest Single Expense", value: "₹15,500", icon: TrendingUp, gradient: "from-teal-400 via-cyan-500 to-blue-500" },
    { title: "No. of Expense Entries", value: "248", icon: FileText, gradient: "from-sky-400 via-cyan-500 to-teal-500" },
    { title: "Average Daily Expense", value: "₹4,150", icon: BarChart, gradient: "from-blue-400 via-sky-500 to-cyan-500" },
  ];

  const getCategoryBadge = (cat: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      Rent: { bg: '#dbeafe', text: '#1e40af' },
      Transport: { bg: '#dcfce7', text: '#166534' },
      Utilities: { bg: '#ffedd5', text: '#9a3412' },
      Marketing: { bg: '#f3e8ff', text: '#6b21a8' },
      Office: { bg: '#f3f4f6', text: '#374151' },
      Food: { bg: '#fef3c7', text: '#92400e' },
      Travel: { bg: '#e0e7ff', text: '#3730a3' },
    };
    return colors[cat] || { bg: '#f3f4f6', text: '#374151' };
  };

  const getPaymentModeBadge = (mode: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      Cash: { bg: '#dcfce7', text: '#15803d' },
      UPI: { bg: '#dbeafe', text: '#1d4ed8' },
      Bank: { bg: '#f3e8ff', text: '#7c3aed' },
      Card: { bg: '#fce7f3', text: '#be185d' },
      Cheque: { bg: '#fef3c7', text: '#92400e' },
    };
    return colors[mode] || { bg: '#f3f4f6', text: '#374151' };
  };

  const filteredExpenses = expenses.filter(e =>
    (searchTerm === "" || e.title.toLowerCase().includes(searchTerm.toLowerCase()) || e.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (category === "all" || e.category.toLowerCase() === category) &&
    (paymentMode === "all" || e.paymentMode.toLowerCase() === paymentMode)
  );

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExpenses = filteredExpenses.slice(startIndex, startIndex + itemsPerPage);

  const clearFilters = () => {
    setSearchTerm("");
    setCategory("all");
    setPaymentMode("all");
    setDateRange("all");
  };

  const handleViewExpense = (expense: any) => {
    setSelectedExpense(expense);
    setIsExpenseReportModalOpen(true);
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
                  <span className="text-orange-600 font-medium">Expense Management</span>
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-1.5">
                  <img src={expenseReportIcon} alt="Expense Report" className="h-5 w-5 object-contain" style={{ mixBlendMode: 'multiply' }} />
                  <span className="font-semibold" style={{ color: THEME.primary }}>Expense Report</span>
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
                  <img src={expenseReportIcon} alt="Expense Report" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
                </motion.div>
                <div className="flex flex-col">
                  <span>Expense Report</span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-sm font-normal italic ml-[1.5ch]"
                    style={{ color: THEME.primary }}
                  >
                    Clear View of Every Expense.
                  </motion.span>
                </div>
              </motion.h1>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" style={{ borderColor: THEME.border, color: THEME.primaryDark }}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" style={{ borderColor: THEME.border, color: THEME.primaryDark }}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm" style={{ borderColor: THEME.border, color: THEME.primaryDark }}>
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
              <Button variant="outline" size="sm" style={{ borderColor: THEME.border, color: THEME.primaryDark }}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <p className="text-2xl font-bold text-white">{card.value}</p>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: THEME.primary }} />
                    <Input
                      placeholder="Search by Title or Description"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 h-9"
                      style={{ borderColor: THEME.border }}
                    />
                  </div>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-9" style={{ borderColor: THEME.border }}>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="rent">Rent</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                      <SelectItem value="utilities">Utilities</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="food">Food & Dining</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="h-9" style={{ borderColor: THEME.border }}>
                      <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dates</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={paymentMode} onValueChange={setPaymentMode}>
                    <SelectTrigger className="h-9" style={{ borderColor: THEME.border }}>
                      <SelectValue placeholder="Payment Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Modes</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" size="sm" onClick={clearFilters} style={{ borderColor: THEME.border, color: THEME.primaryDark }}>
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Expense Transaction Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <Card className="border-2 shadow-sm" style={{ borderColor: THEME.primaryLighter }}>
            <CardHeader>
              <CardTitle className="text-xl font-semibold" style={{ color: THEME.primaryDark }}>Expense Transaction</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow style={{ backgroundColor: THEME.primaryLightest, borderBottomColor: THEME.border }}>
                      <TableHead className="font-semibold" style={{ color: THEME.primaryDark }}>S.No</TableHead>
                      <TableHead className="font-semibold" style={{ color: THEME.primaryDark }}>Date</TableHead>
                      <TableHead className="font-semibold" style={{ color: THEME.primaryDark }}>Expense Title</TableHead>
                      <TableHead className="font-semibold" style={{ color: THEME.primaryDark }}>Category</TableHead>
                      <TableHead className="font-semibold" style={{ color: THEME.primaryDark }}>Description</TableHead>
                      <TableHead className="font-semibold" style={{ color: THEME.primaryDark }}>Amount</TableHead>
                      <TableHead className="font-semibold" style={{ color: THEME.primaryDark }}>Payment Mode</TableHead>
                      <TableHead className="font-semibold" style={{ color: THEME.primaryDark }}>Paid To</TableHead>
                      <TableHead className="font-semibold" style={{ color: THEME.primaryDark }}>Reference No.</TableHead>
                      <TableHead className="font-semibold text-center" style={{ color: THEME.primaryDark }}>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedExpenses.map((expense, index) => {
                      const catColor = getCategoryBadge(expense.category);
                      const pmColor = getPaymentModeBadge(expense.paymentMode);
                      return (
                        <TableRow
                          key={expense.id}
                          className="hover:opacity-90 transition-colors"
                          style={{
                            backgroundColor: expense.isHighExpense ? '#fef2f2' : (index % 2 === 0 ? '#fff' : THEME.primaryLightest),
                          }}
                        >
                          <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                          <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                          <TableCell className="font-medium" style={{ color: THEME.primaryDark }}>{expense.title}</TableCell>
                          <TableCell>
                            <Badge style={{ backgroundColor: catColor.bg, color: catColor.text, border: 'none' }}>{expense.category}</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate" style={{ color: THEME.primary }}>{expense.description}</TableCell>
                          <TableCell className="font-semibold" style={{ color: THEME.primaryDark }}>₹{expense.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge style={{ backgroundColor: pmColor.bg, color: pmColor.text, border: 'none' }}>{expense.paymentMode}</Badge>
                          </TableCell>
                          <TableCell style={{ color: THEME.primary }}>{expense.paidTo}</TableCell>
                          <TableCell className="text-sm" style={{ color: THEME.primary }}>{expense.referenceNo || '-'}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-1">
                              <Button size="sm" variant="ghost" onClick={() => handleViewExpense(expense)} style={{ color: THEME.primary }}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-800 hover:bg-blue-100">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-800 hover:bg-red-100">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm" style={{ color: THEME.primary }}>
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredExpenses.length)} of {filteredExpenses.length} expenses
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} style={{ borderColor: THEME.border, color: THEME.primaryDark }}>
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <span className="text-sm" style={{ color: THEME.primary }}>Page {currentPage} of {totalPages || 1}</span>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} style={{ borderColor: THEME.border, color: THEME.primaryDark }}>
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t flex justify-between items-center text-sm" style={{ borderColor: THEME.primaryLighter, color: THEME.primary }}>
          <Button variant="link" onClick={() => navigate(-1)} style={{ color: THEME.primaryDark }} className="p-0">
            ← Back to Expense Management
          </Button>
          <div>Last updated: {new Date().toLocaleString()}</div>
        </div>

        <ExpenseReportModal
          isOpen={isExpenseReportModalOpen}
          onClose={() => setIsExpenseReportModalOpen(false)}
          expense={selectedExpense}
        />
      </div>
    </AppLayout>
  );
};

export default ExpenseReport;
