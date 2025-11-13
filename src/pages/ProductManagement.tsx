import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Plus,
  Download,
  Home,
  Zap,
  Package,
  RefreshCw,
  Paintbrush,
} from "lucide-react";
import { ProductStats } from "@/components/product/ProductStats";
import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductTable } from "@/components/product/ProductTable";
import { BulkActions } from "@/components/product/BulkActions";
import { ProductFooter } from "@/components/product/ProductFooter";
import { AddProductModal } from "@/components/inventory/AddProductModal";
import AppLayout from "@/components/layout/AppLayout";

// Enhanced mock data with more detailed information
const mockProducts = [
  {
    id: "1",
    name: "Premium Paint Brush Set",
    category: "Tools",
    unit: "Set",
    unitPrice: 29.99,
    stockQuantity: 45,
    image: "/placeholder.svg",
    baseCode: "PB001",
    description: "High-quality brush set for professional painting",
    dateAdded: "2024-01-15",
    featured: true,
    rating: 4.8,
    totalSales: 150,
    lastSold: "2024-01-10",
    supplier: "ArtCraft Inc.",
    variants: [
      { id: "1a", name: "Small Brush Set", unitPrice: 19.99, stockQuantity: 25, sku: "PB001-S" },
      { id: "1b", name: "Medium Brush Set", unitPrice: 24.99, stockQuantity: 15, sku: "PB001-M" },
      { id: "1c", name: "Large Brush Set", unitPrice: 34.99, stockQuantity: 5, sku: "PB001-L" },
    ],
  },
  {
    id: "2",
    name: "Acrylic Paint Collection",
    category: "Paint",
    unit: "Bottle",
    unitPrice: 12.50,
    stockQuantity: 120,
    image: "/placeholder.svg",
    baseCode: "AP002",
    description: "Vibrant acrylic paint collection with 24 colors",
    dateAdded: "2024-01-10",
    featured: false,
    rating: 4.6,
    totalSales: 230,
    lastSold: "2024-01-12",
    supplier: "ColorMax Ltd.",
    variants: [
      { id: "2a", name: "Basic Colors (12pc)", unitPrice: 8.99, stockQuantity: 80, sku: "AP002-B" },
      { id: "2b", name: "Premium Colors (24pc)", unitPrice: 16.99, stockQuantity: 40, sku: "AP002-P" },
    ],
  },
  {
    id: "3",
    name: "Canvas Pack",
    category: "Canvas",
    unit: "Pack",
    unitPrice: 15.75,
    stockQuantity: 8,
    image: "/placeholder.svg",
    baseCode: "CP003",
    description: "Professional grade canvas pack for artists",
    dateAdded: "2024-01-08",
    featured: true,
    rating: 4.9,
    totalSales: 89,
    lastSold: "2024-01-11",
    supplier: "Canvas Pro",
    variants: [
      { id: "3a", name: "Small Canvas (8x10)", unitPrice: 12.99, stockQuantity: 5, sku: "CP003-S" },
      { id: "3b", name: "Large Canvas (16x20)", unitPrice: 18.99, stockQuantity: 3, sku: "CP003-L" },
    ],
  },
];

const categories = ["All", "Tools", "Paint", "Canvas", "Brushes"];
const stockStatuses = ["All", "In Stock", "Low Stock", "Out of Stock"];
const sortOptions = [
  { value: "name", label: "Name" },
  { value: "price", label: "Price" },
  { value: "stock", label: "Stock Quantity" },
  { value: "sales", label: "Total Sales" },
  { value: "rating", label: "Rating" },
];

const getCategoryColor = (category: string) => {
  const colors = {
    Tools: "bg-blue-100 text-blue-800 border-blue-200",
    Paint: "bg-red-100 text-red-800 border-red-200",
    Canvas: "bg-green-100 text-green-800 border-green-200",
    Brushes: "bg-purple-100 text-purple-800 border-purple-200",
  };
  return colors[category] || "bg-slate-100 text-slate-800 border-slate-200";
};

const getStockStatus = (quantity: number) => {
  if (quantity === 0) return { status: "Out of Stock", color: "bg-red-100 text-red-800 border-red-200" };
  if (quantity <= 10) return { status: "Low Stock", color: "bg-orange-100 text-orange-800 border-orange-200" };
  return { status: "In Stock", color: "bg-green-100 text-green-800 border-green-200" };
};

