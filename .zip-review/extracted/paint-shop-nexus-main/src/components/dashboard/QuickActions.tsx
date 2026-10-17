
import React from "react";
import { Plus, ShoppingCart, Package, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const quickActions = [
  {
    label: "New Sale",
    icon: ShoppingCart,
    gradient: "from-green-500 to-green-600",
    hoverGradient: "hover:from-green-600 hover:to-green-700"
  },
  {
    label: "Add Product",
    icon: Plus,
    gradient: "from-blue-500 to-blue-600",
    hoverGradient: "hover:from-blue-600 hover:to-blue-700"
  },
  {
    label: "New Purchase",
    icon: Package,
    gradient: "from-purple-500 to-purple-600",
    hoverGradient: "hover:from-purple-600 hover:to-purple-700"
  },
  {
    label: "Generate Report",
    icon: FileText,
    gradient: "from-orange-500 to-orange-600",
    hoverGradient: "hover:from-orange-600 hover:to-orange-700"
  },
  {
    label: "Add Customer",
    icon: Users,
    gradient: "from-teal-500 to-teal-600",
    hoverGradient: "hover:from-teal-600 hover:to-teal-700"
  }
];

export function QuickActions() {
  return (
    <div className="paint-card">
      <h3 className="text-lg font-semibold text-foreground mb-6">Quick Actions</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              className={`
                h-auto p-4 flex flex-col items-center space-y-2 
                bg-gradient-to-br ${action.gradient} 
                ${action.hoverGradient}
                text-white border-0 shadow-lg 
                hover:shadow-xl hover:scale-105 
                transition-all duration-300
                paint-shimmer
              `}
            >
              <Icon className="h-6 w-6" />
              <span className="text-sm font-medium text-center">{action.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
