import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingCart, TrendingUp, CreditCard } from "lucide-react";
import type { VendorHistoryData } from "@/pages/VendorHistory";

interface VendorHistorySummaryProps {
  vendors: VendorHistoryData[];
}

export const VendorHistorySummary: React.FC<VendorHistorySummaryProps> = ({ vendors }) => {
  const totalVendors = vendors.length;
  const totalPurchases = vendors.reduce((sum, vendor) => sum + vendor.totalAmount, 0);
  const avgPurchaseAmount = totalPurchases / totalVendors || 0;
  const totalOutstanding = vendors.reduce((sum, vendor) => sum + vendor.outstanding, 0);

  const summaryData = [
    {
      title: "Total Vendors",
      value: totalVendors.toString(),
      icon: Users,
      change: `${vendors.filter(v => v.status === "Active").length} active`,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Purchases",
      value: `₹${totalPurchases.toLocaleString()}`,
      icon: ShoppingCart,
      change: "All time purchases",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Average Purchase",
      value: `₹${avgPurchaseAmount.toFixed(0)}`,
      icon: TrendingUp,
      change: "Per vendor average",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Outstanding Payables",
      value: `₹${totalOutstanding.toLocaleString()}`,
      icon: CreditCard,
      change: `${vendors.filter(v => v.outstanding > 0).length} vendors pending`,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaryData.map((card, index) => (
        <Card key={index} className="border-blue-200 hover:shadow-md transition-shadow bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {card.value}
            </div>
            <p className="text-xs text-gray-500">
              {card.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};