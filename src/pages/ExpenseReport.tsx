import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, RefreshCw, DollarSign, FileText, TrendingUp, BarChart, BarChart3, Search, Filter, X, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import AppLayout from "@/components/layout/AppLayout";
import { ExpenseReportModal } from "@/components/expense/ExpenseReportModal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import dashboardHomeIcon from "@/assets/smart-home-3d-icon-8.png";
import expenseReportIcon from "@/assets/expense-report-icon.png";

const THEME = {
  primary: '#5a9e9d', primaryDark: '#3d7a79', primaryLight: '#91C4C3',
  primaryLighter: '#b8dada', primaryLightest: '#e8f4f4', border: '#91C4C3',
  gradientFrom: '#b8dada', gradientMid: '#e8f4f4', gradientTo: '#f5fafa',
};

const ExpenseReport = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [paymentMode, setPaymentMode] = useState("all");
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: expenses = [] } = useQuery({
    queryKey: ["expense-report"],
    queryFn: async () => {
      const { data, error } = await supabase.from("expenses").select("*").order("date", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const filtered = expenses.filter((e) =>
    (searchTerm === "" || e.type.toLowerCase().includes(searchTerm.toLowerCase()) || (e.description || "").toLowerCase().includes(searchTerm.toLowerCase())) &&
    (category === "all" || e.type.toLowerCase() === category) &&
    (paymentMode === "all" || (e.payment_mode || "").toLowerCase() === paymentMode)
  );

  const totalExpenses = filtered.reduce((s, e) => s + Number(e.amount), 0);
  const highest = filtered.reduce((m, e) => Math.max(m, Number(e.amount)), 0);
  const avg = filtered.length > 0 ? totalExpenses / filtered.length : 0;

  const summaryCards = [
    { title: "Total Expenses", value: `₹${totalExpenses.toLocaleString()}`, icon: DollarSign, gradient: "from-cyan-400 via-teal-500 to-emerald-500" },
    { title: "Highest Expense", value: `₹${highest.toLocaleString()}`, icon: TrendingUp, gradient: "from-teal-400 via-cyan-500 to-blue-500" },
    { title: "No. of Entries", value: String(filtered.length), icon: FileText, gradient: "from-sky-400 via-cyan-500 to-teal-500" },
    { title: "Avg Expense", value: `₹${avg.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: BarChart, gradient: "from-blue-400 via-sky-500 to-cyan-500" },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen p-6 space-y-6" style={{ background: `linear-gradient(to bottom right, ${THEME.primaryLightest}, ${THEME.primaryLighter}, #fff)` }}>
        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink onClick={() => navigate("/")} className="cursor-pointer flex items-center gap-1.5"><img src={dashboardHomeIcon} alt="Dashboard" className="h-5 w-5 object-contain" style={{ mixBlendMode: "multiply" }} /><span className="text-cyan-600 font-medium">Dashboard</span></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage className="flex items-center gap-1.5"><BarChart3 className="h-4 w-4 text-orange-400" /><span className="text-orange-600 font-medium">Expense Management</span></BreadcrumbPage></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage className="flex items-center gap-1.5"><img src={expenseReportIcon} alt="Expense" className="h-5 w-5 object-contain" style={{ mixBlendMode: "multiply" }} /><span className="font-semibold" style={{ color: THEME.primary }}>Expense Report</span></BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl p-6 shadow-lg border-2 relative overflow-hidden" style={{ background: `linear-gradient(to right, ${THEME.gradientFrom}, ${THEME.gradientMid}, ${THEME.gradientTo})`, borderColor: THEME.border }}>
          <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl font-bold flex items-center gap-3" style={{ color: THEME.primaryDark }}>
                <img src={expenseReportIcon} alt="Expense" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" /> Expense Report
              </h1>
              <p className="text-sm italic" style={{ color: THEME.primary }}>Clear View of Every Expense.</p>
            </div>
          </div>
        </motion.div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-6 min-h-[140px] shadow-lg`}>
                <div className="relative z-10"><h3 className="text-lg font-semibold text-white/90 mb-1">{card.title}</h3><p className="text-2xl font-bold text-white">{card.value}</p></div>
                <div className="absolute right-4 bottom-4 opacity-80"><Icon className="h-16 w-16 text-white/40" strokeWidth={1.5} /></div>
              </div>
            );
          })}
        </div>

        {/* Filter */}
        <Card className="border-2" style={{ borderColor: THEME.primaryLighter }}>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex items-center gap-2"><Filter className="h-4 w-4" style={{ color: THEME.primary }} /><span className="text-sm font-semibold" style={{ color: THEME.primaryDark }}>Filters:</span></div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: THEME.primary }} />
                  <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 h-9" style={{ borderColor: THEME.border }} />
                </div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-9" style={{ borderColor: THEME.border }}><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="rent">Rent</SelectItem><SelectItem value="transport">Transport</SelectItem><SelectItem value="utilities">Utilities</SelectItem><SelectItem value="marketing">Marketing</SelectItem></SelectContent>
                </Select>
                <Select value={paymentMode} onValueChange={setPaymentMode}>
                  <SelectTrigger className="h-9" style={{ borderColor: THEME.border }}><SelectValue placeholder="Payment Mode" /></SelectTrigger>
                  <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="cash">Cash</SelectItem><SelectItem value="upi">UPI</SelectItem><SelectItem value="bank">Bank</SelectItem></SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="sm" onClick={() => { setSearchTerm(""); setCategory("all"); setPaymentMode("all"); }} style={{ borderColor: THEME.border, color: THEME.primaryDark }}><X className="w-4 h-4 mr-1" /> Clear</Button>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-2" style={{ borderColor: THEME.primaryLighter }}>
          <CardHeader><CardTitle style={{ color: THEME.primaryDark }}>Expense Transactions</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow style={{ backgroundColor: THEME.primaryLightest }}>
                    <TableHead style={{ color: THEME.primaryDark }}>S.No</TableHead>
                    <TableHead style={{ color: THEME.primaryDark }}>Date</TableHead>
                    <TableHead style={{ color: THEME.primaryDark }}>Type</TableHead>
                    <TableHead style={{ color: THEME.primaryDark }}>Description</TableHead>
                    <TableHead className="text-right" style={{ color: THEME.primaryDark }}>Amount</TableHead>
                    <TableHead style={{ color: THEME.primaryDark }}>Payment Mode</TableHead>
                    <TableHead style={{ color: THEME.primaryDark }}>Ref No.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-500">No expenses found</TableCell></TableRow>
                  ) : filtered.map((exp, i) => (
                    <TableRow key={exp.id} className="hover:bg-teal-50/30">
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{exp.date}</TableCell>
                      <TableCell><Badge variant="outline">{exp.type}</Badge></TableCell>
                      <TableCell>{exp.description || "-"}</TableCell>
                      <TableCell className="text-right font-bold" style={{ color: THEME.primaryDark }}>₹{Number(exp.amount).toLocaleString()}</TableCell>
                      <TableCell>{exp.payment_mode || "-"}</TableCell>
                      <TableCell>{exp.ref_no || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ExpenseReport;
