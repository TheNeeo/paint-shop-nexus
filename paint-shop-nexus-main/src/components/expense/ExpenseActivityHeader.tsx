import { Button } from "@/components/ui/button";
import { Plus, Download, Filter } from "lucide-react";

interface ExpenseActivityHeaderProps {
  onAddExpense: () => void;
}

export const ExpenseActivityHeader = ({ onAddExpense }: ExpenseActivityHeaderProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-green-200 p-6">
      {/* Page Title */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-green-800">Expenses</h1>
        <div className="text-sm text-green-600 mt-1">
          <span>Dashboard</span>
          <span className="mx-2">›</span>
          <span>Expense Management</span>
          <span className="mx-2">›</span>
          <span className="font-medium">Expense Activity</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button 
          onClick={onAddExpense}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
        
        <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
        
        <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>
    </div>
  );
};