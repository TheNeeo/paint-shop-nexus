
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package } from "lucide-react";
import { CategoryRow } from "./CategoryRow";
import { ProductRows } from "./ProductRows";

interface CategoryTableProps {
  categories: any[];
  onEdit: (category: any) => void;
  onDelete: (categoryId: string) => void;
}

export function CategoryTable({ categories, onEdit, onDelete }: CategoryTableProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 hover:from-purple-700 hover:via-purple-600 hover:to-indigo-600 border-b-2 border-purple-800">
            <TableHead className="text-white font-bold text-sm w-12"></TableHead>
            <TableHead className="text-white font-bold text-sm">Category</TableHead>
            <TableHead className="text-white font-bold text-sm">Description</TableHead>
            <TableHead className="text-white font-bold text-sm">Color</TableHead>
            <TableHead className="text-white font-bold text-sm">Products</TableHead>
            <TableHead className="text-white font-bold text-sm">Status</TableHead>
            <TableHead className="text-white font-bold text-sm">Created</TableHead>
            <TableHead className="text-white font-bold text-sm w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <React.Fragment key={category.id}>
              <CategoryRow
                category={category}
                isExpanded={expandedCategories.has(category.id)}
                onToggle={toggleCategoryExpansion}
                onEdit={onEdit}
                onDelete={onDelete}
              />

              {/* Products Rows (when expanded) */}
              {expandedCategories.has(category.id) && (
                <ProductRows categoryName={category.name} categoryColor={category.color} />
              )}
            </React.Fragment>
          ))}
          
          {categories.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <Package className="h-8 w-8 text-gray-300" />
                  <span>No categories found</span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
