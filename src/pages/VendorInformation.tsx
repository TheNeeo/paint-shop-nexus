import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { VendorHeader } from "@/components/vendor/VendorHeader";
import { VendorSummaryCards } from "@/components/vendor/VendorSummaryCards";
import { VendorFilters } from "@/components/vendor/VendorFilters";
import { VendorTable } from "@/components/vendor/VendorTable";
import { AddEditVendorModal } from "@/components/vendor/AddEditVendorModal";

export default function VendorInformation() {
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const handleAddVendor = () => {
    setEditingVendor(null);
    setIsAddVendorOpen(true);
  };

  const handleEditVendor = (vendor: any) => {
    setEditingVendor(vendor);
    setIsAddVendorOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setLocationFilter("");
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="space-y-6">
          <VendorHeader onAddVendor={handleAddVendor} />
          
          <VendorSummaryCards />
          
          <VendorFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            clearFilters={clearFilters}
          />
          
          <VendorTable
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            locationFilter={locationFilter}
            onEditVendor={handleEditVendor}
          />
        </div>

        <AddEditVendorModal
          isOpen={isAddVendorOpen}
          onClose={() => setIsAddVendorOpen(false)}
          vendor={editingVendor}
        />
      </div>
    </AppLayout>
  );
}