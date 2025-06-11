
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronDown,
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
  Plus,
  Layers,
  FileText,
  Activity,
  TrendingUp,
  Calendar,
  CreditCard,
  Archive,
  RefreshCw,
  History,
  UserPlus,
  Receipt,
  ShoppingBasket,
  Calculator,
  PieChart,
  BarChart3,
  LineChart,
  Wallet,
  Cog,
  Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  id: string;
  title: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  isExpanded?: boolean;
}

const menuData: MenuItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: <Home className="w-4 h-4" />,
    path: "/",
  },
  {
    id: "product",
    title: "Product Management",
    icon: <Package className="w-4 h-4" />,
    children: [
      {
        id: "product-activity",
        title: "Product Activity",
        icon: <Package className="w-4 h-4" />,
        path: "/product/activity",
      },
      {
        id: "add-product",
        title: "Add New Product",
        icon: <Plus className="w-4 h-4" />,
        path: "/product/add",
      },
      {
        id: "category-management",
        title: "Category Management",
        icon: <Layers className="w-4 h-4" />,
        path: "/product/category",
      },
    ],
  },
  {
    id: "sales",
    title: "Sales Management",
    icon: <ShoppingCart className="w-4 h-4" />,
    children: [
      {
        id: "sales-activity",
        title: "Sales Activity",
        icon: <Activity className="w-4 h-4" />,
        path: "/sales/activity",
      },
      {
        id: "new-sales",
        title: "New Sales Entry",
        icon: <Plus className="w-4 h-4" />,
        path: "/sales/new",
      },
      {
        id: "invoice-generate",
        title: "Invoice Generate",
        icon: <FileText className="w-4 h-4" />,
        path: "/sales/invoice",
      },
    ],
  },
  {
    id: "purchase",
    title: "Purchase Management",
    icon: <ShoppingBag className="w-4 h-4" />,
    children: [
      {
        id: "purchase-activity",
        title: "Purchase Activity",
        icon: <ShoppingBasket className="w-4 h-4" />,
        path: "/purchase/activity",
      },
      {
        id: "new-purchase",
        title: "New Purchase Entry",
        icon: <Plus className="w-4 h-4" />,
        path: "/purchase/new",
      },
      {
        id: "purchase-invoice",
        title: "Purchase Invoice",
        icon: <Receipt className="w-4 h-4" />,
        path: "/purchase/invoice",
      },
      {
        id: "reorder-list",
        title: "Reorder Product List",
        icon: <RefreshCw className="w-4 h-4" />,
        path: "/purchase/reorder",
      },
    ],
  },
  {
    id: "inventory",
    title: "Inventory Management",
    icon: <Boxes className="w-4 h-4" />,
    children: [
      {
        id: "inventory-activity",
        title: "Inventory Activity",
        icon: <Archive className="w-4 h-4" />,
        path: "/inventory/activity",
      },
      {
        id: "update-stock",
        title: "Update Stock",
        icon: <TrendingUp className="w-4 h-4" />,
        path: "/inventory/update",
      },
      {
        id: "inventory-history",
        title: "Inventory Movement History",
        icon: <History className="w-4 h-4" />,
        path: "/inventory/history",
      },
    ],
  },
  {
    id: "customer",
    title: "Customer Management",
    icon: <Users className="w-4 h-4" />,
    children: [
      {
        id: "customer-info",
        title: "Customer Information",
        icon: <Users className="w-4 h-4" />,
        path: "/customer/info",
      },
      {
        id: "add-customer",
        title: "Add New Customer",
        icon: <UserPlus className="w-4 h-4" />,
        path: "/customer/add",
      },
      {
        id: "customer-history",
        title: "Customer History",
        icon: <History className="w-4 h-4" />,
        path: "/customer/history",
      },
    ],
  },
  {
    id: "reports",
    title: "Reports & Analytics",
    icon: <BarChart2 className="w-4 h-4" />,
    children: [
      {
        id: "sales-report",
        title: "Sales Report",
        icon: <LineChart className="w-4 h-4" />,
        path: "/report/sales",
      },
      {
        id: "inventory-report",
        title: "Inventory Report",
        icon: <BarChart3 className="w-4 h-4" />,
        path: "/report/inventory",
      },
      {
        id: "profit-loss",
        title: "Profit/Loss Report",
        icon: <PieChart className="w-4 h-4" />,
        path: "/report/profit-loss",
      },
      {
        id: "periodic-reports",
        title: "Periodic Reports",
        icon: <Calendar className="w-4 h-4" />,
        path: "/report/periodic",
      },
    ],
  },
  {
    id: "expenses",
    title: "Expense Management",
    icon: <DollarSign className="w-4 h-4" />,
    children: [
      {
        id: "expense-activity",
        title: "Expense Activity",
        icon: <CreditCard className="w-4 h-4" />,
        path: "/expense/activity",
      },
      {
        id: "add-expense",
        title: "Add New Expense",
        icon: <Plus className="w-4 h-4" />,
        path: "/expense/add",
      },
      {
        id: "expense-report",
        title: "Expense Report",
        icon: <Calculator className="w-4 h-4" />,
        path: "/expense/report",
      },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    icon: <Settings className="w-4 h-4" />,
    children: [
      {
        id: "app-settings",
        title: "Application Settings",
        icon: <Cog className="w-4 h-4" />,
        path: "/setting/application",
      },
      {
        id: "ui-settings",
        title: "User Interface",
        icon: <Monitor className="w-4 h-4" />,
        path: "/setting/ui",
      },
    ],
  },
];

