import React from "react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  index?: number;
  color?: "green" | "blue" | "orange" | "purple" | "red" | "teal" | "coral";
  badge?: string;
  badgeVariant?: "success" | "warning" | "danger";
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const gradientConfig = {
  green: "from-emerald-400 via-green-500 to-teal-500",
  blue: "from-blue-400 via-indigo-500 to-purple-500",
  orange: "from-orange-400 via-amber-500 to-yellow-500",
  purple: "from-purple-400 via-violet-500 to-indigo-500",
  red: "from-red-400 via-rose-500 to-pink-500",
  teal: "from-teal-400 via-cyan-500 to-blue-500",
  coral: "from-rose-400 via-pink-500 to-fuchsia-500",
};

export function StatsCard({
  title,
  value,
  icon: Icon,
  color = "green",
}: StatsCardProps) {
  const gradient = gradientConfig[color];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
    >
      <div className="relative z-10">
        <h3 className="text-lg font-semibold text-white/90 mb-1">
          {title}
        </h3>
        <p className="text-2xl font-bold text-white">
          {value}
        </p>
      </div>
      
      <div className="absolute right-4 bottom-4 opacity-80">
        <Icon className="h-16 w-16 text-white/40" strokeWidth={1.5} />
      </div>
    </div>
  );
}
