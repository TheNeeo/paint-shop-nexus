import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, ShoppingCart, Users, LucideIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SummaryCard {
  title: string;
  value: string | number;
  Icon: LucideIcon;
  gradient: string;
}

export function SalesSummary() {
  const [summaryData, setSummaryData] = useState({
    totalSales: 0,
    totalRevenue: 0,
    thisWeekSales: 0,
    thisMonthSales: 0,
  });

  useEffect(() => {
    const fetchSummary = async () => {
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const [allSalesRes, weekSalesRes, monthSalesRes] = await Promise.all([
        supabase.from('sales').select('id, total_amount'),
        supabase.from('sales').select('id').gte('invoice_date', weekStart.toISOString().split('T')[0]),
        supabase.from('sales').select('id, total_amount').gte('invoice_date', monthStart.toISOString().split('T')[0]),
      ]);

      setSummaryData({
        totalSales: allSalesRes.data?.length || 0,
        totalRevenue: allSalesRes.data?.reduce((sum, s) => sum + Number(s.total_amount), 0) || 0,
        thisWeekSales: weekSalesRes.data?.length || 0,
        thisMonthSales: monthSalesRes.data?.length || 0,
      });
    };

    fetchSummary();
  }, []);

  const cards: SummaryCard[] = [
    { title: "Total Sales", value: summaryData.totalSales, Icon: ShoppingCart, gradient: "from-blue-400 via-blue-500 to-indigo-500" },
    { title: "Total Revenue", value: `₹${summaryData.totalRevenue.toLocaleString()}`, Icon: DollarSign, gradient: "from-emerald-400 via-green-500 to-teal-500" },
    { title: "This Week", value: summaryData.thisWeekSales, Icon: TrendingUp, gradient: "from-purple-400 via-violet-500 to-indigo-500" },
    { title: "This Month", value: summaryData.thisMonthSales, Icon: Users, gradient: "from-orange-400 via-amber-500 to-yellow-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}>
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white/90 mb-1">{card.title}</h3>
              <p className="text-2xl font-bold text-white">{card.value}</p>
            </div>
            <div className="absolute right-4 bottom-4 opacity-80">
              <card.Icon className="h-16 w-16 text-white/40" strokeWidth={1.5} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
