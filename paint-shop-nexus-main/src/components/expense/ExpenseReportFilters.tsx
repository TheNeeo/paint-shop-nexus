import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search, X } from "lucide-react";

export const ExpenseReportFilters = () => {
  return (
    <Card className="p-6 bg-white border-turquoise-200">
      <div className="space-y-4">
        {/* Search Field */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-turquoise-400 h-4 w-4" />
          <Input
            placeholder="Search by Expense Title, Description..."
            className="pl-10 border-turquoise-300 focus:border-turquoise-500 focus:ring-turquoise-500"
          />
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date Range Filter */}
          <Select>
            <SelectTrigger className="border-turquoise-300 focus:border-turquoise-500 focus:ring-turquoise-500">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          {/* Expense Category Filter */}
          <Select>
            <SelectTrigger className="border-turquoise-300 focus:border-turquoise-500 focus:ring-turquoise-500">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="transport">Transport</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
              <SelectItem value="rent">Rent</SelectItem>
              <SelectItem value="food">Food & Dining</SelectItem>
              <SelectItem value="office">Office Supplies</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="travel">Travel</SelectItem>
              <SelectItem value="miscellaneous">Miscellaneous</SelectItem>
            </SelectContent>
          </Select>

          {/* Payment Mode Filter */}
          <Select>
            <SelectTrigger className="border-turquoise-300 focus:border-turquoise-500 focus:ring-turquoise-500">
              <SelectValue placeholder="Payment Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="bank">Bank Transfer</SelectItem>
              <SelectItem value="cheque">Cheque</SelectItem>
              <SelectItem value="card">Credit/Debit Card</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters Button */}
          <Button 
            variant="outline" 
            className="border-turquoise-300 text-turquoise-700 hover:bg-turquoise-50"
          >
            <X className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </div>
    </Card>
  );
};