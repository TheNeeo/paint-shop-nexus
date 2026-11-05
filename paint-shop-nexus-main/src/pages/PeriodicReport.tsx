import { useMemo, useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Download, Printer, Calendar as CalendarIcon, TrendingUp, ShoppingCart, DollarSign, BarChart3, IndianRupee, Percent, Calculator } from "lucide-react";
import { TableHeaderCell } from "@/components/shared/TableHeaderCell";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, startOfWeek } from "date-fns";
import { useFinanceData } from "@/hooks/useFinanceData";
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

interface PeriodRow {
  period: string;
  periodStart: string;
  totalSales: number;
  totalPurchase: number;
  totalExpenses: number;
  gst: number;
  cashIn: number;
  cashOut: number;
  netCashFlow: number;
  invoiceCount: number;
  avgOrderValue: number;
}

const getPeriodBucket = (day: string, periodType: string) => {
  const date = new Date(`${day.slice(0, 10)}T00:00:00`);
  if (periodType === "daily") {
    return { key: format(date, "yyyy-MM-dd"), label: format(date, "dd MMM yyyy"), periodStart: format(date, "yyyy-MM-dd") };
  }
  if (periodType === "weekly") {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    return { key: format(weekStart, "yyyy-MM-dd"), label: `Week of ${format(weekStart, "dd MMM yyyy")}`, periodStart: format(weekStart, "yyyy-MM-dd") };
  }
  if (periodType === "yearly") {
    return { key: format(date, "yyyy"), label: format(date, "yyyy"), periodStart: `${format(date, "yyyy")}-01-01` };
  }
  return { key: format(date, "yyyy-MM"), label: format(date, "MMM yyyy"), periodStart: `${format(date, "yyyy-MM")}-01` };
};

