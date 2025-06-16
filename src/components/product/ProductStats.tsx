
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
      bgColor: "bg-green-100",
      borderColor: "border-green-200",
    },
    {
      title: "Total Inventory Value",
      value: `$${totalValue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-200",
    },
    {
      title: "Low Stock Items",
      value: lowStockCount,
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      borderColor: "border-orange-200",
      badge: lowStockCount > 0 ? "Attention" : "Good",
      badgeColor: lowStockCount > 0 ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800",
    },
    {
      title: "Featured Products",
      value: featuredCount,
      icon: Star,
      color: "text-green-600",
      bgColor: "bg-green-100",
      borderColor: "border-green-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className={`shadow-sm border ${stat.borderColor} hover:shadow-md transition-shadow`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`h-8 w-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              {stat.badge && (
                <Badge className={`text-xs ${stat.badgeColor}`}>
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
