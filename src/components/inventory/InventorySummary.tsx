import React from "react";
import { Package, AlertTriangle, DollarSign, Tags, LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SummaryCard {
  title: string;
  value: string | number;
  Icon: LucideIcon;
  gradient: string;
}

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

  const cards: SummaryCard[] = [
    {
      title: "Total Products",
      value: summary?.totalProducts || 0,
      Icon: Package,
      gradient: "from-cyan-400 via-teal-500 to-emerald-500",
    },
    {
      title: "Low Stock Count",
      value: summary?.lowStockCount || 0,
      Icon: AlertTriangle,
      gradient: "from-red-400 via-rose-500 to-pink-500",
    },
    {
      title: "Total Stock Value",
      value: `₹${(summary?.totalValue || 0).toLocaleString()}`,
      Icon: DollarSign,
      gradient: "from-emerald-400 via-green-500 to-teal-500",
    },
    {
      title: "Categories",
      value: summary?.uniqueCategories || 0,
      Icon: Tags,
      gradient: "from-purple-400 via-violet-500 to-indigo-500",
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
        >
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-white/90 mb-1">
              {card.title}
            </h3>
            <p className="text-2xl font-bold text-white">
              {card.value}
            </p>
          </div>
          
          <div className="absolute right-4 bottom-4 opacity-80">
            <card.Icon className="h-16 w-16 text-white/40" strokeWidth={1.5} />
          </div>
        </div>
      ))}
    </div>
  );
}
