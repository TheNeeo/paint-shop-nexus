
import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Area, AreaChart } from "recharts";
import { supabase } from "@/integrations/supabase/client";

interface ChartPoint {
  date: string;
  sales: number;
  revenue: number;
}

export function SalesChart() {
  const [chartData, setChartData] = useState<ChartPoint[]>([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      const days: { key: string; label: string }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push({
          key: d.toISOString().split('T')[0],
          label: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        });
      }

      const startDate = days[0].key;
      const { data, error } = await supabase
        .from('sales')
        .select('invoice_date, total_amount')
        .gte('invoice_date', startDate);

      const grouped: Record<string, { sales: number; revenue: number }> = {};
      days.forEach(d => { grouped[d.key] = { sales: 0, revenue: 0 }; });

      if (!error && data) {
        data.forEach((row) => {
          const dateKey = (row.invoice_date || '').split('T')[0];
          if (grouped[dateKey]) {
            grouped[dateKey].sales += 1;
            grouped[dateKey].revenue += Number(row.total_amount) || 0;
          }
        });
      }

      setChartData(days.map(d => ({
        date: d.label,
        sales: grouped[d.key].sales,
        revenue: grouped[d.key].revenue,
      })));
    };

    fetchSalesData();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sales Trend Line Chart */}
      <div className="bg-white p-6 rounded-xl border-2 shadow-lg" style={{ borderColor: '#fce7f3' }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#831843' }}>Sales Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#af0568" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#af0568" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
            <XAxis dataKey="date" stroke="#9d174d" fontSize={12} />
            <YAxis stroke="#9d174d" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '2px solid #f9a8d4',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(175, 5, 104, 0.1)'
              }}
              labelStyle={{ color: '#831843', fontWeight: 'bold' }}
            />
            <Area 
              type="monotone" 
              dataKey="sales" 
              stroke="#af0568" 
              strokeWidth={3}
              fill="url(#salesGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue Bar Chart */}
      <div className="bg-white p-6 rounded-xl border-2 shadow-lg" style={{ borderColor: '#fce7f3' }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#831843' }}>Revenue Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#af0568" stopOpacity={1}/>
                <stop offset="100%" stopColor="#db2777" stopOpacity={0.8}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
            <XAxis dataKey="date" stroke="#9d174d" fontSize={12} />
            <YAxis stroke="#9d174d" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '2px solid #f9a8d4',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(175, 5, 104, 0.1)'
              }}
              labelStyle={{ color: '#831843', fontWeight: 'bold' }}
            />
            <Bar 
              dataKey="revenue" 
              fill="url(#revenueGradient)" 
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
