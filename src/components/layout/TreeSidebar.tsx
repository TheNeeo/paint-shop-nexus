
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
import { Zap, Send, Twitter, MessageCircle, Globe } from "lucide-react";

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
        "h-full bg-gradient-to-b from-[#0b1220] via-[#0f172a] to-[#0b1220] border-r border-slate-800/80 transition-all duration-300 flex flex-col shadow-2xl",
        collapsed ? "w-16" : "w-64"
      )}>
        {/* Brand Header */}
        <div className={cn(
          "border-b border-slate-800/80 bg-slate-900/40 backdrop-blur",
          collapsed ? "p-3" : "p-4"
        )}>
          <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-3")}>
            <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 ring-1 ring-cyan-400/40 flex items-center justify-center shadow-lg shadow-cyan-500/10 shrink-0">
              <Zap className="h-5 w-5 text-cyan-400" strokeWidth={2.5} />
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <div className="text-[10px] uppercase tracking-[0.18em] text-cyan-400/80 font-semibold">Welcome</div>
                <div className="font-bold text-base">
                  <span className="text-slate-100">NEO </span>
                  <span className="text-red-400">C</span>
                  <span className="text-orange-400">O</span>
                  <span className="text-green-400">L</span>
                  <span className="text-blue-400">O</span>
                  <span className="text-purple-400">R</span>
                </div>
                <div className="text-[10px] tracking-widest text-slate-400 font-medium">FACTORY</div>
              </div>
            )}
          </div>
        </div>

        {/* Tree Menu */}
        <div className="flex-1 py-3 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 space-y-0.5 relative">
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

        {/* Social / Quick Icons row */}
        {!collapsed && (
          <div className="px-4 py-3 border-t border-slate-800/80 flex items-center justify-center gap-2">
            {[
              { Icon: Send, color: "text-sky-400", bg: "hover:bg-sky-500/10 ring-sky-500/30" },
              { Icon: Twitter, color: "text-blue-400", bg: "hover:bg-blue-500/10 ring-blue-500/30" },
              { Icon: MessageCircle, color: "text-indigo-400", bg: "hover:bg-indigo-500/10 ring-indigo-500/30" },
              { Icon: Globe, color: "text-orange-400", bg: "hover:bg-orange-500/10 ring-orange-500/30" },
            ].map(({ Icon, color, bg }, i) => (
              <button
                key={i}
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center ring-1 ring-slate-700/60 bg-slate-800/40 transition-all duration-200 hover:scale-110",
                  bg
                )}
              >
                <Icon className={cn("h-4 w-4", color)} />
              </button>
            ))}
          </div>
        )}

        {/* User Profile Section */}
        <div className="border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-sm">
          {collapsed ? (
            <div className="p-3 flex flex-col items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-lg ring-2 ring-cyan-400/30">
                {userInitial}
              </div>
              <button
                onClick={signOut}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="p-3">
              <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/60 border border-slate-700/40">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shrink-0 ring-2 ring-cyan-400/30">
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
