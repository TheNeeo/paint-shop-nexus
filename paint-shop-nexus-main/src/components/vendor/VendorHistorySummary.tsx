import React from "react";
import { Users, ShoppingCart, TrendingUp, CreditCard, LucideIcon } from "lucide-react";
import type { VendorHistoryData } from "@/pages/VendorHistory";

interface VendorHistorySummaryProps {
  vendors: VendorHistoryData[];
}

interface SummaryCard {
  title: string;
  subtitle: string;
  Icon: LucideIcon;
  gradient: string;
}

export const VendorHistorySummary: React.FC<VendorHistorySummaryProps> = ({ vendors }) => {
  const totalVendors = vendors.length;
  const totalPurchases = vendors.reduce((sum, vendor) => sum + vendor.totalAmount, 0);
  const avgPurchaseAmount = totalPurchases / totalVendors || 0;
  const totalOutstanding = vendors.reduce((sum, vendor) => sum + vendor.outstanding, 0);

  const summaryData: SummaryCard[] = [
    {
      title: "Total Vendors",
      subtitle: `${totalVendors} vendors`,
      Icon: Users,
      gradient: "from-blue-400 via-blue-500 to-indigo-500",
    },
    {
      title: "Total Purchases",
      subtitle: `₹${totalPurchases.toLocaleString()}`,
      Icon: ShoppingCart,
      gradient: "from-emerald-400 via-green-500 to-teal-500",
    },
    {
      title: "Average Purchase",
      subtitle: `₹${avgPurchaseAmount.toFixed(0)}`,
      Icon: TrendingUp,
      gradient: "from-purple-400 via-violet-500 to-indigo-500",
    },
    {
      title: "Outstanding Payables",
      subtitle: `₹${totalOutstanding.toLocaleString()}`,
      Icon: CreditCard,
      gradient: "from-orange-400 via-red-400 to-rose-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaryData.map((card, index) => (
        <div
          key={index}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
        >
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-white/90 mb-1">
              {card.title}
            </h3>
            <p className="text-2xl font-bold text-white">
              {card.subtitle}
            </p>
          </div>
          
          <div className="absolute right-4 bottom-4 opacity-80">
            <card.Icon className="h-16 w-16 text-white/40" strokeWidth={1.5} />
          </div>
        </div>
      ))}
    </div>
  );
};
