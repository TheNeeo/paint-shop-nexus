import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { RefreshCw, Download, TrendingUp, DollarSign, FileText, BarChart3, Calendar, Hash, User, IndianRupee, Percent, CreditCard, Inbox } from "lucide-react";
import { TableHeaderCell } from "@/components/shared/TableHeaderCell";
import { format } from "date-fns";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import dashboardHomeIcon from "@/assets/smart-home-3d-icon-2.png";
import salesReportIcon from "@/assets/sales-report-icon.png";

const THEME = {
  primary: '#c4686e', primaryDark: '#8b3a3f', primaryLight: '#F5CBCB',
  primaryLighter: '#fae8e8', primaryLightest: '#fdf2f2', border: '#e8a5a8',
  gradientFrom: '#f5cbcb', gradientMid: '#fae8e8', gradientTo: '#fdf2f2',
};

const SalesReport = () => {
  const navigate = useNavigate();
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const { data: salesData = [] } = useQuery({
    queryKey: ["sales-report", dateFrom, dateTo],
    queryFn: async () => {
      let query = supabase.from("sales").select("*, sale_items(*)").order("invoice_date", { ascending: false });
      if (dateFrom) query = query.gte("invoice_date", format(dateFrom, "yyyy-MM-dd"));
      if (dateTo) query = query.lte("invoice_date", format(dateTo, "yyyy-MM-dd"));
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const { data: trendData = [] } = useQuery({
    queryKey: ["sales-trend"],
    queryFn: async () => {
      const { data } = await supabase.from("sales").select("invoice_date, total_amount");
      if (!data) return [];
      const monthMap: Record<string, number> = {};
      data.forEach((s) => {
        const m = new Date(s.invoice_date).toLocaleString("default", { month: "short" });
        monthMap[m] = (monthMap[m] || 0) + Number(s.total_amount);
      });
      return Object.entries(monthMap).map(([month, sales]) => ({ month, sales }));
    },
  });

  const totalSales = salesData.reduce((sum, s) => sum + Number(s.total_amount), 0);
  const totalGST = salesData.reduce((sum, s) => sum + Number(s.tax_amount), 0);
  const invoiceCount = salesData.length;
  const avgInvoiceValue = invoiceCount > 0 ? totalSales / invoiceCount : 0;

  return (
    <AppLayout>
      <div className="min-h-screen p-6 space-y-6" style={{ background: `linear-gradient(to bottom right, ${THEME.primaryLightest}, ${THEME.primaryLighter}, #fff)` }}>
        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink onClick={() => navigate("/")} className="cursor-pointer flex items-center gap-1.5"><img src={dashboardHomeIcon} alt="Dashboard" className="h-5 w-5 object-contain" style={{ mixBlendMode: "multiply" }} /><span className="text-cyan-600 font-medium">Dashboard</span></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage className="flex items-center gap-1.5"><BarChart3 className="h-4 w-4 text-orange-400" /><span className="text-orange-600 font-medium">Reports</span></BreadcrumbPage></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage className="flex items-center gap-1.5"><img src={salesReportIcon} alt="Sales" className="h-5 w-5 object-contain" style={{ mixBlendMode: "multiply" }} /><span className="font-semibold" style={{ color: THEME.primary }}>Sales Report</span></BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl p-6 shadow-lg border-2 relative overflow-hidden" style={{ background: `linear-gradient(to right, ${THEME.gradientFrom}, ${THEME.gradientMid}, ${THEME.gradientTo})`, borderColor: THEME.border }}>
          <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl font-bold flex items-center gap-3" style={{ color: THEME.primaryDark }}>
                <img src={salesReportIcon} alt="Sales" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" /> Sales Report
              </h1>
              <p className="text-sm italic" style={{ color: THEME.primary }}>Track all customer sales transactions & performance trends</p>
            </div>
            <Badge className="text-white text-sm px-4 py-1" style={{ background: `linear-gradient(to right, ${THEME.primary}, ${THEME.primaryDark})` }}>{invoiceCount} Records</Badge>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Total Sales Amount", value: `₹${totalSales.toLocaleString()}`, icon: DollarSign, gradient: "from-amber-400 via-yellow-400 to-orange-400" },
            { title: "Total GST Collected", value: `₹${totalGST.toLocaleString()}`, icon: TrendingUp, gradient: "from-emerald-400 via-green-400 to-teal-400" },
            { title: "No. of Invoices", value: String(invoiceCount), icon: FileText, gradient: "from-rose-400 via-pink-400 to-red-400" },
            { title: "Avg. Invoice Value", value: `₹${avgInvoiceValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: BarChart3, gradient: "from-violet-400 via-purple-400 to-indigo-400" },
          ].map((card) => (
            <div key={card.title} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-6 min-h-[140px] shadow-lg`}>
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-white/90 mb-1">{card.title}</h3>
                <p className="text-2xl font-bold text-white">{card.value}</p>
              </div>
              <div className="absolute right-4 bottom-4 opacity-80"><card.icon className="h-16 w-16 text-white/40" strokeWidth={1.5} /></div>
            </div>
          ))}
        </div>

        {/* Chart */}
        {trendData.length > 0 && (
          <Card className="border-2" style={{ borderColor: THEME.primaryLight }}>
            <CardHeader><CardTitle style={{ color: THEME.primaryDark }}>Sales Trend</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trendData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Legend /><Bar dataKey="sales" fill={THEME.primary} name="Sales (₹)" /></BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Sales Table */}
        <div className="bg-white rounded-xl border-2 shadow-lg overflow-hidden" style={{ borderColor: THEME.primaryLight }}>
          <div className="p-4 border-b-2" style={{ background: `linear-gradient(to right, ${THEME.gradientFrom}, ${THEME.gradientMid})`, borderColor: THEME.primaryLight }}>
            <h2 className="text-lg font-semibold" style={{ color: THEME.primaryDark }}>Sales Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow style={{ backgroundColor: THEME.primaryLightest }}>
                  <TableHeaderCell icon={Calendar} label="Date" textColor={THEME.primaryDark} iconColor="#0ea5e9" />
                  <TableHeaderCell icon={Hash} label="Invoice No" textColor={THEME.primaryDark} iconColor="#ec4899" />
                  <TableHeaderCell icon={User} label="Customer" textColor={THEME.primaryDark} iconColor="#1e40af" />
                  <TableHeaderCell icon={IndianRupee} label="Subtotal" textColor={THEME.primaryDark} iconColor="#f59e0b" align="right" className="text-right" />
                  <TableHeaderCell icon={Percent} label="GST" textColor={THEME.primaryDark} iconColor="#10b981" align="right" className="text-right" />
                  <TableHeaderCell icon={IndianRupee} label="Total" textColor={THEME.primaryDark} iconColor="#f59e0b" align="right" className="text-right" />
                  <TableHeaderCell icon={CreditCard} label="Payment" textColor={THEME.primaryDark} iconColor="#0d9488" />
                  <TableHeaderCell icon={Inbox} label="Status" textColor={THEME.primaryDark} iconColor="#22c55e" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesData.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8 text-gray-500">No sales data found</TableCell></TableRow>
                ) : salesData.map((sale) => (
                  <TableRow key={sale.id} className="hover:bg-red-50/30">
                    <TableCell>{sale.invoice_date}</TableCell>
                    <TableCell className="font-medium" style={{ color: THEME.primary }}>{sale.invoice_number}</TableCell>
                    <TableCell>{sale.customer_name || "Walk-in"}</TableCell>
                    <TableCell className="text-right">₹{Number(sale.subtotal).toLocaleString()}</TableCell>
                    <TableCell className="text-right">₹{Number(sale.tax_amount).toLocaleString()}</TableCell>
                    <TableCell className="text-right font-bold" style={{ color: THEME.primaryDark }}>₹{Number(sale.total_amount).toLocaleString()}</TableCell>
                    <TableCell>{sale.payment_mode || "-"}</TableCell>
                    <TableCell>
                      <Badge className={sale.payment_status === "paid" ? "bg-green-100 text-green-800" : sale.payment_status === "partial" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}>
                        {sale.payment_status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SalesReport;
