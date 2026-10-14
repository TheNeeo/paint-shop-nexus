
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  DollarSign,
  AlertTriangle,
  Clock,
} from "lucide-react";

interface ProductFooterProps {
  totalProducts: number;
  totalValue: number;
  lowStockCount: number;
}

// Animated counter component
function AnimatedCounter({ target, duration = 1000, prefix = "" }: { target: number; duration?: number; prefix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{prefix}{typeof target === 'number' && target % 1 !== 0 ? count.toFixed(2) : count}</span>;
}

export function ProductFooter({
  totalProducts,
  totalValue,
  lowStockCount,
}: ProductFooterProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky bottom-0 z-20 mt-6"
    >
      <Card className="bg-gradient-to-r from-green-100 via-emerald-50 to-teal-100 border-2 border-green-300 shadow-2xl backdrop-blur-sm">
        <div className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-8 flex-wrap">
              <motion.div 
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-xs text-gray-600 block">Total Products</span>
                  <Badge className="bg-green-600 text-white border-none text-lg font-bold px-3 py-1 mt-1">
                    <AnimatedCounter target={totalProducts} duration={1500} />
                  </Badge>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-xs text-gray-600 block">Stock Value</span>
                  <Badge className="bg-blue-600 text-white border-none text-lg font-bold px-3 py-1 mt-1">
                    ₹<AnimatedCounter target={totalValue} duration={2000} />
                  </Badge>
                </div>
              </motion.div>

              {lowStockCount > 0 && (
                <motion.div 
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  animate={{ 
                    y: [0, -5, 0],
                  }}
                  style={{
                    transition: "all 0.5s ease-in-out",
                    animation: "bounce 2s infinite"
                  }}
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg animate-pulse">
                    <AlertTriangle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-600 block">Low Stock Alert</span>
                    <Badge className="bg-orange-600 text-white border-none text-lg font-bold px-3 py-1 mt-1">
                      <AnimatedCounter target={lowStockCount} duration={1000} />
                    </Badge>
                  </div>
                </motion.div>
              )}
            </div>

            <motion.div 
              className="flex items-center gap-2 text-sm text-gray-700 bg-white/50 px-4 py-2 rounded-full shadow-inner"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Clock className="h-4 w-4 text-green-600" />
              <span className="font-medium">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                {currentTime.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric'
                })}
              </span>
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
