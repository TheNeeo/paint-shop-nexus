import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProductForm } from "@/components/product/ProductForm";
import { ProductPreview } from "@/components/product/ProductPreview";

// Mock data
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
    variants: [
      { id: "1a", name: "Small Brush Set", unitPrice: 19.99, stockQuantity: 25 },
      { id: "1b", name: "Medium Brush Set", unitPrice: 24.99, stockQuantity: 15 },
      { id: "1c", name: "Large Brush Set", unitPrice: 34.99, stockQuantity: 5 },
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
    variants: [
      { id: "2a", name: "Basic Colors (12pc)", unitPrice: 8.99, stockQuantity: 80 },
      { id: "2b", name: "Premium Colors (24pc)", unitPrice: 16.99, stockQuantity: 40 },
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
    variants: [
      { id: "3a", name: "Small Canvas (8x10)", unitPrice: 12.99, stockQuantity: 5 },
      { id: "3b", name: "Large Canvas (16x20)", unitPrice: 18.99, stockQuantity: 3 },
    ],
  },
];

const categories = ["All", "Tools", "Paint", "Canvas", "Brushes"];
const stockStatuses = ["All", "In Stock", "Low Stock", "Out of Stock"];
const sortOptions = ["Name", "Price", "Stock Quantity"];

const getCategoryColor = (category: string) => {
  const colors = {
    Tools: "bg-blue-100 text-blue-800",
    Paint: "bg-red-100 text-red-800",
    Canvas: "bg-green-100 text-green-800",
    Brushes: "bg-purple-100 text-purple-800",
  };
  return colors[category] || "bg-gray-100 text-gray-800";
};

const getStockStatus = (quantity: number) => {
  if (quantity === 0) return { status: "Out of Stock", color: "bg-red-100 text-red-800" };
  if (quantity <= 10) return { status: "Low Stock", color: "bg-yellow-100 text-yellow-800" };
  return { status: "In Stock", color: "bg-green-100 text-green-800" };
};

export default function ProductManagement() {
  const navigate = useNavigate();
  const [products] = useState(mockProducts);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Name");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

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
    if (selectedProducts.size === products.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(products.map(p => p.id)));
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || product.category === categoryFilter;
    const stockStatus = getStockStatus(product.stockQuantity).status;
    const matchesStock = stockFilter === "All" || stockStatus === stockFilter;
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const totalStockValue = products.reduce((total, product) => {
    return total + (product.unitPrice * product.stockQuantity);
  }, 0);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Enhanced Navigation Header */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:bg-blue-50 border-blue-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <div className="h-6 w-px bg-gray-300"></div>
            <Breadcrumb>
              <BreadcrumbList className="text-sm">
                <BreadcrumbItem>
                  <button 
                    onClick={() => navigate('/')} 
                    className="flex items-center hover:text-blue-600 text-gray-600"
                  >
                    <Home className="h-4 w-4 mr-1" />
                    Home
                  </button>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-blue-600 font-medium">Product Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <ProductForm onClose={() => setIsAddProductOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📦 Product Management</h1>
        <p className="text-gray-600 mt-1">Manage your paint products, inventory, and variants</p>
      </div>

      {/* Filter & Sort Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Category: {categoryFilter}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {categories.map((category) => (
                <DropdownMenuItem key={category} onClick={() => setCategoryFilter(category)}>
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Stock: {stockFilter}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {stockStatuses.map((status) => (
                <DropdownMenuItem key={status} onClick={() => setStockFilter(status)}>
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <SortAsc className="h-4 w-4 mr-2" />
                Sort: {sortBy}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {sortOptions.map((option) => (
                <DropdownMenuItem key={option} onClick={() => setSortBy(option)}>
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedProducts.size === products.length}
                  onCheckedChange={selectAllProducts}
                />
              </TableHead>
              <TableHead className="w-12"></TableHead>
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Stock Qty</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <React.Fragment key={product.id}>
                <TableRow className="hover:bg-gray-50">
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
                    >
                      {expandedRows.has(product.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium cursor-pointer hover:text-blue-600"
                           onClick={() => toggleRowExpansion(product.id)}>
                        {product.name}
                      </div>
                      <Badge className={`mt-1 ${getCategoryColor(product.category)}`}>
                        {product.category}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell>${product.unitPrice.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{product.stockQuantity}</span>
                      <Badge className={getStockStatus(product.stockQuantity).color}>
                        {getStockStatus(product.stockQuantity).status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedProduct(product)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <ProductPreview product={selectedProduct} />
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                
                {/* Variant Rows */}
                {expandedRows.has(product.id) && product.variants.map((variant) => (
                  <TableRow key={variant.id} className="bg-blue-50">
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="pl-8">
                      <div className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-600">{variant.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell className="text-sm">${variant.unitPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-sm">{variant.stockQuantity}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer Summary */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex gap-6">
            <span>Total Products: <strong>{products.length}</strong></span>
            <span>Total Stock Value: <strong>${totalStockValue.toFixed(2)}</strong></span>
          </div>
          <span>Last updated: {new Date().toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
