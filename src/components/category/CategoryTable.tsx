
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Package } from "lucide-react";

interface CategoryTableProps {
  categories: any[];
  onEdit: (category: any) => void;
  onDelete: (categoryId: string) => void;
}

const getCategoryColor = (color: string) => {
  const colors = {
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    red: "bg-red-100 text-red-800 border-red-200",
    green: "bg-green-100 text-green-800 border-green-200",
    purple: "bg-purple-100 text-purple-800 border-purple-200",
    orange: "bg-orange-100 text-orange-800 border-orange-200",
    pink: "bg-pink-100 text-pink-800 border-pink-200",
    indigo: "bg-indigo-100 text-indigo-800 border-indigo-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };
  return colors[color] || "bg-slate-100 text-slate-800 border-slate-200";
};

const getColorDot = (color: string) => {
  const colors = {
    blue: "bg-blue-500",
    red: "bg-red-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    pink: "bg-pink-500",
    indigo: "bg-indigo-500",
    yellow: "bg-yellow-500",
  };
  return colors[color] || "bg-slate-500";
};

export function CategoryTable({ categories, onEdit, onDelete }: CategoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-slate-100 to-slate-200 border-b-2 border-slate-300">
            <TableHead className="text-black font-bold text-sm">Category</TableHead>
            <TableHead className="text-black font-bold text-sm">Description</TableHead>
            <TableHead className="text-black font-bold text-sm">Color</TableHead>
            <TableHead className="text-black font-bold text-sm">Products</TableHead>
            <TableHead className="text-black font-bold text-sm">Status</TableHead>
            <TableHead className="text-black font-bold text-sm">Created</TableHead>
            <TableHead className="text-black font-bold text-sm w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow 
              key={category.id} 
              className="hover:bg-gray-50/50 transition-colors border-b border-gray-100"
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getColorDot(category.color)}`} />
                  <span className="text-gray-900">{category.name}</span>
                </div>
              </TableCell>
              
              <TableCell className="text-gray-600 max-w-xs">
                <div className="truncate" title={category.description}>
                  {category.description}
                </div>
              </TableCell>
              
              <TableCell>
                <Badge className={`${getCategoryColor(category.color)} border`}>
                  {category.color.charAt(0).toUpperCase() + category.color.slice(1)}
                </Badge>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-900">
                    {category.productCount}
                  </span>
                </div>
              </TableCell>
              
              <TableCell>
                <Badge 
                  variant={category.isActive ? "default" : "secondary"}
                  className={
                    category.isActive 
                      ? "bg-green-100 text-green-800 border-green-200" 
                      : "bg-gray-100 text-gray-800 border-gray-200"
                  }
                >
                  {category.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              
              <TableCell className="text-gray-500 text-sm">
                {new Date(category.dateCreated).toLocaleDateString()}
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(category)}
                    className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-200"
                  >
                    <Edit className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(category.id)}
                    className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-200"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          
          {categories.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
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
