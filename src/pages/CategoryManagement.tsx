
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Plus,
  Layers,
  Edit,
  Trash2,
  Package,
  Tags,
  RefreshCw,
  Download,
  CheckCircle,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { CategoryForm } from "@/components/category/CategoryForm";
import { CategoryTable } from "@/components/category/CategoryTable";
import AppLayout from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import dashboardHomeIcon from "@/assets/dashboard-home-icon.png";
import categoriesIcon from "@/assets/categories-icon.png";
import addCategoryIcon from "@/assets/add-category-icon.png";

// Mock category data
const mockCategories = [
  {
    id: "1",
    name: "Tools",
    description: "Professional painting and crafting tools",
    productCount: 15,
    color: "blue",
    dateCreated: "2024-01-15",
    isActive: true,
  },
  {
    id: "2",
    name: "Paint",
    description: "Acrylic and oil-based paints",
    productCount: 28,
    color: "red",
    dateCreated: "2024-01-10",
    isActive: true,
  },
  {
    id: "3",
    name: "Canvas",
    description: "Premium canvas for professional artists",
    productCount: 12,
    color: "green",
    dateCreated: "2024-01-08",
    isActive: true,
  },
  {
    id: "4",
    name: "Brushes",
    description: "Various brush types and sizes",
    productCount: 8,
    color: "purple",
    dateCreated: "2024-01-05",
    isActive: false,
  },
];

export default function CategoryManagement() {
  const navigate = useNavigate();
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
  const inactiveCategories = categories.filter(cat => !cat.isActive).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const statCards = [
    {
      title: "Total Categories",
      value: categories.length,
      icon: Layers,
      gradient: "from-violet-400 via-purple-400 to-indigo-400",
    },
    {
      title: "Active Categories",
      value: activeCategories,
      icon: CheckCircle,
      gradient: "from-emerald-400 via-green-400 to-teal-400",
    },
    {
      title: "Total Products",
      value: totalProducts,
      icon: Package,
      gradient: "from-fuchsia-400 via-pink-500 to-rose-500",
    },
    {
      title: "Avg Products/Category",
      value: categories.length > 0 ? Math.round(totalProducts / categories.length) : 0,
      icon: BarChart3,
      gradient: "from-amber-400 via-orange-400 to-red-400",
    },
  ];

  const handleRefresh = () => {
    // Re-fetch categories (refresh the page data)
    window.location.reload();
  };

  const handleExport = () => {
    // Export categories as CSV
    const headers = ["Name", "Description", "Product Count", "Color", "Date Created", "Status"];
    const csvContent = [
      headers.join(","),
      ...categories.map(cat => [
        `"${cat.name}"`,
        `"${cat.description || ''}"`,
        cat.productCount,
        `"${cat.color}"`,
        `"${cat.dateCreated}"`,
        cat.isActive ? "Active" : "Inactive"
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `categories_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <TooltipProvider>
        <div className="w-full bg-gradient-to-br from-purple-100 via-purple-50 to-purple-100 min-h-screen p-6">
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
                  <BreadcrumbPage className="flex items-center gap-1.5">
                    <Package className="h-4 w-4 text-orange-400" />
                    <span className="text-orange-600 font-medium">Product Management</span>
                  </BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="flex items-center gap-1.5">
                    <Tags className="h-4 w-4 text-purple-400" />
                    <span className="text-purple-700 font-semibold">Category Management</span>
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
            className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 rounded-2xl p-6 mb-6 shadow-xl"
          >
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
              <div className="space-y-3">
                {/* Title */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <img src={categoriesIcon} alt="Categories" className="h-6 w-6 sm:h-8 sm:w-8 object-contain" />
                    </div>
                    Category Management
                  </h1>
                  <Badge className="bg-white/20 text-white border-white/30 w-fit backdrop-blur-sm">
                    {categories.length} categories
                  </Badge>
                </div>
                <p className="text-purple-100 text-sm pl-[52px]">Manage Product Categories with Clarity & Precision.</p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRefresh}
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleExport}
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-white text-purple-700 hover:bg-purple-50 shadow-lg">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                    <DialogHeader className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 -mx-6 -mt-6 px-6 py-4 rounded-t-lg">
                      <DialogTitle className="flex items-center gap-3 text-white">
                        <img src={addCategoryIcon} alt="Add Category" className="h-8 w-8 object-contain" />
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
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          >
            {statCards.map((card, index) => (
              <motion.div
                key={card.title}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -4 }}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-white/90 mb-1">
                    {card.title}
                  </h3>
                  <motion.p 
                    className="text-2xl font-bold text-white"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                  >
                    {card.value}
                  </motion.p>
                </div>
                
                <div className="absolute right-4 bottom-4 opacity-80">
                  <card.icon className="h-16 w-16 text-white/40" strokeWidth={1.5} />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Category Table */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg border border-purple-200 overflow-hidden"
          >
            <CategoryTable
              categories={categories}
              onEdit={handleEditClick}
              onDelete={handleDeleteCategory}
            />
          </motion.div>

          {/* Edit Category Dialog */}
          <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
            <DialogContent className="max-w-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <DialogHeader className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 -mx-6 -mt-6 px-6 py-4 rounded-t-lg">
                <DialogTitle className="flex items-center gap-3 text-white">
                  <Edit className="h-5 w-5 text-white" />
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
