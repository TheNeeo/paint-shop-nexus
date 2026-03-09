
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { TreeNode } from "./TreeNode";
import { menuData } from "./menuData";
import { TreeSidebarProps } from "./types";
import { useLocation } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductForm } from "@/components/product/ProductForm";
import { AddEditVendorModal } from "@/components/vendor/AddEditVendorModal";
import { AddEditCustomerModal } from "@/components/customer/AddEditCustomerModal";
import { NewInvoiceModal } from "@/components/sales/NewInvoiceModal";
import { AddEditExpenseModal } from "@/components/expense/AddEditExpenseModal";

export function TreeSidebar({ collapsed }: TreeSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const location = useLocation();
  const { signOut, user } = useAuth();

  const handleToggle = (id: string) => {
    const newExpanded = new Set<string>();
    if (!expandedItems.has(id)) {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleAction = (action: string) => {
    if (action === "add-product") setIsAddProductOpen(true);
    else if (action === "add-vendor") setIsAddVendorOpen(true);
    else if (action === "add-customer") setIsAddCustomerOpen(true);
    else if (action === "add-sale") setIsNewSaleOpen(true);
    else if (action === "add-expense") setIsAddExpenseOpen(true);
  };

  const userEmail = user?.email || "user@example.com";
  const userInitial = userEmail.charAt(0).toUpperCase();

  return (
    <>
      <div className={cn(
        "h-full bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800 border-r border-slate-700/50 transition-all duration-300 flex flex-col",
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
        <div className="flex-1 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-primary relative">
          {menuData.map((item) => (
            <TreeNode
              key={item.id}
              item={item}
              level={0}
              expandedItems={expandedItems}
              onToggle={handleToggle}
              onAction={handleAction}
              collapsed={collapsed}
            />
          ))}
        </div>

        {/* User Profile Section */}
        <div className="border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
          {collapsed ? (
            <div className="p-3 flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                {userInitial}
              </div>
              <button
                onClick={signOut}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-slate-700/50 transition-all duration-200"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="p-3">
              <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/60 border border-slate-700/40">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shrink-0">
                  {userInitial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-xs font-medium truncate">{userEmail}</p>
                  <p className="text-slate-500 text-[10px]">Logged in</p>
                </div>
                <button
                  onClick={signOut}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 shrink-0"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-2 border-green-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-800">
              Add New Product
            </DialogTitle>
          </DialogHeader>
          <ProductForm onClose={() => setIsAddProductOpen(false)} />
        </DialogContent>
      </Dialog>

      <AddEditVendorModal isOpen={isAddVendorOpen} onClose={() => setIsAddVendorOpen(false)} vendor={null} />
      <AddEditCustomerModal isOpen={isAddCustomerOpen} onClose={() => setIsAddCustomerOpen(false)} customer={null} onSave={() => {}} />
      <NewInvoiceModal isOpen={isNewSaleOpen} onClose={() => setIsNewSaleOpen(false)} />
      <AddEditExpenseModal open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen} />
    </>
  );
}
