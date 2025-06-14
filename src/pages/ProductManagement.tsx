
import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Home,
  SortAsc,
  Download,
  Upload,
  MoreHorizontal,
  Copy,
  Archive,
  Star,
  TrendingUp,
  Package,
  AlertTriangle,
  CheckCircle,
  Grid3X3,
  List,
  Zap,
  BarChart3,
} from "lucide-react";
import { ProductForm } from "@/components/product/ProductForm";
import { ProductPreview } from "@/components/product/ProductPreview";

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
  return colors[category] || "bg-gray-100 text-gray-800 border-gray-200";
};

const getStockStatus = (quantity: number) => {
  if (quantity === 0) return { status: "Out of Stock", color: "bg-red-100 text-red-800 border-red-200" };
  if (quantity <= 10) return { status: "Low Stock", color: "bg-yellow-100 text-yellow-800 border-yellow-200" };
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
    // Implement bulk actions here
  };

  return (
    <TooltipProvider>
      <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
        {/* Enhanced Header */}
        <div className="flex justify-between items-start">
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
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Package className="h-8 w-8 text-blue-600" />
                Product Management
              </h1>
              <Badge className="bg-blue-100 text-blue-800">
                {filteredProducts.length} products
              </Badge>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export product data</TooltipContent>
            </Tooltip>
            
            <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg">
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

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Products</p>
                  <p className="text-2xl font-bold text-blue-900">{products.length}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Total Value</p>
                  <p className="text-2xl font-bold text-green-900">${stats.totalValue.toFixed(2)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Low Stock</p>
                  <p className="text-2xl font-bold text-yellow-900">{stats.lowStockCount}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Featured</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.featuredCount}</p>
                </div>
                <Star className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Filter & Sort Controls */}
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-3 items-center flex-1">
                <div className="relative min-w-[300px] flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search products by name or code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-gray-200 focus:border-blue-500"
                  />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
                      <Filter className="h-4 w-4 mr-2" />
                      Category: {categoryFilter}
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white">
                    {categories.map((category) => (
                      <DropdownMenuItem key={category} onClick={() => setCategoryFilter(category)}>
                        {category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
                      Stock: {stockFilter}
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white">
                    {stockStatuses.map((status) => (
                      <DropdownMenuItem key={status} onClick={() => setStockFilter(status)}>
                        {status}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
                      <SortAsc className="h-4 w-4 mr-2" />
                      Sort: {sortOptions.find(opt => opt.value === sortBy)?.label}
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white">
                    {sortOptions.map((option) => (
                      <DropdownMenuItem key={option.value} onClick={() => setSortBy(option.value)}>
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex gap-2 items-center">
                <DropdownMenuCheckboxItem
                  checked={showFeaturedOnly}
                  onCheckedChange={setShowFeaturedOnly}
                  className="flex items-center gap-2"
                >
                  <Star className="h-4 w-4" />
                  Featured Only
                </DropdownMenuCheckboxItem>
                
                <div className="flex border border-gray-200 rounded-md">
                  <Button
                    variant={viewMode === "table" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                    className="rounded-r-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-l-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedProducts.size > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedProducts.size} product(s) selected
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction("export")}>
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction("archive")}>
                      <Archive className="h-4 w-4 mr-1" />
                      Archive
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Selected Products</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {selectedProducts.size} product(s)? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleBulkAction("delete")}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Product Table */}
        <Card className="shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                    onCheckedChange={selectAllProducts}
                  />
                </TableHead>
                <TableHead className="w-12"></TableHead>
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Product Details</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Pricing</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <React.Fragment key={product.id}>
                  <TableRow className="hover:bg-gray-50/50 transition-colors group">
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.has(product.id)}
                        onCheckedChange={() => toggleProductSelection(product.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRowExpansion(product.id)}
                        className="opacity-60 group-hover:opacity-100 transition-opacity"
                      >
                        {expandedRows.has(product.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200 shadow-sm"
                        />
                        {product.featured && (
                          <Star className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                             onClick={() => toggleRowExpansion(product.id)}>
                          {product.name}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${getCategoryColor(product.category)}`}>
                            {product.category}
                          </Badge>
                          <span className="text-xs text-gray-500">#{product.baseCode}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(product.rating) 
                                  ? "text-yellow-400 fill-current" 
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{product.unit}</span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-lg">${product.unitPrice.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">
                          Total: ${(product.unitPrice * product.stockQuantity).toFixed(2)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{product.stockQuantity}</span>
                          <Badge className={getStockStatus(product.stockQuantity).color}>
                            {getStockStatus(product.stockQuantity).status}
                          </Badge>
                        </div>
                        {product.stockQuantity <= 10 && product.stockQuantity > 0 && (
                          <div className="text-xs text-amber-600 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Reorder soon
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <BarChart3 className="h-3 w-3 text-green-600" />
                          <span className="font-medium">{product.totalSales}</span>
                          <span className="text-gray-500">sold</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Last: {new Date(product.lastSold).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="opacity-60 hover:opacity-100"
                                  onClick={() => setSelectedProduct(product)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl">
                                <ProductPreview product={selectedProduct} />
                              </DialogContent>
                            </Dialog>
                          </TooltipTrigger>
                          <TooltipContent>View details</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="opacity-60 hover:opacity-100">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit product</TooltipContent>
                        </Tooltip>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="opacity-60 hover:opacity-100">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-white" align="end">
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Archive className="h-4 w-4 mr-2" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {/* Enhanced Variant Rows */}
                  {expandedRows.has(product.id) && product.variants.map((variant, index) => (
                    <TableRow key={variant.id} className="bg-gradient-to-r from-blue-50/30 to-blue-50/10 border-l-4 border-blue-200">
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell>
                        <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">{index + 1}</span>
                        </div>
                      </TableCell>
                      <TableCell className="pl-8">
                        <div className="flex items-center gap-2">
                          <ChevronRight className="h-3 w-3 text-blue-400" />
                          <div className="space-y-1">
                            <span className="text-sm font-medium text-gray-700">{variant.name}</span>
                            <div className="text-xs text-gray-500">SKU: {variant.sku}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">-</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">${variant.unitPrice.toFixed(2)}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{variant.stockQuantity}</span>
                          <Badge className={`text-xs ${getStockStatus(variant.stockQuantity).color}`}>
                            {getStockStatus(variant.stockQuantity).status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-gray-500">Variant data</span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="opacity-60 hover:opacity-100">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Enhanced Footer Summary */}
        <Card className="bg-gradient-to-r from-gray-50 to-white border border-gray-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-center text-sm">
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-600" />
                  <span>Total Products: <strong className="text-blue-900">{products.length}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span>Total Stock Value: <strong className="text-green-900">${stats.totalValue.toFixed(2)}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span>Low Stock Items: <strong className="text-yellow-900">{stats.lowStockCount}</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="h-4 w-4" />
                <span>Last updated: {new Date().toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
