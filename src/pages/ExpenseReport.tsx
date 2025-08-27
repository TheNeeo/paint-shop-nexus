import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { ExpenseReportHeader } from "@/components/expense/ExpenseReportHeader";
import { ExpenseReportSummary } from "@/components/expense/ExpenseReportSummary";
import { ExpenseReportFilters } from "@/components/expense/ExpenseReportFilters";
import { ExpenseReportTable } from "@/components/expense/ExpenseReportTable";
import { ExpenseReportModal } from "@/components/expense/ExpenseReportModal";

const ExpenseReport = () => {
  const [isExpenseReportModalOpen, setIsExpenseReportModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const handleViewExpense = (expense: any) => {
    setSelectedExpense(expense);
    setIsExpenseReportModalOpen(true);
  };

  return (
    <AppLayout>
      <div className="space-y-6 p-6 bg-gradient-to-br from-turquoise-50 to-turquoise-100 min-h-screen">
        <ExpenseReportHeader />
        <ExpenseReportSummary />
        <ExpenseReportFilters />
        <ExpenseReportTable onViewExpense={handleViewExpense} />
        
        <ExpenseReportModal
          isOpen={isExpenseReportModalOpen}
          onClose={() => setIsExpenseReportModalOpen(false)}
          expense={selectedExpense}
        />
      </div>
    </AppLayout>
  );
};

export default ExpenseReport;