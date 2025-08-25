import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, CheckCircle, Activity } from "lucide-react";

export function VendorSummaryCards() {
  const summaryData = [
    {
      title: "Total Vendors",
      value: "125",
      icon: Users,
      change: "+12 this month",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Total Payables",
      value: "₹2,45,000",
      icon: CreditCard,
      change: "₹45K pending",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Active Vendors",
      value: "98",
      icon: CheckCircle,
      change: "78% active rate",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Recent Transactions",
      value: "42",
      icon: Activity,
      change: "Last 30 days",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaryData.map((card, index) => (
        <Card key={index} className="border-gray-200 hover:shadow-md transition-shadow">
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
}