
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar } from "lucide-react";

export interface SalesFiltersState {
  customer: string;
  status: string;
  paymentMode: string;
  search: string;
  dateRange: string | null;
}

interface SalesFiltersProps {
  filters: SalesFiltersState;
  onFiltersChange: (filters: SalesFiltersState) => void;
}

export function SalesFilters({ filters, onFiltersChange }: SalesFiltersProps) {
  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("customers").select("id, name").order("name");
      if (error) throw error;
      return data || [];
    },
  });

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
          <label className="text-sm font-medium flex items-center gap-2" style={{ color: '#831843' }}><Calendar className="h-4 w-4" />Date Range</label>
          <Select
            value={filters.dateRange || "all"}
            onValueChange={(value) => onFiltersChange({ ...filters, dateRange: value })}
          >
            <SelectTrigger className="bg-white" style={{ borderColor: '#f9a8d4', color: '#9d174d' }}><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
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
              {customers.map((customer) => <SelectItem key={customer.id} value={customer.id} className="hover:bg-pink-50 focus:bg-pink-50">{customer.name}</SelectItem>)}
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
              <SelectItem value="bank_transfer" className="hover:bg-pink-50 focus:bg-pink-50">Bank Transfer</SelectItem>
              <SelectItem value="cheque" className="hover:bg-pink-50 focus:bg-pink-50">Cheque</SelectItem>
              <SelectItem value="credit_card" className="hover:bg-pink-50 focus:bg-pink-50">Credit Card</SelectItem>
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
