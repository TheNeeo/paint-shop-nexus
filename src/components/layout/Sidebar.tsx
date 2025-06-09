
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Home,
  Package,
  ShoppingCart,
  ShoppingBag,
  Boxes,
  Users,
  Truck,
  BookOpen,
  BarChart2,
  DollarSign,
  Settings,
  Menu,
  X,
  Plus,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

type MenuItem = {
  title: string;
  path?: string;
  icon?: React.ReactNode;
  submenu?: MenuItem[];
};

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    path: "/",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "Product",
    icon: <Package className="h-5 w-5" />,
    submenu: [
      {
        title: "Product Management",
        path: "/product/management",
      },
      {
        title: "Add New Product",
        path: "/product/add",
        icon: <Plus className="h-4 w-4" />,
      },
      {
        title: "Category Management",
        path: "/product/category",
        icon: <Layers className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Sales",
    icon: <ShoppingCart className="h-5 w-5" />,
    submenu: [
      {
        title: "Sales Activity",
        path: "/sales/activity",
      },
      {
        title: "New Sales Entry",
        path: "/sales/new",
      },
      {
        title: "Invoice Generate",
        path: "/sales/invoice",
      },
    ],
  },
  {
    title: "Purchase",
    icon: <ShoppingBag className="h-5 w-5" />,
    submenu: [
      {
        title: "Purchase Activity",
        path: "/purchase/activity",
      },
      {
        title: "New Purchase Entry",
        path: "/purchase/new",
      },
      {
        title: "Purchase Invoice",
        path: "/purchase/invoice",
      },
      {
        title: "Reorder Product List",
        path: "/purchase/reorder",
      },
    ],
  },
  {
    title: "Inventory",
    icon: <Boxes className="h-5 w-5" />,
    submenu: [
      {
        title: "Inventory Management",
        path: "/inventory/management",
      },
      {
        title: "Update Stock",
        path: "/inventory/update",
      },
      {
        title: "Inventory Movement History",
        path: "/inventory/history",
      },
    ],
  },
  {
    title: "Customer",
    icon: <Users className="h-5 w-5" />,
    submenu: [
      {
        title: "Customer Information",
        path: "/customer/info",
      },
      {
        title: "Customer History",
        path: "/customer/history",
      },
    ],
  },
  {
    title: "Reports",
    icon: <BarChart2 className="h-5 w-5" />,
    submenu: [
      {
        title: "Sales Report",
        path: "/report/sales",
      },
      {
        title: "Inventory Report",
        path: "/report/inventory",
      },
      {
        title: "Profit/Loss Report",
        path: "/report/profit-loss",
      },
    ],
  },
  {
    title: "Expenses",
    icon: <DollarSign className="h-5 w-5" />,
    submenu: [
      {
        title: "Expense Activity",
        path: "/expense/activity",
      },
      {
        title: "Add New Expense",
        path: "/expense/add",
      },
    ],
  },
  {
    title: "Settings",
    icon: <Settings className="h-5 w-5" />,
    submenu: [
      {
        title: "Application Settings",
        path: "/setting/application",
      },
      {
        title: "User Interface",
        path: "/setting/ui",
      },
    ],
  },
];

type MenuItemProps = {
  item: MenuItem;
  level: number;
  collapsed?: boolean;
};

const SubMenu: React.FC<MenuItemProps> = ({ item, level, collapsed }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSubmenu = () => {
    setIsOpen(!isOpen);
  };

  const hasSubmenu = item.submenu && item.submenu.length > 0;

  return (
    <div className="w-full">
      <div
        onClick={hasSubmenu ? toggleSubmenu : undefined}
        className={cn(
          "flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-200 relative group",
          "hover:bg-primary/20 hover:text-primary",
          level === 0 ? "text-white" : "text-slate-300",
          level === 1 && "pl-8",
          level === 2 && "pl-12",
          collapsed && level === 0 && "justify-center px-2"
        )}
      >
        <div className="flex items-center gap-3">
          {item.icon && (
            <span className={cn("transition-colors", collapsed && level === 0 && "mx-auto")}>
              {item.icon}
            </span>
          )}
          {!collapsed && <span className="truncate font-medium">{item.title}</span>}
        </div>
        {!collapsed && hasSubmenu && (
          <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight className="h-4 w-4" />
          </motion.div>
        )}
        
        {/* Hover effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>

      {!collapsed && hasSubmenu && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {item.submenu?.map((subItem, index) => (
                <SubMenu key={index} item={subItem} level={level + 1} collapsed={collapsed} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 p-3 rounded-lg bg-slate-800 text-white md:hidden shadow-lg"
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <motion.div
        className={cn(
          "fixed top-0 left-0 h-full z-40 overflow-y-auto",
          "bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800",
          "border-r border-slate-700/50",
          "transition-all duration-300 ease-in-out",
          "scrollbar-thin scrollbar-thumb-primary",
          "md:relative md:block",
          isMobileOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full md:translate-x-0",
          collapsed && "md:w-16"
        )}
        initial={false}
      >
        {/* Header with NEO COLOR FACTORY branding */}
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

        {/* Menu Items */}
        <div className="py-4">
          {menuItems.map((item, index) => (
            <div key={index} className="mb-1">
              <SubMenu item={item} level={0} collapsed={collapsed} />
            </div>
          ))}
        </div>

        {/* Bottom gradient effect */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
      </motion.div>
    </>
  );
}
