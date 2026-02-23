import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { RefreshCw, Download, TrendingUp, TrendingDown, DollarSign, Percent, BarChart3, Calendar } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import dashboardHomeIcon from "@/assets/smart-home-3d-icon-4.png";
import profitLossIcon from "@/assets/profit-loss-report-icon.png";

const THEME = {
  primary: '#7a8a3a',
  primaryDark: '#525e28',
  primaryLight: '#BBCB64',
  primaryLighter: '#dde6a8',
  primaryLightest: '#f0f3de',
  border: '#BBCB64',
  gradientFrom: '#dde6a8',
  gradientMid: '#f0f3de',
  gradientTo: '#f7f9ee',
};

const mockProfitLossData = [
  { date: "2025-01-01", description: "Sales - Paint Products", income: 5090, expense: 0, netAmount: 5090, remarks: "Retail Sales" },
  { date: "2025-01-01", description: "Purchase - Raw Materials", income: 0, expense: 3000, netAmount: -3000, remarks: "Stock Purchase" },
  { date: "2025-01-02", description: "Sales - Hardware", income: 7080, expense: 0, netAmount: 7080, remarks: "Wholesale Order" },
  { date: "2025-01-03", description: "Rent Payment", income: 0, expense: 15000, netAmount: -15000, remarks: "Monthly Rent" },
  { date: "2025-01-04", description: "Sales - Cement", income: 11800, expense: 0, netAmount: 11800, remarks: "Bulk Order" },
  { date: "2025-01-05", description: "Utility Bills", income: 0, expense: 2500, netAmount: -2500, remarks: "Electricity & Water" },
];

const profitVsExpenseData = [
  { month: "Jan", profit: 45000, expense: 30000 },
  { month: "Feb", profit: 52000, expense: 33000 },
  { month: "Mar", profit: 48000, expense: 32000 },
  { month: "Apr", profit: 61000, expense: 38000 },
  { month: "May", profit: 55000, expense: 35000 },
  { month: "Jun", profit: 67000, expense: 40000 },
];

const monthlyProfitTrend = [
  { month: "Jan", netProfit: 15000 },
  { month: "Feb", netProfit: 19000 },
  { month: "Mar", netProfit: 16000 },
  { month: "Apr", netProfit: 23000 },
  { month: "May", netProfit: 20000 },
  { month: "Jun", netProfit: 27000 },
];

const profitComposition = [
  { name: "Sales Revenue", value: 65, color: "#7a8a3a" },
  { name: "Service Income", value: 20, color: "#BBCB64" },
  { name: "Other Income", value: 15, color: "#525e28" },
];