interface TreeNodeProps {
  item: MenuItem;
  level: number;
  expandedItems: Set<string>;
  onToggle: (id: string) => void;
  collapsed: boolean;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  item,
  level,
  expandedItems,
  onToggle,
  collapsed,
}) => {
  const isExpanded = expandedItems.has(item.id);
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      onToggle(item.id);
    }
  };

  return (
    <div className="w-full">
      <div
        onClick={handleClick}
        className={cn(
          "flex items-center justify-between px-3 py-2.5 cursor-pointer transition-all duration-200 relative group rounded-lg mx-2",
          "hover:bg-slate-700/50 hover:text-cyan-400",
          level === 0 ? "text-white font-medium" : "text-slate-300",
          level > 0 && "ml-4"
        )}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {hasChildren && !collapsed && (
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          )}
          
          {(!hasChildren || collapsed) && (
            <div className="w-4 h-4 flex-shrink-0">
              {item.icon}
            </div>
          )}
          
          {hasChildren && !collapsed && (
            <div className="w-4 h-4 flex-shrink-0">
              {item.icon}
            </div>
          )}
          
          {!collapsed && (
            <span className="truncate text-sm font-medium">{item.title}</span>
          )}
        </div>
        
        {/* Hover indicator */}
        <div className="absolute left-0 top-0 w-1 h-full bg-cyan-400 scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-center rounded-r" />
      </div>

      {/* Children */}
      {!collapsed && hasChildren && (
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              {item.children?.map((child) => (
                <TreeNode
                  key={child.id}
                  item={child}
                  level={level + 1}
                  expandedItems={expandedItems}
                  onToggle={onToggle}
                  collapsed={collapsed}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

interface TreeSidebarProps {
  collapsed: boolean;
}

export function TreeSidebar({ collapsed }: TreeSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const handleToggle = (id: string) => {
    const newExpanded = new Set<string>();
    
    // If the item is not currently expanded, expand only this item (accordion behavior)
    if (!expandedItems.has(id)) {
      newExpanded.add(id);
    }
    // If the item is currently expanded, close it (newExpanded remains empty)
    
    setExpandedItems(newExpanded);
  };

  return (
    <div className="h-full bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800 border-r border-slate-700/50">
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
      <div className="py-4 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-primary">
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
      </div>
    </div>
  );
}
