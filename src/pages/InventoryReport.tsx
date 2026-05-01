import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Package, TrendingUp, AlertCircle, Star, RefreshCw, Download, Search, BarChart3, Tag, Boxes, Ruler, IndianRupee, Calculator, CheckCircle } from "lucide-react";
import { TableHeaderCell } from "@/components/shared/TableHeaderCell";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import dashboardHomeIcon from "@/assets/smart-home-3d-icon-3.png";
import inventoryReportIcon from "@/assets/inventory-report-icon.png";

const THEME = {
  primary: '#5e7a59', primaryDark: '#3d5438', primaryLight: '#90AB8B',
  primaryLighter: '#c8d9c5', primaryLightest: '#e8f0e6', border: '#90AB8B',
  gradientFrom: '#c8d9c5', gradientMid: '#e8f0e6', gradientTo: '#f4f8f3',
};

export default function InventoryReport() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [stockStatus, setStockStatus] = useState("all");

  const { data: products = [] } = useQuery({
    queryKey: ["inventory-report"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*, categories(name)").is("parent_product_id", null).order("name");
      if (error) throw error;
      return data || [];
    },
  });

  const filtered = products.filter((p) => {
    const matchSearch = !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStock = stockStatus === "all" || (stockStatus === "low" && Number(p.current_stock) > 0 && Number(p.current_stock) <= Number(p.threshold_qty || 10)) || (stockStatus === "out" && Number(p.current_stock) === 0);
    return matchSearch && matchStock;
  });

  const totalItems = products.length;
  const totalValue = products.reduce((s, p) => s + Number(p.current_stock) * Number(p.sale_price || p.unit_price || 0), 0);
  const lowStock = products.filter((p) => Number(p.current_stock) > 0 && Number(p.current_stock) <= Number(p.threshold_qty || 10)).length;

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
              <BreadcrumbItem><BreadcrumbPage className="flex items-center gap-1.5"><img src={inventoryReportIcon} alt="Inventory" className="h-5 w-5 object-contain" style={{ mixBlendMode: "multiply" }} /><span className="font-semibold" style={{ color: THEME.primary }}>Inventory Report</span></BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl p-6 shadow-lg border-2 relative overflow-hidden" style={{ background: `linear-gradient(to right, ${THEME.gradientFrom}, ${THEME.gradientMid}, ${THEME.gradientTo})`, borderColor: THEME.border }}>
          <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl font-bold flex items-center gap-3" style={{ color: THEME.primaryDark }}>
                <img src={inventoryReportIcon} alt="Inventory" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" /> Inventory Report
              </h1>
              <p className="text-sm italic" style={{ color: THEME.primary }}>Monitor stock levels and inventory valuation</p>
            </div>
            <Badge className="text-white text-sm px-4 py-1 h-fit" style={{ background: `linear-gradient(to right, ${THEME.primary}, ${THEME.primaryDark})` }}>{totalItems} Items</Badge>
          </div>
        </motion.div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Total Stock Items", value: totalItems, icon: Package, gradient: "from-amber-400 via-yellow-400 to-orange-400" },
            { title: "Total Stock Value", value: `₹${totalValue.toLocaleString()}`, icon: TrendingUp, gradient: "from-emerald-400 via-green-400 to-teal-400" },
            { title: "Low Stock Alerts", value: lowStock, icon: AlertCircle, gradient: "from-red-400 via-rose-400 to-pink-400" },
            { title: "Out of Stock", value: products.filter((p) => Number(p.current_stock) === 0).length, icon: Star, gradient: "from-violet-400 via-purple-400 to-indigo-400" },
          ].map((card) => (
            <div key={card.title} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-6 min-h-[140px] shadow-lg`}>
              <div className="relative z-10"><h3 className="text-lg font-semibold text-white/90 mb-1">{card.title}</h3><p className="text-2xl font-bold text-white">{card.value}</p></div>
              <div className="absolute right-4 bottom-4 opacity-80"><card.icon className="h-16 w-16 text-white/40" strokeWidth={1.5} /></div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="p-4 rounded-xl border-2 shadow-sm flex gap-4 items-end" style={{ background: `linear-gradient(to right, ${THEME.gradientFrom}, ${THEME.gradientMid})`, borderColor: THEME.border }}>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: THEME.primary }} />
            <Input placeholder="Search product..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 bg-white" style={{ borderColor: THEME.border }} />
          </div>
          <Select value={stockStatus} onValueChange={setStockStatus}>
            <SelectTrigger className="w-48 bg-white" style={{ borderColor: THEME.border }}><SelectValue placeholder="Stock Status" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="low">Low Stock</SelectItem><SelectItem value="out">Out of Stock</SelectItem></SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border-2 shadow-lg overflow-hidden" style={{ borderColor: THEME.primaryLight }}>
          <div className="p-4 border-b-2" style={{ background: `linear-gradient(to right, ${THEME.gradientFrom}, ${THEME.gradientMid})`, borderColor: THEME.primaryLight }}>
            <h2 className="text-lg font-semibold" style={{ color: THEME.primaryDark }}>Inventory Details</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow style={{ backgroundColor: THEME.primaryLightest }}>
                  <TableHeaderCell icon={Package} label="Product" textColor={THEME.primaryDark} iconColor="#f97316" />
                  <TableHeaderCell icon={Tag} label="Category" textColor={THEME.primaryDark} iconColor="#8b5cf6" />
                  <TableHeaderCell icon={Boxes} label="Current Stock" textColor={THEME.primaryDark} iconColor="#0ea5e9" align="right" className="text-right" />
                  <TableHeaderCell icon={Ruler} label="Unit" textColor={THEME.primaryDark} iconColor="#0d9488" />
                  <TableHeaderCell icon={IndianRupee} label="Unit Price" textColor={THEME.primaryDark} iconColor="#f59e0b" align="right" className="text-right" />
                  <TableHeaderCell icon={Calculator} label="Stock Value" textColor={THEME.primaryDark} iconColor="#ec4899" align="right" className="text-right" />
                  <TableHeaderCell icon={CheckCircle} label="Status" textColor={THEME.primaryDark} iconColor="#22c55e" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-500">No products found</TableCell></TableRow>
                ) : filtered.map((p) => {
                  const stock = Number(p.current_stock);
                  const threshold = Number(p.threshold_qty || 10);
                  const price = Number(p.sale_price || p.unit_price || 0);
                  const status = stock === 0 ? "Out of Stock" : stock <= threshold ? "Low Stock" : "In Stock";
                  const statusColor = stock === 0 ? "bg-red-100 text-red-800" : stock <= threshold ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800";
                  return (
                    <TableRow key={p.id} className="hover:bg-green-50/30">
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>{(p as any).categories?.name || "Uncategorized"}</TableCell>
                      <TableCell className="text-right font-bold">{stock}</TableCell>
                      <TableCell>{p.unit}</TableCell>
                      <TableCell className="text-right">₹{price.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-bold" style={{ color: THEME.primaryDark }}>₹{(stock * price).toLocaleString()}</TableCell>
                      <TableCell><Badge className={statusColor}>{status}</Badge></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
