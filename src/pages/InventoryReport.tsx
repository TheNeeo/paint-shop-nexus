import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Package, TrendingUp, AlertCircle, Star, RefreshCw, Download, Printer } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function InventoryReport() {
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [stockStatus, setStockStatus] = useState("all");

  // Sample data for summary cards
  const summaryData = {
    totalItems: 245,
    totalValue: 1245000,
    lowStockAlerts: 12,
    topMoving: 8,
  };

  // Sample data for inventory table
  const inventoryData = [
    {
      id: 1,
      product: "Premium Paint White",
      category: "Interior Paint",
      opening: 100,
      inward: 50,
      outward: 80,
      closing: 70,
      unit: "Ltr",
      value: 52500,
    },
    {
      id: 2,
      product: "Exterior Emulsion",
      category: "Exterior Paint",
      opening: 80,
      inward: 40,
      outward: 60,
      closing: 60,
      unit: "Ltr",
      value: 48000,
    },
    {
      id: 3,
      product: "Wood Primer",
      category: "Primer",
      opening: 50,
      inward: 30,
      outward: 45,
      closing: 35,
      unit: "Ltr",
      value: 28000,
    },
  ];

  // Sample data for charts
  const movementData = [
    { month: "Jan", inward: 400, outward: 350 },
    { month: "Feb", inward: 450, outward: 400 },
    { month: "Mar", inward: 500, outward: 480 },
    { month: "Apr", inward: 420, outward: 390 },
    { month: "May", inward: 480, outward: 450 },
    { month: "Jun", inward: 520, outward: 500 },
  ];

  const categoryDistribution = [
    { name: "Interior Paint", value: 35, color: "hsl(45, 81%, 60%)" },
    { name: "Exterior Paint", value: 30, color: "hsl(45, 71%, 50%)" },
    { name: "Primer", value: 20, color: "hsl(45, 61%, 40%)" },
    { name: "Others", value: 15, color: "hsl(45, 51%, 30%)" },
  ];

  const topProducts = [
    { name: "Premium White", value: 150 },
    { name: "Exterior Emulsion", value: 120 },
    { name: "Wood Primer", value: 100 },
    { name: "Metal Paint", value: 80 },
    { name: "Wall Putty", value: 70 },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>Reports & Analytics</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Inventory Report</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: "hsl(45, 81%, 40%)" }}>
                Inventory Report
              </h1>
              <p className="text-muted-foreground mt-1">
                Monitor stock movement and inventory valuation
              </p>
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
        <Card style={{ borderColor: "hsl(45, 81%, 60%)", borderWidth: "2px" }}>
          <CardHeader style={{ backgroundColor: "hsl(45, 81%, 95%)" }}>
            <CardTitle style={{ color: "hsl(45, 81%, 30%)" }}>Filter Controls</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="interior">Interior Paint</SelectItem>
                    <SelectItem value="exterior">Exterior Paint</SelectItem>
                    <SelectItem value="primer">Primer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Product Name</label>
                <Input
                  placeholder="Search product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Supplier</label>
                <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Suppliers</SelectItem>
                    <SelectItem value="supplier1">Supplier 1</SelectItem>
                    <SelectItem value="supplier2">Supplier 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Stock Status</label>
                <Select value={stockStatus} onValueChange={setStockStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="low">Low Stock</SelectItem>
                    <SelectItem value="out">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button style={{ backgroundColor: "hsl(45, 81%, 60%)", color: "hsl(0, 0%, 100%)" }}>
                Generate Report
              </Button>
              <Button variant="outline">Reset</Button>
            </div>
          </CardContent>
        </Card>

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

        {/* Report Table */}
        <Card style={{ borderColor: "hsl(45, 81%, 60%)", borderWidth: "2px" }}>
          <CardHeader style={{ backgroundColor: "hsl(45, 81%, 95%)" }}>
            <CardTitle style={{ color: "hsl(45, 81%, 30%)" }}>Inventory Report</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Opening Stock</TableHead>
                  <TableHead className="text-right">Inward</TableHead>
                  <TableHead className="text-right">Outward</TableHead>
                  <TableHead className="text-right">Closing Stock</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead className="text-right">Stock Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.product}</TableCell>
                    <TableCell>
                      <span
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ backgroundColor: "hsl(45, 81%, 90%)", color: "hsl(45, 81%, 30%)" }}
                      >
                        {item.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{item.opening}</TableCell>
                    <TableCell className="text-right">{item.inward}</TableCell>
                    <TableCell className="text-right">{item.outward}</TableCell>
                    <TableCell className="text-right">{item.closing}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell className="text-right">₹{item.value.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card style={{ borderColor: "hsl(45, 81%, 60%)", borderWidth: "2px" }}>
            <CardHeader style={{ backgroundColor: "hsl(45, 81%, 95%)" }}>
              <CardTitle style={{ color: "hsl(45, 81%, 30%)" }}>Inventory Movement</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={movementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="inward" stroke="hsl(45, 81%, 60%)" strokeWidth={2} />
                  <Line type="monotone" dataKey="outward" stroke="hsl(45, 61%, 40%)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card style={{ borderColor: "hsl(45, 81%, 60%)", borderWidth: "2px" }}>
            <CardHeader style={{ backgroundColor: "hsl(45, 81%, 95%)" }}>
              <CardTitle style={{ color: "hsl(45, 81%, 30%)" }}>Category-wise Stock Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="hsl(45, 81%, 60%)"
                    dataKey="value"
                    label
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card style={{ borderColor: "hsl(45, 81%, 60%)", borderWidth: "2px" }}>
          <CardHeader style={{ backgroundColor: "hsl(45, 81%, 95%)" }}>
            <CardTitle style={{ color: "hsl(45, 81%, 30%)" }}>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="hsl(45, 81%, 60%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Footer */}
        <Card style={{ borderColor: "hsl(45, 81%, 60%)", borderWidth: "2px", backgroundColor: "hsl(45, 81%, 95%)" }}>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-lg font-semibold" style={{ color: "hsl(45, 81%, 30%)" }}>
                  Total Stock Value: ₹{summaryData.totalValue.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Report Generated On: {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
