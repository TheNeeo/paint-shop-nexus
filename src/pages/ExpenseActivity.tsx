import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { ExpenseActivityHeader } from "@/components/expense/ExpenseActivityHeader";
import { ExpenseActivitySummary } from "@/components/expense/ExpenseActivitySummary";
import { ExpenseActivityFilters } from "@/components/expense/ExpenseActivityFilters";
import { ExpenseActivityTable } from "@/components/expense/ExpenseActivityTable";
import { AddEditExpenseModal } from "@/components/expense/AddEditExpenseModal";

const ExpenseActivity = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  return (
    <AppLayout>
      <div className="min-h-screen bg-green-25 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <ExpenseActivityHeader onAddExpense={() => setIsAddModalOpen(true)} />

          {/* Summary Cards */}
          <ExpenseActivitySummary />

          {/* Search & Filters */}
          <ExpenseActivityFilters />

          {/* Expense Table */}
          <ExpenseActivityTable onEditExpense={setEditingExpense} />

          {/* Add/Edit Expense Modal */}
          <AddEditExpenseModal
            open={isAddModalOpen || !!editingExpense}
            onOpenChange={(open) => {
              if (!open) {
                setIsAddModalOpen(false);
                setEditingExpense(null);
              }
            }}
            expense={editingExpense}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default ExpenseActivity;