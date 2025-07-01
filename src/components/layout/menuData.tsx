
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  CreditCard,
  Users,
  Settings,
  BarChart3,
  Tags,
  Plus,
  List,
} from "lucide-react";

export const menuData = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    id: "product-management",
    title: "Product Management",
    icon: Package,
    children: [
      {
        id: "product-activity",
        title: "Product Activity",
        icon: List,
        path: "/products",
      },
      {
        id: "add-new-product",
        title: "Add New Product",
        icon: Plus,
        action: "add-product",
      },
    ],
  },
  {
    id: "category-management",
    title: "Category Management",
    icon: Tags,
    path: "/categories",
  },
  {
    id: "sales-management",
    title: "Sales Management",
    icon: ShoppingCart,
    path: "/sales",
  },
  {
    id: "purchase-management",
    title: "Purchase Management",
    icon: CreditCard,
    path: "/purchase",
  },
  {
    id: "reports",
    title: "Reports & Analytics",
    icon: BarChart3,
    children: [
      {
        id: "sales-report",
        title: "Sales Report",
        path: "/reports/sales",
      },
      {
        id: "inventory-report",
        title: "Inventory Report",
        path: "/reports/inventory",
      },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];
