
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { TreeNode } from "./TreeNode";
import { menuData } from "./menuData";
import { TreeSidebarProps } from "./types";
import { useLocation } from "react-router-dom";
import { LogOut, User, Settings as SettingsIcon, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ProductForm } from "@/components/product/ProductForm";
import { AddEditVendorModal } from "@/components/vendor/AddEditVendorModal";
import { AddEditCustomerModal } from "@/components/customer/AddEditCustomerModal";
import { NewInvoiceModal } from "@/components/sales/NewInvoiceModal";
import { AddEditExpenseModal } from "@/components/expense/AddEditExpenseModal";
import { Zap, Send, Twitter, MessageCircle, Globe } from "lucide-react";
import { Icon3D } from "@/components/shared/Icon3D";
import { Button } from "@/components/ui/button";

export function TreeSidebar({ collapsed }: TreeSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isSignOutConfirmOpen, setIsSignOutConfirmOpen] = useState(false);
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
        "neo-sidebar h-full border-r border-sidebar-border transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-72"
      )}>
        {/* Brand Header */}
        <div className={cn(
          "border-b border-sidebar-border bg-sidebar/40 backdrop-blur",
          collapsed ? "p-3" : "p-4"
        )}>
          <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-3")}>
            <div className="neo-nav-icon relative h-12 w-12 rounded-xl flex items-center justify-center shrink-0">
              <Icon3D name="paint" className="h-12 w-12" />
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <div className="text-[10px] uppercase tracking-[0.18em] text-sidebar-primary font-semibold">Welcome</div>
                <div className="font-bold text-base">
                  <span className="text-sidebar-foreground">NEO </span>
                  <span className="text-red-400">C</span>
                  <span className="text-orange-400">O</span>
                  <span className="text-green-400">L</span>
                  <span className="text-blue-400">O</span>
                  <span className="text-purple-400">R</span>
                </div>
                <div className="text-[10px] tracking-widest text-sidebar-foreground/70 font-medium">FACTORY</div>
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
          <div className="px-4 py-3 border-t border-sidebar-border flex items-center justify-center gap-2">
            {[
              { Icon: Send, color: "text-sky-400", bg: "hover:bg-sky-500/10 ring-sky-500/30" },
              { Icon: Twitter, color: "text-blue-400", bg: "hover:bg-blue-500/10 ring-blue-500/30" },
              { Icon: MessageCircle, color: "text-indigo-400", bg: "hover:bg-indigo-500/10 ring-indigo-500/30" },
              { Icon: Globe, color: "text-orange-400", bg: "hover:bg-orange-500/10 ring-orange-500/30" },
            ].map(({ Icon, color, bg }, i) => (
              <Button variant="ghost"
                key={i}
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center ring-1 ring-sidebar-border bg-sidebar-accent transition-all duration-200 hover:scale-110",
                  bg
                )}
              >
                <Icon className={cn("h-4 w-4", color)} />
              </Button>
            ))}
          </div>
        )}

        {/* User Profile Section */}
        <div className="border-t border-sidebar-border bg-sidebar/60 backdrop-blur-sm">
          {collapsed ? (
            <div className="p-3 flex flex-col items-center gap-2">
              <div className="neo-profile-avatar w-9 h-9 rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
                {userInitial}
              </div>
              <Button variant="ghost"
                onClick={() => setIsSignOutConfirmOpen(true)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sidebar-foreground/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="p-3">
              <div className={cn(
                "neo-profile rounded-xl border border-sidebar-border overflow-hidden transition-all duration-300",
                profileMenuOpen && "border-cyan-500/30 shadow-lg shadow-cyan-500/5"
              )}>
                {/* Expandable menu items */}
                <div className={cn(
                  "grid transition-all duration-300 ease-out",
                  profileMenuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}>
                  <div className="overflow-hidden">
                    <div className="p-2 space-y-0.5 border-b border-sidebar-border">
                      <Link
                        to="/customers"
                        onClick={() => setProfileMenuOpen(false)}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground text-xs transition-all"
                      >
                        <User className="h-3.5 w-3.5 text-sidebar-primary" />
                        My Profile
                      </Link>
                      <Link
                        to="/settings/app"
                        onClick={() => setProfileMenuOpen(false)}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground text-xs transition-all"
                      >
                        <SettingsIcon className="h-3.5 w-3.5 text-purple-400" />
                        Settings
                      </Link>
                      <Button variant="ghost"
                        onClick={() => { setProfileMenuOpen(false); setIsSignOutConfirmOpen(true); }}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 text-xs transition-all"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Profile trigger row */}
                <Button variant="ghost"
                  onClick={() => setProfileMenuOpen((v) => !v)}
                  aria-label="Account menu" aria-expanded={profileMenuOpen} className="h-auto w-full flex items-center gap-2 p-2.5 hover:bg-sidebar-accent transition-colors"
                >
                  <div className="relative shrink-0">
                    <div className="neo-profile-avatar w-10 h-10 rounded-xl flex items-center justify-center text-primary-foreground text-sm font-bold">
                      {userInitial}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 ring-2 ring-sidebar animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sidebar-foreground text-xs font-semibold truncate">{userEmail}</p>
                    <p className="text-sidebar-foreground/70 text-[10px]">
                      <span className="text-green-400">●</span> Active
                    </p>
                  </div>
                  <ChevronUp
                    className={cn(
                      "h-3.5 w-3.5 text-sidebar-foreground/70 transition-transform duration-300 shrink-0",
                      profileMenuOpen ? "rotate-0" : "rotate-180"
                    )}
                  />
                </Button>
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

      {/* Sign Out Confirmation */}
      <AlertDialog open={isSignOutConfirmOpen} onOpenChange={setIsSignOutConfirmOpen}>
        <AlertDialogContent className="bg-white border-2 border-red-100 z-[100]">
          <AlertDialogHeader>
            <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/30 mb-2">
              <LogOut className="h-7 w-7 text-sidebar-foreground" />
            </div>
            <AlertDialogTitle className="text-center text-xl font-bold text-slate-800">
              Sign Out Confirmation
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-slate-600">
              Are you sure you want to sign out? You will need to log in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center gap-2">
            <AlertDialogCancel className="min-w-[110px] border-slate-300 hover:bg-slate-100">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={signOut}
              className="min-w-[110px] bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-sidebar-foreground shadow-md"
            >
              <LogOut className="h-4 w-4 mr-1.5" />
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
