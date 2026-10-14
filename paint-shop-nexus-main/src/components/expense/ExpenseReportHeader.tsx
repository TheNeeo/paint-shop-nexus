import { Button } from "@/components/ui/button";
import { FileDown, Palette } from "lucide-react";

export const ExpenseReportHeader = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-turquoise-200 p-6">
      {/* Page Title */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-turquoise-800">Expense Report</h1>
        <div className="text-sm text-turquoise-600 mt-1">
          <span>Dashboard</span>
          <span className="mx-2">›</span>
          <span>Expense Management</span>
          <span className="mx-2">›</span>
          <span className="font-medium">Expense Report</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button className="bg-turquoise-600 hover:bg-turquoise-700 text-white">
          <FileDown className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
        
        <Button variant="outline" className="border-turquoise-300 text-turquoise-700 hover:bg-turquoise-50">
          <FileDown className="w-4 h-4 mr-2" />
          Export Excel
        </Button>
        
        <Button variant="outline" className="border-turquoise-300 text-turquoise-700 hover:bg-turquoise-50">
          <Palette className="w-4 h-4 mr-2" />
          Theme Toggle
        </Button>
      </div>
    </div>
  );
};