import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, Grid3X3, List, LucideIcon } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface SelectFilter {
  type: "select";
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  icon?: LucideIcon;
}

interface CheckboxFilter {
  type: "checkbox";
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: LucideIcon;
  activeBadge?: string;
}

type FilterConfig = SelectFilter | CheckboxFilter;

interface PageFiltersProps {
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  viewMode?: "table" | "grid";
  onViewModeChange?: (mode: "table" | "grid") => void;
  showViewToggle?: boolean;
  accentColor?: "green" | "blue" | "purple" | "orange" | "coral";
  className?: string;
}

const colorConfig = {
  green: {
    selectBg: "bg-green-100",
    selectBorder: "border-green-300",
    selectText: "text-green-800",
    checkboxBorder: "border-green-500",
    checkboxChecked: "data-[state=checked]:bg-green-600",
    toggleBg: "bg-green-100",
    toggleActive: "bg-green-600 text-white",
    toggleInactive: "text-green-700 hover:bg-green-200",
    focusRing: "focus:border-green-500 focus:ring-green-500",
    badge: "bg-green-100 text-green-800 border-green-200",
    iconColor: "text-green-500",
  },
  blue: {
    selectBg: "bg-blue-100",
    selectBorder: "border-blue-300",
    selectText: "text-blue-800",
    checkboxBorder: "border-blue-500",
    checkboxChecked: "data-[state=checked]:bg-blue-600",
    toggleBg: "bg-blue-100",
    toggleActive: "bg-blue-600 text-white",
    toggleInactive: "text-blue-700 hover:bg-blue-200",
    focusRing: "focus:border-blue-500 focus:ring-blue-500",
    badge: "bg-blue-100 text-blue-800 border-blue-200",
    iconColor: "text-blue-500",
  },
  purple: {
    selectBg: "bg-purple-100",
    selectBorder: "border-purple-300",
    selectText: "text-purple-800",
    checkboxBorder: "border-purple-500",
    checkboxChecked: "data-[state=checked]:bg-purple-600",
    toggleBg: "bg-purple-100",
    toggleActive: "bg-purple-600 text-white",
    toggleInactive: "text-purple-700 hover:bg-purple-200",
    focusRing: "focus:border-purple-500 focus:ring-purple-500",
    badge: "bg-purple-100 text-purple-800 border-purple-200",
    iconColor: "text-purple-500",
  },
  orange: {
    selectBg: "bg-orange-100",
    selectBorder: "border-orange-300",
    selectText: "text-orange-800",
    checkboxBorder: "border-orange-500",
    checkboxChecked: "data-[state=checked]:bg-orange-600",
    toggleBg: "bg-orange-100",
    toggleActive: "bg-orange-600 text-white",
    toggleInactive: "text-orange-700 hover:bg-orange-200",
    focusRing: "focus:border-orange-500 focus:ring-orange-500",
    badge: "bg-orange-100 text-orange-800 border-orange-200",
    iconColor: "text-orange-500",
  },
  coral: {
    selectBg: "bg-rose-100",
    selectBorder: "border-rose-300",
    selectText: "text-rose-800",
    checkboxBorder: "border-rose-500",
    checkboxChecked: "data-[state=checked]:bg-rose-600",
    toggleBg: "bg-rose-100",
    toggleActive: "bg-rose-600 text-white",
    toggleInactive: "text-rose-700 hover:bg-rose-200",
    focusRing: "focus:border-rose-500 focus:ring-rose-500",
    badge: "bg-rose-100 text-rose-800 border-rose-200",
    iconColor: "text-rose-500",
  },
};

export function PageFilters({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  viewMode,
  onViewModeChange,
  showViewToggle = false,
  accentColor = "green",
  className = "",
}: PageFiltersProps) {
  const colors = colorConfig[accentColor];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={`bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-4 ${className}`}
    >
      {/* Search and Filters Row */}
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        {/* Search */}
        {onSearchChange && (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`pl-10 bg-white border-gray-300 ${colors.focusRing}`}
            />
          </div>
        )}

        {/* Select Filters */}
        <div className="flex flex-wrap gap-2">
          {filters
            .filter((f): f is SelectFilter => f.type === "select")
            .map((filter, index) => (
              <Select key={index} value={filter.value} onValueChange={filter.onChange}>
                <SelectTrigger
                  className={`w-[180px] ${colors.selectBg} ${colors.selectBorder} ${colors.selectText} font-medium`}
                >
                  {filter.icon && <filter.icon className="h-4 w-4 mr-2" />}
                  <SelectValue placeholder={filter.placeholder} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
        </div>

        {/* View Mode Toggle */}
        {showViewToggle && onViewModeChange && (
          <div className={`flex ${colors.toggleBg} rounded-lg p-1`}>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("table")}
              className={viewMode === "table" ? colors.toggleActive : colors.toggleInactive}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className={viewMode === "grid" ? colors.toggleActive : colors.toggleInactive}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Checkbox Filters */}
      {filters.filter((f): f is CheckboxFilter => f.type === "checkbox").length > 0 && (
        <div className="flex flex-wrap items-center gap-4">
          {filters
            .filter((f): f is CheckboxFilter => f.type === "checkbox")
            .map((filter, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`filter-${index}`}
                  checked={filter.checked}
                  onCheckedChange={filter.onChange}
                  className={`${colors.checkboxBorder} ${colors.checkboxChecked}`}
                />
                <label
                  htmlFor={`filter-${index}`}
                  className="flex items-center text-sm font-medium text-gray-700 cursor-pointer"
                >
                  {filter.icon && <filter.icon className={`h-4 w-4 mr-1 ${colors.iconColor}`} />}
                  {filter.label}
                </label>
                {filter.checked && filter.activeBadge && (
                  <Badge className={`${colors.badge}`}>{filter.activeBadge}</Badge>
                )}
              </div>
            ))}
        </div>
      )}
    </motion.div>
  );
}
