
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const salesData = [
  { month: 'Jan', sales: 15000, purchases: 12000 },
  { month: 'Feb', sales: 18000, purchases: 14000 },
  { month: 'Mar', sales: 22000, purchases: 16000 },
  { month: 'Apr', sales: 25000, purchases: 18000 },
  { month: 'May', sales: 28000, purchases: 20000 },
  { month: 'Jun', sales: 32000, purchases: 22000 },
];

export function PaintChart() {
  return (
    <div className="paint-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Sales vs Purchases</h3>
        <select className="text-sm border border-border rounded-md px-3 py-1 bg-background">
          <option>Last 6 months</option>
          <option>Last year</option>
        </select>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="month" 
              stroke="#64748b"
              tick={{ fill: '#64748b' }}
            />
            <YAxis 
              stroke="#64748b"
              tick={{ fill: '#64748b' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
              }}
            />
            <Bar 
              dataKey="sales" 
              fill="url(#salesGradient)" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="purchases" 
              fill="url(#purchasesGradient)" 
              radius={[4, 4, 0, 0]}
            />
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0.3}/>
              </linearGradient>
              <linearGradient id="purchasesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
