
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductManagement from "./pages/ProductManagement";
import CategoryManagement from "./pages/CategoryManagement";
import SalesManagement from "./pages/SalesManagement";
import PurchaseManagement from "./pages/PurchaseManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<ProductManagement />} />
          <Route path="/product/add" element={<ProductManagement />} />
          <Route path="/product/category" element={<CategoryManagement />} />
          <Route path="/sales" element={<SalesManagement />} />
          <Route path="/sales/activity" element={<SalesManagement />} />
          <Route path="/purchase/activity" element={<PurchaseManagement />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
