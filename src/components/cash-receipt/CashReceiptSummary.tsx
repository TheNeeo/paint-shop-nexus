import React from "react";
import { DollarSign, Receipt, TrendingUp, Award, LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function CashReceiptSummary() {
  const { data: stats } = useQuery({
    queryKey: ["cash-receipt-stats"],
    queryFn: async () => {
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0];
      const { data, error } = await supabase.from("cash_receipts").select("amount, receipt_date");
      if (error) throw error;
      const all = data || [];
      const thisMonth = all.filter((r) => r.receipt_date >= monthStart);
      const totalAll = all.reduce((s, r) => s + Number(r.amount), 0);
      const totalMonth = thisMonth.reduce((s, r) => s + Number(r.amount), 0);
      const highest = all.reduce((max, r) => Math.max(max, Number(r.amount)), 0);
      return { totalMonth, totalAll, count: all.length, highest };
    },
  });

  const cards: { title: string; value: string; Icon: LucideIcon; gradient: string }[] = [
    { title: "Total Receipts This Month", value: `₹${(stats?.totalMonth || 0).toLocaleString()}`, Icon: Receipt, gradient: "from-lime-400 via-green-500 to-emerald-500" },
    { title: "Total Cash Inflow", value: `₹${(stats?.totalAll || 0).toLocaleString()}`, Icon: DollarSign, gradient: "from-emerald-400 via-teal-500 to-cyan-500" },
    { title: "No. of Receipts", value: String(stats?.count || 0), Icon: TrendingUp, gradient: "from-green-400 via-emerald-500 to-teal-500" },
    { title: "Highest Single Receipt", value: `₹${(stats?.highest || 0).toLocaleString()}`, Icon: Award, gradient: "from-teal-400 via-green-500 to-lime-500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div key={index} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}>
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-white/90 mb-1">{card.title}</h3>
            <p className="text-2xl font-bold text-white">{card.value}</p>
          </div>
          <div className="absolute right-4 bottom-4 opacity-80"><card.Icon className="h-16 w-16 text-white/40" strokeWidth={1.5} /></div>
        </div>
      ))}
    </div>
  );
}
