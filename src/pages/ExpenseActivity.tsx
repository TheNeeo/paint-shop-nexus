import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, Printer, RefreshCw, Plus, DollarSign, FileText, TrendingUp, Target, BarChart3, Search, Filter, Calendar as CalendarIcon, CreditCard, X, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
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
import { AddEditExpenseModal } from "@/components/expense/AddEditExpenseModal";
import dashboardHomeIcon from "@/assets/smart-home-3d-icon-7.png";
import expenseIcon from "@/assets/expense-activity-icon.png";

const THEME = {
  primary: '#b5a34a',
  primaryDark: '#8a7c2e',
  primaryLight: '#DDC57A',
  primaryLighter: '#eddda3',
  primaryLightest: '#faf6e6',
  border: '#DDC57A',
  gradientFrom: '#eddda3',
  gradientMid: '#faf6e6',
  gradientTo: '#fdfcf5',
};

interface Expense {
  id: number;
  date: string;
  type: string;
  amount: number;
  paymentMode: string;
  description: string;
  refNo: string;
}

const ExpenseActivity = () => {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [expenseType, setExpenseType] = useState("all");
  const [paymentMode, setPaymentMode] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const itemsPerPage = 10;

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summaryCards, setSummaryCards] = useState([
    { title: "Total Expenses (This Month)", value: "₹0", icon: DollarSign, gradient: "from-amber-400 via-yellow-500 to-orange-400" },
    { title: "No. of Expense Entries", value: "0", icon: FileText, gradient: "from-teal-400 via-cyan-500 to-blue-500" },
    { title: "Most Frequent Expense Type", value: "-", icon: TrendingUp, gradient: "from-emerald-400 via-green-500 to-teal-500" },
    { title: "Highest Single Expense", value: "₹0", icon: Target, gradient: "from-rose-400 via-pink-500 to-fuchsia-500" },
  ]);

  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });

    if (!error && data) {
      setExpenses(data.map((e, idx) => ({
        id: idx + 1,
        date: e.date,
        type: e.type,
        amount: Number(e.amount),
        paymentMode: e.payment_mode || '',
        description: e.description || '',
        refNo: e.ref_no || '',
      })));

      // Update summary
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
      const monthExpenses = data.filter(e => e.date >= monthStart);
      const totalMonth = monthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
      const highest = data.length > 0 ? Math.max(...data.map(e => Number(e.amount))) : 0;
      const typeCounts: Record<string, number> = {};
      data.forEach(e => { typeCounts[e.type] = (typeCounts[e.type] || 0) + 1; });
      const mostFrequent = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

      setSummaryCards([
        { title: "Total Expenses (This Month)", value: `₹${totalMonth.toLocaleString()}`, icon: DollarSign, gradient: "from-amber-400 via-yellow-500 to-orange-400" },
        { title: "No. of Expense Entries", value: data.length.toString(), icon: FileText, gradient: "from-teal-400 via-cyan-500 to-blue-500" },
        { title: "Most Frequent Type", value: mostFrequent, icon: TrendingUp, gradient: "from-emerald-400 via-green-500 to-teal-500" },
        { title: "Highest Single Expense", value: `₹${highest.toLocaleString()}`, icon: Target, gradient: "from-rose-400 via-pink-500 to-fuchsia-500" },
      ]);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const getExpenseTypeBadge = (type: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      Transport: { bg: '#dcfce7', text: '#166534' },
      Utilities: { bg: '#dbeafe', text: '#1e40af' },
      Office: { bg: '#f3e8ff', text: '#6b21a8' },
      Rent: { bg: '#ffedd5', text: '#9a3412' },
      Marketing: { bg: '#fce7f3', text: '#9d174d' },
      Maintenance: { bg: '#fef3c7', text: '#92400e' },
    };
    return colors[type] || { bg: '#f3f4f6', text: '#374151' };
  };

  const getPaymentModeBadge = (mode: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      UPI: { bg: '#dcfce7', text: '#15803d' },
      Bank: { bg: '#dbeafe', text: '#1d4ed8' },
      Cash: { bg: '#fef3c7', text: '#92400e' },
      Cheque: { bg: '#f3e8ff', text: '#7c3aed' },
      Card: { bg: '#fce7f3', text: '#be185d' },
    };
    return colors[mode] || { bg: '#f3f4f6', text: '#374151' };
  };

  const clearFilters = () => {
    setSearchTerm("");
    setExpenseType("all");
    setPaymentMode("all");
    setDateRange("all");
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
                  <img src={expenseIcon} alt="Expense Activity" className="h-5 w-5 object-contain" style={{ mixBlendMode: 'multiply' }} />
                  <span className="font-semibold" style={{ color: THEME.primary }}>Expense Activity</span>
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
                    <img src={expenseIcon} alt="Expense Activity" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
                  </motion.div>
                  <div className="flex flex-col">
                    <span>Expense Activity</span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="text-sm font-normal italic ml-[1.5ch]"
                      style={{ color: THEME.primary }}
                    >
                      Track and manage all business expenses
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
                onClick={() => setIsAddModalOpen(true)}
                style={{ backgroundColor: THEME.primary, color: '#fff' }}
                className="hover:opacity-90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
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
                      placeholder="Search by Description or Ref No"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 h-9"
                      style={{ borderColor: THEME.border }}
                    />
                  </div>
                  <Select value={expenseType} onValueChange={setExpenseType}>
                    <SelectTrigger className="h-9" style={{ borderColor: THEME.border }}>
                      <SelectValue placeholder="Expense Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="rent">Rent</SelectItem>
                      <SelectItem value="utilities">Utilities</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                      <SelectItem value="office">Office Supplies</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
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
                      <SelectItem value="quarter">This Quarter</SelectItem>
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
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
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

        {/* Expense Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <Card className="border-2 shadow-sm" style={{ borderColor: THEME.primaryLighter }}>
            <CardHeader>
              <CardTitle className="text-xl font-semibold" style={{ color: THEME.primaryDark }}>Expense Records</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow style={{ backgroundColor: THEME.primaryLightest, borderBottomColor: THEME.border }}>
                      <TableHead className="font-semibold" style={{ color: THEME.primaryDark }}>S.No</TableHead>
                      <TableHead className="font-semibold" style={{ color: THEME.primaryDark }}>Date</TableHead>
                      <TableHead className="font-semibold" style={{ color: THEME.primaryDark }}>Expense Type</TableHead>
                      <TableHead className="font-semibold" style={{ color: THEME.primaryDark }}>Amount</TableHead>
                      <TableHead className="font-semibold" style={{ color: THEME.primaryDark }}>Payment Mode</TableHead>
                      <TableHead className="font-semibold" style={{ color: THEME.primaryDark }}>Description</TableHead>
                      <TableHead className="font-semibold" style={{ color: THEME.primaryDark }}>Ref/Bill No</TableHead>
                      <TableHead className="font-semibold" style={{ color: THEME.primaryDark }}>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentExpenses.map((expense, index) => {
                      const typeColor = getExpenseTypeBadge(expense.type);
                      const pmColor = getPaymentModeBadge(expense.paymentMode);
                      return (
                        <TableRow key={expense.id} className="hover:opacity-90 transition-colors" style={{ backgroundColor: index % 2 === 0 ? '#fff' : THEME.primaryLightest }}>
                          <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                          <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge style={{ backgroundColor: typeColor.bg, color: typeColor.text, border: 'none' }}>{expense.type}</Badge>
                          </TableCell>
                          <TableCell className="font-semibold" style={{ color: THEME.primaryDark }}>₹{expense.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge style={{ backgroundColor: pmColor.bg, color: pmColor.text, border: 'none' }}>{expense.paymentMode}</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate" title={expense.description}>{expense.description}</TableCell>
                          <TableCell className="text-gray-600">{expense.refNo}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" style={{ color: THEME.primary }}><Eye className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="sm" className="text-blue-600" onClick={() => setEditingExpense(expense)}><Edit className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="sm" className="text-red-600"><Trash2 className="w-4 h-4" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4" style={{ borderTopColor: THEME.border, borderTopWidth: 1 }}>
                <div className="text-sm" style={{ color: THEME.primary }}>
                  Showing {startIndex + 1} to {Math.min(endIndex, expenses.length)} of {expenses.length} entries
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} style={{ borderColor: THEME.border, color: THEME.primaryDark }}>
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(i + 1)}
                      style={currentPage === i + 1 ? { backgroundColor: THEME.primary, color: '#fff' } : { borderColor: THEME.border, color: THEME.primaryDark }}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} style={{ borderColor: THEME.border, color: THEME.primaryDark }}>
                    Next <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center py-4"
        >
          <p className="text-sm" style={{ color: THEME.primary }}>
            Expense Activity • Neo Color Factory ~ The Colors of Your Dreams 🎨
          </p>
        </motion.div>

        {/* Add/Edit Expense Modal */}
        <AddEditExpenseModal
          open={isAddModalOpen || !!editingExpense}
          onOpenChange={(open) => {
            if (!open) {
              setIsAddModalOpen(false);
              setEditingExpense(null);
            }
          }}
          expense={editingExpense}
        />
      </div>
    </AppLayout>
  );
};

export default ExpenseActivity;
