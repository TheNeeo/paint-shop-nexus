import React from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

interface PageContainerProps {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  gradientFrom?: string;
  gradientVia?: string;
  gradientTo?: string;
}

export function PageContainer({
  children,
  isLoading = false,
  loadingText = "Loading...",
  gradientFrom = "from-green-50",
  gradientVia = "via-white",
  gradientTo = "to-blue-50",
}: PageContainerProps) {
  if (isLoading) {
    return (
      <div className={`w-full bg-gradient-to-br ${gradientFrom} ${gradientVia} ${gradientTo} min-h-screen p-6`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center min-h-[400px]"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="h-12 w-12 text-green-600 mx-auto mb-4" />
            </motion.div>
            <p className="text-gray-600">{loadingText}</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`w-full bg-gradient-to-br ${gradientFrom} ${gradientVia} ${gradientTo} min-h-screen p-6`}
    >
      {children}
    </motion.div>
  );
}
