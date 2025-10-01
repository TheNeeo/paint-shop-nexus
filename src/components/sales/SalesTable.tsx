
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronRight, Edit, Trash, Eye, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SalesTableProps {
  filters: any;
  onViewInvoice: (invoice: any) => void;
}

// Mock data for sales
const mockSales = [
  {
    id: 1,
    date: "2024-01-15",
    invoiceNumber: "INV-001",
    customerName: "John Doe",
    productName: "Paint Brush Set",
    unitPrice: 150,
    quantity: 2,
    totalAmount: 300,
    paidAmount: 300,
    paymentMode: "UPI",
    paymentStatus: "paid",
    variants: [
      { name: "Small Brush", unitPrice: 50, stockQuantity: 25, totalAmount: 100 },
      { name: "Medium Brush", unitPrice: 75, stockQuantity: 15, totalAmount: 150 },
      { name: "Large Brush", unitPrice: 100, stockQuantity: 10, totalAmount: 50 },
    ]
  },
  {
    id: 2,
    date: "2024-01-14",
    invoiceNumber: "INV-002",
    customerName: "Jane Smith",
    productName: "Wall Paint",
    unitPrice: 500,
    quantity: 4,
    totalAmount: 2000,
    paidAmount: 1000,
    paymentMode: "Credit Card",
    paymentStatus: "partial",
    variants: [
      { name: "White Paint 1L", unitPrice: 400, stockQuantity: 50, totalAmount: 1200 },
      { name: "Blue Paint 1L", unitPrice: 450, stockQuantity: 30, totalAmount: 900 },
    ]
  },
  {
    id: 3,
    date: "2024-01-13",
    invoiceNumber: "INV-003",
    customerName: "Bob Johnson",
    productName: "Roller Set",
    unitPrice: 200,
    quantity: 1,
    totalAmount: 200,
    paidAmount: 0,
    paymentMode: "Cash",
    paymentStatus: "pending",
    variants: [
      { name: "9 inch Roller", unitPrice: 120, stockQuantity: 20, totalAmount: 120 },
      { name: "Extension Handle", unitPrice: 80, stockQuantity: 15, totalAmount: 80 },
    ]
  }
];

export function SalesTable({ filters, onViewInvoice }: SalesTableProps) {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const getPaymentStatusBadge = (status: string) => {
    const variants = {
      paid: "bg-green-100 text-green-800",
      partial: "bg-coral-100 text-coral-800",
      pending: "bg-red-100 text-red-800",
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const getPaymentModeBadge = (mode: string) => {
    const variants = {
      "UPI": "bg-purple-100 text-purple-800",
      "Credit Card": "bg-blue-100 text-blue-800",
      "Cash": "bg-green-100 text-green-800",
      "Bank Transfer": "bg-indigo-100 text-indigo-800",
      "Cheque": "bg-orange-100 text-orange-800",
    };
    return variants[mode as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const toggleRowExpansion = (rowId: number) => {
    setExpandedRows(prev =>
      prev.includes(rowId)
        ? prev.filter(id => id !== rowId)
        : [...prev, rowId]
    );
  };

  const toggleRowSelection = (rowId: number) => {
    setSelectedRows(prev =>
      prev.includes(rowId)
        ? prev.filter(id => id !== rowId)
        : [...prev, rowId]
    );
  };

  const filteredSales = mockSales.filter(sale => {
    const matchesCustomer = !filters.customer || filters.customer === 'all' || sale.customerName.toLowerCase().includes(filters.customer.toLowerCase());
    const matchesStatus = !filters.status || filters.status === 'all' || sale.paymentStatus === filters.status;
    const matchesSearch = !filters.search || 
      sale.invoiceNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
      sale.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
      sale.productName.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesCustomer && matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-black">Sales Records</h2>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-black font-semibold">
              <Checkbox />
            </TableHead>
            <TableHead className="w-8 text-black font-semibold"></TableHead>
            <TableHead className="text-black font-semibold">Date</TableHead>
            <TableHead className="text-black font-semibold">Invoice #</TableHead>
            <TableHead className="text-black font-semibold">Customer</TableHead>
            <TableHead className="text-black font-semibold">Product</TableHead>
            <TableHead className="text-black font-semibold">Unit Price</TableHead>
            <TableHead className="text-black font-semibold">Qty</TableHead>
            <TableHead className="text-black font-semibold">Total Amount</TableHead>
            <TableHead className="text-black font-semibold">Paid Amount</TableHead>
            <TableHead className="text-black font-semibold">Payment Mode</TableHead>
            <TableHead className="text-black font-semibold">Status</TableHead>
            <TableHead className="text-black font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSales.map((sale) => (
            <React.Fragment key={sale.id}>
              {/* Main Row */}
              <TableRow className="hover:bg-gray-50">
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(sale.id)}
                    onCheckedChange={() => toggleRowSelection(sale.id)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleRowExpansion(sale.id)}
                    className="p-1"
                  >
                    {expandedRows.includes(sale.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell>{sale.date}</TableCell>
                <TableCell className="font-medium">{sale.invoiceNumber}</TableCell>
                <TableCell>{sale.customerName}</TableCell>
                <TableCell>
                  <button
                    onClick={() => toggleRowExpansion(sale.id)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {sale.productName}
                  </button>
                </TableCell>
                <TableCell>₹{sale.unitPrice}</TableCell>
                <TableCell>{sale.quantity}</TableCell>
                <TableCell>₹{sale.totalAmount}</TableCell>
                <TableCell>₹{sale.paidAmount}</TableCell>
                <TableCell>
                  <Badge className={getPaymentModeBadge(sale.paymentMode)}>
                    {sale.paymentMode}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getPaymentStatusBadge(sale.paymentStatus)}>
                    {sale.paymentStatus === 'paid' ? 'Paid' : 
                     sale.paymentStatus === 'partial' ? 'Partial Paid' : 'Pending'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => onViewInvoice(sale)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Print
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>

              {/* Expanded Variants Rows */}
              {expandedRows.includes(sale.id) && sale.variants.map((variant, index) => (
                <TableRow key={`${sale.id}-variant-${index}`} className="bg-gray-50">
                  <TableCell></TableCell>
                  <TableCell className="pl-8"></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="pl-8 text-sm text-gray-600">
                    └ {variant.name}
                  </TableCell>
                  <TableCell className="text-sm">₹{variant.unitPrice}</TableCell>
                  <TableCell className="text-sm">{variant.stockQuantity}</TableCell>
                  <TableCell className="text-sm">₹{variant.totalAmount}</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
