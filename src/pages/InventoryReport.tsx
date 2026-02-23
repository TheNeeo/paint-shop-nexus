import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Package, TrendingUp, AlertCircle, Star, RefreshCw, Download, Search, BarChart3 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import dashboardHomeIcon from "@/assets/smart-home-3d-icon-3.png";
import inventoryReportIcon from "@/assets/inventory-report-icon.png";

// Theme colors
const THEME = {
  primary: '#5e7a59',
  primaryDark: '#3d5438',
  primaryLight: '#90AB8B',
  primaryLighter: '#c8d9c5',
  primaryLightest: '#e8f0e6',
  border: '#90AB8B',
  gradientFrom: '#c8d9c5',
  gradientMid: '#e8f0e6',
  gradientTo: '#f4f8f3',
};

const inventoryData = [
  { id: 1, product: "Premium Paint White", category: "Interior Paint", opening: 100, inward: 50, outward: 80, closing: 70, unit: "Ltr", value: 52500 },
  { id: 2, product: "Exterior Emulsion", category: "Exterior Paint", opening: 80, inward: 40, outward: 60, closing: 60, unit: "Ltr", value: 48000 },
  { id: 3, product: "Wood Primer", category: "Primer", opening: 50, inward: 30, outward: 45, closing: 35, unit: "Ltr", value: 28000 },
  { id: 4, product: "Metal Paint Red", category: "Metal Paint", opening: 60, inward: 25, outward: 40, closing: 45, unit: "Ltr", value: 36000 },
  { id: 5, product: "Wall Putty", category: "Wall Care", opening: 120, inward: 60, outward: 90, closing: 90, unit: "Kg", value: 27000 },
];

const movementData = [
  { month: "Jan", inward: 400, outward: 350 },
  { month: "Feb", inward: 450, outward: 400 },
  { month: "Mar", inward: 500, outward: 480 },
  { month: "Apr", inward: 420, outward: 390 },
  { month: "May", inward: 480, outward: 450 },
  { month: "Jun", inward: 520, outward: 500 },
];

const categoryDistribution = [
  { name: "Interior Paint", value: 35, color: "#5e7a59" },
  { name: "Exterior Paint", value: 30, color: "#90AB8B" },
  { name: "Primer", value: 20, color: "#c8d9c5" },
  { name: "Others", value: 15, color: "#3d5438" },
];

const topProducts = [
  { name: "Premium White", value: 150 },
  { name: "Exterior Emulsion", value: 120 },
  { name: "Wood Primer", value: 100 },
  { name: "Metal Paint", value: 80 },
  { name: "Wall Putty", value: 70 },
];

const summaryData = { totalItems: 245, totalValue: 1245000, lowStockAlerts: 12, topMoving: 8 };

