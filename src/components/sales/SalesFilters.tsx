
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Filter } from "lucide-react";

interface SalesFiltersProps {
  filters: {
    customer: string;
    status: string;
    paymentMode: string;
    search: string;
    dateRange: any;
  };
  onFiltersChange: (filters: any) => void;
}

export function SalesFilters({ filters, onFiltersChange }: SalesFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Date Range Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Date Range</label>
          <Button variant="outline" className="w-full justify-start text-left font-normal">
            <Calendar className="mr-2 h-4 w-4" />
            Select Date Range
          </Button>
        </div>

        {/* Customer Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Customer</label>
          <Select
            value={filters.customer}
            onValueChange={(value) => onFiltersChange({ ...filters, customer: value })}
          >
            <SelectTrigger className="bg-white">
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

        {/* Payment Mode Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Payment Mode</label>
          <Select
            value={filters.paymentMode}
            onValueChange={(value) => onFiltersChange({ ...filters, paymentMode: value })}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="All Modes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modes</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
              <SelectItem value="cheque">Cheque</SelectItem>
              <SelectItem value="credit-card">Credit Card</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Payment Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Payment Status</label>
          <Select
            value={filters.status}
            onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
          >
            <SelectTrigger className="bg-white">
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
          <label className="text-sm font-medium text-gray-700">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Invoice No., Customer..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="pl-10 bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
