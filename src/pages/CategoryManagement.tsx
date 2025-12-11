import React, { useState } from "react";
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
  Home,
  Layers,
  Edit,
  Trash2,
  Package,
} from "lucide-react";
import { CategoryForm } from "@/components/category/CategoryForm";
import { CategoryTable } from "@/components/category/CategoryTable";
import AppLayout from "@/components/layout/AppLayout";

// Mock category data
const mockCategories = [
  {
    id: "1",
    name: "Tools",
    description: "Professional painting and crafting tools",
    productCount: 15,
    color: "#3B82F6",
    dateCreated: "2024-01-15",
    isActive: true,
  },
  {
    id: "2",
    name: "Paint",
    description: "Acrylic and oil-based paints",
    productCount: 28,
    color: "#EF4444",
    dateCreated: "2024-01-10",
    isActive: true,
  },
  {
    id: "3",
    name: "Canvas",
    description: "Premium canvas for professional artists",
    productCount: 12,
    color: "#22C55E",
    dateCreated: "2024-01-08",
    isActive: true,
  },
  {
    id: "4",
    name: "Brushes",
    description: "Various brush types and sizes",
    productCount: 8,
    color: "#A855F7",
    dateCreated: "2024-01-05",
    isActive: false,
  },
];

export default function CategoryManagement() {
  const [categories, setCategories] = useState(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);

  const handleAddCategory = (categoryData) => {
    const newCategory = {
      id: String(categories.length + 1),
      ...categoryData,
      productCount: 0,
      dateCreated: new Date().toISOString().split('T')[0],
    };
    setCategories([...categories, newCategory]);
    setIsAddCategoryOpen(false);
  };

  const handleEditCategory = (categoryData) => {
    setCategories(categories.map(cat => 
      cat.id === selectedCategory.id 
        ? { ...selectedCategory, ...categoryData }
        : cat
    ));
    setIsEditCategoryOpen(false);
    setSelectedCategory(null);
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter(cat => cat.id !== categoryId));
    }
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setIsEditCategoryOpen(true);
  };

  const totalProducts = categories.reduce((sum, cat) => sum + cat.productCount, 0);
  const activeCategories = categories.filter(cat => cat.isActive).length;

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
                    <Package className="h-4 w-4" />
                    Product Management
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Category Management</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <Layers className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                  Category Management
                </h1>
                <Badge className="bg-green-100 text-green-800 w-fit">
                  {categories.length} categories
                </Badge>
              </div>
            </div>
            
            <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Category
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-green-600" />
                    Add New Category
                  </DialogTitle>
                </DialogHeader>
                <CategoryForm 
                  onSubmit={handleAddCategory}
                  onClose={() => setIsAddCategoryOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Layers className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{activeCategories}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Layers className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Products/Category</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {categories.length > 0 ? Math.round(totalProducts / categories.length) : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Category Table */}
          <div className="bg-white rounded-lg shadow-sm border border-green-200 overflow-hidden">
            <CategoryTable
              categories={categories}
              onEdit={handleEditClick}
              onDelete={handleDeleteCategory}
            />
          </div>

          {/* Edit Category Dialog */}
          <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5 text-green-600" />
                  Edit Category
                </DialogTitle>
              </DialogHeader>
              {selectedCategory && (
                <CategoryForm 
                  category={selectedCategory}
                  onSubmit={handleEditCategory}
                  onClose={() => {
                    setIsEditCategoryOpen(false);
                    setSelectedCategory(null);
                  }}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </TooltipProvider>
    </AppLayout>
  );
}
