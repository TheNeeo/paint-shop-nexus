
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface InventoryFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  stockStatusFilter: string;
  onStockStatusChange: (value: string) => void;
}

export function InventoryFilters({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  stockStatusFilter,
  onStockStatusChange
}: InventoryFiltersProps) {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      return data || [];
    }
  });

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-lg border-2 shadow-sm" style={{ borderColor: '#EADE71' }}>
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#a16207' }} />
        <Input
          placeholder="Search by Product Name or HSN Code..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white"
          style={{ borderColor: '#EADE71' }}
        />
      </div>
      
      <div className="flex gap-2">
        <Select value={categoryFilter || "all"} onValueChange={(value) => onCategoryChange(value === "all" ? "" : value)}>
          <SelectTrigger className="w-48 bg-white hover:bg-amber-50" style={{ borderColor: '#EADE71' }}>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={stockStatusFilter || "all"} onValueChange={(value) => onStockStatusChange(value === "all" ? "" : value)}>
          <SelectTrigger className="w-48 bg-white hover:bg-amber-50" style={{ borderColor: '#EADE71' }}>
            <SelectValue placeholder="Stock Status" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">All Stock</SelectItem>
            <SelectItem value="in-stock">In Stock</SelectItem>
            <SelectItem value="low-stock">Low Stock</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          size="icon"
          className="bg-white hover:bg-amber-50"
          style={{ borderColor: '#EADE71', color: '#a16207' }}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
