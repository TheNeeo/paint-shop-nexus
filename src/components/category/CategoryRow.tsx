import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Package, ChevronDown, ChevronRight } from "lucide-react";

interface CategoryRowProps {
  category: any;
  isExpanded: boolean;
  onToggle: (categoryId: string) => void;
  onEdit: (category: any) => void;
  onDelete: (categoryId: string) => void;
}

const getLighterHex = (hex: string): string => {
  // Convert hex to RGB, lighten it, and return the lighter hex
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const lighter = (val: number) => Math.min(255, Math.round(val + (255 - val) * 0.7));

  const lr = lighter(r).toString(16).padStart(2, '0');
  const lg = lighter(g).toString(16).padStart(2, '0');
  const lb = lighter(b).toString(16).padStart(2, '0');

  return `#${lr}${lg}${lb}`;
};

const getDarkerHex = (hex: string): string => {
  // Convert hex to RGB and darken it
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const darker = (val: number) => Math.round(val * 0.7);

  const dr = darker(r).toString(16).padStart(2, '0');
  const dg = darker(g).toString(16).padStart(2, '0');
  const db = darker(b).toString(16).padStart(2, '0');

  return `#${dr}${dg}${db}`;
};

const getCategoryColor = (color: string) => {
  // If it's a hex color, generate lighter and darker variants
  if (color.startsWith("#")) {
    const lighter = getLighterHex(color);
    const darker = getDarkerHex(color);
    return {
      bg: lighter,
      text: darker,
      border: color,
    };
  }

  // Fallback for named colors (backward compatibility)
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    blue: { bg: "#EFF6FF", text: "#1E40AF", border: "#3B82F6" },
    red: { bg: "#FEF2F2", text: "#7F1D1D", border: "#EF4444" },
    green: { bg: "#F0FDF4", text: "#166534", border: "#22C55E" },
    purple: { bg: "#FAF5FF", text: "#6B21A8", border: "#A855F7" },
    orange: { bg: "#FFF7ED", text: "#92400E", border: "#F97316" },
    pink: { bg: "#FDF2F8", text: "#831843", border: "#EC4899" },
    indigo: { bg: "#EEF2FF", text: "#312E81", border: "#6366F1" },
    coral: { bg: "#FEF2F2", text: "#7F1D1D", border: "#FF7F50" },
  };
  return colors[color] || { bg: "#F8F8F8", text: "#1F2937", border: "#6B7280" };
};

export function CategoryRow({ category, isExpanded, onToggle, onEdit, onDelete }: CategoryRowProps) {
  return (
    <TableRow 
      className="hover:bg-green-50/50 transition-colors border-b border-gray-100 cursor-pointer"
      onClick={() => onToggle(category.id)}
    >
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-6 w-6"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </TableCell>
      
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full border border-gray-300"
            style={{ backgroundColor: category.color.startsWith("#") ? category.color : "#3B82F6" }}
          />
          <span className="text-gray-900">{category.name}</span>
        </div>
      </TableCell>
      
      <TableCell className="text-gray-600 max-w-xs">
        <div className="truncate" title={category.description}>
          {category.description}
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded border border-gray-300"
            style={{ backgroundColor: category.color.startsWith("#") ? category.color : "#3B82F6" }}
          />
          <span className="text-sm font-medium text-gray-700">
            {category.color.startsWith("#") ? category.color.toUpperCase() : category.color}
          </span>
        </div>
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
      
      <TableCell onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(category)}
            className="h-8 w-8 p-0 hover:bg-green-100 hover:border-green-300 bg-green-50 border-green-200"
          >
            <Edit className="h-4 w-4 text-green-600" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(category.id)}
            className="h-8 w-8 p-0 hover:bg-green-100 hover:border-green-300 bg-green-50 border-green-200"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
