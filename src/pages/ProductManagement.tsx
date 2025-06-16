

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { ProductForm } from "@/components/product/ProductForm";
import { ProductStats } from "@/components/product/ProductStats";
import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductTable } from "@/components/product/ProductTable";
import { BulkActions } from "@/components/product/BulkActions";
import { ProductFooter } from "@/components/product/ProductFooter";
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
  const [products] = useState(mockProducts);
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
        <div className="w-full bg-gradient-to-br from-green-200 via-green-100 to-green-200 min-h-screen p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
            <div className="space-y-3">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <Home className="h-4 w-4" />
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Product Management</BreadcrumbPage>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Product Activity</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <Package className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                  Product Activity
                </h1>
                <Badge className="bg-blue-100 text-blue-800 w-fit">
                  {filteredProducts.length} products
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" size="sm" className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-green-600" />
                      Add New Product
                    </DialogTitle>
                  </DialogHeader>
                  <ProductForm onClose={() => setIsAddProductOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-6">
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
        </div>
      </TooltipProvider>
    </AppLayout>
  );
}

