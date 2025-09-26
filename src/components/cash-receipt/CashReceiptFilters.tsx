import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CashReceiptFiltersProps {
  filters: {
    dateRange: any;
    payerName: string;
    paymentMode: string;
    search: string;
  };
  onFiltersChange: (filters: any) => void;
}

export function CashReceiptFilters({ filters, onFiltersChange }: CashReceiptFiltersProps) {
  const clearFilters = () => {
    onFiltersChange({
      dateRange: null,
      payerName: "",
      paymentMode: "all",
      search: "",
    });
  };

  return (
    <div 
      className="p-6 rounded-lg shadow-sm border-0"
      style={{ 
        backgroundColor: "rgba(125, 190, 60, 0.05)",
        borderLeft: "4px solid #7DBE3C"
      }}
    >
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center flex-1">
          {/* Search */}
          <div className="relative min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by Receipt No or Notes..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="pl-10 border-gray-300 focus:border-[#7DBE3C] focus:ring-[#7DBE3C]"
            />
          </div>

          {/* Date Range */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "min-w-[200px] justify-start text-left font-normal border-gray-300",
                  !filters.dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange ? format(filters.dateRange, "PPP") : "Select date range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dateRange}
                onSelect={(date) => onFiltersChange({ ...filters, dateRange: date })}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          {/* Payer Name */}
          <Input
            placeholder="Payer Name"
            value={filters.payerName}
            onChange={(e) => onFiltersChange({ ...filters, payerName: e.target.value })}
            className="min-w-[150px] border-gray-300 focus:border-[#7DBE3C] focus:ring-[#7DBE3C]"
          />

          {/* Payment Mode */}
          <Select
            value={filters.paymentMode}
            onValueChange={(value) => onFiltersChange({ ...filters, paymentMode: value })}
          >
            <SelectTrigger className="min-w-[150px] border-gray-300">
              <SelectValue placeholder="Payment Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modes</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="cheque">Cheque</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        <Button
          variant="outline"
          onClick={clearFilters}
          className="min-w-[120px]"
          style={{
            borderColor: "#7DBE3C",
            color: "#16583f"
          }}
        >
          <X className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>
    </div>
  );
}