
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { InventoryHeader } from "@/components/inventory/InventoryHeader";
import { InventorySummary } from "@/components/inventory/InventorySummary";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { AddProductModal } from "@/components/inventory/AddProductModal";
import { EditProductModal } from "@/components/inventory/EditProductModal";

export default function InventoryManagement() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockStatusFilter, setStockStatusFilter] = useState("");

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <InventoryHeader onAddProduct={() => setIsAddModalOpen(true)} />
        
        <InventorySummary />
        
        <InventoryFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          stockStatusFilter={stockStatusFilter}
          onStockStatusChange={setStockStatusFilter}
        />
        
        <InventoryTable
          searchTerm={searchTerm}
          categoryFilter={categoryFilter}
          stockStatusFilter={stockStatusFilter}
          onEditProduct={handleEditProduct}
        />
        
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
        
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          product={selectedProduct}
        />
      </div>
    </AppLayout>
  );
}
