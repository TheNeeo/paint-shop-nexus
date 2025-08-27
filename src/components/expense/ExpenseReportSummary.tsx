import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, FileText, BarChart } from "lucide-react";

export const ExpenseReportSummary = () => {
  const summaryCards = [
    {
      title: "Total Expenses",
      value: "₹1,25,450",
      icon: DollarSign,
      bgColor: "bg-turquoise-50",
      iconColor: "text-turquoise-600",
      textColor: "text-turquoise-800"
    },
    {
      title: "Highest Single Expense", 
      value: "₹15,500",
      icon: TrendingUp,
      bgColor: "bg-turquoise-100",
      iconColor: "text-turquoise-700",
      textColor: "text-turquoise-900"
    },
    {
      title: "No. of Expense Entries",
      value: "248",
      icon: FileText,
      bgColor: "bg-turquoise-50",
      iconColor: "text-turquoise-600", 
      textColor: "text-turquoise-800"
    },
    {
      title: "Average Daily Expense",
      value: "₹4,150",
      icon: BarChart,
      bgColor: "bg-turquoise-100",
      iconColor: "text-turquoise-700",
      textColor: "text-turquoise-900"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaryCards.map((card, index) => (
        <Card key={index} className={`${card.bgColor} border-turquoise-200 hover:shadow-md transition-shadow`}>
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