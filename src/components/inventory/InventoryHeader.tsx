
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, FileDown } from "lucide-react";

interface InventoryHeaderProps {
  onAddProduct: () => void;
}

export function InventoryHeader({ onAddProduct }: InventoryHeaderProps) {
  const handleExportCSV = () => {
    // TODO: Implement CSV export
    console.log("Exporting CSV...");
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-gray-600 mt-1">Manage your products, variants, and stock levels</p>
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          onClick={handleExportCSV}
          variant="outline"
          className="border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300 bg-cyan-100"
        >
          <FileDown className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
        
        <Button
          onClick={onAddProduct}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product / Variant
        </Button>
      </div>
    </div>
  );
}
