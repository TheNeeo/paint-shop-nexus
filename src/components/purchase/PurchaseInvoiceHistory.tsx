
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, Eye, Edit, Trash2, FileDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InvoiceHistory {
  id: string;
  invoiceNo: string;
  supplierName: string;
  date: string;
  totalAmount: number;
  paymentStatus: 'Paid' | 'Partial' | 'Pending';
}

const mockInvoices: InvoiceHistory[] = [
  {
    id: '1',
    invoiceNo: 'PI-2024-001',
    supplierName: 'ABC Suppliers',
    date: '2024-01-15',
    totalAmount: 25000,
    paymentStatus: 'Paid'
  },
  {
    id: '2',
    invoiceNo: 'PI-2024-002',
    supplierName: 'XYZ Industries',
    date: '2024-01-16',
    totalAmount: 18500,
    paymentStatus: 'Partial'
  },
  {
    id: '3',
    invoiceNo: 'PI-2024-003',
    supplierName: 'DEF Traders',
    date: '2024-01-17',
    totalAmount: 12000,
    paymentStatus: 'Pending'
  }
];

export const PurchaseInvoiceHistory = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  const getStatusBadge = (status: string) => {
    const colors = {
      'Paid': 'bg-green-100 text-green-800',
      'Partial': 'bg-yellow-100 text-yellow-800',
      'Pending': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleView = (invoice: InvoiceHistory) => {
    toast({
      title: "View Invoice",
      description: `Opening invoice ${invoice.invoiceNo}`,
    });
  };

  const handleEdit = (invoice: InvoiceHistory) => {
    toast({
      title: "Edit Invoice",
      description: `Editing invoice ${invoice.invoiceNo}`,
    });
  };

  const handleDelete = (invoice: InvoiceHistory) => {
    toast({
      title: "Delete Invoice",
      description: `Invoice ${invoice.invoiceNo} has been deleted`,
      variant: "destructive"
    });
  };

  const handleDownload = (invoice: InvoiceHistory) => {
    toast({
      title: "Download PDF",
      description: `Downloading ${invoice.invoiceNo}.pdf`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-pink-800">Search & Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-pink-200 text-pink-700 hover:bg-pink-50">
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoice History Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-pink-800">Purchase Invoice History</CardTitle>
          <Button variant="outline" className="border-pink-200 text-pink-700 hover:bg-pink-50">
            <FileDown className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-pink-200">
                  <th className="text-left p-4 font-medium text-pink-800">Invoice No.</th>
                  <th className="text-left p-4 font-medium text-pink-800">Supplier Name</th>
                  <th className="text-left p-4 font-medium text-pink-800">Date</th>
                  <th className="text-left p-4 font-medium text-pink-800">Total Amount</th>
                  <th className="text-left p-4 font-medium text-pink-800">Payment Status</th>
                  <th className="text-left p-4 font-medium text-pink-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b hover:bg-pink-50/50">
                    <td className="p-4 font-medium text-pink-700">{invoice.invoiceNo}</td>
                    <td className="p-4">{invoice.supplierName}</td>
                    <td className="p-4">{new Date(invoice.date).toLocaleDateString()}</td>
                    <td className="p-4 font-medium">₹{invoice.totalAmount.toLocaleString()}</td>
                    <td className="p-4">
                      <Badge className={getStatusBadge(invoice.paymentStatus)}>
                        {invoice.paymentStatus}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(invoice)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(invoice)}
                          className="text-green-600 hover:text-green-800 hover:bg-green-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(invoice)}
                          className="text-purple-600 hover:text-purple-800 hover:bg-purple-50"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(invoice)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing 1 to 3 of 3 results
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-pink-100 text-pink-700">
                1
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">3</div>
              <div className="text-sm text-gray-600">Total Invoices</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">₹55,500</div>
              <div className="text-sm text-gray-600">Total Amount</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">₹30,500</div>
              <div className="text-sm text-gray-600">Paid Amount</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">₹25,000</div>
              <div className="text-sm text-gray-600">Balance Due</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
