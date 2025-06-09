
import React from "react";
import { ShoppingCart, Package, DollarSign, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: 'sale' | 'purchase' | 'expense' | 'customer';
  description: string;
  amount?: number;
  time: string;
}

const activities: Activity[] = [
  {
    id: "1",
    type: "sale",
    description: "Sale of Asian Paints Premium Emulsion - 20L",
    amount: 2500,
    time: "2 minutes ago"
  },
  {
    id: "2",
    type: "purchase",
    description: "Purchase of Berger Paint Stock - 50 units",
    amount: 15000,
    time: "15 minutes ago"
  },
  {
    id: "3",
    type: "customer",
    description: "New customer registration - John Doe",
    time: "1 hour ago"
  },
  {
    id: "4",
    type: "expense",
    description: "Store maintenance and cleaning",
    amount: 800,
    time: "2 hours ago"
  },
  {
    id: "5",
    type: "sale",
    description: "Sale of Dulux Paint Set - Multiple colors",
    amount: 4200,
    time: "3 hours ago"
  }
];

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'sale':
      return <ShoppingCart className="h-4 w-4 text-green-600" />;
    case 'purchase':
      return <Package className="h-4 w-4 text-blue-600" />;
    case 'expense':
      return <DollarSign className="h-4 w-4 text-red-600" />;
    case 'customer':
      return <Users className="h-4 w-4 text-purple-600" />;
    default:
      return <ShoppingCart className="h-4 w-4" />;
  }
};

const getActivityColor = (type: Activity['type']) => {
  switch (type) {
    case 'sale':
      return "border-l-green-500 bg-green-50";
    case 'purchase':
      return "border-l-blue-500 bg-blue-50";
    case 'expense':
      return "border-l-red-500 bg-red-50";
    case 'customer':
      return "border-l-purple-500 bg-purple-50";
    default:
      return "border-l-gray-500 bg-gray-50";
  }
};

export function RecentActivity() {
  return (
    <div className="paint-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <button className="text-sm text-primary hover:text-primary/80 font-medium">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={cn(
              "flex items-center space-x-4 p-3 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md",
              getActivityColor(activity.type)
            )}
          >
            <div className="flex-shrink-0">
              {getActivityIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {activity.description}
              </p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
            
            {activity.amount && (
              <div className="flex-shrink-0">
                <span className="text-sm font-semibold text-foreground">
                  ₹{activity.amount.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
