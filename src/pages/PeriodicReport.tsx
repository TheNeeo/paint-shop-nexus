import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Download, Printer, Calendar as CalendarIcon, TrendingUp, ShoppingCart, DollarSign } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts";

// Mock data for demonstration
const mockPeriodicData = [
  { period: "Jan 2025", totalSales: 150000, totalPurchase: 95000, gst: 27000, netProfit: 55000, avgOrderValue: 3000 },
  { period: "Feb 2025", totalSales: 175000, totalPurchase: 110000, gst: 31500, netProfit: 65000, avgOrderValue: 3500 },
  { period: "Mar 2025", totalSales: 165000, totalPurchase: 105000, gst: 29700, netProfit: 60000, avgOrderValue: 3300 },
  { period: "Apr 2025", totalSales: 190000, totalPurchase: 120000, gst: 34200, netProfit: 70000, avgOrderValue: 3800 },
  { period: "May 2025", totalSales: 185000, totalPurchase: 115000, gst: 33300, netProfit: 70000, avgOrderValue: 3700 },
  { period: "Jun 2025", totalSales: 210000, totalPurchase: 130000, gst: 37800, netProfit: 80000, avgOrderValue: 4200 },
];

const periodicComparisonData = [
  { period: "Q1 2024", sales: 420000, purchase: 280000 },
  { period: "Q2 2024", sales: 485000, purchase: 310000 },
  { period: "Q3 2024", sales: 510000, purchase: 330000 },
  { period: "Q4 2024", sales: 565000, purchase: 365000 },
  { period: "Q1 2025", sales: 490000, purchase: 310000 },
];

const yearlyTrendData = [
  { year: "2020", value: 1500000 },
  { year: "2021", value: 1750000 },
  { year: "2022", value: 1950000 },
  { year: "2023", value: 2200000 },
  { year: "2024", value: 2450000 },
  { year: "2025", value: 2100000 },
];

const salesVsPurchaseData = [
  { month: "Jan", sales: 150000, purchase: 95000 },
  { month: "Feb", sales: 175000, purchase: 110000 },
  { month: "Mar", sales: 165000, purchase: 105000 },
  { month: "Apr", sales: 190000, purchase: 120000 },
  { month: "May", sales: 185000, purchase: 115000 },
  { month: "Jun", sales: 210000, purchase: 130000 },
];

