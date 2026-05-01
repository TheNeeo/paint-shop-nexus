import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Download, 
  ArrowLeft,
  Boxes,
  Clock
  Calendar as CalIcon,
  Package as PkgIcon,
  ArrowUpDown as ArrowIcon,
  Tag as TagIcon,
  FileText as FileIcon,
  StickyNote as NoteIcon,
  User as UserIcon,
} from "lucide-react";
import { TableHeaderCell } from "@/components/shared/TableHeaderCell";
import dashboardHomeIcon from "@/assets/dashboard-home-icon.png";
import inventoryMovementIcon from "@/assets/inventory-movement-icon.png";

// Electric Aqua theme colors
const ELECTRIC_AQUA = "#7CF6F8";
const ELECTRIC_AQUA_DARK = "#4DD4D6";
const ELECTRIC_AQUA_DARKER = "#2A9D9F";

export default function InventoryMovementHistory() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState("7days");

  // Mock data - replace with actual Supabase query
  const movements = [
    {
      id: "1",
      date: "2024-01-15 10:30 AM",
      productName: "Asian Paints Apex",
      quantityChange: 50,
      type: "Purchase",
      reason: "Restock",
      notes: "New stock arrival",
      user: "Admin",
    },
    {
      id: "2",
      date: "2024-01-15 02:15 PM",
      productName: "Berger Easy Clean",
      quantityChange: -25,
      type: "Sale",
      reason: "Customer Sale",
      notes: "Invoice #INV-1234",
      user: "Cashier 1",
    },
    {
      id: "3",
      date: "2024-01-14 11:00 AM",
      productName: "Nerolac Excel",
      quantityChange: -5,
      type: "Manual Adjust",
      reason: "Damage",
      notes: "Container damaged during handling",
      user: "Manager",
    },
    {
      id: "4",
      date: "2024-01-14 09:45 AM",
      productName: "Dulux Weathershield",
      quantityChange: 30,
      type: "Purchase",
      reason: "Restock",
      notes: "Regular stock replenishment",
      user: "Admin",
    },
    {
      id: "5",
      date: "2024-01-13 03:30 PM",
      productName: "Nippon Odour-Less",
      quantityChange: -15,
      type: "Sale",
      reason: "Customer Sale",
      notes: "Invoice #INV-1230",
      user: "Cashier 2",
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Purchase":
        return "bg-green-100 text-green-800 border-green-200";
      case "Sale":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Manual Adjust":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Return":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getQuantityIcon = (quantity: number) => {
    if (quantity > 0) {
      return <TrendingUp className="h-4 w-4 text-green-600 inline mr-1" />;
    } else {
      return <TrendingDown className="h-4 w-4 text-red-600 inline mr-1" />;
    }
  };

  return (
    <AppLayout>
      <div className="w-full min-h-screen p-6" style={{ background: `linear-gradient(to bottom right, ${ELECTRIC_AQUA}20, white, ${ELECTRIC_AQUA}10)` }}>
        <div className="space-y-6">
          {/* Breadcrumb - Outside Header Box */}
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
                  <BreadcrumbLink 
                    onClick={() => navigate("/inventory")} 
                    className="cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1.5"
                  >
                    <Boxes className="h-4 w-4 text-orange-400" />
                    <span className="text-orange-600 font-medium">Inventory Management</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" style={{ color: ELECTRIC_AQUA_DARKER }} />
                    <span className="font-semibold" style={{ color: ELECTRIC_AQUA_DARKER }}>Movement History</span>
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </motion.div>

          {/* Enhanced Animated Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl p-6 mb-8 shadow-lg border-2 relative overflow-hidden"
            style={{ 
              background: `linear-gradient(to right, ${ELECTRIC_AQUA}40, ${ELECTRIC_AQUA}20, ${ELECTRIC_AQUA}30)`,
              borderColor: ELECTRIC_AQUA
            }}
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: ELECTRIC_AQUA_DARK }}></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full blur-3xl animate-pulse delay-1000" style={{ backgroundColor: ELECTRIC_AQUA }}></div>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-2xl sm:text-4xl font-bold flex items-center gap-3"
                    style={{ color: ELECTRIC_AQUA_DARKER }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <img 
                        src={inventoryMovementIcon} 
                        alt="Inventory Movement History" 
                        className="h-10 w-10 sm:h-12 sm:w-12 object-contain" 
                        style={{ mixBlendMode: 'multiply' }}
                      />
                    </motion.div>
                    Inventory Movement History
                  </motion.h1>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  >
                    <Badge 
                      className="text-white border-none text-sm px-4 py-1 shadow-md"
                      style={{ background: `linear-gradient(to right, ${ELECTRIC_AQUA_DARK}, ${ELECTRIC_AQUA_DARKER})` }}
                    >
                      Live Tracking
                    </Badge>
                  </motion.div>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-sm italic"
                  style={{ color: ELECTRIC_AQUA_DARKER }}
                >
                  Track all inventory changes ~ Every movement recorded 📊
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-2"
              >
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/inventory")}
                  className="bg-white transition-all duration-300 shadow-sm hover:shadow-md group"
                  style={{ 
                    borderColor: ELECTRIC_AQUA,
                    color: ELECTRIC_AQUA_DARKER
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Inventory
                </Button>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    className="shadow-lg hover:shadow-xl border-2 transition-all duration-300 relative overflow-hidden group text-white"
                    style={{ 
                      background: `linear-gradient(to right, ${ELECTRIC_AQUA_DARK}, ${ELECTRIC_AQUA_DARKER})`,
                      borderColor: ELECTRIC_AQUA
                    }}
                  >
                    <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                    <Download className="h-4 w-4 mr-2 relative z-10" />
                    <span className="relative z-10">Export Report</span>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Filters Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-2" style={{ borderColor: ELECTRIC_AQUA }}>
              <CardHeader style={{ backgroundColor: `${ELECTRIC_AQUA}30` }}>
                <CardTitle className="flex items-center gap-2" style={{ color: ELECTRIC_AQUA_DARKER }}>
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by product name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 border-2 focus:ring-2"
                        style={{ 
                          borderColor: ELECTRIC_AQUA,
                          outlineColor: ELECTRIC_AQUA_DARK
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger 
                        className="border-2" 
                        style={{ borderColor: ELECTRIC_AQUA }}
                      >
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="purchase">Purchase</SelectItem>
                        <SelectItem value="sale">Sale</SelectItem>
                        <SelectItem value="manual">Manual Adjust</SelectItem>
                        <SelectItem value="return">Return</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger 
                        className="border-2" 
                        style={{ borderColor: ELECTRIC_AQUA }}
                      >
                        <SelectValue placeholder="Date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="7days">Last 7 Days</SelectItem>
                        <SelectItem value="30days">Last 30 Days</SelectItem>
                        <SelectItem value="90days">Last 90 Days</SelectItem>
                        <SelectItem value="all">All Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Movement History Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-2" style={{ borderColor: ELECTRIC_AQUA }}>
              <CardHeader style={{ backgroundColor: `${ELECTRIC_AQUA}30` }}>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2" style={{ color: ELECTRIC_AQUA_DARKER }}>
                    <Clock className="h-5 w-5" />
                    Stock Movement Records
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-2"
                    style={{ 
                      borderColor: ELECTRIC_AQUA,
                      color: ELECTRIC_AQUA_DARKER
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow style={{ backgroundColor: `${ELECTRIC_AQUA}20` }}>
                      <TableHeaderCell icon={CalIcon} label="Date & Time" textColor={ELECTRIC_AQUA_DARKER} iconColor="#0ea5e9" />
                      <TableHeaderCell icon={PkgIcon} label="Product Name" textColor={ELECTRIC_AQUA_DARKER} iconColor="#f97316" />
                      <TableHeaderCell icon={ArrowIcon} label="Quantity In/Out" textColor={ELECTRIC_AQUA_DARKER} iconColor="#10b981" />
                      <TableHeaderCell icon={TagIcon} label="Type" textColor={ELECTRIC_AQUA_DARKER} iconColor="#8b5cf6" />
                      <TableHeaderCell icon={FileIcon} label="Reason" textColor={ELECTRIC_AQUA_DARKER} iconColor="#ec4899" />
                      <TableHeaderCell icon={NoteIcon} label="Notes" textColor={ELECTRIC_AQUA_DARKER} iconColor="#f59e0b" />
                      <TableHeaderCell icon={UserIcon} label="User/Admin" textColor={ELECTRIC_AQUA_DARKER} iconColor="#1e40af" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movements.map((movement, index) => (
                      <motion.tr
                        key={movement.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="hover:bg-opacity-50 transition-colors"
                        style={{ backgroundColor: index % 2 === 0 ? 'transparent' : `${ELECTRIC_AQUA}10` }}
                      >
                        <TableCell className="font-medium">{movement.date}</TableCell>
                        <TableCell className="font-semibold" style={{ color: ELECTRIC_AQUA_DARKER }}>{movement.productName}</TableCell>
                        <TableCell>
                          {getQuantityIcon(movement.quantityChange)}
                          <span
                            className={`font-bold ${
                              movement.quantityChange > 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {movement.quantityChange > 0 ? "+" : ""}
                            {movement.quantityChange}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTypeColor(movement.type)}>
                            {movement.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{movement.reason}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {movement.notes}
                        </TableCell>
                        <TableCell>{movement.user}</TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-between pt-4 border-t-2"
            style={{ borderColor: ELECTRIC_AQUA }}
          >
            <Button 
              variant="outline" 
              onClick={() => navigate("/inventory")}
              className="border-2"
              style={{ 
                borderColor: ELECTRIC_AQUA,
                color: ELECTRIC_AQUA_DARKER
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Inventory List
            </Button>
            <p className="text-sm" style={{ color: ELECTRIC_AQUA_DARKER }}>
              Showing {movements.length} records
            </p>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
