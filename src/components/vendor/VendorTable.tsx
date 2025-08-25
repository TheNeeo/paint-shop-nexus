import React, { useState } from "react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock vendor data
  const vendors = [
    {
      id: 1,
      name: "ABC Suppliers",
      mobile: "+91 98765 43210",
      gstNo: "27AABCU9603R1ZX",
      address: "Mumbai, Maharashtra",
      totalPurchases: "₹1,25,000",
      outstanding: "₹15,000",
      status: "Active",
      paymentStatus: "due",
    },
    {
      id: 2,
      name: "XYZ Trading Co.",
      mobile: "+91 87654 32109",
      gstNo: "09AABCU9603R1ZY",
      address: "Delhi, NCR",
      totalPurchases: "₹85,000",
      outstanding: "₹0",
      status: "Active",
      paymentStatus: "cleared",
    },
    {
      id: 3,
      name: "PQR Industries",
      mobile: "+91 76543 21098",
      gstNo: "29AABCU9603R1ZZ",
      address: "Bangalore, Karnataka",
      totalPurchases: "₹2,50,000",
      outstanding: "₹35,000",
      status: "Inactive",
      paymentStatus: "overdue",
    },
  ];

  const handleView = (vendor: any) => {
    console.log("Viewing vendor:", vendor);
  };

  const handleDelete = (vendor: any) => {
    console.log("Deleting vendor:", vendor);
  };

  const getStatusBadge = (status: string) => {
    return status === "Active" ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        {status}
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
        {status}
      </Badge>
    );
  };

  const getPaymentStatusColor = (paymentStatus: string, outstanding: string) => {
    if (outstanding === "₹0" || paymentStatus === "cleared") {
      return "hover:bg-green-50";
    } else if (paymentStatus === "overdue") {
      return "hover:bg-red-50";
    } else {
      return "hover:bg-orange-50";
    }
  };

  const totalPages = Math.ceil(vendors.length / itemsPerPage);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-gray-700 font-semibold">S.No</TableHead>
              <TableHead className="text-gray-700 font-semibold">Name</TableHead>
              <TableHead className="text-gray-700 font-semibold">Mobile No</TableHead>
              <TableHead className="text-gray-700 font-semibold">GST No</TableHead>
              <TableHead className="text-gray-700 font-semibold">Address</TableHead>
              <TableHead className="text-gray-700 font-semibold">Total Purchases</TableHead>
              <TableHead className="text-gray-700 font-semibold">Outstanding</TableHead>
              <TableHead className="text-gray-700 font-semibold">Status</TableHead>
              <TableHead className="text-gray-700 font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.map((vendor, index) => (
              <TableRow
                key={vendor.id}
                className={`border-b border-gray-100 ${getPaymentStatusColor(
                  vendor.paymentStatus,
                  vendor.outstanding
                )} transition-colors`}
              >
                <TableCell className="text-gray-900">{index + 1}</TableCell>
                <TableCell className="font-medium text-gray-900">
                  {vendor.name}
                </TableCell>
                <TableCell className="text-gray-700">{vendor.mobile}</TableCell>
                <TableCell className="text-gray-700 font-mono text-sm">
                  {vendor.gstNo}
                </TableCell>
                <TableCell className="text-gray-700">{vendor.address}</TableCell>
                <TableCell className="text-gray-900 font-semibold">
                  {vendor.totalPurchases}
                </TableCell>
                <TableCell
                  className={`font-semibold ${
                    vendor.outstanding === "₹0"
                      ? "text-green-600"
                      : vendor.paymentStatus === "overdue"
                      ? "text-red-600"
                      : "text-orange-600"
                  }`}
                >
                  {vendor.outstanding}
                </TableCell>
                <TableCell>{getStatusBadge(vendor.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(vendor)}
                      className="h-8 w-8 p-0 hover:bg-orange-50 hover:text-orange-600"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditVendor(vendor)}
                      className="h-8 w-8 p-0 hover:bg-orange-50 hover:text-orange-600"
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
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, vendors.length)} of {vendors.length} vendors
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="border-gray-300 hover:bg-orange-50 hover:border-orange-400"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="border-gray-300 hover:bg-orange-50 hover:border-orange-400"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}