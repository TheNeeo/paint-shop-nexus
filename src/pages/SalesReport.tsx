import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { RefreshCw, Download, Printer, TrendingUp, DollarSign, FileText, BarChart3 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Mock data for demonstration
const mockSalesData = [
  { date: "2025-01-01", invoiceNo: "INV-001", customerName: "John Doe", category: "Paints", product: "Asian Paints Premium", qty: 10, rate: 500, gst: 90, total: 5090, paymentMode: "Cash" },
  { date: "2025-01-02", invoiceNo: "INV-002", customerName: "Jane Smith", category: "Hardware", product: "Steel Rods", qty: 20, rate: 300, gst: 1080, total: 7080, paymentMode: "UPI" },
  { date: "2025-01-03", invoiceNo: "INV-003", customerName: "Bob Wilson", category: "Paints", product: "Nerolac Excel", qty: 15, rate: 450, gst: 1215, total: 8215, paymentMode: "Card" },
  { date: "2025-01-04", invoiceNo: "INV-004", customerName: "Alice Brown", category: "Cement", product: "UltraTech Cement", qty: 25, rate: 400, gst: 1800, total: 11800, paymentMode: "Cash" },
  { date: "2025-01-05", invoiceNo: "INV-005", customerName: "Charlie Davis", category: "Hardware", product: "TMT Bars", qty: 30, rate: 550, gst: 2970, total: 19470, paymentMode: "UPI" },
];

const trendData = [
  { month: "Jan", sales: 45000 },
  { month: "Feb", sales: 52000 },
  { month: "Mar", sales: 48000 },
  { month: "Apr", sales: 61000 },
  { month: "May", sales: 55000 },
  { month: "Jun", sales: 67000 },
];

const categoryData = [
  { category: "Paints", amount: 85000 },
  { category: "Hardware", amount: 65000 },
  { category: "Cement", amount: 95000 },
  { category: "Tools", amount: 45000 },
];

const gstData = [
  { name: "CGST", value: 15000, color: "#A8884D" },
  { name: "SGST", value: 15000, color: "#C4A869" },
  { name: "IGST", value: 8000, color: "#8B7340" },
];

const SalesReport = () => {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const totalSales = mockSalesData.reduce((sum, item) => sum + item.total, 0);
  const totalGST = mockSalesData.reduce((sum, item) => sum + item.gst, 0);
  const invoiceCount = mockSalesData.length;
  const avgInvoiceValue = totalSales / invoiceCount;

  return (
    <AppLayout>
      <div className="min-h-screen p-6 space-y-6" style={{ backgroundColor: "hsl(41, 31%, 95%)" }}>
        {/* Header */}
        <div className="space-y-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Reports & Analytics</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Sales Report</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: "hsl(41, 31%, 30%)" }}>Sales Report</h1>
              <p className="text-muted-foreground">Track all customer sales transactions and performance trends.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <Card style={{ borderColor: "hsl(41, 31%, 48%)", backgroundColor: "white" }}>
          <CardHeader>
            <CardTitle style={{ color: "hsl(41, 31%, 30%)" }}>Filter Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date From</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      {dateFrom ? format(dateFrom, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus className="pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date To</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      {dateTo ? format(dateTo, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus className="pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="paints">Paints</SelectItem>
                    <SelectItem value="hardware">Hardware</SelectItem>
                    <SelectItem value="cement">Cement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Customer</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Customers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Mode</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Modes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modes</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button style={{ backgroundColor: "hsl(41, 31%, 48%)", color: "white" }} className="hover:opacity-90">
                Generate Report
              </Button>
              <Button variant="outline">Reset</Button>
            </div>
          </CardContent>
        </Card>

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

        {/* Report Table */}
        <Card style={{ borderColor: "hsl(41, 31%, 48%)", backgroundColor: "white" }}>
          <CardHeader>
            <CardTitle style={{ color: "hsl(41, 31%, 30%)" }}>Sales Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow style={{ borderColor: "hsl(41, 31%, 70%)" }}>
                    <TableHead>Date</TableHead>
                    <TableHead>Invoice No</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">GST</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Payment Mode</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSalesData.map((row, idx) => (
                    <TableRow key={idx} style={{ borderColor: "hsl(41, 31%, 85%)" }}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell className="font-medium">{row.invoiceNo}</TableCell>
                      <TableCell>{row.customerName}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: "hsl(41, 31%, 90%)", color: "hsl(41, 31%, 30%)" }}>
                          {row.category}
                        </span>
                      </TableCell>
                      <TableCell>{row.product}</TableCell>
                      <TableCell className="text-right">{row.qty}</TableCell>
                      <TableCell className="text-right">₹{row.rate}</TableCell>
                      <TableCell className="text-right">₹{row.gst}</TableCell>
                      <TableCell className="text-right font-semibold">₹{row.total}</TableCell>
                      <TableCell>{row.paymentMode}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Trend Line Chart */}
          <Card style={{ borderColor: "hsl(41, 31%, 48%)", backgroundColor: "white" }}>
            <CardHeader>
              <CardTitle style={{ color: "hsl(41, 31%, 30%)" }}>Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(41, 31%, 85%)" />
                  <XAxis dataKey="month" stroke="hsl(41, 31%, 40%)" />
                  <YAxis stroke="hsl(41, 31%, 40%)" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="hsl(41, 31%, 48%)" strokeWidth={2} name="Sales (₹)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category-wise Sales Bar Chart */}
          <Card style={{ borderColor: "hsl(41, 31%, 48%)", backgroundColor: "white" }}>
            <CardHeader>
              <CardTitle style={{ color: "hsl(41, 31%, 30%)" }}>Category-wise Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(41, 31%, 85%)" />
                  <XAxis dataKey="category" stroke="hsl(41, 31%, 40%)" />
                  <YAxis stroke="hsl(41, 31%, 40%)" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="hsl(41, 31%, 48%)" name="Amount (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* GST Contribution Pie Chart */}
        <Card style={{ borderColor: "hsl(41, 31%, 48%)", backgroundColor: "white" }}>
          <CardHeader>
            <CardTitle style={{ color: "hsl(41, 31%, 30%)" }}>GST Contribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gstData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
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
        <Card style={{ borderColor: "hsl(41, 31%, 48%)", backgroundColor: "white" }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold" style={{ color: "hsl(41, 31%, 30%)" }}>
                  Grand Total: ₹{totalSales.toLocaleString()}
                </p>
                <p className="text-sm" style={{ color: "hsl(41, 31%, 40%)" }}>
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
