import React, { useState } from "react";
import { motion } from "framer-motion";
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
        <div className="w-full bg-gradient-to-br from-green-50 via-white to-blue-50 min-h-screen p-6">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <Home className="h-4 w-4 text-green-600" />
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-green-700 font-medium">Product Management</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-green-800 font-semibold">Category Management</BreadcrumbPage>
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
                      <Layers className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
                    </motion.div>
                    Manage Product Categories
                  </motion.h1>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  >
                    <Badge className="bg-gradient-to-r from-green-600 to-teal-600 text-white border-none text-sm px-4 py-1 shadow-md">
                      {categories.length} categories
                    </Badge>
                  </motion.div>
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-gray-700 text-sm sm:text-base font-medium max-w-lg"
                >
                  Manage Product Categories with Clarity & Precision
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
                  <DialogTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl w-full sm:w-auto border-2 border-green-400 transition-all duration-300 relative overflow-hidden group">
                        <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                        <Plus className="h-4 w-4 mr-2 relative z-10" />
                        <span className="relative z-10">Add New Category</span>
                      </Button>
                    </motion.div>
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
              </motion.div>
            </div>
          </motion.div>

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
