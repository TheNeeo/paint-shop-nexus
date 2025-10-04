import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import ErrorBoundary from "@/components/layout/ErrorBoundary";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductManagement from "./pages/ProductManagement";
import CategoryManagement from "./pages/CategoryManagement";
import SalesManagement from "./pages/SalesManagement";
import PurchaseManagement from "./pages/PurchaseManagement";
import NewPurchaseEntry from "./pages/NewPurchaseEntry";
import PurchaseInvoice from "./pages/PurchaseInvoice";
import ReorderProductList from "./pages/ReorderProductList";
import GeneratePurchaseOrder from "./pages/GeneratePurchaseOrder";
import InventoryManagement from "./pages/InventoryManagement";
import UpdateStock from "./pages/UpdateStock";
import InventoryMovementHistory from "./pages/InventoryMovementHistory";
import CustomerInformation from "./pages/CustomerInformation";
import CustomerHistory from "./pages/CustomerHistory";
import VendorInformation from "./pages/VendorInformation";
import VendorHistory from "./pages/VendorHistory";
import ExpenseActivity from "./pages/ExpenseActivity";
import ExpenseReport from "./pages/ExpenseReport";
import ApplicationSettings from "./pages/ApplicationSettings";
import UserInterfaceSettings from "./pages/UserInterfaceSettings";
import CashReceipt from "./pages/CashReceipt";
import DayBook from "./pages/DayBook";
import InvoiceGenerate from "./pages/InvoiceGenerate";
import SalesReport from "./pages/SalesReport";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/products" element={<ProtectedRoute><ProductManagement /></ProtectedRoute>} />
              <Route path="/product/add" element={<ProtectedRoute><ProductManagement /></ProtectedRoute>} />
              <Route path="/product/category" element={<ProtectedRoute><CategoryManagement /></ProtectedRoute>} />
              <Route path="/sales" element={<ProtectedRoute><SalesManagement /></ProtectedRoute>} />
              <Route path="/sales/activity" element={<ProtectedRoute><SalesManagement /></ProtectedRoute>} />
              <Route path="/sales/invoice" element={<ProtectedRoute><InvoiceGenerate /></ProtectedRoute>} />
              <Route path="/reports/sales" element={<ProtectedRoute><SalesReport /></ProtectedRoute>} />
              <Route path="/purchase" element={<ProtectedRoute><PurchaseManagement /></ProtectedRoute>} />
              <Route path="/purchase/activity" element={<ProtectedRoute><PurchaseManagement /></ProtectedRoute>} />
              <Route path="/purchase/new" element={<ProtectedRoute><NewPurchaseEntry /></ProtectedRoute>} />
              <Route path="/purchase/invoice" element={<ProtectedRoute><PurchaseInvoice /></ProtectedRoute>} />
              <Route path="/purchase/reorder" element={<ProtectedRoute><ReorderProductList /></ProtectedRoute>} />
              <Route path="/purchase/generate-order" element={<ProtectedRoute><GeneratePurchaseOrder /></ProtectedRoute>} />
              <Route path="/inventory" element={<ProtectedRoute><InventoryManagement /></ProtectedRoute>} />
              <Route path="/inventory/update" element={<ProtectedRoute><UpdateStock /></ProtectedRoute>} />
              <Route path="/inventory/history" element={<ProtectedRoute><InventoryMovementHistory /></ProtectedRoute>} />
              <Route path="/customers" element={<ProtectedRoute><CustomerInformation /></ProtectedRoute>} />
              <Route path="/customers/history" element={<ProtectedRoute><CustomerHistory /></ProtectedRoute>} />
              <Route path="/vendors" element={<ProtectedRoute><VendorInformation /></ProtectedRoute>} />
              <Route path="/vendors/history" element={<ProtectedRoute><VendorHistory /></ProtectedRoute>} />
              <Route path="/expenses" element={<ProtectedRoute><ExpenseActivity /></ProtectedRoute>} />
              <Route path="/expenses/report" element={<ProtectedRoute><ExpenseReport /></ProtectedRoute>} />
              <Route path="/settings/app" element={<ProtectedRoute><ApplicationSettings /></ProtectedRoute>} />
              <Route path="/settings/ui" element={<ProtectedRoute><UserInterfaceSettings /></ProtectedRoute>} />
              <Route path="/sales/cash-receipt" element={<ProtectedRoute><CashReceipt /></ProtectedRoute>} />
              <Route path="/reports/day-book" element={<ProtectedRoute><DayBook /></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
