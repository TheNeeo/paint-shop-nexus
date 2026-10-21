import { useState, useMemo } from "react";
import { Icon3D } from "@/components/shared/Icon3D";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Download, Printer, Calendar as CalendarIcon, TrendingUp, ShoppingCart, DollarSign, BarChart3, IndianRupee, Percent, Calculator } from "lucide-react";
import { TableHeaderCell } from "@/components/shared/TableHeaderCell";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts";
import dashboardHomeIcon from "@/assets/smart-home-3d-icon-5.png";
import periodicReportIcon from "@/assets/periodic-report-icon.png";

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

const PeriodicReport = () => {
  const navigate = useNavigate();
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [periodType, setPeriodType] = useState("monthly");

  const { data: salesRows = [] } = useQuery({
    queryKey: ["periodic-report-sales"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sales")
        .select("invoice_date, total_amount, tax_amount");
      if (error) throw error;
      return data || [];
    },
  });

  const { data: purchaseRows = [] } = useQuery({
    queryKey: ["periodic-report-purchases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchases")
        .select("purchase_date, total_amount, tax_amount");
      if (error) throw error;
      return data || [];
    },
  });

  const monthLabel = (d: Date) =>
    d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });

  const periodicData = useMemo(() => {
    const map = new Map<string, { period: string; totalSales: number; totalPurchase: number; gst: number; orderCount: number }>();

    salesRows.forEach((row) => {
      const d = new Date(row.invoice_date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!map.has(key)) {
        map.set(key, { period: monthLabel(d), totalSales: 0, totalPurchase: 0, gst: 0, orderCount: 0 });
      }
      const entry = map.get(key)!;
      entry.totalSales += Number(row.total_amount) || 0;
      entry.gst += Number(row.tax_amount) || 0;
      entry.orderCount += 1;
    });

    purchaseRows.forEach((row) => {
      const d = new Date(row.purchase_date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!map.has(key)) {
        map.set(key, { period: monthLabel(d), totalSales: 0, totalPurchase: 0, gst: 0, orderCount: 0 });
      }
      const entry = map.get(key)!;
      entry.totalPurchase += Number(row.total_amount) || 0;
      entry.gst += Number(row.tax_amount) || 0;
    });

    return Array.from(map.entries())
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([, value]) => ({
        period: value.period,
        totalSales: value.totalSales,
        totalPurchase: value.totalPurchase,
        gst: value.gst,
        netProfit: value.totalSales - value.totalPurchase,
        avgOrderValue: value.orderCount > 0 ? Math.round(value.totalSales / value.orderCount) : 0,
      }));
  }, [salesRows, purchaseRows]);

  const periodicComparisonData = useMemo(
    () => periodicData.map((row) => ({ period: row.period, sales: row.totalSales, purchase: row.totalPurchase })),
    [periodicData]
  );

  const yearlyTrendData = useMemo(() => {
    const map = new Map<string, number>();
    salesRows.forEach((row) => {
      const year = String(new Date(row.invoice_date).getFullYear());
      map.set(year, (map.get(year) || 0) + (Number(row.total_amount) || 0));
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([year, value]) => ({ year, value }));
  }, [salesRows]);

  const salesVsPurchaseData = useMemo(
    () => periodicData.map((row) => ({ month: row.period, sales: row.totalSales, purchase: row.totalPurchase })),
    [periodicData]
  );

  const totalSales = periodicData.reduce((sum, item) => sum + item.totalSales, 0);
  const totalPurchase = periodicData.reduce((sum, item) => sum + item.totalPurchase, 0);
  const totalGST = periodicData.reduce((sum, item) => sum + item.gst, 0);
  const totalNetProfit = periodicData.reduce((sum, item) => sum + item.netProfit, 0);

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
                  <img src={periodicReportIcon} alt="Periodic Reports" className="h-5 w-5 object-contain" style={{ mixBlendMode: 'multiply' }} />
                  <span className="font-semibold" style={{ color: THEME.primary }}>Periodic Reports</span>
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
                    <img src={periodicReportIcon} alt="Periodic Reports" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
                  </motion.div>
                  <div className="flex flex-col">
                    <span>Periodic Reports</span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="text-sm font-normal italic ml-[1.5ch]"
                      style={{ color: THEME.primary }}
                    >
                      Generate periodic business performance summaries
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
                Export
              </Button>
              <Button variant="outline" size="sm" style={{ borderColor: THEME.border, color: THEME.primaryDark }}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-400 via-purple-400 to-indigo-400 p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white/90 mb-1">Period</h3>
              <p className="text-2xl font-bold text-white">
                {periodType === "monthly" ? "Monthly" : periodType === "weekly" ? "Weekly" : periodType === "yearly" ? "Yearly" : "Daily"}
              </p>
            </div>
            <div className="absolute right-4 bottom-4 opacity-80">
              <Icon3D name="chart" className="h-16 w-16" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-fuchsia-400 via-pink-500 to-rose-500 p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white/90 mb-1">Total Sales</h3>
              <p className="text-2xl font-bold text-white">₹{totalSales.toLocaleString()}</p>
            </div>
            <div className="absolute right-4 bottom-4 opacity-80">
              <Icon3D name="cart" className="h-16 w-16" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-400 via-blue-400 to-cyan-400 p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white/90 mb-1">Total Purchases</h3>
              <p className="text-2xl font-bold text-white">₹{totalPurchase.toLocaleString()}</p>
            </div>
            <div className="absolute right-4 bottom-4 opacity-80">
              <Icon3D name="truck" className="h-16 w-16" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-400 via-green-400 to-teal-400 p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white/90 mb-1">Net Profit</h3>
              <p className="text-2xl font-bold text-white">₹{totalNetProfit.toLocaleString()}</p>
            </div>
            <div className="absolute right-4 bottom-4 opacity-80">
              <Icon3D name="invoice" className="h-16 w-16" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white/90 mb-1">GST Collected</h3>
              <p className="text-2xl font-bold text-white">₹{totalGST.toLocaleString()}</p>
            </div>
            <div className="absolute right-4 bottom-4 opacity-80">
              <Icon3D name="invoice" className="h-16 w-16" />
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <Card style={{ borderColor: THEME.border, backgroundColor: "white" }}>
          <CardHeader>
            <CardTitle style={{ color: THEME.primaryDark }}>Filter Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: THEME.primaryDark }}>Period Type</label>
                <Select value={periodType} onValueChange={setPeriodType}>
                  <SelectTrigger style={{ borderColor: THEME.border }}>
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
                <label className="text-sm font-medium" style={{ color: THEME.primaryDark }}>Date From</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal" style={{ borderColor: THEME.border }}>
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
                <label className="text-sm font-medium" style={{ color: THEME.primaryDark }}>Date To</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal" style={{ borderColor: THEME.border }}>
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
                <label className="text-sm font-medium" style={{ color: THEME.primaryDark }}>Category / Product</label>
                <Select>
                  <SelectTrigger style={{ borderColor: THEME.border }}>
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
              <Button style={{ backgroundColor: THEME.primaryLight, color: "white" }} className="hover:opacity-90">
                Generate Report
              </Button>
              <Button variant="outline" style={{ borderColor: THEME.border, color: THEME.primaryDark }}>Reset</Button>
            </div>
          </CardContent>
        </Card>

        {/* Report Table */}
        <Card style={{ borderColor: THEME.border, backgroundColor: "white" }}>
          <CardHeader>
            <CardTitle style={{ color: THEME.primaryDark }}>Periodic Performance Report</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList style={{ backgroundColor: THEME.primaryLightest }}>
                <TabsTrigger value="all">All Periods</TabsTrigger>
                <TabsTrigger value="current">Current Period</TabsTrigger>
                <TabsTrigger value="comparison">Comparison</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow style={{ borderColor: THEME.primaryLighter }}>
                        <TableHeaderCell icon={CalendarIcon} label="Period" textColor={THEME.primaryDark} iconColor="#0ea5e9" />
                        <TableHeaderCell icon={TrendingUp} label="Total Sales" textColor={THEME.primaryDark} iconColor="#10b981" align="right" className="text-right" />
                        <TableHeaderCell icon={ShoppingCart} label="Total Purchase" textColor={THEME.primaryDark} iconColor="#1e40af" align="right" className="text-right" />
                        <TableHeaderCell icon={Percent} label="GST" textColor={THEME.primaryDark} iconColor="#8b5cf6" align="right" className="text-right" />
                        <TableHeaderCell icon={IndianRupee} label="Net Profit" textColor={THEME.primaryDark} iconColor="#f59e0b" align="right" className="text-right" />
                        <TableHeaderCell icon={Calculator} label="Avg. Order Value" textColor={THEME.primaryDark} iconColor="#ec4899" align="right" className="text-right" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {periodicData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            No sales or purchase data available yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                      periodicData.map((row, idx) => (
                        <TableRow key={idx} style={{ borderColor: THEME.primaryLightest }}>
                          <TableCell className="font-medium">{row.period}</TableCell>
                          <TableCell className="text-right">₹{row.totalSales.toLocaleString()}</TableCell>
                          <TableCell className="text-right">₹{row.totalPurchase.toLocaleString()}</TableCell>
                          <TableCell className="text-right">₹{row.gst.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-semibold" style={{ color: "hsl(142, 76%, 36%)" }}>
                            ₹{row.netProfit.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">₹{row.avgOrderValue.toLocaleString()}</TableCell>
                        </TableRow>
                      ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4">
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
              </TabsContent>

              <TabsContent value="current" className="mt-4">
                <div className="p-4 text-center text-muted-foreground">Current period data will be displayed here</div>
              </TabsContent>

              <TabsContent value="comparison" className="mt-4">
                <div className="p-4 text-center text-muted-foreground">Period comparison data will be displayed here</div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card style={{ borderColor: THEME.border, backgroundColor: "white" }}>
            <CardHeader>
              <CardTitle style={{ color: THEME.primaryDark }}>Periodic Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={periodicComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={THEME.primaryLighter} />
                  <XAxis dataKey="period" stroke={THEME.primary} />
                  <YAxis stroke={THEME.primary} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill={THEME.primaryLight} name="Sales (₹)" />
                  <Bar dataKey="purchase" fill={THEME.primary} name="Purchase (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card style={{ borderColor: THEME.border, backgroundColor: "white" }}>
            <CardHeader>
              <CardTitle style={{ color: THEME.primaryDark }}>Yearly Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={yearlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={THEME.primaryLighter} />
                  <XAxis dataKey="year" stroke={THEME.primary} />
                  <YAxis stroke={THEME.primary} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke={THEME.primaryLight} strokeWidth={2} name="Revenue (₹)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Sales vs Purchase */}
        <Card style={{ borderColor: THEME.border, backgroundColor: "white" }}>
          <CardHeader>
            <CardTitle style={{ color: THEME.primaryDark }}>Sales vs Purchase</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={salesVsPurchaseData}>
                <CartesianGrid strokeDasharray="3 3" stroke={THEME.primaryLighter} />
                <XAxis dataKey="month" stroke={THEME.primary} />
                <YAxis stroke={THEME.primary} />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill={THEME.primaryLight} name="Sales (₹)" />
                <Line type="monotone" dataKey="purchase" stroke={THEME.primaryDark} strokeWidth={2} name="Purchase (₹)" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Footer */}
        <Card style={{ borderColor: THEME.border, backgroundColor: "white" }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold" style={{ color: THEME.primaryDark }}>
                Summary Totals: Sales ₹{totalSales.toLocaleString()} | Profit ₹{totalNetProfit.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Last Generated: {new Date().toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default PeriodicReport;
