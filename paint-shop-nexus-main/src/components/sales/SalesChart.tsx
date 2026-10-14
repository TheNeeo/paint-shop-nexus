
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Area, AreaChart } from "recharts";

const mockChartData = [
  { date: "Jan 1", sales: 4000, revenue: 12000 },
  { date: "Jan 2", sales: 3000, revenue: 9000 },
  { date: "Jan 3", sales: 5000, revenue: 15000 },
  { date: "Jan 4", sales: 2780, revenue: 8340 },
  { date: "Jan 5", sales: 1890, revenue: 5670 },
  { date: "Jan 6", sales: 2390, revenue: 7170 },
  { date: "Jan 7", sales: 3490, revenue: 10470 },
];

export function SalesChart() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sales Trend Line Chart */}
      <div className="bg-white p-6 rounded-xl border-2 shadow-lg" style={{ borderColor: '#fce7f3' }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#831843' }}>Sales Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={mockChartData}>
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
          <BarChart data={mockChartData}>
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
