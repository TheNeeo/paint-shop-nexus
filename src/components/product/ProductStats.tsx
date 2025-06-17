
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  DollarSign,
  AlertTriangle,
  Star,
  TrendingUp,
  Boxes,
} from "lucide-react";

interface ProductStatsProps {
  totalProducts: number;
  totalValue: number;
  lowStockCount: number;
  featuredCount: number;
}

export function ProductStats({
  totalProducts,
  totalValue,
  lowStockCount,
  featuredCount,
}: ProductStatsProps) {
  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-gradient-to-br from-green-100 to-green-200",
      borderColor: "border-green-300",
      cardBg: "bg-gradient-to-br from-green-50 to-white",
    },
    {
      title: "Total Inventory Value",
      value: `$${totalValue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-100 to-blue-200",
      borderColor: "border-blue-300",
      cardBg: "bg-gradient-to-br from-blue-50 to-white",
    },
    {
      title: "Low Stock Items",
      value: lowStockCount,
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-gradient-to-br from-orange-100 to-orange-200",
      borderColor: "border-orange-300",
      cardBg: "bg-gradient-to-br from-orange-50 to-white",
      badge: lowStockCount > 0 ? "Attention" : "Good",
      badgeColor: lowStockCount > 0 ? "bg-orange-100 text-orange-800 border-orange-200" : "bg-green-100 text-green-800 border-green-200",
    },
    {
      title: "Featured Products",
      value: featuredCount,
      icon: Star,
      color: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-100 to-purple-200",
      borderColor: "border-purple-300",
      cardBg: "bg-gradient-to-br from-purple-50 to-white",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className={`shadow-lg border-2 ${stat.borderColor} ${stat.cardBg} hover:shadow-xl transition-all duration-300 hover:scale-105`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700">
              {stat.title}
            </CardTitle>
            <div className={`h-10 w-10 rounded-xl ${stat.bgColor} flex items-center justify-center shadow-md`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              {stat.badge && (
                <Badge className={`text-xs font-medium ${stat.badgeColor} border`}>
                  {stat.badge}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
