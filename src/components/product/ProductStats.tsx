import React from "react";
import { Package, DollarSign, AlertTriangle, Star, LucideIcon } from "lucide-react";

interface ProductStatsProps {
  totalProducts: number;
  totalValue: number;
  lowStockCount: number;
  featuredCount: number;
}

interface SummaryCard {
  title: string;
  value: string | number;
  Icon: LucideIcon;
  gradient: string;
}

export function ProductStats({
  totalProducts,
  totalValue,
  lowStockCount,
  featuredCount,
}: ProductStatsProps) {
  const cards: SummaryCard[] = [
    {
      title: "Total Products",
      value: totalProducts,
      Icon: Package,
      gradient: "from-emerald-400 via-green-500 to-teal-500",
    },
    {
      title: "Total Inventory Value",
      value: `₹${totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      Icon: DollarSign,
      gradient: "from-blue-400 via-indigo-500 to-purple-500",
    },
    {
      title: "Low Stock Items",
      value: lowStockCount,
      Icon: AlertTriangle,
      gradient: "from-orange-400 via-amber-500 to-yellow-500",
    },
    {
      title: "Featured Products",
      value: featuredCount,
      Icon: Star,
      gradient: "from-purple-400 via-violet-500 to-indigo-500",
    },
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
