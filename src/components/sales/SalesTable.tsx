
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
      paid: "bg-green-100 text-green-800 border border-green-200",
      partial: "bg-amber-100 text-amber-800 border border-amber-200",
      pending: "bg-red-100 text-red-800 border border-red-200",
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const getPaymentModeBadge = (mode: string) => {
    const variants = {
      "UPI": "bg-purple-100 text-purple-800 border border-purple-200",
      "Credit Card": "bg-blue-100 text-blue-800 border border-blue-200",
      "Cash": "bg-green-100 text-green-800 border border-green-200",
      "Bank Transfer": "bg-indigo-100 text-indigo-800 border border-indigo-200",
      "Cheque": "bg-orange-100 text-orange-800 border border-orange-200",
    };
    return variants[mode as keyof typeof variants] || "bg-gray-100 text-gray-800 border border-gray-200";
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
    <div className="bg-white rounded-xl border-2 shadow-lg overflow-hidden" style={{ borderColor: '#fce7f3' }}>
      <div 
        className="p-4 border-b-2" 
        style={{ 
          background: 'linear-gradient(to right, #fdf2f8, #fff1f2)',
          borderColor: '#fce7f3'
        }}
      >
        <h2 className="text-lg font-semibold" style={{ color: '#831843' }}>Sales Records</h2>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow style={{ backgroundColor: '#fdf2f8' }}>
            <TableHead className="w-12 font-semibold" style={{ color: '#831843' }}>
              <Checkbox />
            </TableHead>
            <TableHead className="w-8 font-semibold" style={{ color: '#831843' }}></TableHead>
            <TableHead className="font-semibold" style={{ color: '#831843' }}>Date</TableHead>
            <TableHead className="font-semibold" style={{ color: '#831843' }}>Invoice #</TableHead>
            <TableHead className="font-semibold" style={{ color: '#831843' }}>Customer</TableHead>
            <TableHead className="font-semibold" style={{ color: '#831843' }}>Product</TableHead>
            <TableHead className="font-semibold" style={{ color: '#831843' }}>Unit Price</TableHead>
            <TableHead className="font-semibold" style={{ color: '#831843' }}>Qty</TableHead>
            <TableHead className="font-semibold" style={{ color: '#831843' }}>Total Amount</TableHead>
            <TableHead className="font-semibold" style={{ color: '#831843' }}>Paid Amount</TableHead>
            <TableHead className="font-semibold" style={{ color: '#831843' }}>Payment Mode</TableHead>
            <TableHead className="font-semibold" style={{ color: '#831843' }}>Status</TableHead>
            <TableHead className="font-semibold" style={{ color: '#831843' }}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSales.map((sale) => (
            <React.Fragment key={sale.id}>
              {/* Main Row */}
              <TableRow className="hover:bg-pink-50/50 transition-colors duration-200">
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
                    className="p-1 hover:bg-pink-100"
                    style={{ color: '#af0568' }}
                  >
                    {expandedRows.includes(sale.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="text-gray-700">{sale.date}</TableCell>
                <TableCell className="font-medium" style={{ color: '#af0568' }}>{sale.invoiceNumber}</TableCell>
                <TableCell className="text-gray-700">{sale.customerName}</TableCell>
                <TableCell>
                  <button
                    onClick={() => toggleRowExpansion(sale.id)}
                    className="font-medium hover:underline"
                    style={{ color: '#af0568' }}
                  >
                    {sale.productName}
                  </button>
                </TableCell>
                <TableCell className="text-gray-700">₹{sale.unitPrice}</TableCell>
                <TableCell className="text-gray-700">{sale.quantity}</TableCell>
                <TableCell className="font-semibold" style={{ color: '#831843' }}>₹{sale.totalAmount}</TableCell>
                <TableCell className="font-semibold text-green-700">₹{sale.paidAmount}</TableCell>
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
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="hover:bg-pink-100"
                        style={{ color: '#af0568' }}
                      >
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white border-2" style={{ borderColor: '#fce7f3' }}>
                      <DropdownMenuItem 
                        onClick={() => onViewInvoice(sale)}
                        className="hover:bg-pink-50 cursor-pointer"
                      >
                        <Eye className="h-4 w-4 mr-2" style={{ color: '#af0568' }} />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-pink-50 cursor-pointer">
                        <Download className="h-4 w-4 mr-2" style={{ color: '#af0568' }} />
                        Print
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-pink-50 cursor-pointer">
                        <Edit className="h-4 w-4 mr-2" style={{ color: '#af0568' }} />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 hover:bg-red-50 cursor-pointer">
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>

              {/* Expanded Variants Rows */}
              {expandedRows.includes(sale.id) && sale.variants.map((variant, index) => (
                <TableRow 
                  key={`${sale.id}-variant-${index}`} 
                  style={{ backgroundColor: '#fdf2f8' }}
                  className="border-l-4"
                >
                  <TableCell></TableCell>
                  <TableCell className="pl-8"></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="pl-8 text-sm" style={{ color: '#9d174d' }}>
                    └ {variant.name}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">₹{variant.unitPrice}</TableCell>
                  <TableCell className="text-sm text-gray-600">{variant.stockQuantity}</TableCell>
                  <TableCell className="text-sm font-medium" style={{ color: '#831843' }}>₹{variant.totalAmount}</TableCell>
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
