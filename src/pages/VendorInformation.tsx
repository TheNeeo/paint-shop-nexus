import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { VendorHeader } from "@/components/vendor/VendorHeader";
import { VendorSummaryCards } from "@/components/vendor/VendorSummaryCards";
import { VendorFilters } from "@/components/vendor/VendorFilters";
import { VendorTable } from "@/components/vendor/VendorTable";
import { AddEditVendorModal } from "@/components/vendor/AddEditVendorModal";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Users, Store } from "lucide-react";
import dashboardHomeIcon from "@/assets/dashboard-home-icon.png";

// Theme colors for Vendor Information
const THEME_PRIMARY = "#7C3AED"; // Purple

export default function VendorInformation() {
  const navigate = useNavigate();
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const vendorTableRef = useRef<{ fetchVendors: () => void }>(null);

  const handleAddVendor = () => {
    setEditingVendor(null);
    setIsAddVendorOpen(true);
  };

  const handleEditVendor = (vendor: any) => {
    setEditingVendor(vendor);
    setIsAddVendorOpen(true);
  };

  const handleModalClose = () => {
    setIsAddVendorOpen(false);
    setEditingVendor(null);
    // Refresh the vendor table if there's a ref to it
    if (vendorTableRef.current) {
      vendorTableRef.current.fetchVendors();
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setLocationFilter("");
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50 p-6">
        <div className="space-y-6">
          {/* Breadcrumb - Outside Header Box */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-3"
          >
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink 
                    onClick={() => navigate("/")} 
                    className="cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1.5"
                  >
                    <img src={dashboardHomeIcon} alt="Dashboard" className="h-5 w-5 object-contain bg-transparent" style={{ mixBlendMode: 'multiply' }} />
                    <span className="text-cyan-600 font-medium">Dashboard</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-orange-400" />
                    <span className="text-orange-600 font-medium">Customer Management</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="flex items-center gap-1.5">
                    <Store className="h-4 w-4" style={{ color: THEME_PRIMARY }} />
                    <span className="font-semibold" style={{ color: THEME_PRIMARY }}>Vendor Information</span>
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </motion.div>

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
          onClose={handleModalClose}
          vendor={editingVendor}
        />
      </div>
    </AppLayout>
  );
}
