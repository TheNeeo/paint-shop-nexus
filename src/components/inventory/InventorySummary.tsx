
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertTriangle, DollarSign, Tags } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function InventorySummary() {
  const { data: summary } = useQuery({
    queryKey: ["inventory-summary"],
    queryFn: async () => {
      const { data: products } = await supabase
        .from("products")
        .select(`
          *,
          categories (name)
        `);

      if (!products) return null;

      const totalProducts = products.length;
      const lowStockCount = products.filter(p => p.current_stock <= p.threshold_qty).length;
      const totalValue = products.reduce((sum, p) => sum + (p.current_stock * p.unit_price), 0);
      const uniqueCategories = new Set(products.map(p => p.category_id)).size;

      return {
        totalProducts,
        lowStockCount,
        totalValue,
        uniqueCategories
      };
    }
  });

  const cards = [
    {
      title: "Total Products",
      value: summary?.totalProducts || 0,
      icon: Package,
      color: "cyan"
    },
    {
      title: "Low Stock Count",
      value: summary?.lowStockCount || 0,
      icon: AlertTriangle,
      color: "red"
    },
    {
      title: "Total Stock Value",
      value: `₹${(summary?.totalValue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "green"
    },
    {
      title: "Categories",
      value: summary?.uniqueCategories || 0,
      icon: Tags,
      color: "purple"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <Card key={card.title} className="border-cyan-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {card.title}
            </CardTitle>
            <card.icon className={`h-4 w-4 text-${card.color}-600`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
