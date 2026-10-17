
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ChevronDown,
  Edit,
  Copy,
  Archive,
  Trash2,
  Tag,
  Download,
  Star,
} from "lucide-react";

interface BulkActionsProps {
  selectedCount: number;
  onBulkAction: (action: string) => void;
}

export function BulkActions({ selectedCount, onBulkAction }: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <Badge className="bg-green-600 text-white">
          {selectedCount} selected
        </Badge>
        <span className="text-sm text-green-700 font-medium">
          Bulk actions available
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkAction("export")}
          className="border-green-300 text-green-700 hover:bg-green-100"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              Actions
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white" align="end">
            <DropdownMenuItem onClick={() => onBulkAction("edit")}>
              <Edit className="h-4 w-4 mr-2" />
              Bulk Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onBulkAction("duplicate")}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onBulkAction("feature")}>
              <Star className="h-4 w-4 mr-2" />
              Mark as Featured
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onBulkAction("tag")}>
              <Tag className="h-4 w-4 mr-2" />
              Add Tags
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onBulkAction("archive")}>
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete{" "}
                    {selectedCount} product{selectedCount > 1 ? "s" : ""}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onBulkAction("delete")}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
