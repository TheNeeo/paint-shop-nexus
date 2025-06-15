
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface SalesFiltersProps {
  filters: {
    customer: string;
    status: string;
    search: string;
  };
  onFiltersChange: (filters: any) => void;
}

export function SalesFilters({ filters, onFiltersChange }: SalesFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Customer Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Customer</label>
          <Select
            value={filters.customer}
            onValueChange={(value) => onFiltersChange({ ...filters, customer: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Customers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Customers</SelectItem>
              <SelectItem value="john-doe">John Doe</SelectItem>
              <SelectItem value="jane-smith">Jane Smith</SelectItem>
              <SelectItem value="bob-johnson">Bob Johnson</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Payment Status</label>
          <Select
            value={filters.status}
            onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="partial">Partial Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Box */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Invoice No., Customer Name..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
