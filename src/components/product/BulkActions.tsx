
import React from "react";
import { Button } from "@/components/ui/button";
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
  Download,
  Archive,
  Trash2,
} from "lucide-react";

interface BulkActionsProps {
  selectedCount: number;
  onBulkAction: (action: string) => void;
}

export function BulkActions({ selectedCount, onBulkAction }: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-blue-900">
          {selectedCount} product(s) selected
        </span>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onBulkAction("export")}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button size="sm" variant="outline" onClick={() => onBulkAction("archive")}>
            <Archive className="h-4 w-4 mr-1" />
            Archive
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="destructive">
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Selected Products</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete {selectedCount} product(s)? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onBulkAction("delete")}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
