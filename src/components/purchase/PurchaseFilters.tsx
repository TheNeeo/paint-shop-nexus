import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

export const PurchaseFilters = () => {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentModeFilter, setPaymentModeFilter] = useState('');

  const handleClearFilters = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    setSearchTerm('');
    setVendorFilter('');
    setStatusFilter('');
    setPaymentModeFilter('');
  };


  return (
    <div className="bg-white p-6 rounded-lg shadow-md border space-y-4" style={{ borderColor: '#93c5fd' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold" style={{ color: '#1e40af' }}>Filters & Search</h3>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        {/* Search Bar */}
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#3b82f6' }} />
            <Input
              placeholder="Search by Bill No., Vendor, Product, HSN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white font-medium"
              style={{ borderColor: '#3b82f6' }}
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button className="w-[140px] justify-start text-left font-medium text-white hover:opacity-90" style={{ backgroundColor: '#1e40af', borderColor: '#1e40af' }}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? format(dateFrom, "MMM dd") : "From Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={setDateFrom}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button className="w-[140px] justify-start text-left font-medium text-white hover:opacity-90" style={{ backgroundColor: '#1e40af', borderColor: '#1e40af' }}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? format(dateTo, "MMM dd") : "To Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={setDateTo}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        {/* Vendor Filter */}
        <Select value={vendorFilter} onValueChange={setVendorFilter}>
          <SelectTrigger className="w-[180px] text-white font-medium hover:opacity-90" style={{ backgroundColor: '#1e40af', borderColor: '#1e40af' }}>
            <SelectValue placeholder="Select Vendor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Vendors</SelectItem>
            <SelectItem value="abc-suppliers">ABC Suppliers</SelectItem>
            <SelectItem value="xyz-distributors">XYZ Distributors</SelectItem>
            <SelectItem value="premium-paints">Premium Paints Co.</SelectItem>
            <SelectItem value="color-world">Color World Ltd.</SelectItem>
          </SelectContent>
        </Select>

        {/* Payment Mode Filter */}
        <Select value={paymentModeFilter} onValueChange={setPaymentModeFilter}>
          <SelectTrigger className="w-[150px] text-white font-medium hover:opacity-90" style={{ backgroundColor: '#1e40af', borderColor: '#1e40af' }}>
            <SelectValue placeholder="Payment Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modes</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="upi">UPI</SelectItem>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            <SelectItem value="cheque">Cheque</SelectItem>
            <SelectItem value="credit_card">Credit Card</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px] text-white font-medium hover:opacity-90" style={{ backgroundColor: '#1e40af', borderColor: '#1e40af' }}>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="due">Due</SelectItem>
            <SelectItem value="received">Received</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>

        <Button size="sm" onClick={handleClearFilters} className="text-white font-medium hover:opacity-90" style={{ backgroundColor: '#1e40af', borderColor: '#1e40af' }}>
          <Filter className="w-4 h-4 mr-2" />
          Clear Filters
        </Button>
      </div>
    </div>
  );
};
