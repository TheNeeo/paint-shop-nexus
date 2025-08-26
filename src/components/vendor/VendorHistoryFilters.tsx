import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import type { FilterType } from "@/pages/VendorHistory";

interface VendorHistoryFiltersProps {
  filters: FilterType;
  setFilters: React.Dispatch<React.SetStateAction<FilterType>>;
}

export const VendorHistoryFilters: React.FC<VendorHistoryFiltersProps> = ({
  filters,
  setFilters,
}) => {
  const clearFilters = () => {
    setFilters({
      search: "",
      dateRange: "",
      category: "",
      outstanding: "",
    });
  };

  return (
    <Card className="border-blue-200 bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="h-5 w-5 text-blue-600" />
          Search & Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Field */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by Name, Mobile, GST No..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-10 border-blue-200 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Date Range Filter */}
          <Select
            value={filters.dateRange}
            onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}
          >
            <SelectTrigger className="border-blue-200 focus:ring-blue-500 focus:border-blue-500">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent className="bg-white border-blue-200">
              <SelectItem value="last-7-days">Last 7 days</SelectItem>
              <SelectItem value="last-30-days">Last 30 days</SelectItem>
              <SelectItem value="last-3-months">Last 3 months</SelectItem>
              <SelectItem value="last-6-months">Last 6 months</SelectItem>
              <SelectItem value="last-year">Last year</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select
            value={filters.category}
            onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger className="border-blue-200 focus:ring-blue-500 focus:border-blue-500">
              <SelectValue placeholder="Vendor Category" />
            </SelectTrigger>
            <SelectContent className="bg-white border-blue-200">
              <SelectItem value="paints">Paints</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
              <SelectItem value="tools">Tools</SelectItem>
              <SelectItem value="hardware">Hardware</SelectItem>
              <SelectItem value="chemicals">Chemicals</SelectItem>
            </SelectContent>
          </Select>

          {/* Outstanding Balance Filter */}
          <Select
            value={filters.outstanding}
            onValueChange={(value) => setFilters(prev => ({ ...prev, outstanding: value }))}
          >
            <SelectTrigger className="border-blue-200 focus:ring-blue-500 focus:border-blue-500">
              <SelectValue placeholder="Outstanding Balance" />
            </SelectTrigger>
            <SelectContent className="bg-white border-blue-200">
              <SelectItem value="no-outstanding">No Outstanding</SelectItem>
              <SelectItem value="has-outstanding">Has Outstanding</SelectItem>
              <SelectItem value="high-outstanding">High Outstanding (&gt;₹10K)</SelectItem>
              <SelectItem value="overdue">Overdue Payments</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters Button */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={clearFilters}
            className="border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};