import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { 
  Package, 
  TrendingUp, 
  DollarSign, 
  Layers, 
  AlertTriangle, 
  Plus, 
  Check, 
  ChevronsUpDown, 
  Download, 
  Search, 
  Filter,
  Boxes,
  ArrowLeft
  Package as PkgIcon,
  Tag as TagIcon,
  FileText as FileTextIcon,
  Boxes as BoxesIcon,
  Ruler as RulerIcon,
  IndianRupee as IndianRupeeIcon,
  CheckCircle as CheckCircleIcon,
  Settings as SettingsIcon,
} from "lucide-react";
import { TableHeaderCell } from "@/components/shared/TableHeaderCell";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dashboardHomeIcon from "@/assets/dashboard-home-icon.png";
import updateStockIcon from "@/assets/update-stock-icon.png";

// Pale Oak theme color
const PALE_OAK = "#E2D0B7";
const PALE_OAK_DARK = "#C4A67C";
const PALE_OAK_DARKER = "#8B7355";

export default function UpdateStock() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [adjustQuantity, setAdjustQuantity] = useState<number>(0);
  const [reason, setReason] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

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

  // Fetch categories for color mapping
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*");
      if (error) throw error;
      return data || [];
    },
  });

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const newStock = selectedProduct ? selectedProduct.current_stock + adjustQuantity : 0;

  // Calculate summary stats
  const totalStock = products.reduce((sum, p) => sum + p.current_stock, 0);
  const lowStockItems = products.filter((p) => p.current_stock <= p.threshold_qty).length;
  const totalValue = products.reduce((sum, p) => sum + (p.current_stock * p.unit_price), 0);
  const totalSKUs = products.length;

  // Filtered products for table
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category_id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Low stock and out of stock products
  const lowStockProducts = products.filter(
    (p) => p.current_stock > 0 && p.current_stock <= p.threshold_qty
  );
  const outOfStockProducts = products.filter((p) => p.current_stock === 0);

  const handleSave = async () => {
    if (!selectedProductId || adjustQuantity === 0 || !reason) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Insert stock adjustment record
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      const { error: adjustmentError } = await supabase
        .from("stock_adjustments")
        .insert([{
          product_id: selectedProductId,
          adjustment_type: adjustQuantity > 0 ? 'increase' : 'decrease',
          quantity: adjustQuantity,
          reason: `${reason}: ${notes || 'N/A'}`,
          created_by_user_id: currentUser?.id || '',
        }]);

      if (adjustmentError) throw adjustmentError;

      // Update product stock
      const { error } = await supabase
        .from("products")
        .update({ current_stock: newStock })
        .eq("id", selectedProductId);

      if (error) throw error;

      toast({
        title: "Stock Updated",
        description: `Successfully updated stock for ${selectedProduct?.name}`,
      });

      // Refresh products data
      queryClient.invalidateQueries({ queryKey: ["products"] });

      // Reset form
      setSelectedProductId("");
      setAdjustQuantity(0);
      setReason("");
      setNotes("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update stock",
        variant: "destructive",
      });
    }
  };

  const getCategoryColor = (categoryId: string) => {
    const colors = ["bg-amber-100 text-amber-800", "bg-orange-100 text-orange-800", "bg-yellow-100 text-yellow-800", "bg-lime-100 text-lime-800"];
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return colors[0];
    const index = categories.findIndex((c) => c.id === categoryId);
    return colors[index % colors.length];
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return "N/A";
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "N/A";
  };

  const getStockStatus = (product: any) => {
    if (product.current_stock === 0) {
      return <Badge className="bg-red-100 text-red-700 border-red-200">Out of Stock</Badge>;
    }
    if (product.current_stock <= product.threshold_qty) {
      return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Low Stock</Badge>;
    }
    return <Badge className="bg-green-100 text-green-700 border-green-200">In Stock</Badge>;
  };

  return (
    <AppLayout>
      <div className="w-full min-h-screen p-6" style={{ background: `linear-gradient(to bottom right, ${PALE_OAK}20, white, ${PALE_OAK}10)` }}>
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
                    <TrendingUp className="h-4 w-4" style={{ color: PALE_OAK_DARKER }} />
                    <span className="font-semibold" style={{ color: PALE_OAK_DARKER }}>Update Stock</span>
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
              background: `linear-gradient(to right, ${PALE_OAK}40, ${PALE_OAK}20, ${PALE_OAK}30)`,
              borderColor: PALE_OAK
            }}
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: PALE_OAK_DARK }}></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full blur-3xl animate-pulse delay-1000" style={{ backgroundColor: PALE_OAK }}></div>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-2xl sm:text-4xl font-bold flex items-center gap-3"
                    style={{ color: PALE_OAK_DARKER }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <img 
                        src={updateStockIcon} 
                        alt="Update Stock" 
                        className="h-10 w-10 sm:h-12 sm:w-12 object-contain" 
                        style={{ mixBlendMode: 'multiply' }}
                      />
                    </motion.div>
                    Update Stock
                  </motion.h1>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  >
                    <Badge 
                      className="text-white border-none text-sm px-4 py-1 shadow-md"
                      style={{ background: `linear-gradient(to right, ${PALE_OAK_DARK}, ${PALE_OAK_DARKER})` }}
                    >
                      Live Inventory
                    </Badge>
                  </motion.div>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-sm italic"
                  style={{ color: PALE_OAK_DARKER }}
                >
                  Quick stock corrections ~ Track every change with precision 📦
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
                    borderColor: PALE_OAK,
                    color: PALE_OAK_DARKER
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Inventory
                </Button>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    className="shadow-lg hover:shadow-xl border-2 transition-all duration-300 relative overflow-hidden group text-white"
                    style={{ 
                      background: `linear-gradient(to right, ${PALE_OAK_DARK}, ${PALE_OAK_DARKER})`,
                      borderColor: PALE_OAK
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

          {/* Hero Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden rounded-2xl p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              style={{ background: `linear-gradient(135deg, ${PALE_OAK}, ${PALE_OAK_DARK})` }}
            >
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-white/90 mb-1">Total Stock Quantity</h3>
                <p className="text-2xl font-bold text-white">{totalStock}</p>
              </div>
              <div className="absolute right-4 bottom-4 opacity-80">
                <Package className="h-16 w-16 text-white/40" strokeWidth={1.5} />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative overflow-hidden rounded-2xl p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              style={{ background: `linear-gradient(135deg, #D4A574, #A67B5B)` }}
            >
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-white/90 mb-1">Low Stock Items</h3>
                <p className="text-2xl font-bold text-white">{lowStockItems}</p>
              </div>
              <div className="absolute right-4 bottom-4 opacity-80">
                <AlertTriangle className="h-16 w-16 text-white/40" strokeWidth={1.5} />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative overflow-hidden rounded-2xl p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              style={{ background: `linear-gradient(135deg, #C4A67C, #8B7355)` }}
            >
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-white/90 mb-1">Inventory Value</h3>
                <p className="text-2xl font-bold text-white">₹{totalValue.toFixed(2)}</p>
              </div>
              <div className="absolute right-4 bottom-4 opacity-80">
                <DollarSign className="h-16 w-16 text-white/40" strokeWidth={1.5} />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative overflow-hidden rounded-2xl p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              style={{ background: `linear-gradient(135deg, #B8956E, #7D5A3C)` }}
            >
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-white/90 mb-1">Number of SKUs</h3>
                <p className="text-2xl font-bold text-white">{totalSKUs}</p>
              </div>
              <div className="absolute right-4 bottom-4 opacity-80">
                <Layers className="h-16 w-16 text-white/40" strokeWidth={1.5} />
              </div>
            </motion.div>
          </div>

          {/* Stock Adjustment Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-2" style={{ borderColor: PALE_OAK }}>
              <CardHeader style={{ backgroundColor: `${PALE_OAK}30` }}>
                <CardTitle className="flex items-center gap-2" style={{ color: PALE_OAK_DARKER }}>
                  <TrendingUp className="h-5 w-5" />
                  Stock Adjustment Form
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Product Selector */}
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <Label>Select Product</Label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-full justify-between"
                          style={{ borderColor: PALE_OAK }}
                        >
                          {selectedProductId
                            ? products.find((product) => product.id === selectedProductId)?.name
                            : "Search and select a product..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search product..." />
                          <CommandList>
                            <CommandEmpty>No product found.</CommandEmpty>
                            <CommandGroup>
                              {products.map((product) => (
                                <CommandItem
                                  key={product.id}
                                  value={product.name}
                                  onSelect={() => {
                                    setSelectedProductId(product.id);
                                    setOpen(false);
                                  }}
                                >
                                  <Check
                                    className={`mr-2 h-4 w-4 ${
                                      selectedProductId === product.id ? "opacity-100" : "opacity-0"
                                    }`}
                                  />
                                  {product.name} ({product.current_stock} {product.unit})
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Button variant="outline" style={{ borderColor: PALE_OAK, color: PALE_OAK_DARKER }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Product
                  </Button>
                </div>

                {/* Product Details Block */}
                {selectedProduct && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-lg" style={{ backgroundColor: `${PALE_OAK}20` }}>
                    <div>
                      <Label className="text-xs text-muted-foreground">Product Name</Label>
                      <p className="font-medium">{selectedProduct.name}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Category</Label>
                      <div>
                        {selectedProduct.category_id && (
                          <Badge className={getCategoryColor(selectedProduct.category_id)}>
                            {getCategoryName(selectedProduct.category_id)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">HSN Code</Label>
                      <p className="font-medium">{selectedProduct.hsn_code || "N/A"}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Current Stock</Label>
                      <p className="font-medium text-lg" style={{ color: PALE_OAK_DARKER }}>
                        {selectedProduct.current_stock}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Unit</Label>
                      <p className="font-medium">{selectedProduct.unit}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Threshold Qty</Label>
                      <p className="font-medium">{selectedProduct.threshold_qty}</p>
                    </div>
                  </div>
                )}

                {/* Stock Adjustment Form */}
                {selectedProduct && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Current Stock (readonly)</Label>
                      <Input value={selectedProduct.current_stock} disabled style={{ borderColor: PALE_OAK }} />
                    </div>
                    <div>
                      <Label>Adjust Quantity (+/-)</Label>
                      <Input
                        type="number"
                        value={adjustQuantity}
                        onChange={(e) => setAdjustQuantity(Number(e.target.value))}
                        placeholder="Enter positive or negative number"
                        style={{ borderColor: PALE_OAK }}
                      />
                    </div>
                    <div>
                      <Label>Reason</Label>
                      <Select value={reason} onValueChange={setReason}>
                        <SelectTrigger style={{ borderColor: PALE_OAK }}>
                          <SelectValue placeholder="Select reason..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="restock">Restock</SelectItem>
                          <SelectItem value="damage">Damage</SelectItem>
                          <SelectItem value="return">Return</SelectItem>
                          <SelectItem value="correction">Correction</SelectItem>
                          <SelectItem value="theft">Theft/Loss</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>New Stock (Preview)</Label>
                      <Input
                        value={newStock}
                        disabled
                        className="font-bold"
                        style={{ 
                          borderColor: PALE_OAK,
                          color: newStock < 0 ? "#EF4444" : PALE_OAK_DARKER 
                        }}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Notes (Optional)</Label>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add any additional notes..."
                        rows={3}
                        style={{ borderColor: PALE_OAK }}
                      />
                    </div>
                  </div>
                )}

                {/* Save Button */}
                {selectedProduct && (
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSave}
                      disabled={!selectedProductId || adjustQuantity === 0 || !reason}
                      className="text-white hover:opacity-90"
                      style={{ backgroundColor: PALE_OAK_DARKER }}
                    >
                      Save / Update Stock
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Filters Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="border-2" style={{ borderColor: PALE_OAK }}>
              <CardHeader className="py-4" style={{ backgroundColor: `${PALE_OAK}20` }}>
                <CardTitle className="flex items-center gap-2 text-lg" style={{ color: PALE_OAK_DARKER }}>
                  <Filter className="h-5 w-5" />
                  Product Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="pl-10"
                      style={{ borderColor: PALE_OAK }}
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full sm:w-[200px]" style={{ borderColor: PALE_OAK }}>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Products Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="border-2 overflow-hidden" style={{ borderColor: PALE_OAK }}>
              <CardHeader style={{ backgroundColor: `${PALE_OAK}30` }}>
                <CardTitle className="flex items-center gap-2" style={{ color: PALE_OAK_DARKER }}>
                  <Package className="h-5 w-5" />
                  Inventory Products ({filteredProducts.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow style={{ backgroundColor: `${PALE_OAK}15` }}>
                        <TableHeaderCell icon={PkgIcon} label="Product Name" textColor={PALE_OAK_DARKER} iconColor="#f97316" />
                        <TableHeaderCell icon={TagIcon} label="Category" textColor={PALE_OAK_DARKER} iconColor="#8b5cf6" />
                        <TableHeaderCell icon={FileTextIcon} label="HSN Code" textColor={PALE_OAK_DARKER} iconColor="#ec4899" />
                        <TableHeaderCell icon={BoxesIcon} label="Current Stock" textColor={PALE_OAK_DARKER} iconColor="#0ea5e9" align="right" className="text-right" />
                        <TableHeaderCell icon={RulerIcon} label="Unit" textColor={PALE_OAK_DARKER} iconColor="#0d9488" />
                        <TableHeaderCell icon={IndianRupeeIcon} label="Unit Price" textColor={PALE_OAK_DARKER} iconColor="#f59e0b" align="right" className="text-right" />
                        <TableHeaderCell icon={CheckCircleIcon} label="Status" textColor={PALE_OAK_DARKER} iconColor="#22c55e" />
                        <TableHeaderCell icon={SettingsIcon} label="Actions" textColor={PALE_OAK_DARKER} iconColor="#64748b" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product, index) => (
                        <TableRow 
                          key={product.id}
                          className="hover:bg-opacity-50 transition-colors"
                          style={{ backgroundColor: index % 2 === 0 ? 'transparent' : `${PALE_OAK}08` }}
                        >
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>
                            <Badge className={getCategoryColor(product.category_id || "")}>
                              {getCategoryName(product.category_id)}
                            </Badge>
                          </TableCell>
                          <TableCell>{product.hsn_code || "N/A"}</TableCell>
                          <TableCell className="text-right font-semibold">{product.current_stock}</TableCell>
                          <TableCell>{product.unit}</TableCell>
                          <TableCell className="text-right">₹{product.unit_price.toFixed(2)}</TableCell>
                          <TableCell>{getStockStatus(product)}</TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedProductId(product.id);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              style={{ borderColor: PALE_OAK, color: PALE_OAK_DARKER }}
                            >
                              <TrendingUp className="h-4 w-4 mr-1" />
                              Adjust
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredProducts.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            No products found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Alerts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Low Stock Products */}
            {lowStockProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="border-2 border-amber-300">
                  <CardHeader className="bg-amber-50">
                    <CardTitle className="text-amber-700 flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Low Stock Products ({lowStockProducts.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {lowStockProducts.slice(0, 5).map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-amber-50"
                        >
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Stock: {product.current_stock} {product.unit}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-amber-300 text-amber-700 hover:bg-amber-100"
                            onClick={() => {
                              setSelectedProductId(product.id);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                          >
                            Restock Now
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Out of Stock Products */}
            {outOfStockProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Card className="border-2 border-red-300">
                  <CardHeader className="bg-red-50">
                    <CardTitle className="text-red-700 flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Out of Stock Products ({outOfStockProducts.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {outOfStockProducts.slice(0, 5).map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-red-50"
                        >
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Stock: 0 {product.unit}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-700 hover:bg-red-100"
                            onClick={() => {
                              setSelectedProductId(product.id);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                          >
                            Restock Now
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center text-sm text-muted-foreground py-4"
          >
            Last updated: {new Date().toLocaleString()}
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
