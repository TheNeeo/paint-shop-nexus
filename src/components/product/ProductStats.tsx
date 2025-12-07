
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  DollarSign,
  AlertTriangle,
  Star,
  TrendingUp,
  Boxes,
} from "lucide-react";

interface ProductStatsProps {
  totalProducts: number;
  totalValue: number;
  lowStockCount: number;
  featuredCount: number;
}

export function ProductStats({
  totalProducts,
  totalValue,
  lowStockCount,
  featuredCount,
}: ProductStatsProps) {
  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-gradient-to-br from-green-100 to-green-200",
      borderColor: "border-green-300",
      cardBg: "bg-gradient-to-br from-green-50 to-white",
      glowColor: "shadow-green-200/50",
    },
    {
      title: "Total Inventory Value",
      value: `₹${totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-100 to-blue-200",
      borderColor: "border-blue-300",
      cardBg: "bg-gradient-to-br from-blue-50 to-white",
      glowColor: "shadow-blue-200/50",
    },
    {
      title: "Low Stock Items",
      value: lowStockCount,
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-gradient-to-br from-orange-100 to-orange-200",
      borderColor: "border-orange-300",
      cardBg: "bg-gradient-to-br from-orange-50 to-white",
      badge: lowStockCount > 0 ? "Attention" : "Good",
      badgeColor: lowStockCount > 0 ? "bg-orange-100 text-orange-800 border-orange-200" : "bg-green-100 text-green-800 border-green-200",
      glowColor: "shadow-orange-200/50",
    },
    {
      title: "Featured Products",
      value: featuredCount,
      icon: Star,
      color: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-100 to-purple-200",
      borderColor: "border-purple-300",
      cardBg: "bg-gradient-to-br from-purple-50 to-white",
      glowColor: "shadow-purple-200/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ y: -8, transition: { duration: 0.2 } }}
        >
          <Card className={`shadow-lg border-2 ${stat.borderColor} ${stat.cardBg} hover:shadow-2xl hover:${stat.glowColor} transition-all duration-300 relative overflow-hidden group`}>
            {/* Animated gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700">
                {stat.title}
              </CardTitle>
              <motion.div 
                className={`h-12 w-12 rounded-xl ${stat.bgColor} flex items-center justify-center shadow-md`}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </motion.div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center justify-between">
                <motion.div 
                  className={`text-3xl font-bold ${stat.color}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                >
                  {stat.value}
                </motion.div>
                {stat.badge && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.1 + 0.4, type: "spring" }}
                  >
                    <Badge className={`text-xs font-medium ${stat.badgeColor} border`}>
                      {stat.badge}
                    </Badge>
                  </motion.div>
                )}
              </div>
            </CardContent>
            
            {/* Sparkle effect on hover */}
            <motion.div
              className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100"
              animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
            />
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
