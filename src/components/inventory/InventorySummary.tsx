
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
      color: "cyan",
      bgColor: "bg-cyan-100",
      textColor: "text-cyan-800",
      iconColor: "text-cyan-600"
    },
    {
      title: "Low Stock Count",
      value: summary?.lowStockCount || 0,
      icon: AlertTriangle,
      color: "red",
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      iconColor: "text-red-600"
    },
    {
      title: "Total Stock Value",
      value: `₹${(summary?.totalValue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "green",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      iconColor: "text-green-600"
    },
    {
      title: "Categories",
      value: summary?.uniqueCategories || 0,
      icon: Tags,
      color: "purple",
      bgColor: "bg-purple-100",
      textColor: "text-purple-800",
      iconColor: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <Card key={card.title} className={`${card.bgColor} border-${card.color}-200 hover:shadow-lg transition-shadow`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${card.textColor}`}>
              {card.title}
            </CardTitle>
            <card.icon className={`h-4 w-4 ${card.iconColor}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.textColor}`}>{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
