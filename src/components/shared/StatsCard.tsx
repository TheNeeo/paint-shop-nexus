import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

const colorConfig = {
  green: {
    icon: "text-green-600",
    iconBg: "bg-gradient-to-br from-green-100 to-green-200",
    border: "border-green-300",
    cardBg: "bg-gradient-to-br from-green-50 to-white",
    glow: "shadow-green-200/50",
    value: "text-green-600",
  },
  blue: {
    icon: "text-blue-600",
    iconBg: "bg-gradient-to-br from-blue-100 to-blue-200",
    border: "border-blue-300",
    cardBg: "bg-gradient-to-br from-blue-50 to-white",
    glow: "shadow-blue-200/50",
    value: "text-blue-600",
  },
  orange: {
    icon: "text-orange-600",
    iconBg: "bg-gradient-to-br from-orange-100 to-orange-200",
    border: "border-orange-300",
    cardBg: "bg-gradient-to-br from-orange-50 to-white",
    glow: "shadow-orange-200/50",
    value: "text-orange-600",
  },
  purple: {
    icon: "text-purple-600",
    iconBg: "bg-gradient-to-br from-purple-100 to-purple-200",
    border: "border-purple-300",
    cardBg: "bg-gradient-to-br from-purple-50 to-white",
    glow: "shadow-purple-200/50",
    value: "text-purple-600",
  },
  red: {
    icon: "text-red-600",
    iconBg: "bg-gradient-to-br from-red-100 to-red-200",
    border: "border-red-300",
    cardBg: "bg-gradient-to-br from-red-50 to-white",
    glow: "shadow-red-200/50",
    value: "text-red-600",
  },
  teal: {
    icon: "text-teal-600",
    iconBg: "bg-gradient-to-br from-teal-100 to-teal-200",
    border: "border-teal-300",
    cardBg: "bg-gradient-to-br from-teal-50 to-white",
    glow: "shadow-teal-200/50",
    value: "text-teal-600",
  },
  coral: {
    icon: "text-rose-600",
    iconBg: "bg-gradient-to-br from-rose-100 to-rose-200",
    border: "border-rose-300",
    cardBg: "bg-gradient-to-br from-rose-50 to-white",
    glow: "shadow-rose-200/50",
    value: "text-rose-600",
  },
};

const badgeConfig = {
  success: "bg-green-100 text-green-800 border-green-200",
  warning: "bg-orange-100 text-orange-800 border-orange-200",
  danger: "bg-red-100 text-red-800 border-red-200",
};

export function StatsCard({
  title,
  value,
  icon: Icon,
  index = 0,
  color = "green",
  badge,
  badgeVariant = "success",
  trend,
}: StatsCardProps) {
  const colors = colorConfig[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <Card
        className={`shadow-lg border-2 ${colors.border} ${colors.cardBg} hover:shadow-2xl hover:${colors.glow} transition-all duration-300 relative overflow-hidden group`}
      >
        {/* Animated gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
          <CardTitle className="text-sm font-semibold text-gray-700">{title}</CardTitle>
          <motion.div
            className={`h-12 w-12 rounded-xl ${colors.iconBg} flex items-center justify-center shadow-md`}
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <Icon className={`h-6 w-6 ${colors.icon}`} />
          </motion.div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex items-center justify-between">
            <motion.div
              className={`text-3xl font-bold ${colors.value}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
            >
              {value}
            </motion.div>
            {badge && (
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.1 + 0.4, type: "spring" }}
              >
                <Badge className={`text-xs font-medium ${badgeConfig[badgeVariant]} border`}>
                  {badge}
                </Badge>
              </motion.div>
            )}
          </div>
          {trend && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              className={`text-xs mt-2 ${trend.isPositive ? "text-green-600" : "text-red-600"}`}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}% from last period
            </motion.p>
          )}
        </CardContent>

        {/* Sparkle effect on hover */}
        <motion.div
          className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100"
          animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
        />
      </Card>
    </motion.div>
  );
}
