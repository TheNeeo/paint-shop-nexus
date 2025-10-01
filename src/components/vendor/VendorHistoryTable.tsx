import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { Eye, Edit, Trash2, ChevronDown, ChevronUp, FileText } from "lucide-react";
import type { VendorHistoryData, FilterType } from "@/pages/VendorHistory";

interface VendorHistoryTableProps {
  vendors: VendorHistoryData[];
  filters: FilterType;
}

export const VendorHistoryTable: React.FC<VendorHistoryTableProps> = ({
  vendors,
  filters,
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const toggleRowExpansion = (vendorId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(vendorId)) {
      newExpanded.delete(vendorId);
    } else {
      newExpanded.add(vendorId);
    }
    setExpandedRows(newExpanded);
  };

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch = 
      vendor.vendorName.toLowerCase().includes(filters.search.toLowerCase()) ||
      vendor.mobile.toLowerCase().includes(filters.search.toLowerCase()) ||
      vendor.gstNo.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesOutstanding = 
      !filters.outstanding ||
      (filters.outstanding === "no-outstanding" && vendor.outstanding === 0) ||
      (filters.outstanding === "has-outstanding" && vendor.outstanding > 0) ||
      (filters.outstanding === "high-outstanding" && vendor.outstanding > 10000);

    return matchesSearch && matchesOutstanding;
  });

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const paginatedVendors = filteredVendors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getRowBackground = (vendor: VendorHistoryData) => {
    if (vendor.outstanding > 10000) return "bg-red-50 hover:bg-red-100";
    if (vendor.outstanding === 0) return "bg-green-50 hover:bg-green-100";
    return "hover:bg-blue-50";
  };

  const getStatusBadge = (status: string) => {
    return status === "Active" ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
        {status}
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-100 text-gray-800">
        {status}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusColors = {
      "Paid": "bg-green-100 text-green-800",
      "Pending": "bg-coral-100 text-coral-800",
      "Overdue": "bg-red-100 text-red-800",
    };
    
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    );
  };

  const handleView = (vendorId: string) => {
    console.log('Viewing vendor:', vendorId);
  };

  const handleEdit = (vendorId: string) => {
    console.log('Editing vendor:', vendorId);
  };

  const handleDelete = (vendorId: string) => {
    console.log('Deleting vendor:', vendorId);
  };

  const handleViewPO = (poNumber: string) => {
    console.log('Viewing PO:', poNumber);
  };

  return (
    <div className="space-y-4">
      <Card className="border-blue-200 bg-white shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-50 hover:bg-blue-100">
                  <TableHead className="text-blue-900 font-semibold">S.No</TableHead>
                  <TableHead className="text-blue-900 font-semibold">Vendor Name</TableHead>
                  <TableHead className="text-blue-900 font-semibold">Mobile Number</TableHead>
                  <TableHead className="text-blue-900 font-semibold">GST No.</TableHead>
                  <TableHead className="text-blue-900 font-semibold">Total POs</TableHead>
                  <TableHead className="text-blue-900 font-semibold">Total Amount</TableHead>
                  <TableHead className="text-blue-900 font-semibold">Last Purchase</TableHead>
                  <TableHead className="text-blue-900 font-semibold">Outstanding</TableHead>
                  <TableHead className="text-blue-900 font-semibold">Status</TableHead>
                  <TableHead className="text-blue-900 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedVendors.map((vendor, index) => (
                  <React.Fragment key={vendor.id}>
                    <TableRow className={getRowBackground(vendor)}>
                      <TableCell className="font-medium">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRowExpansion(vendor.id)}
                            className="p-1 h-6 w-6"
                          >
                            {expandedRows.has(vendor.id) ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            )}
                          </Button>
                          <span className="font-medium text-gray-900">{vendor.vendorName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700">{vendor.mobile}</TableCell>
                      <TableCell className="text-gray-700">{vendor.gstNo}</TableCell>
                      <TableCell className="text-gray-700">{vendor.totalOrders}</TableCell>
                      <TableCell className="font-semibold text-gray-900">
                        ₹{vendor.totalAmount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-gray-700">{vendor.lastPurchase}</TableCell>
                      <TableCell>
                        <span className={vendor.outstanding > 0 ? "font-semibold text-red-600" : "text-green-600"}>
                          ₹{vendor.outstanding.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(vendor.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(vendor.id)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(vendor.id)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(vendor.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Row Content */}
                    {expandedRows.has(vendor.id) && (
                      <TableRow>
                        <TableCell colSpan={10} className="bg-blue-25 border-t-0">
                          <div className="p-4 bg-blue-25 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-3">Purchase Order History</h4>
                            <div className="grid gap-2">
                              {vendor.purchaseOrders.map((po, poIndex) => (
                                <div
                                  key={poIndex}
                                  className="flex items-center justify-between p-3 bg-white rounded-md border border-blue-200"
                                >
                                  <div className="grid grid-cols-4 gap-4 flex-1">
                                    <div>
                                      <span className="text-sm text-gray-600">PO Number:</span>
                                      <div className="font-medium text-blue-700">{po.poNumber}</div>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-600">Date:</span>
                                      <div className="font-medium">{po.date}</div>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-600">Amount:</span>
                                      <div className="font-medium">₹{po.amount.toLocaleString()}</div>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-600">Status:</span>
                                      <div>{getPaymentStatusBadge(po.paymentStatus)}</div>
                                    </div>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewPO(po.poNumber)}
                                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                                  >
                                    <FileText className="h-4 w-4 mr-1" />
                                    View PO
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="border-blue-200 bg-white">
          <CardContent className="flex items-center justify-between p-4">
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredVendors.length)} of{" "}
              {filteredVendors.length} vendors
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="border-blue-300 text-blue-700 hover:bg-blue-100 disabled:opacity-50"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="border-blue-300 text-blue-700 hover:bg-blue-100 disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};