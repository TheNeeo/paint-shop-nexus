import React, { useEffect, useState } from "react";
import { Icon3D } from "@/components/shared/Icon3D";
import { Users, CreditCard, CheckCircle, Activity, LucideIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SummaryCard {
  title: string;
  subtitle: string;
  Icon: LucideIcon;
  gradient: string;
}

interface VendorSummaryCardsProps {
  refreshKey?: number;
}

export function VendorSummaryCards({ refreshKey = 0 }: VendorSummaryCardsProps) {
  const [stats, setStats] = useState({ total: 0, active: 0, payables: 0, recent: 0 });

  useEffect(() => {
    const load = async () => {
      const [{ data: vendors }, { data: purchases }] = await Promise.all([
        supabase.from("vendors").select("id, status"),
        supabase.from("purchases").select("balance_amount, purchase_date"),
      ]);
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      setStats({
        total: vendors?.length || 0,
        active: (vendors || []).filter((v) => (v.status || "active").toLowerCase() === "active").length,
        payables: (purchases || []).reduce((s, p) => s + Number(p.balance_amount || 0), 0),
        recent: (purchases || []).filter((p) => new Date(p.purchase_date) >= monthStart).length,
      });
    };
    load();
  }, [refreshKey]);

  const summaryData: SummaryCard[] = [
    {
      title: "Total Vendors",
      subtitle: `${stats.total} vendors`,
      Icon: Users,
      gradient: "from-violet-400 via-purple-400 to-indigo-400",
    },
    {
      title: "Total Payables",
      subtitle: `₹${stats.payables.toLocaleString("en-IN")}`,
      Icon: CreditCard,
      gradient: "from-blue-300 via-cyan-300 to-teal-300",
    },
    {
      title: "Active Vendors",
      subtitle: `${stats.active} active`,
      Icon: CheckCircle,
      gradient: "from-rose-300 via-pink-300 to-red-300",
    },
    {
      title: "Recent Transactions",
      subtitle: `${stats.recent} this month`,
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
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-white/90 mb-1">{card.title}</h3>
            <p className="text-sm text-white/70">{card.subtitle}</p>
          </div>
          <div className="absolute right-4 bottom-4 opacity-80">
            <Icon3D label={card.title} className="h-16 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
