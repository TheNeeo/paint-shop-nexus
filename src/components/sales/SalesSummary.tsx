
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
            <CardTitle className="text-sm font-medium text-blue-800">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{summaryData.totalSales}</div>
            <p className="text-xs text-blue-600">All time sales count</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">₹{summaryData.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-600">Total revenue earned</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{summaryData.thisWeekSales}</div>
            <p className="text-xs text-purple-600">Sales this week</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">This Month</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{summaryData.thisMonthSales}</div>
            <p className="text-xs text-orange-600">Sales this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <CardHeader>
            <CardTitle className="text-indigo-800">Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summaryData.topSellingProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-indigo-700">{index + 1}</span>
                    </div>
                    <span className="font-medium text-indigo-900">{product.name}</span>
                  </div>
                  <span className="text-sm text-indigo-600">{product.sales} sales</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer Information */}
        <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
          <CardHeader>
            <CardTitle className="text-teal-800">System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-teal-600">Total Sales Count:</span>
                <span className="font-medium text-teal-900">{summaryData.totalSales}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-teal-600">Total Revenue:</span>
                <span className="font-medium text-teal-900">₹{summaryData.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-teal-600">Last Updated:</span>
                <span className="font-medium text-sm text-teal-900">{summaryData.lastUpdated}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
