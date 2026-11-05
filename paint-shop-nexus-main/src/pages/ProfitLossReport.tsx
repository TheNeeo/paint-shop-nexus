import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Calendar, FileText, IndianRupee, ShoppingCart } from "lucide-react";
import { TableHeaderCell } from "@/components/shared/TableHeaderCell";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useFinanceData } from "@/hooks/useFinanceData";
import dashboardHomeIcon from "@/assets/smart-home-3d-icon-4.png";
import profitLossIcon from "@/assets/profit-loss-report-icon.png";

const THEME = {
  primary: '#7a8a3a', primaryDark: '#525e28', primaryLight: '#BBCB64',
  primaryLighter: '#dde6a8', primaryLightest: '#f0f3de', border: '#BBCB64',
  gradientFrom: '#dde6a8', gradientMid: '#f0f3de', gradientTo: '#f7f9ee',
};

const ProfitLossReport = () => {
  const navigate = useNavigate();
  const { data: financeData, isLoading, isError } = useFinanceData();

  const stats = useMemo(() => {
    if (!financeData) return { totalSales: 0, totalPurchases: 0, totalExpenses: 0, cashIn: 0, cashOut: 0, netCashFlow: 0, trend: [], transactions: [] };

    const sales = financeData.sales.filter((sale) => sale.status !== "draft");
    const monthMap = new Map<string, { month: string; income: number; expense: number }>();
    const addMonth = (date: string) => {
      const key = date.slice(0, 7);
      let row = monthMap.get(key);
      if (!row) {
        row = { month: new Date(`${key}-01T00:00:00`).toLocaleString("en-IN", { month: "short", year: "numeric" }), income: 0, expense: 0 };
        monthMap.set(key, row);
      }
      return row;
    };

    const transactions = [
      ...sales.filter((sale) => Number(sale.paid_amount) > 0).map((sale) => ({ date: sale.invoice_date, description: `Invoice payment ${sale.invoice_number}`, income: Number(sale.paid_amount) || 0, expense: 0, net: Number(sale.paid_amount) || 0 })),
      ...financeData.receipts.map((receipt) => ({ date: receipt.receipt_date, description: receipt.reason || `Receipt ${receipt.receipt_no}`, income: Number(receipt.amount) || 0, expense: 0, net: Number(receipt.amount) || 0 })),
      ...financeData.purchases.filter((purchase) => Number(purchase.paid_amount) > 0).map((purchase) => ({ date: purchase.purchase_date, description: `Purchase payment ${purchase.invoice_number}`, income: 0, expense: Number(purchase.paid_amount) || 0, net: -(Number(purchase.paid_amount) || 0) })),
      ...financeData.expenses.map((expense) => ({ date: expense.date, description: expense.description || expense.type, income: 0, expense: Number(expense.amount) || 0, net: -(Number(expense.amount) || 0) })),
    ].sort((left, right) => right.date.localeCompare(left.date));

    sales.forEach((sale) => { addMonth(sale.invoice_date).income += Number(sale.paid_amount) || 0; });
    financeData.receipts.forEach((receipt) => { addMonth(receipt.receipt_date).income += Number(receipt.amount) || 0; });
    financeData.purchases.forEach((purchase) => { addMonth(purchase.purchase_date).expense += Number(purchase.paid_amount) || 0; });
    financeData.expenses.forEach((expense) => { addMonth(expense.date).expense += Number(expense.amount) || 0; });

    const totalSales = sales.reduce((sum, sale) => sum + (Number(sale.total_amount) || 0), 0);
    const totalPurchases = financeData.purchases.reduce((sum, purchase) => sum + (Number(purchase.total_amount) || 0), 0);
    const totalExpenses = financeData.expenses.reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0);
    const cashIn = transactions.reduce((sum, transaction) => sum + transaction.income, 0);
    const cashOut = transactions.reduce((sum, transaction) => sum + transaction.expense, 0);

    return {
      totalSales,
      totalPurchases,
      totalExpenses,
      cashIn,
      cashOut,
      netCashFlow: cashIn - cashOut,
      trend: Array.from(monthMap.entries()).sort(([left], [right]) => left.localeCompare(right)).map(([, row]) => row),
      transactions,
    };
  }, [financeData]);

  const { totalSales, totalPurchases, totalExpenses, netCashFlow, trend, transactions } = stats;

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
              <BreadcrumbItem><BreadcrumbPage className="flex items-center gap-1.5"><img src={profitLossIcon} alt="P&L" className="h-5 w-5 object-contain" style={{ mixBlendMode: "multiply" }} />                  <span className="font-semibold" style={{ color: THEME.primary }}>Financial Summary</span></BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl p-6 shadow-lg border-2 relative overflow-hidden" style={{ background: `linear-gradient(to right, ${THEME.gradientFrom}, ${THEME.gradientMid}, ${THEME.gradientTo})`, borderColor: THEME.border }}>
          <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl font-bold flex items-center gap-3" style={{ color: THEME.primaryDark }}>
                <img src={profitLossIcon} alt="Financial summary" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" /> Financial Summary
              </h1>
              <p className="text-sm italic" style={{ color: THEME.primary }}>Final invoices, recorded costs, and actual cash movement</p>
            </div>
          </div>
        </motion.div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Final Sales", value: `₹${totalSales.toLocaleString("en-IN")}`, icon: TrendingUp, gradient: "from-amber-400 via-yellow-400 to-orange-400" },
            { title: "Recorded Purchases", value: `₹${totalPurchases.toLocaleString("en-IN")}`, icon: ShoppingCart, gradient: "from-red-400 via-rose-400 to-pink-400" },
            { title: "Operating Expenses", value: `₹${totalExpenses.toLocaleString("en-IN")}`, icon: TrendingDown, gradient: "from-emerald-400 via-green-400 to-teal-400" },
            { title: "Net Cash Flow", value: `₹${netCashFlow.toLocaleString("en-IN")}`, icon: DollarSign, gradient: "from-violet-400 via-purple-400 to-indigo-400" },
          ].map((card) => (
            <div key={card.title} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-6 min-h-[140px] shadow-lg`}>
              <div className="relative z-10"><h3 className="text-lg font-semibold text-white/90 mb-1">{card.title}</h3><p className="text-2xl font-bold text-white">{card.value}</p></div>
              <div className="absolute right-4 bottom-4 opacity-80"><card.icon className="h-16 w-16 text-white/40" strokeWidth={1.5} /></div>
            </div>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          Net cash flow uses paid invoice amounts, standalone receipts, paid purchases, and expenses. Historical cost of goods sold and receipt-to-invoice links are not stored, so this summary should not be used as accounting profit.
        </p>

        {/* Chart */}
        {trend.length > 0 && (
          <Card className="border-2" style={{ borderColor: THEME.primaryLight }}>
            <CardHeader><CardTitle style={{ color: THEME.primaryDark }}>Cash In vs Cash Out</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Legend /><Bar dataKey="income" fill="#7a8a3a" name="Cash In (₹)" /><Bar dataKey="expense" fill="#e74c3c" name="Cash Out (₹)" /></BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Transactions */}
        <div className="bg-white rounded-xl border-2 shadow-lg overflow-hidden" style={{ borderColor: THEME.primaryLight }}>
          <div className="p-4 border-b-2" style={{ background: `linear-gradient(to right, ${THEME.gradientFrom}, ${THEME.gradientMid})`, borderColor: THEME.primaryLight }}>
            <h2 className="text-lg font-semibold" style={{ color: THEME.primaryDark }}>Cash Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow style={{ backgroundColor: THEME.primaryLightest }}>
                  <TableHeaderCell icon={Calendar} label="Date" textColor={THEME.primaryDark} iconColor="#0ea5e9" />
                  <TableHeaderCell icon={FileText} label="Description" textColor={THEME.primaryDark} iconColor="#ec4899" />
                  <TableHeaderCell icon={TrendingUp} label="Income" textColor={THEME.primaryDark} iconColor="#10b981" align="right" className="text-right" />
                  <TableHeaderCell icon={TrendingDown} label="Expense" textColor={THEME.primaryDark} iconColor="#ef4444" align="right" className="text-right" />
                  <TableHeaderCell icon={IndianRupee} label="Net Amount" textColor={THEME.primaryDark} iconColor="#f59e0b" align="right" className="text-right" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">{isLoading ? "Loading transactions..." : isError ? "Could not load financial data. Check database access and refresh." : "No cash transactions found."}</TableCell></TableRow>
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
