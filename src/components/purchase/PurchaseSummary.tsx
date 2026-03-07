import React, { useEffect, useState } from 'react';
import { TrendingUp, FileText, Clock, Calendar, LucideIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SummaryCard {
  title: string;
  value: string;
  Icon: LucideIcon;
  gradient: string;
}

export const PurchaseSummary = () => {
  const [summaryData, setSummaryData] = useState({
    totalPurchaseAmount: 0,
    totalInvoices: 0,
    vendorDueAmount: 0,
    thisMonthPurchases: 0,
  });

  useEffect(() => {
    const fetchSummary = async () => {
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

      const [allRes, monthRes] = await Promise.all([
        supabase.from('purchases').select('total_amount, balance_amount'),
        supabase.from('purchases').select('total_amount').gte('purchase_date', monthStart),
      ]);

      const allData = allRes.data || [];
      setSummaryData({
        totalPurchaseAmount: allData.reduce((sum, p) => sum + Number(p.total_amount), 0),
        totalInvoices: allData.length,
        vendorDueAmount: allData.reduce((sum, p) => sum + Number(p.balance_amount), 0),
        thisMonthPurchases: (monthRes.data || []).reduce((sum, p) => sum + Number(p.total_amount), 0),
      });
    };

    fetchSummary();
  }, []);

  const cards: SummaryCard[] = [
    { title: "Total Purchase Amount", value: `₹${summaryData.totalPurchaseAmount.toLocaleString()}`, Icon: TrendingUp, gradient: "from-pink-400 via-rose-500 to-purple-500" },
    { title: "Total Invoices", value: summaryData.totalInvoices.toString(), Icon: FileText, gradient: "from-purple-400 via-violet-500 to-indigo-500" },
    { title: "Vendor Due Amount", value: `₹${summaryData.vendorDueAmount.toLocaleString()}`, Icon: Clock, gradient: "from-rose-400 via-pink-500 to-fuchsia-500" },
    { title: "This Month's Purchases", value: `₹${summaryData.thisMonthPurchases.toLocaleString()}`, Icon: Calendar, gradient: "from-fuchsia-400 via-purple-500 to-violet-500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
  );
};
