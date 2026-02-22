import React from "react";
import { Filter, Star } from "lucide-react";
import { PageFilters } from "@/components/shared/PageFilters";

interface ProductFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  stockFilter: string;
  setStockFilter: (stock: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  showFeaturedOnly: boolean;
  setShowFeaturedOnly: (featured: boolean) => void;
  viewMode: "table" | "grid";
  setViewMode: (mode: "table" | "grid") => void;
  categories: string[];
  stockStatuses: string[];
  sortOptions: { value: string; label: string }[];
}

export function ProductFilters({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  stockFilter,
  setStockFilter,
  sortBy,
  setSortBy,
  showFeaturedOnly,
  setShowFeaturedOnly,
  viewMode,
  setViewMode,
  categories,
  stockStatuses,
  sortOptions,
}: ProductFiltersProps) {
  return (
    <PageFilters
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Search products..."
      accentColor="green"
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      showViewToggle={true}
      filters={[
        {
          type: "select",
          placeholder: "Category",
          value: categoryFilter,
          onChange: setCategoryFilter,
          options: categories.map((c) => ({ value: c, label: c })),
          icon: Filter,
        },
        {
          type: "select",
          placeholder: "Stock",
          value: stockFilter,
          onChange: setStockFilter,
          options: stockStatuses.map((s) => ({ value: s, label: s })),
        },
        {
          type: "select",
          placeholder: "Sort by",
          value: sortBy,
          onChange: setSortBy,
          options: sortOptions,
        },
        {
          type: "checkbox",
          label: "Featured Only",
          checked: showFeaturedOnly,
          onChange: setShowFeaturedOnly,
          icon: Star,
          activeBadge: "Active",
        },
      ]}
    />
  );
}
