import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Calendar, CreditCard, Filter } from "lucide-react";
import { PageFilters } from "@/components/shared/PageFilters";

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
    <div className="space-y-4">
      <PageFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by Description or Ref No"
        accentColor="green"
        filters={[
          {
            type: "select",
            placeholder: "Filter by Expense Type",
            value: expenseType,
            onChange: setExpenseType,
            options: [
              { value: "rent", label: "Rent" },
              { value: "utilities", label: "Utilities" },
              { value: "transport", label: "Transport" },
              { value: "office", label: "Office Supplies" },
              { value: "marketing", label: "Marketing" },
              { value: "maintenance", label: "Maintenance" },
              { value: "other", label: "Other" },
            ],
            icon: Filter,
          },
          {
            type: "select",
            placeholder: "Date Range",
            value: dateRange,
            onChange: setDateRange,
            options: [
              { value: "today", label: "Today" },
              { value: "week", label: "This Week" },
              { value: "month", label: "This Month" },
              { value: "quarter", label: "This Quarter" },
              { value: "year", label: "This Year" },
              { value: "custom", label: "Custom Range" },
            ],
            icon: Calendar,
          },
          {
            type: "select",
            placeholder: "Payment Mode",
            value: paymentMode,
            onChange: setPaymentMode,
            options: [
              { value: "cash", label: "Cash" },
              { value: "upi", label: "UPI" },
              { value: "bank", label: "Bank Transfer" },
              { value: "cheque", label: "Cheque" },
              { value: "card", label: "Credit/Debit Card" },
            ],
            icon: CreditCard,
          },
        ]}
      />

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={clearFilters}
          className="border-green-300 text-green-700 hover:bg-green-50 shadow-sm"
          size="sm"
        >
          <X className="w-4 h-4 mr-2" />
          Clear Filters
        </Button>
      </div>
    </div>
  );
};
