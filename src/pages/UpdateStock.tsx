import React, { useState } from "react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Package, TrendingUp, DollarSign, Layers, AlertTriangle, Plus, Check, ChevronsUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export default function UpdateStock() {
  const { toast } = useToast();
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [adjustQuantity, setAdjustQuantity] = useState<number>(0);
  const [reason, setReason] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [open, setOpen] = useState(false);

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
  const newStock = selectedProduct
    ? (Number(selectedProduct.current_stock) || 0) + (Number(adjustQuantity) || 0)
    : 0;

  // Calculate summary stats
  const totalStock = products.reduce((sum, p) => sum + (Number(p.current_stock) || 0), 0);
  const lowStockItems = products.filter((p) => (Number(p.current_stock) || 0) <= (Number(p.threshold_qty) || 0)).length;
  const totalValue = products.reduce((sum, p) => {
    const stock = Number(p.current_stock) || 0;
    const price = Number(p.unit_price) || 0;
    return sum + (stock * price);
  }, 0);
  const totalSKUs = products.length;

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
      const { error } = await supabase
        .from("products")
        .update({ current_stock: newStock })
        .eq("id", selectedProductId);

      if (error) throw error;

      toast({
        title: "Stock Updated",
        description: `Successfully updated stock for ${selectedProduct?.name}`,
      });

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
    const colors = ["bg-blue-100 text-blue-800", "bg-green-100 text-green-800", "bg-purple-100 text-purple-800", "bg-pink-100 text-pink-800"];
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return colors[0];
    const index = categories.findIndex((c) => c.id === categoryId);
    return colors[index % colors.length];
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Title Bar with Breadcrumbs */}
        <div className="flex items-center justify-between">
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/inventory">Inventory Management</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Update Stock</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-3xl font-bold mt-2" style={{ color: "#96A3CC" }}>
              Inventory Update Section
            </h1>
          </div>
        </div>

        {/* Hero Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-400 via-blue-400 to-cyan-400 p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white/90 mb-1">Total Stock Quantity</h3>
              <p className="text-2xl font-bold text-white">{totalStock}</p>
            </div>
            <div className="absolute right-4 bottom-4 opacity-80">
              <Package className="h-16 w-16 text-white/40" strokeWidth={1.5} />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-400 via-rose-400 to-pink-400 p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white/90 mb-1">Low Stock Items</h3>
              <p className="text-2xl font-bold text-white">{lowStockItems}</p>
            </div>
            <div className="absolute right-4 bottom-4 opacity-80">
              <AlertTriangle className="h-16 w-16 text-white/40" strokeWidth={1.5} />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-400 via-green-400 to-teal-400 p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white/90 mb-1">Inventory Value</h3>
              <p className="text-2xl font-bold text-white">₹{(isNaN(totalValue) ? 0 : totalValue).toFixed(2)}</p>
            </div>
            <div className="absolute right-4 bottom-4 opacity-80">
              <DollarSign className="h-16 w-16 text-white/40" strokeWidth={1.5} />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-400 via-purple-400 to-indigo-400 p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white/90 mb-1">Number of SKUs</h3>
              <p className="text-2xl font-bold text-white">{totalSKUs}</p>
            </div>
            <div className="absolute right-4 bottom-4 opacity-80">
              <Layers className="h-16 w-16 text-white/40" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Update Stock Panel */}
        <Card style={{ borderColor: "#96A3CC" }}>
          <CardHeader style={{ backgroundColor: "#F0F3FC" }}>
            <CardTitle style={{ color: "#96A3CC" }}>
              <TrendingUp className="inline-block mr-2 h-5 w-5" />
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
              <Button variant="outline" style={{ borderColor: "#96A3CC", color: "#96A3CC" }}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </Button>
            </div>

            {/* Product Details Block */}
            {selectedProduct && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-lg" style={{ backgroundColor: "#F0F3FC" }}>
                <div>
                  <Label className="text-xs text-muted-foreground">Product Name</Label>
                  <p className="font-medium">{selectedProduct.name}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Category</Label>
                  <div>
                    {selectedProduct.category_id && (
                      <Badge className={getCategoryColor(selectedProduct.category_id)}>
                        {categories.find((c) => c.id === selectedProduct.category_id)?.name || "N/A"}
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
                  <p className="font-medium text-lg" style={{ color: "#96A3CC" }}>
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
                  <Input value={selectedProduct.current_stock} disabled />
                </div>
                <div>
                  <Label>Adjust Quantity (+/-)</Label>
                  <Input
                    type="number"
                    value={adjustQuantity}
                    onChange={(e) => setAdjustQuantity(Number(e.target.value))}
                    placeholder="Enter positive or negative number"
                  />
                </div>
                <div>
                  <Label>Reason</Label>
                  <Select value={reason} onValueChange={setReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="restock">Restock</SelectItem>
                      <SelectItem value="damage">Damage</SelectItem>
                      <SelectItem value="return">Return</SelectItem>
                      <SelectItem value="correction">Correction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>New Stock (Preview)</Label>
                  <Input
                    value={isNaN(newStock) ? 0 : newStock}
                    disabled
                    className="font-bold"
                    style={{ color: newStock < 0 ? "#EF4444" : "#96A3CC" }}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Notes (Optional)</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any additional notes..."
                    rows={3}
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
                  style={{ backgroundColor: "#96A3CC", color: "white" }}
                  className="hover:opacity-90"
                >
                  Save / Update Stock
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alerts / Warnings Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Low Stock Products */}
          {lowStockProducts.length > 0 && (
            <Card className="border-coral-300">
              <CardHeader className="bg-coral-50">
                <CardTitle className="text-coral-700 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Low Stock Products ({lowStockProducts.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {lowStockProducts.slice(0, 5).map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-coral-50"
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
                        className="border-coral-300 text-coral-700 hover:bg-coral-100"
                      >
                        Restock Now
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Out of Stock Products */}
          {outOfStockProducts.length > 0 && (
            <Card className="border-destructive">
              <CardHeader className="bg-destructive/10">
                <CardTitle className="text-destructive flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Out of Stock Products ({outOfStockProducts.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {outOfStockProducts.slice(0, 5).map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-destructive/10"
                    >
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-destructive">Out of Stock</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-destructive text-destructive hover:bg-destructive/10"
                      >
                        Restock Now
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={() => window.history.back()}>
            Back to Inventory List
          </Button>
          <p className="text-sm text-muted-foreground">
            Last Updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
