import React from "react";
import { StatsCard } from "./StatsCard";
import { LucideIcon } from "lucide-react";

interface StatItem {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: "green" | "blue" | "orange" | "purple" | "red" | "teal" | "coral";
  badge?: string;
  badgeVariant?: "success" | "warning" | "danger";
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

interface StatsGridProps {
  stats: StatItem[];
  columns?: 2 | 3 | 4;
}

export function StatsGrid({ stats, columns = 4 }: StatsGridProps) {
  const gridClasses = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-6`}>
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          index={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          badge={stat.badge}
          badgeVariant={stat.badgeVariant}
          trend={stat.trend}
        />
      ))}
    </div>
  );
}
