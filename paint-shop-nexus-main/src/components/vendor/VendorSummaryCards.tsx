import React from "react";
import { Users, CreditCard, CheckCircle, Activity, LucideIcon } from "lucide-react";

interface SummaryCard {
  title: string;
  subtitle: string;
  Icon: LucideIcon;
  gradient: string;
}

export function VendorSummaryCards() {
  const summaryData: SummaryCard[] = [
    {
      title: "Total Vendors",
      subtitle: "125 vendors",
      Icon: Users,
      gradient: "from-violet-400 via-purple-400 to-indigo-400",
    },
    {
      title: "Total Payables",
      subtitle: "₹2,45,000",
      Icon: CreditCard,
      gradient: "from-blue-300 via-cyan-300 to-teal-300",
    },
    {
      title: "Active Vendors",
      subtitle: "98 active",
      Icon: CheckCircle,
      gradient: "from-rose-300 via-pink-300 to-red-300",
    },
    {
      title: "Recent Transactions",
      subtitle: "42 this month",
      Icon: Activity,
      gradient: "from-emerald-400 via-green-400 to-teal-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaryData.map((card, index) => (
        <div
          key={index}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
        >
          {/* Text Content */}
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-white/90 mb-1">
              {card.title}
            </h3>
            <p className="text-sm text-white/70">
              {card.subtitle}
            </p>
          </div>
          
          {/* Large Icon on the right */}
          <div className="absolute right-4 bottom-4 opacity-80">
            <card.Icon className="h-16 w-16 text-white/40" strokeWidth={1.5} />
          </div>
        </div>
      ))}
    </div>
  );
}