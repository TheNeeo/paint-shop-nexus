
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ReorderFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  supplierFilter: string;
  setSupplierFilter: (value: string) => void;
  stockStatusFilter: string;
  setStockStatusFilter: (value: string) => void;
}

export function ReorderFilters({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  supplierFilter,
  setSupplierFilter,
  stockStatusFilter,
  setStockStatusFilter,
}: ReorderFiltersProps) {
  return (
    <div className="bg-pink-50 rounded-lg p-6 shadow-sm border border-pink-200">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 h-4 w-4" />
          <Input
            placeholder="Search by Product Name, HSN, Category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-pink-300 focus:border-pink-500 focus:ring-pink-500 bg-white"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40 border-pink-300 focus:border-pink-500 focus:ring-pink-500 bg-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="paint">Paint</SelectItem>
              <SelectItem value="tools">Tools</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
            </SelectContent>
          </Select>

          <Select value={supplierFilter} onValueChange={setSupplierFilter}>
            <SelectTrigger className="w-40 border-pink-300 focus:border-pink-500 focus:ring-pink-500 bg-white">
              <SelectValue placeholder="Supplier" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All Suppliers</SelectItem>
              <SelectItem value="asian-paints">Asian Paints Ltd</SelectItem>
              <SelectItem value="tools-india">Tools India</SelectItem>
            </SelectContent>
          </Select>

          <Select value={stockStatusFilter} onValueChange={setStockStatusFilter}>
            <SelectTrigger className="w-40 border-pink-300 focus:border-pink-500 focus:ring-pink-500 bg-white">
              <SelectValue placeholder="Stock Status" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="low">Low Stock</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            className="border-pink-300 text-pink-700 hover:bg-pink-100 bg-white"
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('all');
              setSupplierFilter('all');
              setStockStatusFilter('all');
            }}
          >
            <Filter className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
