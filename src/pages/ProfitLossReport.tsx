import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { RefreshCw, Download, Printer, TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Mock data for demonstration
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
  { name: "Sales Revenue", value: 65, color: "hsl(6, 31%, 64%)" },
  { name: "Service Income", value: 20, color: "hsl(6, 41%, 54%)" },
  { name: "Other Income", value: 15, color: "hsl(6, 21%, 74%)" },
];

const ProfitLossReport = () => {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const totalIncome = mockProfitLossData.reduce((sum, item) => sum + item.income, 0);
  const totalExpense = mockProfitLossData.reduce((sum, item) => sum + item.expense, 0);
  const grossProfit = totalIncome - totalExpense;
  const netProfitMargin = totalIncome > 0 ? ((grossProfit / totalIncome) * 100).toFixed(2) : "0.00";

  return (
    <AppLayout>
      <div className="min-h-screen p-6 space-y-6" style={{ backgroundColor: "hsl(6, 31%, 95%)" }}>
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
                <BreadcrumbPage>Profit/Loss Report</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: "hsl(6, 31%, 30%)" }}>Profit / Loss Report</h1>
              <p className="text-muted-foreground">Analyze overall business profitability.</p>
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
        <Card style={{ borderColor: "hsl(6, 31%, 64%)", backgroundColor: "white" }}>
          <CardHeader>
            <CardTitle style={{ color: "hsl(6, 31%, 30%)" }}>Filter Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="purchase">Purchase</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Customer / Vendor</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Parties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Parties</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button style={{ backgroundColor: "hsl(6, 31%, 64%)", color: "white" }} className="hover:opacity-90">
                Generate Report
              </Button>
              <Button variant="outline">Reset</Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-400 via-pink-400 to-red-400 p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white/90 mb-1">Total Revenue</h3>
              <p className="text-2xl font-bold text-white">₹{totalIncome.toLocaleString()}</p>
            </div>
            <div className="absolute right-4 bottom-4 opacity-80">
              <TrendingUp className="h-16 w-16 text-white/40" strokeWidth={1.5} />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-400 via-rose-500 to-pink-500 p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
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

        {/* Report Table */}
        <Card style={{ borderColor: "hsl(6, 31%, 64%)", backgroundColor: "white" }}>
          <CardHeader>
            <CardTitle style={{ color: "hsl(6, 31%, 30%)" }}>Profit & Loss Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow style={{ borderColor: "hsl(6, 31%, 70%)" }}>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Income</TableHead>
                    <TableHead className="text-right">Expense</TableHead>
                    <TableHead className="text-right">Net Amount</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockProfitLossData.map((row, idx) => (
                    <TableRow key={idx} style={{ borderColor: "hsl(6, 31%, 85%)" }}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell className="font-medium">{row.description}</TableCell>
                      <TableCell className="text-right" style={{ color: row.income > 0 ? "hsl(142, 76%, 36%)" : "inherit" }}>
                        {row.income > 0 ? `₹${row.income.toLocaleString()}` : "-"}
                      </TableCell>
                      <TableCell className="text-right" style={{ color: row.expense > 0 ? "hsl(0, 84%, 60%)" : "inherit" }}>
                        {row.expense > 0 ? `₹${row.expense.toLocaleString()}` : "-"}
                      </TableCell>
                      <TableCell className="text-right font-semibold" style={{ color: row.netAmount >= 0 ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 60%)" }}>
                        ₹{row.netAmount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{row.remarks}</TableCell>
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
          {/* Profit vs Expense Area Chart */}
          <Card style={{ borderColor: "hsl(6, 31%, 64%)", backgroundColor: "white" }}>
            <CardHeader>
              <CardTitle style={{ color: "hsl(6, 31%, 30%)" }}>Profit vs Expense</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={profitVsExpenseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(6, 31%, 85%)" />
                  <XAxis dataKey="month" stroke="hsl(6, 31%, 40%)" />
                  <YAxis stroke="hsl(6, 31%, 40%)" />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="profit" stackId="1" stroke="hsl(142, 76%, 36%)" fill="hsl(142, 76%, 80%)" name="Profit (₹)" />
                  <Area type="monotone" dataKey="expense" stackId="2" stroke="hsl(0, 84%, 60%)" fill="hsl(0, 84%, 85%)" name="Expense (₹)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Profit Trend Line Chart */}
          <Card style={{ borderColor: "hsl(6, 31%, 64%)", backgroundColor: "white" }}>
            <CardHeader>
              <CardTitle style={{ color: "hsl(6, 31%, 30%)" }}>Monthly Profit Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyProfitTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(6, 31%, 85%)" />
                  <XAxis dataKey="month" stroke="hsl(6, 31%, 40%)" />
                  <YAxis stroke="hsl(6, 31%, 40%)" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="netProfit" stroke="hsl(6, 31%, 64%)" strokeWidth={2} name="Net Profit (₹)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Profit Composition Pie Chart */}
        <Card style={{ borderColor: "hsl(6, 31%, 64%)", backgroundColor: "white" }}>
          <CardHeader>
            <CardTitle style={{ color: "hsl(6, 31%, 30%)" }}>Profit Composition</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={profitComposition}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {profitComposition.map((entry, index) => (
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
        <Card style={{ borderColor: "hsl(6, 31%, 64%)", backgroundColor: "white" }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold" style={{ color: grossProfit >= 0 ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 60%)" }}>
                  Net Profit/Loss Summary: ₹{grossProfit.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Generated On: {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ProfitLossReport;
