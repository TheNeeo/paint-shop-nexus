
import React from "react";
import {
  Home,
  Package,
  ShoppingCart,
  ShoppingBag,
  Boxes,
  Users,
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
  Cog,
  Monitor,
} from "lucide-react";
import { MenuItem } from "./types";

export const menuData: MenuItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: <Home className="w-4 h-4" />,
    path: "/",
  },
  {
    id: "product",
    title: "Product Activity",
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
    title: "Inventory Activity",
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
