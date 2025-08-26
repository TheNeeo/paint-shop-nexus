import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, FileText, TrendingUp, Target } from "lucide-react";

export const ExpenseActivitySummary = () => {
  const summaryCards = [
    {
      title: "Total Expenses (This Month)",
      value: "₹45,250",
      icon: DollarSign,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      textColor: "text-green-800"
    },
    {
      title: "No. of Expense Entries", 
      value: "124",
      icon: FileText,
      bgColor: "bg-green-100",
      iconColor: "text-green-700",
      textColor: "text-green-900"
    },
    {
      title: "Most Frequent Expense Type",
      value: "Transport",
      icon: TrendingUp,
      bgColor: "bg-green-50",
      iconColor: "text-green-600", 
      textColor: "text-green-800"
    },
    {
      title: "Highest Single Expense",
      value: "₹8,500",
      icon: Target,
      bgColor: "bg-green-100",
      iconColor: "text-green-700",
      textColor: "text-green-900"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaryCards.map((card, index) => (
        <Card key={index} className={`${card.bgColor} border-green-200 hover:shadow-md transition-shadow`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${card.textColor}`}>
              {card.title}
            </CardTitle>
            <card.icon className={`h-5 w-5 ${card.iconColor}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.textColor}`}>
              {card.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};