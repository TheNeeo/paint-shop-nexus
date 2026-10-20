
import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon3D } from "@/components/shared/Icon3D";

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
    <div className={cn("neo-stat paint-card group relative overflow-hidden rounded-2xl min-h-[174px] transition-all duration-300 hover:-translate-y-1", className)}>
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", gradient)} />
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-3 mb-4">
          <Icon3D label={title} icon={Icon} className="h-16 w-16" />
          {trend && <span className="text-xs font-semibold text-foreground">{trend.isPositive ? "+" : ""}{trend.value}%</span>}
        </div>
        <h3 className="text-sm font-semibold text-foreground/80 mb-1">{title}</h3>
        <div className="text-3xl font-bold text-foreground break-words">{value}</div>
        {description && <p className="text-sm text-muted-foreground mt-2">{description}</p>}
      </div>
    </div>
  );
}
