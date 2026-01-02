import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, ShoppingCart, Users, LucideIcon } from "lucide-react";

interface SummaryCard {
  title: string;
  value: string | number;
  Icon: LucideIcon;
  gradient: string;
}

export function SalesSummary() {
  const summaryData = {
    totalSales: 156,
    totalRevenue: 45780,
    thisWeekSales: 23,
    thisMonthSales: 89,
    topSellingProducts: [
      { name: "Paint Brush Set", sales: 45 },
      { name: "Wall Paint", sales: 38 },
      { name: "Roller Set", sales: 29 },
    ],
    lastUpdated: new Date().toLocaleString(),
  };

  const cards: SummaryCard[] = [
    {
      title: "Total Sales",
      value: summaryData.totalSales,
      Icon: ShoppingCart,
      gradient: "from-blue-400 via-blue-500 to-indigo-500",
    },
    {
      title: "Total Revenue",
      value: `₹${summaryData.totalRevenue.toLocaleString()}`,
      Icon: DollarSign,
      gradient: "from-emerald-400 via-green-500 to-teal-500",
    },
    {
      title: "This Week",
      value: summaryData.thisWeekSales,
      Icon: TrendingUp,
      gradient: "from-purple-400 via-violet-500 to-indigo-500",
    },
    {
      title: "This Month",
      value: summaryData.thisMonthSales,
      Icon: Users,
      gradient: "from-orange-400 via-amber-500 to-yellow-500",
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
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

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <CardHeader>
            <CardTitle className="text-black">Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summaryData.topSellingProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-indigo-700">{index + 1}</span>
                    </div>
                    <span className="font-medium text-black">{product.name}</span>
                  </div>
                  <span className="text-sm text-black">{product.sales} sales</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer Information */}
        <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
          <CardHeader>
            <CardTitle className="text-black">System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-black">Total Sales Count:</span>
                <span className="font-medium text-black">{summaryData.totalSales}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-black">Total Revenue:</span>
                <span className="font-medium text-black">₹{summaryData.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-black">Last Updated:</span>
                <span className="font-medium text-sm text-black">{summaryData.lastUpdated}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
