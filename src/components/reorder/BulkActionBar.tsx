
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, X } from 'lucide-react';

interface BulkActionBarProps {
  selectedCount: number;
  totalCost: number;
  onClearSelection: () => void;
  onAddToPurchaseOrder: () => void;
}

export function BulkActionBar({
  selectedCount,
  totalCost,
  onClearSelection,
  onAddToPurchaseOrder,
}: BulkActionBarProps) {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white border border-pink-200 rounded-lg shadow-lg px-6 py-4 flex items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="font-medium text-pink-800">{selectedCount}</span>
            <span className="text-pink-600 ml-1">items selected</span>
          </div>
          <div className="text-sm">
            <span className="text-pink-600">Total Cost: </span>
            <span className="font-bold text-pink-800">₹{totalCost.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearSelection}
            className="border-pink-300 text-pink-700 hover:bg-pink-100"
          >
            <X className="h-4 w-4 mr-2" />
            Clear Selection
          </Button>
          <Button
            size="sm"
            onClick={onAddToPurchaseOrder}
            className="bg-pink-600 hover:bg-pink-700 text-white"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add Selected to Purchase Order
          </Button>
        </div>
      </div>
    </div>
  );
}
