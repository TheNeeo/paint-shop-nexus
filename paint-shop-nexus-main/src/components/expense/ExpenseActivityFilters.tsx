import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Calendar, CreditCard, X } from "lucide-react";

export const ExpenseActivityFilters = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expenseType, setExpenseType] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [dateRange, setDateRange] = useState("");

  const clearFilters = () => {
    setSearchTerm("");
    setExpenseType("");
    setPaymentMode("");
    setDateRange("");
  };

  return (
    <Card className="bg-white border-green-200">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search Field */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4" />
            <Input
              placeholder="Search by Description or Ref No"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-green-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>

          {/* Expense Type Filter */}
          <Select value={expenseType} onValueChange={setExpenseType}>
            <SelectTrigger className="border-green-300 focus:border-green-500 focus:ring-green-500">
              <SelectValue placeholder="Filter by Expense Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rent">Rent</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
              <SelectItem value="transport">Transport</SelectItem>
              <SelectItem value="office">Office Supplies</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Range Filter */}
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="border-green-300 focus:border-green-500 focus:ring-green-500">
              <Calendar className="h-4 w-4 text-green-500" />
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          {/* Payment Mode Filter */}
          <Select value={paymentMode} onValueChange={setPaymentMode}>
            <SelectTrigger className="border-green-300 focus:border-green-500 focus:ring-green-500">
              <CreditCard className="h-4 w-4 text-green-500" />
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
        </div>

        {/* Clear Filters Button */}
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            onClick={clearFilters}
            className="border-green-300 text-green-700 hover:bg-green-50"
          >
            <X className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};