const PeriodicReport = () => {
  const navigate = useNavigate();
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [periodType, setPeriodType] = useState("monthly");
  const { data: financeData, isLoading, isError, refetch } = useFinanceData();
  const fromDate = dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined;
  const toDate = dateTo ? format(dateTo, "yyyy-MM-dd") : undefined;

  const periodRows = useMemo(() => {
    if (!financeData) return [];
    const grouped = new Map<string, PeriodRow>();
    const getRow = (date: string) => {
      const bucket = getPeriodBucket(date, periodType);
      let row = grouped.get(bucket.key);
      if (!row) {
        row = {
          period: bucket.label,
          periodStart: bucket.periodStart,
          totalSales: 0,
          totalPurchase: 0,
          totalExpenses: 0,
          gst: 0,
          cashIn: 0,
          cashOut: 0,
          netCashFlow: 0,
          invoiceCount: 0,
          avgOrderValue: 0,
        };
        grouped.set(bucket.key, row);
      }
      return row;
    };
    const withinRange = (date: string) =>
      (!fromDate || date >= fromDate) && (!toDate || date <= toDate);

    financeData.sales.forEach((sale) => {
      const date = sale.invoice_date.slice(0, 10);
      if (sale.status === "draft" || !withinRange(date)) return;
      const row = getRow(date);
      row.totalSales += Number(sale.total_amount) || 0;
      row.gst += Number(sale.tax_amount) || 0;
      row.cashIn += Number(sale.paid_amount) || 0;
      row.invoiceCount += 1;
    });

    financeData.purchases.forEach((purchase) => {
      const date = purchase.purchase_date.slice(0, 10);
      if (!withinRange(date)) return;
      const row = getRow(date);
      row.totalPurchase += Number(purchase.total_amount) || 0;
      row.cashOut += Number(purchase.paid_amount) || 0;
    });

    financeData.expenses.forEach((expense) => {
      const date = expense.date.slice(0, 10);
      if (!withinRange(date)) return;
      const row = getRow(date);
      const amount = Number(expense.amount) || 0;
      row.totalExpenses += amount;
      row.cashOut += amount;
    });

    financeData.receipts.forEach((receipt) => {
      const date = receipt.receipt_date.slice(0, 10);
      if (!withinRange(date)) return;
      getRow(date).cashIn += Number(receipt.amount) || 0;
    });

    return Array.from(grouped.values())
      .map((row) => ({
        ...row,
        netCashFlow: row.cashIn - row.cashOut,
        avgOrderValue: row.invoiceCount > 0 ? row.totalSales / row.invoiceCount : 0,
      }))
      .sort((left, right) => left.periodStart.localeCompare(right.periodStart));
  }, [financeData, fromDate, periodType, toDate]);

  const totalSales = periodRows.reduce((sum, row) => sum + row.totalSales, 0);
  const totalPurchase = periodRows.reduce((sum, row) => sum + row.totalPurchase, 0);
  const totalGST = periodRows.reduce((sum, row) => sum + row.gst, 0);
  const totalCashIn = periodRows.reduce((sum, row) => sum + row.cashIn, 0);
  const totalCashOut = periodRows.reduce((sum, row) => sum + row.cashOut, 0);
  const netCashFlow = totalCashIn - totalCashOut;
  const currentBucket = getPeriodBucket(format(new Date(), "yyyy-MM-dd"), periodType);
  const currentPeriod = periodRows.find((row) => row.period === currentBucket.label);
  const comparisonRows = periodRows.slice(-6);
  const salesVsPurchaseData = periodRows.map((row) => ({ period: row.period, sales: row.totalSales, purchase: row.totalPurchase }));
  const yearlyTrendData = useMemo(() => {
    const yearly = new Map<string, number>();
    periodRows.forEach((row) => {
      const year = row.periodStart.slice(0, 4);
      yearly.set(year, (yearly.get(year) || 0) + row.totalSales);
    });
    return Array.from(yearly, ([year, value]) => ({ year, value })).sort((left, right) => left.year.localeCompare(right.year));
  }, [periodRows]);

  const handleExport = () => {
    if (periodRows.length === 0) return;
    const csvRows = periodRows.map((row) => ({
      Period: row.period,
      Sales: row.totalSales,
      Purchases: row.totalPurchase,
      Expenses: row.totalExpenses,
      GST: row.gst,
      "Cash In": row.cashIn,
      "Cash Out": row.cashOut,
      "Net Cash Flow": row.netCashFlow,
      "Average Order Value": row.avgOrderValue,
    }));
    const headers = Object.keys(csvRows[0]);
    const csv = [headers.join(","), ...csvRows.map((row) => headers.map((header) => `"${row[header as keyof typeof row]}"`).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `periodic-report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
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
              <Button variant="outline" size="sm" onClick={() => void refetch()} disabled={isLoading} style={{ borderColor: THEME.border, color: THEME.primaryDark }}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} disabled={periodRows.length === 0} style={{ borderColor: THEME.border, color: THEME.primaryDark }}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.print()} style={{ borderColor: THEME.border, color: THEME.primaryDark }}>
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
              <CalendarIcon className="h-16 w-16 text-white/40" strokeWidth={1.5} />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-fuchsia-400 via-pink-500 to-rose-500 p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white/90 mb-1">Total Sales</h3>
              <p className="text-2xl font-bold text-white">₹{totalSales.toLocaleString()}</p>
            </div>
            <div className="absolute right-4 bottom-4 opacity-80">
              <TrendingUp className="h-16 w-16 text-white/40" strokeWidth={1.5} />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-400 via-blue-400 to-cyan-400 p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white/90 mb-1">Total Purchases</h3>
              <p className="text-2xl font-bold text-white">₹{totalPurchase.toLocaleString()}</p>
            </div>
            <div className="absolute right-4 bottom-4 opacity-80">
              <ShoppingCart className="h-16 w-16 text-white/40" strokeWidth={1.5} />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-400 via-green-400 to-teal-400 p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white/90 mb-1">Net Cash Flow</h3>
              <p className="text-2xl font-bold text-white">₹{netCashFlow.toLocaleString()}</p>
            </div>
            <div className="absolute right-4 bottom-4 opacity-80">
              <DollarSign className="h-16 w-16 text-white/40" strokeWidth={1.5} />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white/90 mb-1">GST Collected</h3>
              <p className="text-2xl font-bold text-white">₹{totalGST.toLocaleString()}</p>
            </div>
            <div className="absolute right-4 bottom-4 opacity-80">
              <TrendingUp className="h-16 w-16 text-white/40" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Net cash flow uses recorded invoice payments, standalone receipts, paid purchases, and expenses. A receipt is not linked to an invoice yet, so avoid recording the same payment twice.
        </p>

        {/* Filter Controls */}
        <Card style={{ borderColor: THEME.border, backgroundColor: "white" }}>
          <CardHeader>
            <CardTitle style={{ color: THEME.primaryDark }}>Filter Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

            </div>

            <div className="flex gap-2 mt-4">
              <Button onClick={() => void refetch()} disabled={isLoading} style={{ backgroundColor: THEME.primaryLight, color: "white" }} className="hover:opacity-90">
                Generate Report
              </Button>
              <Button variant="outline" onClick={() => { setDateFrom(undefined); setDateTo(undefined); setPeriodType("monthly"); }} style={{ borderColor: THEME.border, color: THEME.primaryDark }}>Reset</Button>
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
                        <TableHeaderCell icon={TrendingUp} label="Sales" textColor={THEME.primaryDark} iconColor="#10b981" align="right" className="text-right" />
                        <TableHeaderCell icon={ShoppingCart} label="Purchases" textColor={THEME.primaryDark} iconColor="#1e40af" align="right" className="text-right" />
                        <TableHeaderCell icon={IndianRupee} label="Expenses" textColor={THEME.primaryDark} iconColor="#ef4444" align="right" className="text-right" />
                        <TableHeaderCell icon={Percent} label="GST" textColor={THEME.primaryDark} iconColor="#8b5cf6" align="right" className="text-right" />
                        <TableHeaderCell icon={TrendingUp} label="Cash In" textColor={THEME.primaryDark} iconColor="#10b981" align="right" className="text-right" />
                        <TableHeaderCell icon={TrendingUp} label="Cash Out" textColor={THEME.primaryDark} iconColor="#ef4444" align="right" className="text-right" />
                        <TableHeaderCell icon={IndianRupee} label="Net Cash Flow" textColor={THEME.primaryDark} iconColor="#f59e0b" align="right" className="text-right" />
                        <TableHeaderCell icon={Calculator} label="Avg. Order" textColor={THEME.primaryDark} iconColor="#ec4899" align="right" className="text-right" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow><TableCell colSpan={9} className="py-8 text-center text-muted-foreground">Loading report data...</TableCell></TableRow>
                      ) : isError ? (
                        <TableRow><TableCell colSpan={9} className="py-8 text-center text-red-600">Could not load report data. Check database access and refresh.</TableCell></TableRow>
                      ) : periodRows.length === 0 ? (
                        <TableRow><TableCell colSpan={9} className="py-8 text-center text-muted-foreground">No finalized sales or transactions in this date range.</TableCell></TableRow>
                      ) : periodRows.map((row) => (
                        <TableRow key={row.periodStart} style={{ borderColor: THEME.primaryLightest }}>
                          <TableCell className="font-medium">{row.period}</TableCell>
                          <TableCell className="text-right">₹{row.totalSales.toLocaleString("en-IN")}</TableCell>
                          <TableCell className="text-right">₹{row.totalPurchase.toLocaleString("en-IN")}</TableCell>
                          <TableCell className="text-right">₹{row.totalExpenses.toLocaleString("en-IN")}</TableCell>
                          <TableCell className="text-right">₹{row.gst.toLocaleString("en-IN")}</TableCell>
                          <TableCell className="text-right">₹{row.cashIn.toLocaleString("en-IN")}</TableCell>
                          <TableCell className="text-right">₹{row.cashOut.toLocaleString("en-IN")}</TableCell>
                          <TableCell className={`text-right font-semibold ${row.netCashFlow >= 0 ? "text-green-700" : "text-red-700"}`}>₹{row.netCashFlow.toLocaleString("en-IN")}</TableCell>
                          <TableCell className="text-right">₹{row.avgOrderValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="current" className="mt-4">
                {isLoading ? (
                  <div className="p-4 text-center text-muted-foreground">Loading current period...</div>
                ) : isError ? (
                  <div className="p-4 text-center text-red-600">Could not load the current period.</div>
                ) : currentPeriod ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-lg border p-4">
                    <div><p className="text-sm text-muted-foreground">Period</p><p className="font-semibold">{currentPeriod.period}</p></div>
                    <div><p className="text-sm text-muted-foreground">Sales</p><p className="font-semibold">₹{currentPeriod.totalSales.toLocaleString("en-IN")}</p></div>
                    <div><p className="text-sm text-muted-foreground">Purchases</p><p className="font-semibold">₹{currentPeriod.totalPurchase.toLocaleString("en-IN")}</p></div>
                    <div><p className="text-sm text-muted-foreground">Expenses</p><p className="font-semibold">₹{currentPeriod.totalExpenses.toLocaleString("en-IN")}</p></div>
                    <div><p className="text-sm text-muted-foreground">GST</p><p className="font-semibold">₹{currentPeriod.gst.toLocaleString("en-IN")}</p></div>
                    <div><p className="text-sm text-muted-foreground">Cash In</p><p className="font-semibold">₹{currentPeriod.cashIn.toLocaleString("en-IN")}</p></div>
                    <div><p className="text-sm text-muted-foreground">Cash Out</p><p className="font-semibold">₹{currentPeriod.cashOut.toLocaleString("en-IN")}</p></div>
                    <div><p className="text-sm text-muted-foreground">Net Cash Flow</p><p className="font-semibold">₹{currentPeriod.netCashFlow.toLocaleString("en-IN")}</p></div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">No current-period data yet.</div>
                )}
              </TabsContent>

              <TabsContent value="comparison" className="mt-4">
                {comparisonRows.length < 2 ? (
                  <div className="p-4 text-center text-muted-foreground">At least two periods are needed for a comparison.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader><TableRow><TableHead>Period</TableHead><TableHead className="text-right">Sales</TableHead><TableHead className="text-right">Purchases</TableHead><TableHead className="text-right">Expenses</TableHead><TableHead className="text-right">Net Cash Flow</TableHead></TableRow></TableHeader>
                      <TableBody>{comparisonRows.map((row) => <TableRow key={row.periodStart}><TableCell>{row.period}</TableCell><TableCell className="text-right">₹{row.totalSales.toLocaleString("en-IN")}</TableCell><TableCell className="text-right">₹{row.totalPurchase.toLocaleString("en-IN")}</TableCell><TableCell className="text-right">₹{row.totalExpenses.toLocaleString("en-IN")}</TableCell><TableCell className={`text-right font-semibold ${row.netCashFlow >= 0 ? "text-green-700" : "text-red-700"}`}>₹{row.netCashFlow.toLocaleString("en-IN")}</TableCell></TableRow>)}</TableBody>
                    </Table>
                  </div>
                )}
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
                <BarChart data={comparisonRows.map((row) => ({ period: row.period, sales: row.totalSales, purchase: row.totalPurchase }))}>
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
                <XAxis dataKey="period" stroke={THEME.primary} />
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
                Summary Totals: Sales ₹{totalSales.toLocaleString("en-IN")} | Net Cash Flow ₹{netCashFlow.toLocaleString("en-IN")}
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
