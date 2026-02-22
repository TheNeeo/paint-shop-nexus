import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { RefreshCw, Download, TrendingUp, DollarSign, FileText, BarChart3, Search, Calendar, ShoppingCart } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import dashboardHomeIcon from "@/assets/smart-home-3d-icon-2.png";
import salesReportIcon from "@/assets/sales-report-icon.png";

// Theme colors
const THEME = {
  primary: '#c4686e',
  primaryDark: '#8b3a3f',
  primaryLight: '#F5CBCB',
  primaryLighter: '#fae8e8',
  primaryLightest: '#fdf2f2',
  border: '#e8a5a8',
  gradientFrom: '#f5cbcb',
  gradientMid: '#fae8e8',
  gradientTo: '#fdf2f2',
};

const mockSalesData = [
  { date: "2025-01-01", invoiceNo: "INV-001", customerName: "John Doe", category: "Paints", product: "Asian Paints Premium", qty: 10, rate: 500, gst: 90, total: 5090, paymentMode: "Cash" },
  { date: "2025-01-02", invoiceNo: "INV-002", customerName: "Jane Smith", category: "Hardware", product: "Steel Rods", qty: 20, rate: 300, gst: 1080, total: 7080, paymentMode: "UPI" },
  { date: "2025-01-03", invoiceNo: "INV-003", customerName: "Bob Wilson", category: "Paints", product: "Nerolac Excel", qty: 15, rate: 450, gst: 1215, total: 8215, paymentMode: "Card" },
  { date: "2025-01-04", invoiceNo: "INV-004", customerName: "Alice Brown", category: "Cement", product: "UltraTech Cement", qty: 25, rate: 400, gst: 1800, total: 11800, paymentMode: "Cash" },
  { date: "2025-01-05", invoiceNo: "INV-005", customerName: "Charlie Davis", category: "Hardware", product: "TMT Bars", qty: 30, rate: 550, gst: 2970, total: 19470, paymentMode: "UPI" },
];

const trendData = [
  { month: "Jan", sales: 45000 }, { month: "Feb", sales: 52000 }, { month: "Mar", sales: 48000 },
  { month: "Apr", sales: 61000 }, { month: "May", sales: 55000 }, { month: "Jun", sales: 67000 },
];

const categoryData = [
  { category: "Paints", amount: 85000 }, { category: "Hardware", amount: 65000 },
  { category: "Cement", amount: 95000 }, { category: "Tools", amount: 45000 },
];

const gstData = [
  { name: "CGST", value: 15000, color: "#c4686e" },
  { name: "SGST", value: 15000, color: "#e8a5a8" },
  { name: "IGST", value: 8000, color: "#8b3a3f" },
];