export default function ProductManagement() {
  const navigate = useNavigate();

  // Fetch products from database
  const { data: dbProducts = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories (
            name
          )
        `)
        .is("parent_product_id", null)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Transform database products to match the format expected by the UI
      return (data || []).map((product, index) => ({
        id: product.id,
        name: product.name,
        category: product.categories?.name || "Uncategorized",
        unit: product.unit,
        unitPrice: Number(product.unit_price) || 0,
        stockQuantity: product.current_stock || 0,
        image: product.image_url || "/placeholder.svg",
        baseCode: product.hsn_code || `PRD${String(index + 1).padStart(3, '0')}`,
        description: "",
        dateAdded: new Date(product.created_at).toISOString().split('T')[0],
        featured: false,
        rating: 4.5,
        totalSales: product.sale_qty || 0,
        lastSold: "",
        supplier: "",
        variants: []
      }));
    },
  });

  const products = dbProducts;
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const toggleRowExpansion = (productId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedRows(newExpanded);
  };

  const toggleProductSelection = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const selectAllProducts = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.baseCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "All" || product.category === categoryFilter;
      const stockStatus = getStockStatus(product.stockQuantity).status;
      const matchesStock = stockFilter === "All" || stockStatus === stockFilter;
      const matchesFeatured = !showFeaturedOnly || product.featured;
      
      return matchesSearch && matchesCategory && matchesStock && matchesFeatured;
    }).sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.unitPrice - b.unitPrice;
        case "stock":
          return b.stockQuantity - a.stockQuantity;
        case "sales":
          return b.totalSales - a.totalSales;
        case "rating":
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [products, searchTerm, categoryFilter, stockFilter, sortBy, showFeaturedOnly]);

  const stats = useMemo(() => {
    const totalValue = products.reduce((sum, product) => sum + (product.unitPrice * product.stockQuantity), 0);
    const lowStockCount = products.filter(p => p.stockQuantity <= 10 && p.stockQuantity > 0).length;
    const outOfStockCount = products.filter(p => p.stockQuantity === 0).length;
    const featuredCount = products.filter(p => p.featured).length;
    
    return { totalValue, lowStockCount, outOfStockCount, featuredCount };
  }, [products]);

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on products:`, Array.from(selectedProducts));
  };

  return (
    <AppLayout>
      <TooltipProvider>
        <div className="w-full bg-gradient-to-br from-green-50 via-white to-blue-50 min-h-screen p-6">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <RefreshCw className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading products...</p>
              </div>
            </div>
          ) : (
            <>
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    onClick={() => navigate("/")}
                    className="cursor-pointer hover:text-green-700 transition-colors"
                  >
                    <Home className="h-4 w-4 text-green-600" />
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-green-700 font-medium">Product Management</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-green-800 font-semibold">Product Activity</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Enhanced Animated Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-green-100 via-emerald-50 to-teal-50 rounded-3xl p-6 mb-8 shadow-lg border-2 border-green-200 relative overflow-hidden"
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-green-400 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-teal-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <motion.h1 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-2xl sm:text-4xl font-bold text-green-900 flex items-center gap-3"
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <Paintbrush className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
                    </motion.div>
                    Product Activity
                  </motion.h1>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  >
                    <Badge className="bg-gradient-to-r from-green-600 to-teal-600 text-white border-none text-sm px-4 py-1 shadow-md">
                      {filteredProducts.length} products
                    </Badge>
                  </motion.div>
                </div>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-sm text-green-700 italic"
                >
                  Neo Color Factory ~ The Colors of Your Dreams 🎨
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
                  size="sm" 
                  className="w-full sm:w-auto bg-white hover:bg-green-50 border-2 border-green-300 text-green-700 hover:border-green-400 transition-all duration-300 shadow-sm hover:shadow-md group"
                >
                  <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                  Refresh
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 border-blue-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              
                <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                  <DialogTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl w-full sm:w-auto border-2 border-green-400 transition-all duration-300 relative overflow-hidden group">
                        <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                        <Plus className="h-4 w-4 mr-2 relative z-10" />
                        <span className="relative z-10">Add New Product</span>
                      </Button>
                    </motion.div>
                  </DialogTrigger>
                </Dialog>
                
                <AddProductModal 
                  isOpen={isAddProductOpen} 
                  onClose={() => setIsAddProductOpen(false)} 
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="mb-8">
            <ProductStats
              totalProducts={products.length}
              totalValue={stats.totalValue}
              lowStockCount={stats.lowStockCount}
              featuredCount={stats.featuredCount}
            />
          </div>

          {/* Filters */}
          <div className="mb-6">
            <ProductFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              stockFilter={stockFilter}
              setStockFilter={setStockFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              showFeaturedOnly={showFeaturedOnly}
              setShowFeaturedOnly={setShowFeaturedOnly}
              viewMode={viewMode}
              setViewMode={setViewMode}
              categories={categories}
              stockStatuses={stockStatuses}
              sortOptions={sortOptions}
            />
          </div>

          {/* Bulk Actions */}
          <div className="mb-6">
            <BulkActions
              selectedCount={selectedProducts.size}
              onBulkAction={handleBulkAction}
            />
          </div>

          {/* Product Table */}
          <div className="overflow-hidden mb-6">
            <ProductTable
              products={filteredProducts}
              expandedRows={expandedRows}
              selectedProducts={selectedProducts}
              onToggleRowExpansion={toggleRowExpansion}
              onToggleProductSelection={toggleProductSelection}
              onSelectAllProducts={selectAllProducts}
              onSetSelectedProduct={setSelectedProduct}
              selectedProduct={selectedProduct}
              getCategoryColor={getCategoryColor}
              getStockStatus={getStockStatus}
            />
          </div>

          {/* Footer */}
          <ProductFooter
            totalProducts={products.length}
            totalValue={stats.totalValue}
            lowStockCount={stats.lowStockCount}
          />
            </>
          )}
        </div>
      </TooltipProvider>
    </AppLayout>
  );
}
