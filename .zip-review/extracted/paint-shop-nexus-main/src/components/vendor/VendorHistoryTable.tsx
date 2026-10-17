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
import { Eye, Edit, Trash2, ChevronDown, ChevronUp, FileText, Hash, User, Phone, ShoppingBag, IndianRupee, Calendar, AlertTriangle, CheckCircle, Settings } from "lucide-react";
import { TableHeaderCell } from "@/components/shared/TableHeaderCell";
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
    return "hover:bg-[#f0fafa]";
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
    const statusColors: Record<string, string> = {
      "Paid": "bg-green-100 text-green-800",
      "Pending": "bg-amber-100 text-amber-800",
      "Overdue": "bg-red-100 text-red-800",
    };
    
    return (
      <Badge className={statusColors[status] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    );
  };

  const handleView = (vendorId: string) => console.log('Viewing vendor:', vendorId);
  const handleEdit = (vendorId: string) => console.log('Editing vendor:', vendorId);
  const handleDelete = (vendorId: string) => console.log('Deleting vendor:', vendorId);
  const handleViewPO = (poNumber: string) => console.log('Viewing PO:', poNumber);

  return (
    <div className="space-y-4">
      <Card className="bg-white shadow-sm" style={{ borderColor: '#9ECAD6' }}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow style={{ backgroundColor: '#e8f5f5' }}>
                  <TableHeaderCell icon={Hash} label="S.No" textColor="#2a7a8a" iconColor="#64748b" />
                  <TableHeaderCell icon={User} label="Vendor Name" textColor="#2a7a8a" iconColor="#1e40af" />
                  <TableHeaderCell icon={Phone} label="Mobile Number" textColor="#2a7a8a" iconColor="#10b981" />
                  <TableHeaderCell icon={FileText} label="GST No." textColor="#2a7a8a" iconColor="#ec4899" />
                  <TableHeaderCell icon={ShoppingBag} label="Total POs" textColor="#2a7a8a" iconColor="#8b5cf6" />
                  <TableHeaderCell icon={IndianRupee} label="Total Amount" textColor="#2a7a8a" iconColor="#f59e0b" />
                  <TableHeaderCell icon={Calendar} label="Last Purchase" textColor="#2a7a8a" iconColor="#0ea5e9" />
                  <TableHeaderCell icon={AlertTriangle} label="Outstanding" textColor="#2a7a8a" iconColor="#ef4444" />
                  <TableHeaderCell icon={CheckCircle} label="Status" textColor="#2a7a8a" iconColor="#22c55e" />
                  <TableHeaderCell icon={Settings} label="Actions" textColor="#2a7a8a" iconColor="#64748b" />
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
                          <Button variant="ghost" size="sm" onClick={() => handleView(vendor.id)} style={{ color: '#3d8f9e' }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(vendor.id)} style={{ color: '#3d8f9e' }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(vendor.id)} className="text-red-600 hover:text-red-700 hover:bg-red-100">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Row Content */}
                    {expandedRows.has(vendor.id) && (
                      <TableRow>
                        <TableCell colSpan={10} className="border-t-0">
                          <div className="p-4 rounded-lg" style={{ backgroundColor: '#f0fafa' }}>
                            <h4 className="font-semibold mb-3" style={{ color: '#2a7a8a' }}>Purchase Order History</h4>
                            <div className="grid gap-2">
                              {vendor.purchaseOrders.map((po, poIndex) => (
                                <div
                                  key={poIndex}
                                  className="flex items-center justify-between p-3 bg-white rounded-md"
                                  style={{ borderColor: '#9ECAD6', borderWidth: 1 }}
                                >
                                  <div className="grid grid-cols-4 gap-4 flex-1">
                                    <div>
                                      <span className="text-sm text-gray-600">PO Number:</span>
                                      <div className="font-medium" style={{ color: '#3d8f9e' }}>{po.poNumber}</div>
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
                                    style={{ borderColor: '#9ECAD6', color: '#3d8f9e' }}
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
        <Card className="bg-white" style={{ borderColor: '#9ECAD6' }}>
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
                style={{ borderColor: '#9ECAD6', color: '#3d8f9e' }}
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
                style={{ borderColor: '#9ECAD6', color: '#3d8f9e' }}
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
