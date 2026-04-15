import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  DollarSign,
  CreditCard,
  TrendingUp,
  Plus,
  Trash2,
  Save,
  FileDown,
  Printer,
  Mail,
  MessageSquare,
  ShoppingCart,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast as sonnerToast } from "sonner";
import invoiceGenerateIcon from "@/assets/invoice-generate-icon.png";
import dashboardHomeIcon from "@/assets/dashboard-home-icon.png";

// Champagne Brown theme colors
const THEME_PRIMARY = "#5D3A1A";
const THEME_SECONDARY = "#8B4513";
const THEME_BG = "#F4DDCB";
const THEME_BORDER = "#D4A574";

interface InvoiceItem {
  id: string;
  productName: string;
  category: string;
  hsnCode: string;
  unit: string;
  quantity: number;
  rate: number;
  amount: number;
}

export default function InvoiceGenerate() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [gstRate, setGstRate] = useState<number>(18);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [terms, setTerms] = useState<string>("");

  // Fetch products
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name");
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data || [];
    },
  });

  // Calculate totals
  const subtotal = invoiceItems.reduce((sum, item) => sum + item.amount, 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const gstAmount = (taxableAmount * gstRate) / 100;
  const grandTotal = taxableAmount + gstAmount;
  const balanceDue = grandTotal - paidAmount;

  const addNewItem = () => {
    const newItem: InvoiceItem = {
      id: Math.random().toString(36).substr(2, 9),
      productName: "",
      category: "",
      hsnCode: "",
      unit: "PC",
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    setInvoiceItems([...invoiceItems, newItem]);
  };

  const removeItem = (id: string) => {
    setInvoiceItems(invoiceItems.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setInvoiceItems(
      invoiceItems.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "quantity" || field === "rate") {
            updated.amount = updated.quantity * updated.rate;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Invoice draft has been saved successfully.",
    });
  };

  const handleGeneratePDF = () => {
    toast({
      title: "PDF Generated",
      description: "Invoice PDF is ready for download.",
    });
  };

  return (
    <AppLayout>
      <div 
        className="w-full min-h-screen p-6"
        style={{ background: 'linear-gradient(to br, #FAF3ED, #fff, #FDF8F3)' }}
      >
        <div className="space-y-6">
          {/* Breadcrumb - Outside Header Box (Like Sales Activity) */}
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
                    onClick={() => navigate("/sales")} 
                    className="cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1.5"
                  >
                    <ShoppingCart className="h-4 w-4 text-orange-400" />
                    <span className="text-orange-600 font-medium">Sales Management</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4" style={{ color: THEME_SECONDARY }} />
                    <span className="font-semibold" style={{ color: THEME_PRIMARY }}>Invoice Generate</span>
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </motion.div>

          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl p-6 mb-8 shadow-lg border-2 relative overflow-hidden"
            style={{
              background: `linear-gradient(to right, ${THEME_BG}, #FAF3ED, #FDF8F3)`,
              borderColor: THEME_BORDER,
            }}
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: THEME_SECONDARY }}></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full blur-3xl animate-pulse delay-1000" style={{ backgroundColor: THEME_BORDER }}></div>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-2xl sm:text-4xl font-bold flex items-center gap-3"
                    style={{ color: THEME_PRIMARY }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <img 
                        src={invoiceGenerateIcon} 
                        alt="Invoice Generate" 
                        className="h-10 w-10 sm:h-12 sm:w-12 object-contain" 
                        style={{ mixBlendMode: 'multiply' }}
                      />
                    </motion.div>
                    Invoice Generate
                  </motion.h1>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  >
                    <Badge 
                      className="text-white border-none text-sm px-4 py-1 shadow-md"
                      style={{ background: `linear-gradient(to right, ${THEME_PRIMARY}, ${THEME_SECONDARY})` }}
                    >
                      Smart Invoice
                    </Badge>
                  </motion.div>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-sm italic"
                  style={{ color: THEME_SECONDARY }}
                >
                  Invoices, intelligently generated. 📝
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
                  onClick={handleGeneratePDF}
                  className="bg-white transition-all duration-300 shadow-sm hover:shadow-md group"
                  style={{ 
                    borderColor: THEME_BORDER,
                    color: THEME_PRIMARY
                  }}
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={handleSaveDraft} 
                    className="shadow-lg hover:shadow-xl border-2 transition-all duration-300 relative overflow-hidden group text-white"
                    style={{ 
                      background: `linear-gradient(to right, ${THEME_PRIMARY}, ${THEME_SECONDARY})`,
                      borderColor: THEME_BORDER
                    }}
                  >
                    <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                    <Plus className="h-4 w-4 mr-2 relative z-10" />
                    <span className="relative z-10">Create New Invoice</span>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Hero Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden rounded-2xl p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              style={{ background: `linear-gradient(135deg, ${THEME_BG} 0%, ${THEME_BORDER} 100%)` }}
            >
              <div className="relative z-10">
                <h3 className="text-lg font-semibold mb-1" style={{ color: THEME_PRIMARY }}>Total Sales Today</h3>
                <p className="text-2xl font-bold" style={{ color: THEME_PRIMARY }}>₹45,231</p>
              </div>
              <div className="absolute right-4 bottom-4 opacity-30">
                <FileText className="h-16 w-16" style={{ color: THEME_PRIMARY }} strokeWidth={1.5} />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative overflow-hidden rounded-2xl p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              style={{ background: `linear-gradient(135deg, #E8C5A8 0%, ${THEME_SECONDARY} 100%)` }}
            >
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-white/90 mb-1">Pending Invoices</h3>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
              <div className="absolute right-4 bottom-4 opacity-30">
                <CreditCard className="h-16 w-16 text-white" strokeWidth={1.5} />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative overflow-hidden rounded-2xl p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              style={{ background: `linear-gradient(135deg, ${THEME_SECONDARY} 0%, ${THEME_PRIMARY} 100%)` }}
            >
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-white/90 mb-1">Total GST Collected</h3>
                <p className="text-2xl font-bold text-white">₹8,142</p>
              </div>
              <div className="absolute right-4 bottom-4 opacity-30">
                <DollarSign className="h-16 w-16 text-white" strokeWidth={1.5} />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative overflow-hidden rounded-2xl p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              style={{ background: `linear-gradient(135deg, #D4A574 0%, #C49A6C 100%)` }}
            >
              <div className="relative z-10">
                <h3 className="text-lg font-semibold mb-1" style={{ color: THEME_PRIMARY }}>Avg Invoice Value</h3>
                <p className="text-2xl font-bold" style={{ color: THEME_PRIMARY }}>₹3,769</p>
              </div>
              <div className="absolute right-4 bottom-4 opacity-30">
                <TrendingUp className="h-16 w-16" style={{ color: THEME_PRIMARY }} strokeWidth={1.5} />
              </div>
            </motion.div>
          </div>

          {/* Invoice Form Section */}
          <Card 
            className="shadow-lg" 
            style={{ borderColor: THEME_BORDER, borderWidth: "2px" }}
          >
            <CardHeader 
              className="rounded-t-lg"
              style={{ backgroundColor: `${THEME_BG}60` }}
            >
              <CardTitle style={{ color: THEME_PRIMARY }}>Invoice Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Customer Information Block */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold" style={{ color: THEME_PRIMARY }}>
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label style={{ color: THEME_SECONDARY }}>Select Customer</Label>
                    <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                      <SelectTrigger style={{ borderColor: THEME_BORDER }}>
                        <SelectValue placeholder="Choose a customer..." />
                      </SelectTrigger>
                      <SelectContent style={{ borderColor: THEME_BORDER }}>
                        <SelectItem value="customer1">John Doe</SelectItem>
                        <SelectItem value="customer2">Jane Smith</SelectItem>
                        <SelectItem value="customer3">Bob Johnson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="invisible">Action</Label>
                    <Button
                      variant="outline"
                      style={{ borderColor: THEME_BORDER, color: THEME_PRIMARY }}
                      className="w-full hover:opacity-80"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Customer
                    </Button>
                  </div>
                </div>

                {selectedCustomer && (
                  <div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg" 
                    style={{ backgroundColor: `${THEME_BG}40` }}
                  >
                    <div>
                      <Label className="text-xs" style={{ color: THEME_SECONDARY }}>Name</Label>
                      <p className="font-medium" style={{ color: THEME_PRIMARY }}>John Doe</p>
                    </div>
                    <div>
                      <Label className="text-xs" style={{ color: THEME_SECONDARY }}>Mobile / Email</Label>
                      <p className="font-medium" style={{ color: THEME_PRIMARY }}>+91 98765 43210 | john@example.com</p>
                    </div>
                    <div>
                      <Label className="text-xs" style={{ color: THEME_SECONDARY }}>GST Number</Label>
                      <p className="font-medium" style={{ color: THEME_PRIMARY }}>29ABCDE1234F1Z5</p>
                    </div>
                    <div>
                      <Label className="text-xs" style={{ color: THEME_SECONDARY }}>Billing Address</Label>
                      <p className="font-medium" style={{ color: THEME_PRIMARY }}>123 Main St, City, State - 123456</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Invoice Details Block */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold" style={{ color: THEME_PRIMARY }}>
                  Invoice Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label style={{ color: THEME_SECONDARY }}>Invoice No.</Label>
                    <Input 
                      value="INV-2025-001" 
                      readOnly 
                      style={{ borderColor: THEME_BORDER }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label style={{ color: THEME_SECONDARY }}>Date</Label>
                    <Input 
                      type="date" 
                      defaultValue={new Date().toISOString().split("T")[0]} 
                      style={{ borderColor: THEME_BORDER }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label style={{ color: THEME_SECONDARY }}>Due Date</Label>
                    <Input type="date" style={{ borderColor: THEME_BORDER }} />
                  </div>
                  <div className="space-y-2">
                    <Label style={{ color: THEME_SECONDARY }}>Payment Terms</Label>
                    <Select defaultValue="net30">
                      <SelectTrigger style={{ borderColor: THEME_BORDER }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent style={{ borderColor: THEME_BORDER }}>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="net30">Net 30</SelectItem>
                        <SelectItem value="net60">Net 60</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label style={{ color: THEME_SECONDARY }}>Salesperson</Label>
                    <Select>
                      <SelectTrigger style={{ borderColor: THEME_BORDER }}>
                        <SelectValue placeholder="Select salesperson" />
                      </SelectTrigger>
                      <SelectContent style={{ borderColor: THEME_BORDER }}>
                        <SelectItem value="sales1">Sales Person 1</SelectItem>
                        <SelectItem value="sales2">Sales Person 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Product/Item Table */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold" style={{ color: THEME_PRIMARY }}>
                    Products / Items
                  </h3>
                  <Button
                    onClick={addNewItem}
                    size="sm"
                    style={{ backgroundColor: THEME_PRIMARY, color: "#fff" }}
                    className="hover:opacity-90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden" style={{ borderColor: THEME_BORDER }}>
                  <Table>
                    <TableHeader style={{ backgroundColor: `${THEME_BG}60` }}>
                      <TableRow>
                        <TableHead className="w-12" style={{ color: THEME_PRIMARY }}>S.No</TableHead>
                        <TableHead style={{ color: THEME_PRIMARY }}>Product Name</TableHead>
                        <TableHead style={{ color: THEME_PRIMARY }}>Category</TableHead>
                        <TableHead style={{ color: THEME_PRIMARY }}>HSN Code</TableHead>
                        <TableHead style={{ color: THEME_PRIMARY }}>Unit</TableHead>
                        <TableHead className="w-24" style={{ color: THEME_PRIMARY }}>Qty</TableHead>
                        <TableHead className="w-32" style={{ color: THEME_PRIMARY }}>Rate</TableHead>
                        <TableHead className="w-32" style={{ color: THEME_PRIMARY }}>Amount</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoiceItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8" style={{ color: THEME_SECONDARY }}>
                            No items added. Click "Add Item" to start.
                          </TableCell>
                        </TableRow>
                      ) : (
                        invoiceItems.map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell style={{ color: THEME_PRIMARY }}>{index + 1}</TableCell>
                            <TableCell>
                              <Select
                                value={item.productName}
                                onValueChange={(value) => {
                                  const product = products.find((p) => p.name === value);
                                  if (product) {
                                    updateItem(item.id, "productName", value);
                                    updateItem(item.id, "hsnCode", product.hsn_code || "");
                                    updateItem(item.id, "unit", product.unit);
                                    updateItem(item.id, "rate", product.unit_price);
                                  }
                                }}
                              >
                                <SelectTrigger style={{ borderColor: THEME_BORDER }}>
                                  <SelectValue placeholder="Select product" />
                                </SelectTrigger>
                                <SelectContent style={{ borderColor: THEME_BORDER }}>
                                  {products.map((product) => (
                                    <SelectItem key={product.id} value={product.name}>
                                      {product.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              {item.category && (
                                <Badge style={{ backgroundColor: THEME_BG, color: THEME_PRIMARY }}>
                                  {item.category}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Input
                                value={item.hsnCode}
                                onChange={(e) => updateItem(item.id, "hsnCode", e.target.value)}
                                className="w-24"
                                style={{ borderColor: THEME_BORDER }}
                              />
                            </TableCell>
                            <TableCell>
                              <Select
                                value={item.unit}
                                onValueChange={(value) => updateItem(item.id, "unit", value)}
                              >
                                <SelectTrigger className="w-20" style={{ borderColor: THEME_BORDER }}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent style={{ borderColor: THEME_BORDER }}>
                                  <SelectItem value="PC">PC</SelectItem>
                                  <SelectItem value="Kg">Kg</SelectItem>
                                  <SelectItem value="Ltr">Ltr</SelectItem>
                                  <SelectItem value="ML">ML</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)
                                }
                                className="w-20"
                                style={{ borderColor: THEME_BORDER }}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.rate}
                                onChange={(e) =>
                                  updateItem(item.id, "rate", parseFloat(e.target.value) || 0)
                                }
                                style={{ borderColor: THEME_BORDER }}
                              />
                            </TableCell>
                            <TableCell className="font-medium" style={{ color: THEME_PRIMARY }}>
                              ₹{item.amount.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Financial Summary Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold" style={{ color: THEME_PRIMARY }}>
                    Additional Details
                  </h3>
                  <div className="space-y-2">
                    <Label style={{ color: THEME_SECONDARY }}>Notes</Label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any notes for the customer..."
                      rows={3}
                      style={{ borderColor: THEME_BORDER }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label style={{ color: THEME_SECONDARY }}>Terms & Conditions</Label>
                    <Textarea
                      value={terms}
                      onChange={(e) => setTerms(e.target.value)}
                      placeholder="Enter terms and conditions..."
                      rows={3}
                      style={{ borderColor: THEME_BORDER }}
                    />
                  </div>
                </div>

                <Card style={{ borderColor: THEME_BORDER, borderWidth: "2px" }}>
                  <CardHeader style={{ backgroundColor: `${THEME_BG}60` }}>
                    <CardTitle style={{ color: THEME_PRIMARY }}>Financial Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-4">
                    <div className="flex justify-between">
                      <span style={{ color: THEME_SECONDARY }}>Subtotal:</span>
                      <span className="font-medium" style={{ color: THEME_PRIMARY }}>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span style={{ color: THEME_SECONDARY }}>Discount:</span>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={discount}
                          onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                          className="w-20 h-8"
                          style={{ borderColor: THEME_BORDER }}
                        />
                        <span style={{ color: THEME_SECONDARY }}>%</span>
                        <span className="font-medium" style={{ color: THEME_PRIMARY }}>₹{discountAmount.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span style={{ color: THEME_SECONDARY }}>GST:</span>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={gstRate}
                          onChange={(e) => setGstRate(parseFloat(e.target.value) || 0)}
                          className="w-20 h-8"
                          style={{ borderColor: THEME_BORDER }}
                        />
                        <span style={{ color: THEME_SECONDARY }}>%</span>
                        <span className="font-medium" style={{ color: THEME_PRIMARY }}>₹{gstAmount.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="border-t pt-3" style={{ borderColor: THEME_BORDER }}>
                      <div className="flex justify-between text-lg font-bold">
                        <span style={{ color: THEME_PRIMARY }}>Grand Total:</span>
                        <span style={{ color: THEME_SECONDARY }}>₹{grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span style={{ color: THEME_SECONDARY }}>Paid Amount:</span>
                      <Input
                        type="number"
                        value={paidAmount}
                        onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                        className="w-32 h-8"
                        style={{ borderColor: THEME_BORDER }}
                      />
                    </div>
                    <div className="flex justify-between text-lg font-semibold">
                      <span style={{ color: THEME_PRIMARY }}>Balance Due:</span>
                      <span className={balanceDue > 0 ? "text-red-500" : "text-green-500"}>
                        ₹{balanceDue.toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-end pt-4 border-t" style={{ borderColor: THEME_BORDER }}>
                <Button 
                  variant="outline" 
                  onClick={handleSaveDraft}
                  style={{ borderColor: THEME_BORDER, color: THEME_PRIMARY }}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button
                  variant="outline"
                  onClick={handleGeneratePDF}
                  style={{ borderColor: THEME_BORDER, color: THEME_PRIMARY }}
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  Generate PDF
                </Button>
                <Button 
                  variant="outline"
                  style={{ borderColor: THEME_BORDER, color: THEME_PRIMARY }}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print Invoice
                </Button>
                <Button 
                  variant="outline"
                  style={{ borderColor: THEME_BORDER, color: THEME_PRIMARY }}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send via Email
                </Button>
                <Button
                  style={{ backgroundColor: THEME_PRIMARY, color: "#fff" }}
                  className="hover:opacity-90"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send via WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Invoice History Table */}
          <Card style={{ borderColor: THEME_BORDER, borderWidth: "2px" }}>
            <CardHeader style={{ backgroundColor: `${THEME_BG}60` }}>
              <CardTitle style={{ color: THEME_PRIMARY }}>Invoice History</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Table>
                <TableHeader style={{ backgroundColor: `${THEME_BG}40` }}>
                  <TableRow>
                    <TableHead style={{ color: THEME_PRIMARY }}>Invoice No.</TableHead>
                    <TableHead style={{ color: THEME_PRIMARY }}>Customer Name</TableHead>
                    <TableHead style={{ color: THEME_PRIMARY }}>Date</TableHead>
                    <TableHead style={{ color: THEME_PRIMARY }}>Amount</TableHead>
                    <TableHead style={{ color: THEME_PRIMARY }}>Status</TableHead>
                    <TableHead style={{ color: THEME_PRIMARY }}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium" style={{ color: THEME_PRIMARY }}>INV-2024-150</TableCell>
                    <TableCell style={{ color: THEME_SECONDARY }}>John Doe</TableCell>
                    <TableCell style={{ color: THEME_SECONDARY }}>2025-01-10</TableCell>
                    <TableCell style={{ color: THEME_PRIMARY }}>₹12,500</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700">Paid</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" style={{ borderColor: THEME_BORDER, color: THEME_PRIMARY }}>View</Button>
                        <Button variant="outline" size="sm" style={{ borderColor: THEME_BORDER, color: THEME_PRIMARY }}>Edit</Button>
                        <Button variant="outline" size="sm" style={{ borderColor: THEME_BORDER, color: THEME_PRIMARY }}>PDF</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium" style={{ color: THEME_PRIMARY }}>INV-2024-149</TableCell>
                    <TableCell style={{ color: THEME_SECONDARY }}>Jane Smith</TableCell>
                    <TableCell style={{ color: THEME_SECONDARY }}>2025-01-09</TableCell>
                    <TableCell style={{ color: THEME_PRIMARY }}>₹8,750</TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-100 text-yellow-700">Unpaid</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" style={{ borderColor: THEME_BORDER, color: THEME_PRIMARY }}>View</Button>
                        <Button variant="outline" size="sm" style={{ borderColor: THEME_BORDER, color: THEME_PRIMARY }}>Edit</Button>
                        <Button variant="outline" size="sm" style={{ borderColor: THEME_BORDER, color: THEME_PRIMARY }}>PDF</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="flex justify-between items-center text-sm pt-4 border-t" style={{ borderColor: THEME_BORDER, color: THEME_SECONDARY }}>
            <a 
              href="/sales" 
              className="hover:underline"
              style={{ color: THEME_PRIMARY }}
            >
              ← Back to Sales List
            </a>
            <span>Last updated: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
