import React from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VendorFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  locationFilter: string;
  setLocationFilter: (value: string) => void;
  clearFilters: () => void;
}

export function VendorFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  locationFilter,
  setLocationFilter,
  clearFilters,
}: VendorFiltersProps) {
  return (
    <div className="bg-gradient-to-r from-purple-50 via-cyan-50 to-teal-50 rounded-lg shadow-sm border border-purple-200 p-6">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Search Bar */}
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-500" />
          <Input
            placeholder="Search by Name, Mobile, GST No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-purple-200 focus:border-cyan-500 focus:ring-cyan-100 bg-white/80"
          />
        </div>

        {/* Payment Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] border-purple-200 focus:border-cyan-500 bg-white/80">
            <Filter className="h-4 w-4 mr-2 text-purple-500" />
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent className="bg-white border-purple-200">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="due">Payment Due</SelectItem>
            <SelectItem value="cleared">Cleared</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>

        {/* Location Filter */}
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-[180px] border-purple-200 focus:border-cyan-500 bg-white/80">
            <Filter className="h-4 w-4 mr-2 text-purple-500" />
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent className="bg-white border-purple-200">
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="mumbai">Mumbai</SelectItem>
            <SelectItem value="delhi">Delhi</SelectItem>
            <SelectItem value="bangalore">Bangalore</SelectItem>
            <SelectItem value="chennai">Chennai</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        <Button
          variant="outline"
          onClick={clearFilters}
          className="border-purple-300 text-purple-700 hover:bg-purple-100 hover:border-purple-400"
        >
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      </div>
    </div>
  );
}