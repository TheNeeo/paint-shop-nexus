
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { TreeNode } from "./TreeNode";
import { menuData } from "./menuData";
import { TreeSidebarProps } from "./types";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductForm } from "@/components/product/ProductForm";

export function TreeSidebar({ collapsed }: TreeSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const location = useLocation();

  const handleToggle = (id: string) => {
    const newExpanded = new Set<string>();
    
    // If the item is not currently expanded, expand only this item (accordion behavior)
    if (!expandedItems.has(id)) {
      newExpanded.add(id);
    }
    // If the item is currently expanded, close it (newExpanded remains empty)
    
    setExpandedItems(newExpanded);
  };

  // Check if we're on a product-related page
  const isProductPage = location.pathname.includes('/product');

  return (
    <div className={cn(
      "h-full bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800 border-r border-slate-700/50 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-800 to-slate-700">
        <div className={cn("flex items-center", collapsed ? "justify-center" : "space-x-2")}>
          {!collapsed ? (
            <div className="text-center">
              <div className="text-cyan-400 font-bold text-xl mb-1">Well-Come</div>
              <div className="flex flex-col">
                <span className="text-slate-200 font-bold text-lg">NEO</span>
                <div className="font-bold text-sm">
                  <span className="text-red-400">C</span>
                  <span className="text-orange-400">O</span>
                  <span className="text-green-400">L</span>
                  <span className="text-blue-400">O</span>
                  <span className="text-purple-400">R</span>
                </div>
                <span className="text-slate-200 font-bold text-xs">FACTORY</span>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-cyan-400 flex items-center justify-center">
              <span className="text-white font-bold text-xs">N</span>
            </div>
          )}
        </div>
      </div>

      {/* Tree Menu */}
      <div className="py-4 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-primary relative">
        {menuData.map((item) => (
          <TreeNode
            key={item.id}
            item={item}
            level={0}
            expandedItems={expandedItems}
            onToggle={handleToggle}
            collapsed={collapsed}
          />
        ))}

        {/* Add New Product Button - Show only when Product Management is expanded and we're on product pages */}
        {isProductPage && expandedItems.has('product-management') && !collapsed && (
          <div className="px-4 mt-2">
            <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg text-sm py-2"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-2 border-green-200">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-green-800">
                    <Plus className="h-5 w-5 text-green-600" />
                    Add New Product
                  </DialogTitle>
                </DialogHeader>
                <ProductForm onClose={() => setIsAddProductOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}
