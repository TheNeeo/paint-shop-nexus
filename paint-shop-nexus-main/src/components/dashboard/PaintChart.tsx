
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";

interface ChartData {
  month: string;
  sales: number;
  purchases: number;
}

export function PaintChart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchChartData = async () => {
      const now = new Date();
      const months: ChartData[] = [];

      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
        const monthName = date.toLocaleString('default', { month: 'short' });
        const startStr = date.toISOString().split('T')[0];
        const endStr = endDate.toISOString().split('T')[0];

        const [salesRes, purchasesRes] = await Promise.all([
          supabase.from('sales').select('total_amount').gte('invoice_date', startStr).lte('invoice_date', endStr),
          supabase.from('purchases').select('total_amount').gte('purchase_date', startStr).lte('purchase_date', endStr),
        ]);

        const salesTotal = salesRes.data?.reduce((sum, s) => sum + Number(s.total_amount), 0) || 0;
        const purchasesTotal = purchasesRes.data?.reduce((sum, p) => sum + Number(p.total_amount), 0) || 0;

        months.push({ month: monthName, sales: salesTotal, purchases: purchasesTotal });
      }

      setChartData(months);
    };

    fetchChartData();
  }, []);

  return (
    <div className="paint-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Sales vs Purchases</h3>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#64748b' }} />
            <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} />
            <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
            <Bar dataKey="sales" fill="url(#salesGradient)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="purchases" fill="url(#purchasesGradient)" radius={[4, 4, 0, 0]} />
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="purchasesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
