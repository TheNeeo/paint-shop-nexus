
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Plus, Layers, Edit, Package, Tags, RefreshCw, Download, CheckCircle, BarChart3 } from "lucide-react";
import { CategoryForm } from "@/components/category/CategoryForm";
import { CategoryTable } from "@/components/category/CategoryTable";
import AppLayout from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import dashboardHomeIcon from "@/assets/dashboard-home-icon.png";
import categoriesIcon from "@/assets/categories-icon.png";
import addCategoryIcon from "@/assets/add-category-icon.png";

export default function CategoryManagement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories-management"],
    queryFn: async () => {
      const { data: cats, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;

      // Get product counts per category
      const { data: products } = await supabase
        .from("products")
        .select("category_id")
        .is("parent_product_id", null);

      const countMap: Record<string, number> = {};
      (products || []).forEach((p) => {
        if (p.category_id) countMap[p.category_id] = (countMap[p.category_id] || 0) + 1;
      });

      return (cats || []).map((cat) => ({
        id: cat.id,
        name: cat.name,
        description: cat.description || "",
        productCount: countMap[cat.id] || 0,
        color: cat.color || "blue",
        dateCreated: new Date(cat.created_at).toISOString().split("T")[0],
        isActive: true,
      }));
    },
  });

  const handleAddCategory = async (categoryData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error("Not authenticated"); return; }

      const { error } = await supabase.from("categories").insert({
        name: categoryData.name,
        description: categoryData.description,
        color: categoryData.color,
        created_by_user_id: user.id,
      });
      if (error) throw error;

      toast.success("Category created successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories-management"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsAddCategoryOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to create category");
    }
  };

  const handleEditCategory = async (categoryData: any) => {
    if (!selectedCategory) return;
    try {
      const { error } = await supabase
        .from("categories")
        .update({ name: categoryData.name, description: categoryData.description, color: categoryData.color })
        .eq("id", selectedCategory.id);
      if (error) throw error;

      toast.success("Category updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories-management"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsEditCategoryOpen(false);
      setSelectedCategory(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to update category");
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const { error } = await supabase.from("categories").delete().eq("id", categoryId);
      if (error) throw error;
      toast.success("Category deleted!");
      queryClient.invalidateQueries({ queryKey: ["categories-management"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to delete category");
    }
  };

  const handleEditClick = (category: any) => {
    setSelectedCategory(category);
    setIsEditCategoryOpen(true);
  };

  const totalProducts = categories.reduce((sum, cat) => sum + cat.productCount, 0);
  const activeCategories = categories.filter((cat) => cat.isActive).length;

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  const statCards = [
    { title: "Total Categories", value: categories.length, icon: Layers, gradient: "from-violet-400 via-purple-400 to-indigo-400" },
    { title: "Active Categories", value: activeCategories, icon: CheckCircle, gradient: "from-emerald-400 via-green-400 to-teal-400" },
    { title: "Total Products", value: totalProducts, icon: Package, gradient: "from-fuchsia-400 via-pink-500 to-rose-500" },
    { title: "Avg Products/Category", value: categories.length > 0 ? Math.round(totalProducts / categories.length) : 0, icon: BarChart3, gradient: "from-amber-400 via-orange-400 to-red-400" },
  ];

  const handleExport = () => {
    const headers = ["Name", "Description", "Product Count", "Color", "Date Created", "Status"];
    const csvContent = [headers.join(","), ...categories.map((cat) => [`"${cat.name}"`, `"${cat.description || ""}"`, cat.productCount, `"${cat.color}"`, `"${cat.dateCreated}"`, cat.isActive ? "Active" : "Inactive"].join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `categories_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <TooltipProvider>
        <div className="w-full bg-gradient-to-br from-purple-100 via-purple-50 to-purple-100 min-h-screen p-6">
          {/* Breadcrumb */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="mb-3">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink onClick={() => navigate("/")} className="cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1.5">
                    <img src={dashboardHomeIcon} alt="Dashboard" className="h-5 w-5 object-contain bg-transparent" style={{ mixBlendMode: "multiply" }} />
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

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 rounded-2xl p-6 mb-6 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <img src={categoriesIcon} alt="Categories" className="h-6 w-6 sm:h-8 sm:w-8 object-contain" />
                    </div>
                    Category Management
                  </h1>
                  <Badge className="bg-white/20 text-white border-white/30 w-fit backdrop-blur-sm">{categories.length} categories</Badge>
                </div>
                <p className="text-purple-100 text-sm pl-[52px]">Manage Product Categories with Clarity & Precision.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ["categories-management"] })} className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
                  <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport} className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
                  <Download className="h-4 w-4 mr-2" /> Export
                </Button>
                <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-white text-purple-700 hover:bg-purple-50 shadow-lg"><Plus className="h-4 w-4 mr-2" /> Add New Category</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                    <DialogHeader className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 -mx-6 -mt-6 px-6 py-4 rounded-t-lg">
                      <DialogTitle className="flex items-center gap-3 text-white">
                        <img src={addCategoryIcon} alt="Add Category" className="h-8 w-8 object-contain" /> Add New Category
                      </DialogTitle>
                    </DialogHeader>
                    <CategoryForm onSubmit={handleAddCategory} onClose={() => setIsAddCategoryOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statCards.map((card, index) => (
              <motion.div key={card.title} variants={itemVariants} whileHover={{ scale: 1.02, y: -4 }} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300`}>
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-white/90 mb-1">{card.title}</h3>
                  <motion.p className="text-2xl font-bold text-white" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 + 0.3, type: "spring" }}>{card.value}</motion.p>
                </div>
                <div className="absolute right-4 bottom-4 opacity-80"><card.icon className="h-16 w-16 text-white/40" strokeWidth={1.5} /></div>
              </motion.div>
            ))}
          </motion.div>

          {/* Category Table */}
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <RefreshCw className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl shadow-lg border border-purple-200 overflow-hidden">
              <CategoryTable categories={categories} onEdit={handleEditClick} onDelete={handleDeleteCategory} />
            </motion.div>
          )}

          {/* Edit Category Dialog */}
          <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
            <DialogContent className="max-w-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <DialogHeader className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 -mx-6 -mt-6 px-6 py-4 rounded-t-lg">
                <DialogTitle className="flex items-center gap-3 text-white"><Edit className="h-5 w-5 text-white" /> Edit Category</DialogTitle>
              </DialogHeader>
              {selectedCategory && <CategoryForm category={selectedCategory} onSubmit={handleEditCategory} onClose={() => { setIsEditCategoryOpen(false); setSelectedCategory(null); }} />}
            </DialogContent>
          </Dialog>
        </div>
      </TooltipProvider>
    </AppLayout>
  );
}
