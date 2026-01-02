import React from "react";
import { DollarSign, FileText, TrendingUp, Target, LucideIcon } from "lucide-react";

interface SummaryCard {
  title: string;
  value: string;
  Icon: LucideIcon;
  gradient: string;
}

export const ExpenseActivitySummary = () => {
  const cards: SummaryCard[] = [
    {
      title: "Total Expenses (This Month)",
      value: "₹45,250",
      Icon: DollarSign,
      gradient: "from-emerald-400 via-green-500 to-teal-500",
    },
    {
      title: "No. of Expense Entries",
      value: "124",
      Icon: FileText,
      gradient: "from-teal-400 via-cyan-500 to-blue-500",
    },
    {
      title: "Most Frequent Expense Type",
      value: "Transport",
      Icon: TrendingUp,
      gradient: "from-green-400 via-emerald-500 to-teal-500",
    },
    {
      title: "Highest Single Expense",
      value: "₹8,500",
      Icon: Target,
      gradient: "from-lime-400 via-green-500 to-emerald-500",
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
};
