import React from "react";
import { Plus, Download, Home, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VendorHeaderProps {
  onAddVendor: () => void;
}

export function VendorHeader({ onAddVendor }: VendorHeaderProps) {
  const handleExportCSV = () => {
    console.log("Exporting CSV...");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <Home className="h-4 w-4 mr-2" />
        <span className="hover:text-orange-600 cursor-pointer">Dashboard</span>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="hover:text-orange-600 cursor-pointer">Customer Management</span>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-orange-600 font-medium">Vendor Information</span>
      </div>

      {/* Header content */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendors</h1>
          <p className="text-gray-600">Manage your vendor information and relationships</p>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleExportCSV}
            className="border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          
          <Button
            onClick={onAddVendor}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
          </Button>
        </div>
      </div>
    </div>
  );
}