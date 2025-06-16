
import React from "react";
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
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
} from "lucide-react";

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
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-4">
      {/* Search and Filters Row */}
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-300 focus:border-green-500 focus:ring-green-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] bg-green-100 border-green-300 text-green-800 font-medium">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger className="w-[150px] bg-green-100 border-green-300 text-green-800 font-medium">
              <SelectValue placeholder="Stock" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {stockStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px] bg-green-100 border-green-300 text-green-800 font-medium">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex bg-green-100 rounded-lg p-1">
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("table")}
            className={viewMode === "table" ? "bg-green-600 text-white" : "text-green-700 hover:bg-green-200"}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-green-600 text-white" : "text-green-700 hover:bg-green-200"}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Featured Filter */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="featured"
          checked={showFeaturedOnly}
          onCheckedChange={setShowFeaturedOnly}
          className="border-green-500 data-[state=checked]:bg-green-600"
        />
        <label htmlFor="featured" className="flex items-center text-sm font-medium text-gray-700 cursor-pointer">
          <Star className="h-4 w-4 mr-1 text-green-500" />
          Featured Only
        </label>
        {showFeaturedOnly && (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Active
          </Badge>
        )}
      </div>
    </div>
  );
}
