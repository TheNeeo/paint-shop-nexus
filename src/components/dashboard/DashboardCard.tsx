
import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  gradient?: string;
}

export function DashboardCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
  gradient = "from-primary/10 to-primary/5"
}: DashboardCardProps) {
  return (
    <div className={cn(
      "paint-card paint-shimmer group hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
      className
    )}>
      <div className={cn("absolute inset-0 rounded-lg bg-gradient-to-br opacity-50", gradient)} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-foreground/80">{title}</h3>
          </div>
          
          {trend && (
            <div className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              trend.isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              {trend.isPositive ? "+" : ""}{trend.value}%
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="text-3xl font-bold text-foreground">{value}</div>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
