import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { RefreshCw, Download, TrendingUp, TrendingDown, DollarSign, Percent, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import dashboardHomeIcon from "@/assets/smart-home-3d-icon-4.png";
import profitLossIcon from "@/assets/profit-loss-report-icon.png";

const THEME = {
  primary: '#7a8a3a', primaryDark: '#525e28', primaryLight: '#BBCB64',
  primaryLighter: '#dde6a8', primaryLightest: '#f0f3de', border: '#BBCB64',
  gradientFrom: '#dde6a8', gradientMid: '#f0f3de', gradientTo: '#f7f9ee',
};

const ProfitLossReport = () => {
  const navigate = useNavigate();

  const { data: stats } = useQuery({
    queryKey: ["profit-loss-stats"],
    queryFn: async () => {
      const [salesRes, purchasesRes, expensesRes] = await Promise.all([
        supabase.from("sales").select("total_amount, invoice_date"),
        supabase.from("purchases").select("total_amount, purchase_date"),
        supabase.from("expenses").select("amount, date"),
      ]);
      const sales = salesRes.data || [];
      const purchases = purchasesRes.data || [];
      const expenses = expensesRes.data || [];

      const totalIncome = sales.reduce((s, r) => s + Number(r.total_amount), 0);
      const totalPurchase = purchases.reduce((s, r) => s + Number(r.total_amount), 0);
      const totalExpense = expenses.reduce((s, r) => s + Number(r.amount), 0);
      const totalCost = totalPurchase + totalExpense;
      const grossProfit = totalIncome - totalCost;
      const margin = totalIncome > 0 ? ((grossProfit / totalIncome) * 100).toFixed(2) : "0.00";

      // Monthly trend
      const monthMap: Record<string, { income: number; cost: number }> = {};
      sales.forEach((s) => { const m = new Date(s.invoice_date).toLocaleString("default", { month: "short" }); if (!monthMap[m]) monthMap[m] = { income: 0, cost: 0 }; monthMap[m].income += Number(s.total_amount); });
      purchases.forEach((p) => { const m = new Date(p.purchase_date).toLocaleString("default", { month: "short" }); if (!monthMap[m]) monthMap[m] = { income: 0, cost: 0 }; monthMap[m].cost += Number(p.total_amount); });
      expenses.forEach((e) => { const m = new Date(e.date).toLocaleString("default", { month: "short" }); if (!monthMap[m]) monthMap[m] = { income: 0, cost: 0 }; monthMap[m].cost += Number(e.amount); });

      const trend = Object.entries(monthMap).map(([month, v]) => ({ month, income: v.income, expense: v.cost, profit: v.income - v.cost }));

      // Transaction list
      const transactions = [
        ...sales.map((s) => ({ date: s.invoice_date, description: "Sales Revenue", income: Number(s.total_amount), expense: 0, net: Number(s.total_amount) })),
        ...purchases.map((p) => ({ date: p.purchase_date, description: "Purchase", income: 0, expense: Number(p.total_amount), net: -Number(p.total_amount) })),
        ...expenses.map((e) => ({ date: e.date, description: "Expense", income: 0, expense: Number(e.amount), net: -Number(e.amount) })),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      return { totalIncome, totalCost, grossProfit, margin, trend, transactions };
    },
  });

  const { totalIncome = 0, totalCost = 0, grossProfit = 0, margin = "0", trend = [], transactions = [] } = stats || {};

  return (
    <AppLayout>
      <div className="min-h-screen p-6 space-y-6" style={{ background: `linear-gradient(to bottom right, ${THEME.primaryLightest}, ${THEME.primaryLighter}, #fff)` }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink onClick={() => navigate("/")} className="cursor-pointer flex items-center gap-1.5"><img src={dashboardHomeIcon} alt="Dashboard" className="h-5 w-5 object-contain" style={{ mixBlendMode: "multiply" }} /><span className="text-cyan-600 font-medium">Dashboard</span></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage className="flex items-center gap-1.5"><BarChart3 className="h-4 w-4 text-orange-400" /><span className="text-orange-600 font-medium">Reports</span></BreadcrumbPage></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage className="flex items-center gap-1.5"><img src={profitLossIcon} alt="P&L" className="h-5 w-5 object-contain" style={{ mixBlendMode: "multiply" }} /><span className="font-semibold" style={{ color: THEME.primary }}>Profit/Loss Report</span></BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl p-6 shadow-lg border-2 relative overflow-hidden" style={{ background: `linear-gradient(to right, ${THEME.gradientFrom}, ${THEME.gradientMid}, ${THEME.gradientTo})`, borderColor: THEME.border }}>
          <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl font-bold flex items-center gap-3" style={{ color: THEME.primaryDark }}>
                <img src={profitLossIcon} alt="P&L" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" /> Profit / Loss Report
              </h1>
              <p className="text-sm italic" style={{ color: THEME.primary }}>Analyze overall business profitability & trends</p>
            </div>
          </div>
        </motion.div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Total Revenue", value: `₹${totalIncome.toLocaleString()}`, icon: TrendingUp, gradient: "from-amber-400 via-yellow-400 to-orange-400" },
            { title: "Total Costs", value: `₹${totalCost.toLocaleString()}`, icon: TrendingDown, gradient: "from-red-400 via-rose-400 to-pink-400" },
            { title: "Gross Profit", value: `₹${grossProfit.toLocaleString()}`, icon: DollarSign, gradient: "from-emerald-400 via-green-400 to-teal-400" },
            { title: "Net Profit Margin", value: `${margin}%`, icon: Percent, gradient: "from-violet-400 via-purple-400 to-indigo-400" },
          ].map((card) => (
            <div key={card.title} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-6 min-h-[140px] shadow-lg`}>
              <div className="relative z-10"><h3 className="text-lg font-semibold text-white/90 mb-1">{card.title}</h3><p className="text-2xl font-bold text-white">{card.value}</p></div>
              <div className="absolute right-4 bottom-4 opacity-80"><card.icon className="h-16 w-16 text-white/40" strokeWidth={1.5} /></div>
            </div>
          ))}
        </div>

        {/* Chart */}
        {trend.length > 0 && (
          <Card className="border-2" style={{ borderColor: THEME.primaryLight }}>
            <CardHeader><CardTitle style={{ color: THEME.primaryDark }}>Revenue vs Expenses</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Legend /><Bar dataKey="income" fill="#7a8a3a" name="Revenue (₹)" /><Bar dataKey="expense" fill="#e74c3c" name="Expenses (₹)" /></BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Transactions */}
        <div className="bg-white rounded-xl border-2 shadow-lg overflow-hidden" style={{ borderColor: THEME.primaryLight }}>
          <div className="p-4 border-b-2" style={{ background: `linear-gradient(to right, ${THEME.gradientFrom}, ${THEME.gradientMid})`, borderColor: THEME.primaryLight }}>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">No data found</TableCell></TableRow>
                ) : transactions.slice(0, 50).map((t, i) => (
                  <TableRow key={i} className="hover:bg-yellow-50/30">
                    <TableCell>{t.date}</TableCell>
                    <TableCell>{t.description}</TableCell>
                    <TableCell className="text-right">{t.income > 0 ? <span className="text-green-600 font-medium">₹{t.income.toLocaleString()}</span> : "-"}</TableCell>
                    <TableCell className="text-right">{t.expense > 0 ? <span className="text-red-600 font-medium">₹{t.expense.toLocaleString()}</span> : "-"}</TableCell>
                    <TableCell className={`text-right font-bold ${t.net >= 0 ? "text-green-700" : "text-red-700"}`}>₹{t.net.toLocaleString()}</TableCell>
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

export default ProfitLossReport;
