
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
    <div 
      className="p-4 rounded-lg border-2 shadow-sm"
      style={{ 
        background: 'linear-gradient(to right, #fdf2f8, #fff1f2)',
        borderColor: '#fce7f3'
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Date Range Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium" style={{ color: '#831843' }}>Date Range</label>
          <Button 
            variant="outline" 
            className="w-full justify-start text-left font-normal bg-white hover:bg-pink-50 transition-colors"
            style={{ borderColor: '#f9a8d4', color: '#9d174d' }}
          >
            <Calendar className="mr-2 h-4 w-4" style={{ color: '#af0568' }} />
            Select Date Range
          </Button>
        </div>

        {/* Customer Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium" style={{ color: '#831843' }}>Customer</label>
          <Select
            value={filters.customer}
            onValueChange={(value) => onFiltersChange({ ...filters, customer: value })}
          >
            <SelectTrigger 
              className="bg-white hover:bg-pink-50 transition-colors"
              style={{ borderColor: '#f9a8d4', color: '#9d174d' }}
            >
              <SelectValue placeholder="All Customers" />
            </SelectTrigger>
            <SelectContent className="bg-white border-2" style={{ borderColor: '#fce7f3' }}>
              <SelectItem value="all" className="hover:bg-pink-50 focus:bg-pink-50">All Customers</SelectItem>
              <SelectItem value="john-doe" className="hover:bg-pink-50 focus:bg-pink-50">John Doe</SelectItem>
              <SelectItem value="jane-smith" className="hover:bg-pink-50 focus:bg-pink-50">Jane Smith</SelectItem>
              <SelectItem value="bob-johnson" className="hover:bg-pink-50 focus:bg-pink-50">Bob Johnson</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Payment Mode Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium" style={{ color: '#831843' }}>Payment Mode</label>
          <Select
            value={filters.paymentMode}
            onValueChange={(value) => onFiltersChange({ ...filters, paymentMode: value })}
          >
            <SelectTrigger 
              className="bg-white hover:bg-pink-50 transition-colors"
              style={{ borderColor: '#f9a8d4', color: '#9d174d' }}
            >
              <SelectValue placeholder="All Modes" />
            </SelectTrigger>
            <SelectContent className="bg-white border-2" style={{ borderColor: '#fce7f3' }}>
              <SelectItem value="all" className="hover:bg-pink-50 focus:bg-pink-50">All Modes</SelectItem>
              <SelectItem value="cash" className="hover:bg-pink-50 focus:bg-pink-50">Cash</SelectItem>
              <SelectItem value="upi" className="hover:bg-pink-50 focus:bg-pink-50">UPI</SelectItem>
              <SelectItem value="bank-transfer" className="hover:bg-pink-50 focus:bg-pink-50">Bank Transfer</SelectItem>
              <SelectItem value="cheque" className="hover:bg-pink-50 focus:bg-pink-50">Cheque</SelectItem>
              <SelectItem value="credit-card" className="hover:bg-pink-50 focus:bg-pink-50">Credit Card</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Payment Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium" style={{ color: '#831843' }}>Payment Status</label>
          <Select
            value={filters.status}
            onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
          >
            <SelectTrigger 
              className="bg-white hover:bg-pink-50 transition-colors"
              style={{ borderColor: '#f9a8d4', color: '#9d174d' }}
            >
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-white border-2" style={{ borderColor: '#fce7f3' }}>
              <SelectItem value="all" className="hover:bg-pink-50 focus:bg-pink-50">All Status</SelectItem>
              <SelectItem value="paid" className="hover:bg-pink-50 focus:bg-pink-50">Paid</SelectItem>
              <SelectItem value="partial" className="hover:bg-pink-50 focus:bg-pink-50">Partial Paid</SelectItem>
              <SelectItem value="pending" className="hover:bg-pink-50 focus:bg-pink-50">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Box */}
        <div className="space-y-2">
          <label className="text-sm font-medium" style={{ color: '#831843' }}>Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#af0568' }} />
            <Input
              placeholder="Invoice No., Customer..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="pl-10 bg-white hover:bg-pink-50 focus:bg-white transition-colors"
              style={{ borderColor: '#f9a8d4', color: '#9d174d' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
