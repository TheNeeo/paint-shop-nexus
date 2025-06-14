
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Filter,
  ChevronDown,
  SortAsc,
  Star,
  List,
  Grid3X3,
} from "lucide-react";

interface ProductFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  stockFilter: string;
  setStockFilter: (status: string) => void;
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
    <Card className="shadow-sm border-slate-200 bg-white">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center flex-1">
            <div className="relative min-w-[300px] flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search products by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-slate-200 hover:bg-slate-50 text-slate-700">
                  <Filter className="h-4 w-4 mr-2" />
                  Category: {categoryFilter}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border-slate-200">
                {categories.map((category) => (
                  <DropdownMenuItem key={category} onClick={() => setCategoryFilter(category)} className="hover:bg-slate-50">
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-slate-200 hover:bg-slate-50 text-slate-700">
                  Stock: {stockFilter}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border-slate-200">
                {stockStatuses.map((status) => (
                  <DropdownMenuItem key={status} onClick={() => setStockFilter(status)} className="hover:bg-slate-50">
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-slate-200 hover:bg-slate-50 text-slate-700">
                  <SortAsc className="h-4 w-4 mr-2" />
                  Sort: {sortOptions.find(opt => opt.value === sortBy)?.label}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border-slate-200">
                {sortOptions.map((option) => (
                  <DropdownMenuItem key={option.value} onClick={() => setSortBy(option.value)} className="hover:bg-slate-50">
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex gap-2 items-center">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={showFeaturedOnly}
                onCheckedChange={setShowFeaturedOnly}
              />
              <label
                htmlFor="featured"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1 text-slate-700"
              >
                <Star className="h-4 w-4" />
                Featured Only
              </label>
            </div>
            
            <div className="flex border border-slate-200 rounded-md">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="rounded-r-none"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-l-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
