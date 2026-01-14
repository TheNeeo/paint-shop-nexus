import React, { useState, useEffect } from "react";
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface VendorTableProps {
  searchTerm: string;
  statusFilter: string;
  locationFilter: string;
  onEditVendor: (vendor: any) => void;
}

export function VendorTable({
  searchTerm,
  statusFilter,
  locationFilter,
  onEditVendor,
}: VendorTableProps) {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    if (user) {
      fetchVendors();
    }
  }, [user]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVendors(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch vendors: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (vendor: any) => {
    console.log("Viewing vendor:", vendor);
  };

  const handleDelete = async (vendor: any) => {
    if (!confirm("Are you sure you want to delete this vendor?")) return;
    
    try {
      const { error } = await supabase
        .from("vendors")
        .delete()
        .eq("id", vendor.id);

      if (error) throw error;
      toast.success("Vendor deleted successfully");
      fetchVendors(); // Refresh the list
    } catch (error: any) {
      toast.error("Failed to delete vendor: " + error.message);
    }
  };

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        Active
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
        Inactive
      </Badge>
    );
  };

  // Filter vendors based on search and status
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || 
                         (statusFilter === "Active" && vendor.status) ||
                         (statusFilter === "Inactive" && !vendor.status);
    const matchesLocation = !locationFilter || 
                           vendor.address?.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesLocation;
  });

  const paginatedVendors = filteredVendors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);

  return (
    <div className="bg-gradient-to-br from-purple-50/50 via-cyan-50/50 to-teal-50/50 rounded-lg shadow-sm border border-purple-200">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-purple-100 via-cyan-100 to-teal-100 border-b border-purple-200">
              <TableHead className="text-purple-800 font-semibold">S.No</TableHead>
              <TableHead className="text-purple-800 font-semibold">Name</TableHead>
              <TableHead className="text-purple-800 font-semibold">Phone No</TableHead>
              <TableHead className="text-purple-800 font-semibold">GST No</TableHead>
              <TableHead className="text-purple-800 font-semibold">Address</TableHead>
              <TableHead className="text-purple-800 font-semibold">Contact Person</TableHead>
              <TableHead className="text-purple-800 font-semibold">Email</TableHead>
              <TableHead className="text-purple-800 font-semibold">Status</TableHead>
              <TableHead className="text-purple-800 font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                    <span className="ml-2 text-purple-600">Loading vendors...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedVendors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-purple-500">
                  No vendors found
                </TableCell>
              </TableRow>
            ) : (
              paginatedVendors.map((vendor, index) => (
                <TableRow
                  key={vendor.id}
                  className="border-b border-purple-100 hover:bg-purple-50/50 transition-colors bg-white/60"
                >
                  <TableCell className="text-purple-900">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell className="font-medium text-purple-900">
                    {vendor.name}
                  </TableCell>
                  <TableCell className="text-purple-700">{vendor.phone || 'N/A'}</TableCell>
                  <TableCell className="text-purple-700 font-mono text-sm">
                    {vendor.gst_number || 'N/A'}
                  </TableCell>
                  <TableCell className="text-purple-700">{vendor.address || 'N/A'}</TableCell>
                  <TableCell className="text-purple-700">{vendor.contact_person || 'N/A'}</TableCell>
                  <TableCell className="text-purple-700">{vendor.email || 'N/A'}</TableCell>
                  <TableCell>{getStatusBadge(vendor.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(vendor)}
                      className="h-8 w-8 p-0 hover:bg-cyan-50 hover:text-cyan-600"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditVendor(vendor)}
                      className="h-8 w-8 p-0 hover:bg-purple-50 hover:text-purple-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(vendor)}
                      className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-purple-200 bg-gradient-to-r from-purple-50/50 via-cyan-50/50 to-teal-50/50">
        <div className="text-sm text-purple-700">
          Showing {paginatedVendors.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredVendors.length)} of {filteredVendors.length} vendors
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="border-purple-300 hover:bg-purple-100 hover:border-purple-400 text-purple-700"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-purple-700">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="border-purple-300 hover:bg-purple-100 hover:border-purple-400 text-purple-700"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}