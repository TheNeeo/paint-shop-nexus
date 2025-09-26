import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Receipt, TrendingUp, Award } from "lucide-react";

export function CashReceiptSummary() {
  const summaryData = [
    {
      title: "Total Receipts This Month",
      value: "₹2,45,000",
      icon: Receipt,
      color: "#7DBE3C",
      bgColor: "rgba(125, 190, 60, 0.1)",
    },
    {
      title: "Total Cash Inflow",
      value: "₹4,78,500",
      icon: DollarSign,
      color: "#16583f",
      bgColor: "rgba(22, 88, 63, 0.1)",
    },
    {
      title: "No. of Receipts",
      value: "142",
      icon: TrendingUp,
      color: "#7DBE3C",
      bgColor: "rgba(125, 190, 60, 0.1)",
    },
    {
      title: "Highest Single Receipt",
      value: "₹85,000",
      icon: Award,
      color: "#16583f",
      bgColor: "rgba(22, 88, 63, 0.1)",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaryData.map((item, index) => (
        <Card 
          key={index} 
          className="border-0 shadow-lg"
          style={{ 
            backgroundColor: item.bgColor,
            borderLeft: `4px solid ${item.color}`
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle 
              className="text-sm font-medium"
              style={{ color: item.color }}
            >
              {item.title}
            </CardTitle>
            <item.icon 
              className="h-5 w-5" 
              style={{ color: item.color }}
            />
          </CardHeader>
          <CardContent>
            <div 
              className="text-2xl font-bold"
              style={{ color: item.color }}
            >
              {item.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}