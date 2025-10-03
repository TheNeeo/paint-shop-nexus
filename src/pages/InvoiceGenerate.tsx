import React, { useState } from "react";
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
  Calendar,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

// Champagne Pink theme color
const THEME_COLOR = "#F4DDCB";
const THEME_HSL = "26 61% 88%";

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
      <div className="space-y-6">
        {/* Page Title Bar */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: THEME_COLOR }}>
              Sales Management
            </h1>
            <Breadcrumb className="mt-2">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/sales">Sales</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Invoice Generate</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <Button
            style={{ backgroundColor: THEME_COLOR, color: "#333" }}
            onClick={handleSaveDraft}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Invoice
          </Button>
        </div>

        {/* Hero Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card style={{ borderColor: THEME_COLOR, borderWidth: "2px" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" style={{ color: THEME_COLOR }} />
                Total Sales Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹45,231</div>
              <p className="text-xs text-muted-foreground">+20.1% from yesterday</p>
            </CardContent>
          </Card>

          <Card style={{ borderColor: THEME_COLOR, borderWidth: "2px" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4" style={{ color: THEME_COLOR }} />
                Pending Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Worth ₹28,450</p>
            </CardContent>
          </Card>

          <Card style={{ borderColor: THEME_COLOR, borderWidth: "2px" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" style={{ color: THEME_COLOR }} />
                Total GST Collected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹8,142</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card style={{ borderColor: THEME_COLOR, borderWidth: "2px" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" style={{ color: THEME_COLOR }} />
                Avg Invoice Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹3,769</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Invoice Form Section */}
        <Card style={{ borderColor: THEME_COLOR, borderWidth: "2px" }}>
          <CardHeader style={{ backgroundColor: `${THEME_COLOR}40` }}>
            <CardTitle>Invoice Form</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Customer Information Block */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold" style={{ color: THEME_COLOR }}>
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Select Customer</Label>
                  <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a customer..." />
                    </SelectTrigger>
                    <SelectContent>
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
                    style={{ borderColor: THEME_COLOR, color: THEME_COLOR }}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Customer
                  </Button>
                </div>
              </div>

              {selectedCustomer && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg" style={{ backgroundColor: `${THEME_COLOR}20` }}>
                  <div>
                    <Label className="text-xs text-muted-foreground">Name</Label>
                    <p className="font-medium">John Doe</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Mobile / Email</Label>
                    <p className="font-medium">+91 98765 43210 | john@example.com</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">GST Number</Label>
                    <p className="font-medium">29ABCDE1234F1Z5</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Billing Address</Label>
                    <p className="font-medium">123 Main St, City, State - 123456</p>
                  </div>
                </div>
              )}
            </div>

            {/* Invoice Details Block */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold" style={{ color: THEME_COLOR }}>
                Invoice Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Invoice No.</Label>
                  <Input value="INV-2025-001" readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <div className="relative">
                    <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Payment Terms</Label>
                  <Select defaultValue="net30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="net30">Net 30</SelectItem>
                      <SelectItem value="net60">Net 60</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Salesperson</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select salesperson" />
                    </SelectTrigger>
                    <SelectContent>
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
                <h3 className="text-lg font-semibold" style={{ color: THEME_COLOR }}>
                  Products / Items
                </h3>
                <Button
                  onClick={addNewItem}
                  size="sm"
                  style={{ backgroundColor: THEME_COLOR, color: "#333" }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="border rounded-lg" style={{ borderColor: THEME_COLOR }}>
                <Table>
                  <TableHeader style={{ backgroundColor: `${THEME_COLOR}40` }}>
                    <TableRow>
                      <TableHead className="w-12">S.No</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>HSN Code</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead className="w-24">Qty</TableHead>
                      <TableHead className="w-32">Rate</TableHead>
                      <TableHead className="w-32">Amount</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoiceItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                          No items added. Click "Add Item" to start.
                        </TableCell>
                      </TableRow>
                    ) : (
                      invoiceItems.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>{index + 1}</TableCell>
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
                              <SelectTrigger>
                                <SelectValue placeholder="Select product" />
                              </SelectTrigger>
                              <SelectContent>
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
                              <Badge style={{ backgroundColor: THEME_COLOR, color: "#333" }}>
                                {item.category}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.hsnCode}
                              onChange={(e) => updateItem(item.id, "hsnCode", e.target.value)}
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={item.unit}
                              onValueChange={(value) => updateItem(item.id, "unit", value)}
                            >
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
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
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.rate}
                              onChange={(e) =>
                                updateItem(item.id, "rate", parseFloat(e.target.value) || 0)
                              }
                            />
                          </TableCell>
                          <TableCell className="font-medium">₹{item.amount.toFixed(2)}</TableCell>
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
                <h3 className="text-lg font-semibold" style={{ color: THEME_COLOR }}>
                  Additional Details
                </h3>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes for the customer..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Terms & Conditions</Label>
                  <Textarea
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    placeholder="Enter terms and conditions..."
                    rows={3}
                  />
                </div>
              </div>

              <Card style={{ borderColor: THEME_COLOR, borderWidth: "2px" }}>
                <CardHeader style={{ backgroundColor: `${THEME_COLOR}40` }}>
                  <CardTitle>Financial Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Discount:</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                        className="w-20 h-8"
                      />
                      <span>%</span>
                      <span className="font-medium">₹{discountAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>GST:</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={gstRate}
                        onChange={(e) => setGstRate(parseFloat(e.target.value) || 0)}
                        className="w-20 h-8"
                      />
                      <span>%</span>
                      <span className="font-medium">₹{gstAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Grand Total:</span>
                      <span style={{ color: THEME_COLOR }}>₹{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Paid Amount:</span>
                    <Input
                      type="number"
                      value={paidAmount}
                      onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                      className="w-32 h-8"
                    />
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Balance Due:</span>
                    <span className={balanceDue > 0 ? "text-red-500" : "text-green-500"}>
                      ₹{balanceDue.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-end pt-4 border-t">
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                variant="outline"
                onClick={handleGeneratePDF}
                style={{ borderColor: THEME_COLOR, color: THEME_COLOR }}
              >
                <FileDown className="h-4 w-4 mr-2" />
                Generate PDF
              </Button>
              <Button variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print Invoice
              </Button>
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Send via Email
              </Button>
              <Button
                style={{ backgroundColor: THEME_COLOR, color: "#333" }}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Send via WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Invoice History Table */}
        <Card style={{ borderColor: THEME_COLOR, borderWidth: "2px" }}>
          <CardHeader style={{ backgroundColor: `${THEME_COLOR}40` }}>
            <CardTitle>Invoice History</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice No.</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">INV-2024-150</TableCell>
                  <TableCell>John Doe</TableCell>
                  <TableCell>2025-01-10</TableCell>
                  <TableCell>₹12,500</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-700">Paid</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">PDF</Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INV-2024-149</TableCell>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>2025-01-09</TableCell>
                  <TableCell>₹8,750</TableCell>
                  <TableCell>
                    <Badge className="bg-yellow-100 text-yellow-700">Unpaid</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">PDF</Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="flex justify-between items-center text-sm text-muted-foreground pt-4 border-t">
          <a href="/sales" className="text-primary hover:underline">
            ← Back to Sales List
          </a>
          <span>Last updated: {new Date().toLocaleString()}</span>
        </div>
      </div>
    </AppLayout>
  );
}
