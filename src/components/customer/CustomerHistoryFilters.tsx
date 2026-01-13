import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import { CustomerHistoryFilters as FilterType } from '@/pages/CustomerHistory';

interface CustomerHistoryFiltersProps {
  filters: FilterType;
  setFilters: React.Dispatch<React.SetStateAction<FilterType>>;
}

export const CustomerHistoryFilters: React.FC<CustomerHistoryFiltersProps> = ({ filters, setFilters }) => {
  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      dateRange: 'all',
      customerType: 'all',
      outstandingAmount: 'all'
    });
  };

  return (
    <Card 
      className="shadow-lg mb-6"
      style={{
        background: 'linear-gradient(135deg, rgba(14, 172, 221, 0.05) 0%, rgba(14, 172, 221, 0.1) 100%)',
        borderColor: '#0EACDD'
      }}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5" style={{ color: '#0EACDD' }} />
          <h3 className="text-lg font-semibold" style={{ color: '#087A9E' }}>Search & Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#0EACDD' }} />
            <Input
              placeholder="Search by Name / Mobile / Email"
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              className="pl-10 bg-white"
              style={{ borderColor: '#0EACDD', color: '#087A9E' }}
            />
          </div>

          {/* Date Range Filter */}
          <Select 
            value={filters.dateRange} 
            onValueChange={(value: 'all' | '30days' | '90days' | '1year') => 
              setFilters(prev => ({ ...prev, dateRange: value }))
            }
          >
            <SelectTrigger className="bg-white" style={{ borderColor: '#0EACDD', color: '#087A9E' }}>
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent className="bg-white" style={{ borderColor: '#0EACDD' }}>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="1year">Last 1 Year</SelectItem>
            </SelectContent>
          </Select>

          {/* Customer Type Filter */}
          <Select 
            value={filters.customerType} 
            onValueChange={(value: 'all' | 'retail' | 'wholesale') => 
              setFilters(prev => ({ ...prev, customerType: value }))
            }
          >
            <SelectTrigger className="bg-white" style={{ borderColor: '#0EACDD', color: '#087A9E' }}>
              <SelectValue placeholder="Customer Type" />
            </SelectTrigger>
            <SelectContent className="bg-white" style={{ borderColor: '#0EACDD' }}>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="wholesale">Wholesale</SelectItem>
            </SelectContent>
          </Select>

          {/* Outstanding Amount Filter */}
          <Select 
            value={filters.outstandingAmount} 
            onValueChange={(value: 'all' | 'zero' | 'low' | 'high') => 
              setFilters(prev => ({ ...prev, outstandingAmount: value }))
            }
          >
            <SelectTrigger className="bg-white" style={{ borderColor: '#0EACDD', color: '#087A9E' }}>
              <SelectValue placeholder="Outstanding Amount" />
            </SelectTrigger>
            <SelectContent className="bg-white" style={{ borderColor: '#0EACDD' }}>
              <SelectItem value="all">All Amounts</SelectItem>
              <SelectItem value="zero">Zero Outstanding</SelectItem>
              <SelectItem value="low">Low (₹1-₹10k)</SelectItem>
              <SelectItem value="high">High (Above ₹10k)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            variant="outline"
            onClick={clearFilters}
            className="hover:bg-white/50"
            style={{ borderColor: '#0EACDD', color: '#0EACDD' }}
          >
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