const PeriodicReport = () => {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [periodType, setPeriodType] = useState("monthly");

  const totalSales = mockPeriodicData.reduce((sum, item) => sum + item.totalSales, 0);
  const totalPurchase = mockPeriodicData.reduce((sum, item) => sum + item.totalPurchase, 0);
  const totalGST = mockPeriodicData.reduce((sum, item) => sum + item.gst, 0);
  const totalNetProfit = mockPeriodicData.reduce((sum, item) => sum + item.netProfit, 0);

  return (
    <AppLayout>
      <div className="min-h-screen p-6 space-y-6" style={{ backgroundColor: "hsl(278, 50%, 96%)" }}>
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
                <BreadcrumbPage>Periodic Reports</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: "hsl(278, 50%, 30%)" }}>Periodic Reports</h1>
              <p className="text-muted-foreground">Generate periodic business performance summaries.</p>
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
        <Card style={{ borderColor: "hsl(278, 50%, 70%)", backgroundColor: "white" }}>
          <CardHeader>
            <CardTitle style={{ color: "hsl(278, 50%, 30%)" }}>Filter Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Period Type</label>
                <Select value={periodType} onValueChange={setPeriodType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date From</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
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
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus className="pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category / Product</label>
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
            </div>

            <div className="flex gap-2 mt-4">
              <Button style={{ backgroundColor: "hsl(278, 50%, 70%)", color: "white" }} className="hover:opacity-90">
                Generate Report
              </Button>
              <Button variant="outline">Reset</Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card style={{ borderColor: "hsl(278, 50%, 70%)", backgroundColor: "white" }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Period</CardTitle>
              <CalendarIcon className="h-4 w-4" style={{ color: "hsl(278, 50%, 70%)" }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: "hsl(278, 50%, 30%)" }}>
                {periodType === "monthly" ? "Monthly" : periodType === "weekly" ? "Weekly" : periodType === "yearly" ? "Yearly" : "Daily"}
              </div>
              <p className="text-xs text-muted-foreground">Current view</p>
            </CardContent>
          </Card>

          <Card style={{ borderColor: "hsl(278, 50%, 70%)", backgroundColor: "white" }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <TrendingUp className="h-4 w-4" style={{ color: "hsl(278, 50%, 70%)" }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: "hsl(278, 50%, 30%)" }}>
                ₹{totalSales.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">+12% from last period</p>
            </CardContent>
          </Card>

          <Card style={{ borderColor: "hsl(278, 50%, 70%)", backgroundColor: "white" }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
              <ShoppingCart className="h-4 w-4" style={{ color: "hsl(278, 50%, 70%)" }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: "hsl(278, 50%, 30%)" }}>
                ₹{totalPurchase.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">+8% from last period</p>
            </CardContent>
          </Card>

          <Card style={{ borderColor: "hsl(278, 50%, 70%)", backgroundColor: "white" }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <DollarSign className="h-4 w-4" style={{ color: "hsl(278, 50%, 70%)" }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: "hsl(142, 76%, 36%)" }}>
                ₹{totalNetProfit.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Healthy margin</p>
            </CardContent>
          </Card>

          <Card style={{ borderColor: "hsl(278, 50%, 70%)", backgroundColor: "white" }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">GST Collected</CardTitle>
              <TrendingUp className="h-4 w-4" style={{ color: "hsl(278, 50%, 70%)" }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: "hsl(278, 50%, 30%)" }}>
                ₹{totalGST.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Total tax collected</p>
            </CardContent>
          </Card>
        </div>

        {/* Report Table with Tabs */}
        <Card style={{ borderColor: "hsl(278, 50%, 70%)", backgroundColor: "white" }}>
          <CardHeader>
            <CardTitle style={{ color: "hsl(278, 50%, 30%)" }}>Periodic Performance Report</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList style={{ backgroundColor: "hsl(278, 50%, 95%)" }}>
                <TabsTrigger value="all">All Periods</TabsTrigger>
                <TabsTrigger value="current">Current Period</TabsTrigger>
                <TabsTrigger value="comparison">Comparison</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow style={{ borderColor: "hsl(278, 50%, 80%)" }}>
                        <TableHead>Period</TableHead>
                        <TableHead className="text-right">Total Sales</TableHead>
                        <TableHead className="text-right">Total Purchase</TableHead>
                        <TableHead className="text-right">GST</TableHead>
                        <TableHead className="text-right">Net Profit</TableHead>
                        <TableHead className="text-right">Avg. Order Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockPeriodicData.map((row, idx) => (
                        <TableRow key={idx} style={{ borderColor: "hsl(278, 50%, 90%)" }}>
                          <TableCell className="font-medium">{row.period}</TableCell>
                          <TableCell className="text-right">₹{row.totalSales.toLocaleString()}</TableCell>
                          <TableCell className="text-right">₹{row.totalPurchase.toLocaleString()}</TableCell>
                          <TableCell className="text-right">₹{row.gst.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-semibold" style={{ color: "hsl(142, 76%, 36%)" }}>
                            ₹{row.netProfit.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">₹{row.avgOrderValue.toLocaleString()}</TableCell>
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
              </TabsContent>

              <TabsContent value="current" className="mt-4">
                <div className="p-4 text-center text-muted-foreground">
                  Current period data will be displayed here
                </div>
              </TabsContent>

              <TabsContent value="comparison" className="mt-4">
                <div className="p-4 text-center text-muted-foreground">
                  Period comparison data will be displayed here
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Periodic Comparison Bar Chart */}
          <Card style={{ borderColor: "hsl(278, 50%, 70%)", backgroundColor: "white" }}>
            <CardHeader>
              <CardTitle style={{ color: "hsl(278, 50%, 30%)" }}>Periodic Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={periodicComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(278, 50%, 90%)" />
                  <XAxis dataKey="period" stroke="hsl(278, 50%, 40%)" />
                  <YAxis stroke="hsl(278, 50%, 40%)" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="hsl(278, 50%, 70%)" name="Sales (₹)" />
                  <Bar dataKey="purchase" fill="hsl(278, 30%, 60%)" name="Purchase (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Yearly Trend Line Chart */}
          <Card style={{ borderColor: "hsl(278, 50%, 70%)", backgroundColor: "white" }}>
            <CardHeader>
              <CardTitle style={{ color: "hsl(278, 50%, 30%)" }}>Yearly Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={yearlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(278, 50%, 90%)" />
                  <XAxis dataKey="year" stroke="hsl(278, 50%, 40%)" />
                  <YAxis stroke="hsl(278, 50%, 40%)" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="hsl(278, 50%, 70%)" strokeWidth={2} name="Revenue (₹)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Sales vs Purchase Dual Axis Chart */}
        <Card style={{ borderColor: "hsl(278, 50%, 70%)", backgroundColor: "white" }}>
          <CardHeader>
            <CardTitle style={{ color: "hsl(278, 50%, 30%)" }}>Sales vs Purchase</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={salesVsPurchaseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(278, 50%, 90%)" />
                <XAxis dataKey="month" stroke="hsl(278, 50%, 40%)" />
                <YAxis stroke="hsl(278, 50%, 40%)" />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="hsl(278, 50%, 70%)" name="Sales (₹)" />
                <Line type="monotone" dataKey="purchase" stroke="hsl(278, 30%, 50%)" strokeWidth={2} name="Purchase (₹)" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Footer */}
        <Card style={{ borderColor: "hsl(278, 50%, 70%)", backgroundColor: "white" }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold" style={{ color: "hsl(278, 50%, 30%)" }}>
                  Summary Totals: Sales ₹{totalSales.toLocaleString()} | Profit ₹{totalNetProfit.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Last Generated: {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default PeriodicReport;