const SalesReport = () => {
  const navigate = useNavigate();
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const totalSales = mockSalesData.reduce((sum, item) => sum + item.total, 0);
  const totalGST = mockSalesData.reduce((sum, item) => sum + item.gst, 0);
  const invoiceCount = mockSalesData.length;
  const avgInvoiceValue = totalSales / invoiceCount;

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
                  <img src={salesReportIcon} alt="Sales Report" className="h-5 w-5 object-contain" style={{ mixBlendMode: 'multiply' }} />
                  <span className="font-semibold" style={{ color: THEME.primary }}>Sales Report</span>
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
                    <img src={salesReportIcon} alt="Sales Report" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
                  </motion.div>
                  <div className="flex flex-col">
                    <span>Sales Report</span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="text-sm font-normal italic ml-[3.5ch]"
                      style={{ color: THEME.primary }}
                    >
                      Track all customer sales transactions & performance trends
                    </motion.span>
                  </div>
                </motion.h1>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                >
                  <Badge className="text-white border-none text-sm px-4 py-1 shadow-md" style={{ background: `linear-gradient(to right, ${THEME.primary}, ${THEME.primaryDark})` }}>
                    {invoiceCount} Records
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
              <h3 className="text-lg font-semibold text-white/90 mb-1">Total Sales Amount</h3>
              <p className="text-2xl font-bold text-white">₹{totalSales.toLocaleString()}</p>
            </div>
            <div className="absolute right-4 bottom-4 opacity-80">
              <DollarSign className="h-16 w-16 text-white/40" strokeWidth={1.5} />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-400 via-green-400 to-teal-400 p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white/90 mb-1">Total GST Collected</h3>
              <p className="text-2xl font-bold text-white">₹{totalGST.toLocaleString()}</p>
            </div>
            <div className="absolute right-4 bottom-4 opacity-80">
              <TrendingUp className="h-16 w-16 text-white/40" strokeWidth={1.5} />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-400 via-pink-400 to-red-400 p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white/90 mb-1">No. of Invoices</h3>
              <p className="text-2xl font-bold text-white">{invoiceCount}</p>
            </div>
            <div className="absolute right-4 bottom-4 opacity-80">
              <FileText className="h-16 w-16 text-white/40" strokeWidth={1.5} />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-400 via-purple-400 to-indigo-400 p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white/90 mb-1">Avg. Invoice Value</h3>
              <p className="text-2xl font-bold text-white">₹{avgInvoiceValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="absolute right-4 bottom-4 opacity-80">
              <BarChart3 className="h-16 w-16 text-white/40" strokeWidth={1.5} />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                  <SelectItem value="paints">Paints</SelectItem>
                  <SelectItem value="hardware">Hardware</SelectItem>
                  <SelectItem value="cement">Cement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: THEME.primaryDark }}>Customer</label>
              <Select>
                <SelectTrigger className="bg-white hover:opacity-90 transition-colors" style={{ borderColor: THEME.border, color: THEME.primary }}>
                  <SelectValue placeholder="All Customers" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2" style={{ borderColor: THEME.primaryLight }}>
                  <SelectItem value="all">All Customers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: THEME.primaryDark }}>Payment Mode</label>
              <Select>
                <SelectTrigger className="bg-white hover:opacity-90 transition-colors" style={{ borderColor: THEME.border, color: THEME.primary }}>
                  <SelectValue placeholder="All Modes" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2" style={{ borderColor: THEME.primaryLight }}>
                  <SelectItem value="all">All Modes</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
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

        {/* Sales Transactions Table */}
        <div className="bg-white rounded-xl border-2 shadow-lg overflow-hidden" style={{ borderColor: THEME.primaryLight }}>
          <div
            className="p-4 border-b-2"
            style={{
              background: `linear-gradient(to right, ${THEME.gradientFrom}, ${THEME.gradientMid})`,
              borderColor: THEME.primaryLight,
            }}
          >
            <h2 className="text-lg font-semibold" style={{ color: THEME.primaryDark }}>Sales Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow style={{ backgroundColor: THEME.primaryLightest }}>
                  <TableHead className="font-semibold" style={{ color: THEME.primaryDark }}>Date</TableHead>
                  <TableHead className="font-semibold" style={{ color: THEME.primaryDark }}>Invoice No</TableHead>
                  <TableHead className="font-semibold" style={{ color: THEME.primaryDark }}>Customer Name</TableHead>
                  <TableHead className="font-semibold" style={{ color: THEME.primaryDark }}>Category</TableHead>
                  <TableHead className="font-semibold" style={{ color: THEME.primaryDark }}>Product</TableHead>
                  <TableHead className="text-right font-semibold" style={{ color: THEME.primaryDark }}>Qty</TableHead>
                  <TableHead className="text-right font-semibold" style={{ color: THEME.primaryDark }}>Rate</TableHead>
                  <TableHead className="text-right font-semibold" style={{ color: THEME.primaryDark }}>GST</TableHead>
                  <TableHead className="text-right font-semibold" style={{ color: THEME.primaryDark }}>Total</TableHead>
                  <TableHead className="font-semibold" style={{ color: THEME.primaryDark }}>Payment Mode</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSalesData.map((row, idx) => (
                  <TableRow key={idx} className="transition-colors duration-200" style={{ borderColor: THEME.primaryLight }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = THEME.primaryLightest)} onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}>
                    <TableCell className="text-gray-700">{row.date}</TableCell>
                    <TableCell className="font-medium" style={{ color: THEME.primary }}>{row.invoiceNo}</TableCell>
                    <TableCell className="text-gray-700">{row.customerName}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: THEME.primaryLight, color: THEME.primaryDark }}>{row.category}</span>
                    </TableCell>
                    <TableCell className="text-gray-700">{row.product}</TableCell>
                    <TableCell className="text-right text-gray-700">{row.qty}</TableCell>
                    <TableCell className="text-right text-gray-700">₹{row.rate}</TableCell>
                    <TableCell className="text-right text-gray-700">₹{row.gst}</TableCell>
                    <TableCell className="text-right font-semibold" style={{ color: THEME.primaryDark }}>₹{row.total}</TableCell>
                    <TableCell>
                      <Badge style={{ backgroundColor: THEME.primaryLight, color: THEME.primaryDark, border: `1px solid ${THEME.border}` }}>{row.paymentMode}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="p-4 border-t" style={{ borderColor: THEME.primaryLight }}>
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white shadow-lg" style={{ borderColor: THEME.border }}>
            <CardHeader>
              <CardTitle style={{ color: THEME.primaryDark }}>Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={THEME.primaryLight} />
                  <XAxis dataKey="month" stroke={THEME.primary} />
                  <YAxis stroke={THEME.primary} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke={THEME.primary} strokeWidth={2} name="Sales (₹)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg" style={{ borderColor: THEME.border }}>
            <CardHeader>
              <CardTitle style={{ color: THEME.primaryDark }}>Category-wise Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={THEME.primaryLight} />
                  <XAxis dataKey="category" stroke={THEME.primary} />
                  <YAxis stroke={THEME.primary} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill={THEME.primary} name="Amount (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* GST Pie Chart */}
        <Card className="bg-white shadow-lg" style={{ borderColor: THEME.border }}>
          <CardHeader>
            <CardTitle style={{ color: THEME.primaryDark }}>GST Contribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={gstData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                  {gstData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Footer */}
        <Card className="bg-white shadow-lg" style={{ borderColor: THEME.border }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold" style={{ color: THEME.primaryDark }}>
                  Grand Total: ₹{totalSales.toLocaleString()}
                </p>
                <p className="text-sm" style={{ color: THEME.primary }}>
                  GST Total: ₹{totalGST.toLocaleString()}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Last Updated: {format(new Date(), "PPpp")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default SalesReport;
