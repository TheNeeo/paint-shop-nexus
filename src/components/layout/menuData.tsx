import type { Icon3DName } from "@/components/shared/Icon3D";

type MenuItem = {
  id: string;
  title: string;
  icon3d: Icon3DName;
  path?: string;
  action?: string;
  children?: MenuItem[];
};

export const menuData: MenuItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon3d: "home",
    path: "/",
  },
  {
    id: "product-management",
    title: "Product Management",
    icon3d: "boxes",
    children: [
      { id: "product-activity", title: "Product Activity", icon3d: "boxes", path: "/products" },
      { id: "add-new-product", title: "Add New Product", icon3d: "boxes", action: "add-product" },
      { id: "category-management", title: "Category Management", icon3d: "paint", path: "/product/category" },
    ],
  },
  {
    id: "sales-management",
    title: "Sales Management",
    icon3d: "cart",
    children: [
      { id: "sales-activity", title: "Sales Activity", icon3d: "cart", path: "/sales" },
      { id: "new-sales-entry", title: "New Sales Entry", icon3d: "cart", action: "add-sale" },
      { id: "invoice-generate", title: "Invoice Generate", icon3d: "invoice", path: "/sales/invoice" },
      { id: "cash-receipt", title: "Cash Receipt", icon3d: "invoice", path: "/sales/cash-receipt" },
    ],
  },
  {
    id: "purchase-management",
    title: "Purchase Management",
    icon3d: "truck",
    children: [
      { id: "purchase-activity", title: "Purchase Activity", icon3d: "truck", path: "/purchase" },
      { id: "new-purchase-entry", title: "New Purchase Entry", icon3d: "truck", path: "/purchase/new" },
      { id: "purchase-invoice", title: "Purchase Invoice", icon3d: "invoice", path: "/purchase/invoice" },
      { id: "reorder-product-list", title: "Reorder Product List", icon3d: "boxes", path: "/purchase/reorder" },
    ],
  },
  {
    id: "inventory-management",
    title: "Inventory Management",
    icon3d: "boxes",
    children: [
      { id: "inventory-activity", title: "Inventory Activity", icon3d: "boxes", path: "/inventory" },
      { id: "update-stock", title: "Update Stock", icon3d: "boxes", path: "/inventory/update" },
      { id: "inventory-movement-history", title: "Inventory Movement History", icon3d: "chart", path: "/inventory/history" },
    ],
  },
  {
    id: "customer-management",
    title: "Contact Management",
    icon3d: "contacts",
    children: [
      { id: "customer-information", title: "Customer Information", icon3d: "contacts", path: "/customers" },
      { id: "add-new-customer", title: "Add New Customer", icon3d: "contacts", action: "add-customer" },
      { id: "customer-history", title: "Customer History", icon3d: "contacts", path: "/customers/history" },
      { id: "vendor-information", title: "Vendor Information", icon3d: "truck", path: "/vendors" },
      { id: "add-new-vendor", title: "Add New Vendor", icon3d: "contacts", action: "add-vendor" },
      { id: "vendor-history", title: "Vendor History", icon3d: "truck", path: "/vendors/history" },
    ],
  },
  {
    id: "reports",
    title: "Reports & Analytics",
    icon3d: "chart",
    children: [
      { id: "sales-report", title: "Sales Report", icon3d: "chart", path: "/reports/sales" },
      { id: "inventory-report", title: "Inventory Report", icon3d: "boxes", path: "/reports/inventory" },
      { id: "profit-loss-report", title: "Profit/Loss Report", icon3d: "chart", path: "/reports/profit-loss" },
      { id: "periodic-reports", title: "Periodic Reports", icon3d: "chart", path: "/reports/periodic" },
      { id: "day-book", title: "Day Book", icon3d: "invoice", path: "/reports/day-book" },
    ],
  },
  {
    id: "expense-management",
    title: "Expense Management",
    icon3d: "invoice",
    children: [
      { id: "expense-activity", title: "Expense Activity", icon3d: "invoice", path: "/expenses" },
      { id: "add-new-expense", title: "Add New Expense", icon3d: "invoice", action: "add-expense" },
      { id: "expense-report", title: "Expense Report", icon3d: "chart", path: "/expenses/report" },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    icon3d: "settings",
    children: [
      { id: "application-settings", title: "Application Settings", icon3d: "settings", path: "/settings/app" },
      { id: "user-interface", title: "User Interface", icon3d: "settings", path: "/settings/ui" },
    ],
  },
];