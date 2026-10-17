import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home, RefreshCw, Download, Plus, LucideIcon } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  isCurrentPage?: boolean;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  breadcrumbs: BreadcrumbItem[];
  itemCount?: number;
  itemLabel?: string;
  gradientFrom?: string;
  gradientVia?: string;
  gradientTo?: string;
  accentColor?: string;
  onRefresh?: () => void;
  onExport?: () => void;
  onAdd?: () => void;
  addButtonLabel?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle = "Neo Color Factory ~ The Colors of Your Dreams 🎨",
  icon: Icon,
  breadcrumbs,
  itemCount,
  itemLabel = "items",
  gradientFrom = "from-green-100",
  gradientVia = "via-emerald-50",
  gradientTo = "to-teal-50",
  accentColor = "green",
  onRefresh,
  onExport,
  onAdd,
  addButtonLabel = "Add New",
  children,
}: PageHeaderProps) {
  const colorClasses = {
    green: {
      text: "text-green-900",
      textLight: "text-green-700",
      textMedium: "text-green-800",
      border: "border-green-200",
      iconText: "text-green-600",
      badge: "from-green-600 to-teal-600",
      buttonOutline: "border-green-300 text-green-700 hover:border-green-400 hover:bg-green-50",
      buttonPrimary: "from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-green-400",
      blob1: "bg-green-400",
      blob2: "bg-teal-400",
    },
    blue: {
      text: "text-blue-900",
      textLight: "text-blue-700",
      textMedium: "text-blue-800",
      border: "border-blue-200",
      iconText: "text-blue-600",
      badge: "from-blue-600 to-cyan-600",
      buttonOutline: "border-blue-300 text-blue-700 hover:border-blue-400 hover:bg-blue-50",
      buttonPrimary: "from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-blue-400",
      blob1: "bg-blue-400",
      blob2: "bg-cyan-400",
    },
    purple: {
      text: "text-purple-900",
      textLight: "text-purple-700",
      textMedium: "text-purple-800",
      border: "border-purple-200",
      iconText: "text-purple-600",
      badge: "from-purple-600 to-pink-600",
      buttonOutline: "border-purple-300 text-purple-700 hover:border-purple-400 hover:bg-purple-50",
      buttonPrimary: "from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-purple-400",
      blob1: "bg-purple-400",
      blob2: "bg-pink-400",
    },
    orange: {
      text: "text-orange-900",
      textLight: "text-orange-700",
      textMedium: "text-orange-800",
      border: "border-orange-200",
      iconText: "text-orange-600",
      badge: "from-orange-600 to-amber-600",
      buttonOutline: "border-orange-300 text-orange-700 hover:border-orange-400 hover:bg-orange-50",
      buttonPrimary: "from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 border-orange-400",
      blob1: "bg-orange-400",
      blob2: "bg-amber-400",
    },
    coral: {
      text: "text-rose-900",
      textLight: "text-rose-700",
      textMedium: "text-rose-800",
      border: "border-rose-200",
      iconText: "text-rose-600",
      badge: "from-rose-600 to-pink-600",
      buttonOutline: "border-rose-300 text-rose-700 hover:border-rose-400 hover:bg-rose-50",
      buttonPrimary: "from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 border-rose-400",
      blob1: "bg-rose-400",
      blob2: "bg-pink-400",
    },
  };

  const colors = colorClasses[accentColor as keyof typeof colorClasses] || colorClasses.green;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-r ${gradientFrom} ${gradientVia} ${gradientTo} rounded-3xl p-6 mb-8 shadow-lg border-2 ${colors.border} relative overflow-hidden`}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className={`absolute top-0 left-0 w-40 h-40 ${colors.blob1} rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-0 right-0 w-40 h-40 ${colors.blob2} rounded-full blur-3xl animate-pulse delay-1000`}></div>
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="space-y-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Home className={`h-4 w-4 ${colors.iconText}`} />
              </BreadcrumbItem>
              {breadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className={item.isCurrentPage ? `${colors.textMedium} font-semibold` : `${colors.textLight} font-medium`}>
                      {item.label}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className={`text-2xl sm:text-4xl font-bold ${colors.text} flex items-center gap-3`}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Icon className={`h-8 w-8 sm:h-10 sm:w-10 ${colors.iconText}`} />
              </motion.div>
              {title}
            </motion.h1>
            {itemCount !== undefined && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              >
                <Badge className={`bg-gradient-to-r ${colors.badge} text-white border-none text-sm px-4 py-1 shadow-md`}>
                  {itemCount} {itemLabel}
                </Badge>
              </motion.div>
            )}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className={`text-sm ${colors.textLight} italic`}
          >
            {subtitle}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-2"
        >
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className={`w-full sm:w-auto bg-white ${colors.buttonOutline} transition-all duration-300 shadow-sm hover:shadow-md group`}
            >
              <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              Refresh
            </Button>
          )}
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 border-blue-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
          {onAdd && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onAdd}
                className={`bg-gradient-to-r ${colors.buttonPrimary} shadow-lg hover:shadow-xl w-full sm:w-auto border-2 transition-all duration-300 relative overflow-hidden group text-white`}
              >
                <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                <Plus className="h-4 w-4 mr-2 relative z-10" />
                <span className="relative z-10">{addButtonLabel}</span>
              </Button>
            </motion.div>
          )}
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
}
