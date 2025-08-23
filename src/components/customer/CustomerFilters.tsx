import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter } from 'lucide-react';
import { CustomerFilters as FilterType } from '@/pages/CustomerInformation';

interface CustomerFiltersProps {
  filters: FilterType;
  setFilters: React.Dispatch<React.SetStateAction<FilterType>>;
}

export const CustomerFilters: React.FC<CustomerFiltersProps> = ({ filters, setFilters }) => {
  return (
    <Card className="border-blue-200 shadow-sm mb-6 bg-gradient-to-r from-blue-50 to-sky-50">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900">Search & Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
            <Input
              placeholder="Search by Name / Mobile / GST No"
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white"
            />
          </div>

          {/* Customer Type Filter */}
          <Select 
            value={filters.customerType} 
            onValueChange={(value: 'all' | 'retail' | 'wholesale') => 
              setFilters(prev => ({ ...prev, customerType: value }))
            }
          >
            <SelectTrigger className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white">
              <SelectValue placeholder="Customer Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="wholesale">Wholesale</SelectItem>
            </SelectContent>
          </Select>

          {/* Outstanding Balance Filter */}
          <Select 
            value={filters.balanceStatus} 
            onValueChange={(value: 'all' | 'due' | 'cleared') => 
              setFilters(prev => ({ ...prev, balanceStatus: value }))
            }
          >
            <SelectTrigger className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white">
              <SelectValue placeholder="Balance Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Balances</SelectItem>
              <SelectItem value="due">Outstanding Due</SelectItem>
              <SelectItem value="cleared">Cleared</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};