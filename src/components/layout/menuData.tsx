
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
  Activity,
  FileText,
  RefreshCw,
  TrendingUp,
  History,
  DollarSign,
  FileBarChart,
  Calendar,
  Monitor,
  User,
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
        icon: Activity,
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
    id: "sales-management",
    title: "Sales Management",
    icon: ShoppingCart,
    children: [
      {
        id: "sales-activity",
        title: "Sales Activity",
        icon: Activity,
        path: "/sales",
      },
      {
        id: "new-sales-entry",
        title: "New Sales Entry",
        icon: Plus,
        path: "/sales/new",
      },
      {
        id: "invoice-generate",
        title: "Invoice Generate",
        icon: FileText,
        path: "/sales/invoice",
      },
    ],
  },
  {
    id: "purchase-management",
    title: "Purchase Management",
    icon: CreditCard,
    children: [
      {
        id: "purchase-activity",
        title: "Purchase Activity",
        icon: Activity,
        path: "/purchase",
      },
      {
        id: "new-purchase-entry",
        title: "New Purchase Entry",
        icon: Plus,
        path: "/purchase/new",
      },
      {
        id: "purchase-invoice",
        title: "Purchase Invoice",
        icon: FileText,
        path: "/purchase/invoice",
      },
      {
        id: "reorder-product-list",
        title: "Reorder Product List",
        icon: RefreshCw,
        path: "/purchase/reorder",
      },
    ],
  },
  {
    id: "inventory-management",
    title: "Inventory Management",
    icon: Package,
    children: [
      {
        id: "inventory-activity",
        title: "Inventory Activity",
        icon: Activity,
        path: "/inventory",
      },
      {
        id: "update-stock",
        title: "Update Stock",
        icon: TrendingUp,
        path: "/inventory/update",
      },
      {
        id: "inventory-movement-history",
        title: "Inventory Movement History",
        icon: History,
        path: "/inventory/history",
      },
    ],
  },
  {
    id: "customer-management",
    title: "Customer Management",
    icon: Users,
    children: [
      {
        id: "customer-information",
        title: "Customer Information",
        icon: User,
        path: "/customers",
      },
      {
        id: "add-new-customer",
        title: "Add New Customer",
        icon: Plus,
        path: "/customers/new",
      },
      {
        id: "customer-history",
        title: "Customer History",
        icon: History,
        path: "/customers/history",
      },
    ],
  },
  {
    id: "reports",
    title: "Reports & Analytics",
    icon: BarChart3,
    children: [
      {
        id: "sales-report",
        title: "Sales Report",
        icon: BarChart3,
        path: "/reports/sales",
      },
      {
        id: "inventory-report",
        title: "Inventory Report",
        icon: Package,
        path: "/reports/inventory",
      },
      {
        id: "profit-loss-report",
        title: "Profit/Loss Report",
        icon: DollarSign,
        path: "/reports/profit-loss",
      },
      {
        id: "periodic-reports",
        title: "Periodic Reports",
        icon: Calendar,
        path: "/reports/periodic",
      },
    ],
  },
  {
    id: "expense-management",
    title: "Expense Management",
    icon: CreditCard,
    children: [
      {
        id: "expense-activity",
        title: "Expense Activity",
        icon: Activity,
        path: "/expenses",
      },
      {
        id: "add-new-expense",
        title: "Add New Expense",
        icon: Plus,
        path: "/expenses/new",
      },
      {
        id: "expense-report",
        title: "Expense Report",
        icon: FileBarChart,
        path: "/expenses/report",
      },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    icon: Settings,
    children: [
      {
        id: "application-settings",
        title: "Application Settings",
        icon: Settings,
        path: "/settings/app",
      },
      {
        id: "user-interface",
        title: "User Interface",
        icon: Monitor,
        path: "/settings/ui",
      },
    ],
  },
];
