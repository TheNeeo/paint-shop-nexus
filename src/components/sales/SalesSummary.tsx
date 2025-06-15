
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, ShoppingCart, Users } from "lucide-react";

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

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{summaryData.totalSales}</div>
            <p className="text-xs text-black">All time sales count</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">₹{summaryData.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-black">Total revenue earned</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{summaryData.thisWeekSales}</div>
            <p className="text-xs text-black">Sales this week</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">This Month</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{summaryData.thisMonthSales}</div>
            <p className="text-xs text-black">Sales this month</p>
          </CardContent>
        </Card>
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