const ProfitLossReport = () => {
  const navigate = useNavigate();
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const totalIncome = mockProfitLossData.reduce((sum, item) => sum + item.income, 0);
  const totalExpense = mockProfitLossData.reduce((sum, item) => sum + item.expense, 0);
  const grossProfit = totalIncome - totalExpense;
  const netProfitMargin = totalIncome > 0 ? ((grossProfit / totalIncome) * 100).toFixed(2) : "0.00";
  const recordCount = mockProfitLossData.length;

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
                  <img src={profitLossIcon} alt="Profit/Loss Report" className="h-5 w-5 object-contain" style={{ mixBlendMode: 'multiply' }} />
                  <span className="font-semibold" style={{ color: THEME.primary }}>Profit/Loss Report</span>
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
                    <img src={profitLossIcon} alt="Profit/Loss Report" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
                  </motion.div>
                  <div className="flex flex-col">
                    <span>Profit / Loss Report</span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="text-sm font-normal italic ml-[3.5ch]"
                      style={{ color: THEME.primary }}
                    >
                      Analyze overall business profitability & trends
                    </motion.span>
                  </div>
                </motion.h1>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                >
                  <Badge className="text-white border-none text-sm px-4 py-1 shadow-md" style={{ background: `linear-gradient(to right, ${THEME.primary}, ${THEME.primaryDark})` }}>
                    {recordCount} Records
                  </Badge>
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-2"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto bg-white transition-all duration-300 shadow-sm hover:shadow-md group"
                style={{ borderColor: THEME.border, color: THEME.primary }}
              >
                <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto text-white hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                style={{ background: `linear-gradient(to right, ${THEME.primary}, ${THEME.primaryDark})`, borderColor: THEME.primary }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white/90 mb-1">Total Revenue</h3>
              <p className="text-2xl font-bold text-white">₹{totalIncome.toLocaleString()}</p>
            </div>
            <div className="absolute right-4 bottom-4 opacity-80">
              <TrendingUp className="h-16 w-16 text-white/40" strokeWidth={1.5} />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-400 via-rose-400 to-pink-400 p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white/90 mb-1">Total Expenses</h3>
              <p className="text-2xl font-bold text-white">₹{totalExpense.toLocaleString()}</p>
            </div>
            <div className="absolute right-4 bottom-4 opacity-80">
              <TrendingDown className="h-16 w-16 text-white/40" strokeWidth={1.5} />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-400 via-green-400 to-teal-400 p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white/90 mb-1">Gross Profit</h3>
              <p className="text-2xl font-bold text-white">₹{grossProfit.toLocaleString()}</p>
            </div>
            <div className="absolute right-4 bottom-4 opacity-80">
              <DollarSign className="h-16 w-16 text-white/40" strokeWidth={1.5} />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-400 via-purple-400 to-indigo-400 p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white/90 mb-1">Net Profit Margin</h3>
              <p className="text-2xl font-bold text-white">{netProfitMargin}%</p>
            </div>
            <div className="absolute right-4 bottom-4 opacity-80">
              <Percent className="h-16 w-16 text-white/40" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div
          className="p-4 rounded-xl border-2 shadow-sm"
          style={{
            background: `linear-gradient(to right, ${THEME.gradientFrom}, ${THEME.gradientMid})`,
            borderColor: THEME.border,
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: THEME.primaryDark }}>Date From</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-white hover:opacity-90 transition-colors"
                    style={{ borderColor: THEME.border, color: THEME.primary }}
                  >
                    <Calendar className="mr-2 h-4 w-4" style={{ color: THEME.primary }} />
                    {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus className="pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: THEME.primaryDark }}>Date To</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-white hover:opacity-90 transition-colors"
                    style={{ borderColor: THEME.border, color: THEME.primary }}
                  >
                    <Calendar className="mr-2 h-4 w-4" style={{ color: THEME.primary }} />
                    {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent mode="single" selected={dateTo} onSelect={setDateTo} initialFocus className="pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: THEME.primaryDark }}>Category</label>
              <Select>
                <SelectTrigger className="bg-white hover:opacity-90 transition-colors" style={{ borderColor: THEME.border, color: THEME.primary }}>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2" style={{ borderColor: THEME.primaryLight }}>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: THEME.primaryDark }}>Customer / Vendor</label>
              <Select>
                <SelectTrigger className="bg-white hover:opacity-90 transition-colors" style={{ borderColor: THEME.border, color: THEME.primary }}>
                  <SelectValue placeholder="All Parties" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2" style={{ borderColor: THEME.primaryLight }}>
                  <SelectItem value="all">All Parties</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button className="text-white hover:opacity-90" style={{ backgroundColor: THEME.primary }}>
              Generate Report
            </Button>
            <Button variant="outline" className="bg-white" style={{ borderColor: THEME.border, color: THEME.primary }}>
              Reset
            </Button>
          </div>
        </div>

        {/* Profit & Loss Transactions Table */}
        <div className="bg-white rounded-xl border-2 shadow-lg overflow-hidden" style={{ borderColor: THEME.primaryLight }}>
          <div
            className="p-4 border-b-2"
            style={{
              background: `linear-gradient(to right, ${THEME.gradientFrom}, ${THEME.gradientMid})`,
              borderColor: THEME.primaryLight,
            }}
          >
            <h2 className="text-lg font-semibold" style={{ color: THEME.primaryDark }}>Profit & Loss Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow style={{ backgroundColor: THEME.primaryLightest }}>
                  <TableHead style={{ color: THEME.primaryDark }}>Date</TableHead>
                  <TableHead style={{ color: THEME.primaryDark }}>Description</TableHead>
                  <TableHead className="text-right" style={{ color: THEME.primaryDark }}>Income</TableHead>
                  <TableHead className="text-right" style={{ color: THEME.primaryDark }}>Expense</TableHead>
                  <TableHead className="text-right" style={{ color: THEME.primaryDark }}>Net Amount</TableHead>
                  <TableHead style={{ color: THEME.primaryDark }}>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockProfitLossData.map((row, idx) => (
                  <TableRow key={idx} className="hover:bg-opacity-50 transition-colors">
                    <TableCell>{row.date}</TableCell>
                    <TableCell className="font-medium">{row.description}</TableCell>
                    <TableCell className="text-right font-medium" style={{ color: row.income > 0 ? '#16a34a' : 'inherit' }}>
                      {row.income > 0 ? `₹${row.income.toLocaleString()}` : "-"}
                    </TableCell>
                    <TableCell className="text-right font-medium" style={{ color: row.expense > 0 ? '#dc2626' : 'inherit' }}>
                      {row.expense > 0 ? `₹${row.expense.toLocaleString()}` : "-"}
                    </TableCell>
                    <TableCell className="text-right font-bold" style={{ color: row.netAmount >= 0 ? '#16a34a' : '#dc2626' }}>
                      ₹{row.netAmount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{row.remarks}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="p-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
                <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
                <PaginationItem><PaginationNext href="#" /></PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border-2 shadow-lg overflow-hidden" style={{ borderColor: THEME.primaryLight }}>
            <div className="p-4 border-b-2" style={{ background: `linear-gradient(to right, ${THEME.gradientFrom}, ${THEME.gradientMid})`, borderColor: THEME.primaryLight }}>
              <h2 className="text-lg font-semibold" style={{ color: THEME.primaryDark }}>Profit vs Expense</h2>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={profitVsExpenseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="profit" stackId="1" stroke="#16a34a" fill="#bbf7d0" name="Profit (₹)" />
                  <Area type="monotone" dataKey="expense" stackId="2" stroke="#dc2626" fill="#fecaca" name="Expense (₹)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 shadow-lg overflow-hidden" style={{ borderColor: THEME.primaryLight }}>
            <div className="p-4 border-b-2" style={{ background: `linear-gradient(to right, ${THEME.gradientFrom}, ${THEME.gradientMid})`, borderColor: THEME.primaryLight }}>
              <h2 className="text-lg font-semibold" style={{ color: THEME.primaryDark }}>Monthly Profit Trend</h2>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyProfitTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="netProfit" stroke={THEME.primary} strokeWidth={2} name="Net Profit (₹)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 shadow-lg overflow-hidden" style={{ borderColor: THEME.primaryLight }}>
          <div className="p-4 border-b-2" style={{ background: `linear-gradient(to right, ${THEME.gradientFrom}, ${THEME.gradientMid})`, borderColor: THEME.primaryLight }}>
            <h2 className="text-lg font-semibold" style={{ color: THEME.primaryDark }}>Profit Composition</h2>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={profitComposition} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={100} dataKey="value">
                  {profitComposition.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Footer */}
        <div
          className="p-6 rounded-xl border-2"
          style={{
            background: `linear-gradient(to right, ${THEME.gradientFrom}, ${THEME.gradientMid})`,
            borderColor: THEME.border,
          }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-lg font-semibold" style={{ color: grossProfit >= 0 ? '#16a34a' : '#dc2626' }}>
              Net Profit/Loss Summary: ₹{grossProfit.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Generated On: {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfitLossReport;