export default function InventoryReport() {
  const navigate = useNavigate();
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [stockStatus, setStockStatus] = useState("all");

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
                  <img src={inventoryReportIcon} alt="Inventory Report" className="h-5 w-5 object-contain" style={{ mixBlendMode: 'multiply' }} />
                  <span className="font-semibold" style={{ color: THEME.primary }}>Inventory Report</span>
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
                    <img src={inventoryReportIcon} alt="Inventory Report" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
                  </motion.div>
                  <div className="flex flex-col">
                    <span>Inventory Report</span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="text-sm font-normal italic ml-[3.5ch]"
                      style={{ color: THEME.primary }}
                    >
                      Monitor stock movement and inventory valuation
                    </motion.span>
                  </div>
                </motion.h1>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                >
                  <Badge className="text-white border-none text-sm px-4 py-1 shadow-md" style={{ background: `linear-gradient(to right, ${THEME.primary}, ${THEME.primaryDark})` }}>
                    {summaryData.totalItems} Items
                  </Badge>
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-2"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto bg-white transition-all duration-300 shadow-sm hover:shadow-md group"
                style={{ borderColor: THEME.border, color: THEME.primary }}
              >
                <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto text-white hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                style={{ background: `linear-gradient(to right, ${THEME.primary}, ${THEME.primaryDark})`, borderColor: THEME.primary }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white/90 mb-1">Total Stock Items</h3>
              <p className="text-2xl font-bold text-white">{summaryData.totalItems}</p>
            </div>
            <div className="absolute right-4 bottom-4 opacity-80">
              <Package className="h-16 w-16 text-white/40" strokeWidth={1.5} />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-400 via-green-400 to-teal-400 p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white/90 mb-1">Total Stock Value</h3>
              <p className="text-2xl font-bold text-white">₹{summaryData.totalValue.toLocaleString()}</p>
            </div>
            <div className="absolute right-4 bottom-4 opacity-80">
              <TrendingUp className="h-16 w-16 text-white/40" strokeWidth={1.5} />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-400 via-rose-400 to-pink-400 p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white/90 mb-1">Low Stock Alerts</h3>
              <p className="text-2xl font-bold text-white">{summaryData.lowStockAlerts}</p>
            </div>
            <div className="absolute right-4 bottom-4 opacity-80">
              <AlertCircle className="h-16 w-16 text-white/40" strokeWidth={1.5} />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-400 via-purple-400 to-indigo-400 p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white/90 mb-1">Top Moving Products</h3>
              <p className="text-2xl font-bold text-white">{summaryData.topMoving}</p>
            </div>
            <div className="absolute right-4 bottom-4 opacity-80">
              <Star className="h-16 w-16 text-white/40" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div
          className="p-4 rounded-xl border-2 shadow-sm"
          style={{
            background: `linear-gradient(to right, ${THEME.gradientFrom}, ${THEME.gradientMid})`,
            borderColor: THEME.border,
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: THEME.primaryDark }}>Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-white hover:opacity-90 transition-colors" style={{ borderColor: THEME.border, color: THEME.primary }}>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2" style={{ borderColor: THEME.primaryLight }}>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="interior">Interior Paint</SelectItem>
                  <SelectItem value="exterior">Exterior Paint</SelectItem>
                  <SelectItem value="primer">Primer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: THEME.primaryDark }}>Product Name</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: THEME.primary }} />
                <Input
                  placeholder="Search product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-white"
                  style={{ borderColor: THEME.border }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: THEME.primaryDark }}>Supplier</label>
              <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                <SelectTrigger className="bg-white hover:opacity-90 transition-colors" style={{ borderColor: THEME.border, color: THEME.primary }}>
                  <SelectValue placeholder="All Suppliers" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2" style={{ borderColor: THEME.primaryLight }}>
                  <SelectItem value="all">All Suppliers</SelectItem>
                  <SelectItem value="supplier1">Supplier 1</SelectItem>
                  <SelectItem value="supplier2">Supplier 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: THEME.primaryDark }}>Stock Status</label>
              <Select value={stockStatus} onValueChange={setStockStatus}>
                <SelectTrigger className="bg-white hover:opacity-90 transition-colors" style={{ borderColor: THEME.border, color: THEME.primary }}>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2" style={{ borderColor: THEME.primaryLight }}>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button className="text-white hover:opacity-90" style={{ backgroundColor: THEME.primary }}>
              Generate Report
            </Button>
            <Button variant="outline" className="bg-white" style={{ borderColor: THEME.border, color: THEME.primary }}>
              Reset
            </Button>
          </div>
        </div>

        {/* Inventory Report Table */}
        <div className="bg-white rounded-xl border-2 shadow-lg overflow-hidden" style={{ borderColor: THEME.primaryLight }}>
          <div
            className="p-4 border-b-2"
            style={{
              background: `linear-gradient(to right, ${THEME.gradientFrom}, ${THEME.gradientMid})`,
              borderColor: THEME.primaryLight,
            }}
          >
            <h2 className="text-lg font-semibold" style={{ color: THEME.primaryDark }}>Inventory Report</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow style={{ backgroundColor: THEME.primaryLightest }}>
                  <TableHead style={{ color: THEME.primaryDark }}>Product</TableHead>
                  <TableHead style={{ color: THEME.primaryDark }}>Category</TableHead>
                  <TableHead className="text-right" style={{ color: THEME.primaryDark }}>Opening Stock</TableHead>
                  <TableHead className="text-right" style={{ color: THEME.primaryDark }}>Inward</TableHead>
                  <TableHead className="text-right" style={{ color: THEME.primaryDark }}>Outward</TableHead>
                  <TableHead className="text-right" style={{ color: THEME.primaryDark }}>Closing Stock</TableHead>
                  <TableHead style={{ color: THEME.primaryDark }}>Unit</TableHead>
                  <TableHead className="text-right" style={{ color: THEME.primaryDark }}>Stock Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-opacity-50 transition-colors" style={{ '--tw-bg-opacity': 0 } as any}>
                    <TableCell className="font-medium">{item.product}</TableCell>
                    <TableCell>
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: THEME.primaryLighter, color: THEME.primaryDark }}
                      >
                        {item.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{item.opening}</TableCell>
                    <TableCell className="text-right font-medium" style={{ color: '#16a34a' }}>{item.inward}</TableCell>
                    <TableCell className="text-right font-medium" style={{ color: '#dc2626' }}>{item.outward}</TableCell>
                    <TableCell className="text-right font-bold">{item.closing}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell className="text-right font-semibold">₹{item.value.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border-2 shadow-lg overflow-hidden" style={{ borderColor: THEME.primaryLight }}>
            <div className="p-4 border-b-2" style={{ background: `linear-gradient(to right, ${THEME.gradientFrom}, ${THEME.gradientMid})`, borderColor: THEME.primaryLight }}>
              <h2 className="text-lg font-semibold" style={{ color: THEME.primaryDark }}>Inventory Movement</h2>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={movementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="inward" stroke={THEME.primary} strokeWidth={2} />
                  <Line type="monotone" dataKey="outward" stroke={THEME.primaryDark} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 shadow-lg overflow-hidden" style={{ borderColor: THEME.primaryLight }}>
            <div className="p-4 border-b-2" style={{ background: `linear-gradient(to right, ${THEME.gradientFrom}, ${THEME.gradientMid})`, borderColor: THEME.primaryLight }}>
              <h2 className="text-lg font-semibold" style={{ color: THEME.primaryDark }}>Category-wise Stock Distribution</h2>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={categoryDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill={THEME.primary} dataKey="value" label>
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 shadow-lg overflow-hidden" style={{ borderColor: THEME.primaryLight }}>
          <div className="p-4 border-b-2" style={{ background: `linear-gradient(to right, ${THEME.gradientFrom}, ${THEME.gradientMid})`, borderColor: THEME.primaryLight }}>
            <h2 className="text-lg font-semibold" style={{ color: THEME.primaryDark }}>Top Products</h2>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill={THEME.primary} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Footer */}
        <div
          className="p-6 rounded-xl border-2"
          style={{
            background: `linear-gradient(to right, ${THEME.gradientFrom}, ${THEME.gradientMid})`,
            borderColor: THEME.border,
          }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-lg font-semibold" style={{ color: THEME.primaryDark }}>
              Total Stock Value: ₹{summaryData.totalValue.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Report Generated On: {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
