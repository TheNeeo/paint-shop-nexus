
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
  iconColor?: string;
}

export function DashboardCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
  gradient = "from-primary/10 to-primary/5",
  iconColor = "from-blue-400 to-blue-600"
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
            {/* 3D Colorful Icon */}
            <div className="relative">
              <div className={cn(
                "p-3 rounded-xl bg-gradient-to-br shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
                iconColor
              )}>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent"></div>
                <Icon className="h-7 w-7 text-white relative z-10 drop-shadow-sm" />
              </div>
              {/* 3D Shadow Effect */}
              <div className={cn(
                "absolute top-1 left-1 w-full h-full rounded-xl opacity-40 -z-10",
                iconColor.replace('to-', 'to-transparent from-')
              )}></div>
            </div>
            <h3 className="font-semibold text-foreground/80">{title}</h3>
          </div>
          
          {trend && (
            <div className={cn(
              "px-3 py-1 rounded-full text-xs font-medium shadow-sm",
              trend.isPositive 
                ? "bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200" 
                : "bg-gradient-to-r from-red-100 to-red-50 text-red-700 border border-red-200"
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
