import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Eye, Edit, Trash2, ChevronDown, ChevronRight, FileText, AlertCircle } from 'lucide-react';
import { CustomerHistoryData } from '@/pages/CustomerHistory';

interface CustomerHistoryTableProps {
  customers: CustomerHistoryData[];
  onViewDetails: (customer: CustomerHistoryData) => void;
  onEditCustomer: (customer: CustomerHistoryData) => void;
  onDeleteCustomer: (customerId: string) => void;
}

export const CustomerHistoryTable: React.FC<CustomerHistoryTableProps> = ({ 
  customers, 
  onViewDetails, 
  onEditCustomer, 
  onDeleteCustomer 
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (customerId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(customerId)) {
      newExpanded.delete(customerId);
    } else {
      newExpanded.add(customerId);
    }
    setExpandedRows(newExpanded);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return date.toLocaleDateString('en-IN');
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-gray-100 text-gray-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRowBackgroundColor = (customer: CustomerHistoryData) => {
    if (customer.outstandingBalance > 10000) return 'bg-red-50/50';
    if (customer.outstandingBalance === 0) return 'bg-green-50/50';
    return 'bg-white';
  };

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200">
        <CardTitle className="text-gray-900 flex items-center gap-2">
          Customer Purchase History
          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
            {customers.length} customers
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-100 to-slate-100 hover:bg-gradient-to-r hover:from-gray-100 hover:to-slate-100">
                <TableHead className="text-gray-900 font-semibold w-12"></TableHead>
                <TableHead className="text-gray-900 font-semibold">S.No</TableHead>
                <TableHead className="text-gray-900 font-semibold">Customer Name</TableHead>
                <TableHead className="text-gray-900 font-semibold">Mobile Number</TableHead>
                <TableHead className="text-gray-900 font-semibold">Email</TableHead>
                <TableHead className="text-gray-900 font-semibold">Total Invoices</TableHead>
                <TableHead className="text-gray-900 font-semibold">Total Purchase Value</TableHead>
                <TableHead className="text-gray-900 font-semibold">Last Purchase Date</TableHead>
                <TableHead className="text-gray-900 font-semibold">Outstanding Balance</TableHead>
                <TableHead className="text-gray-900 font-semibold text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-gray-600">
                    No customer history found
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer, index) => (
                  <React.Fragment key={customer.id}>
                    <TableRow 
                      className={`hover:bg-gray-50/50 transition-colors ${getRowBackgroundColor(customer)}`}
                    >
                      <TableCell>
                        <Collapsible>
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleRow(customer.id)}
                              className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-100"
                            >
                              {expandedRows.has(customer.id) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                        </Collapsible>
                      </TableCell>
                      <TableCell className="font-medium text-gray-800">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">{customer.name}</div>
                        <Badge 
                          variant={customer.customerType === 'wholesale' ? 'default' : 'secondary'}
                          className={customer.customerType === 'wholesale' 
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }
                        >
                          {customer.customerType === 'wholesale' ? 'Wholesale' : 'Retail'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-700">{customer.mobile}</TableCell>
                      <TableCell className="text-gray-700">
                        {customer.email || <span className="text-gray-400">-</span>}
                      </TableCell>
                      <TableCell className="font-medium text-gray-800">
                        {customer.totalInvoices}
                      </TableCell>
                      <TableCell className="font-medium text-green-600">
                        {formatCurrency(customer.totalPurchaseValue)}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {formatDate(customer.lastPurchaseDate)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {customer.outstandingBalance > 10000 && (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className={customer.outstandingBalance > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                            {formatCurrency(customer.outstandingBalance)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewDetails(customer)}
                            className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-100"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditCustomer(customer)}
                            className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-100"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteCustomer(customer.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expandable Invoice History Row */}
                    <Collapsible open={expandedRows.has(customer.id)}>
                      <CollapsibleContent asChild>
                        <TableRow className="bg-gray-50">
                          <TableCell colSpan={10} className="p-4">
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Invoice History
                              </h4>
                              <div className="overflow-x-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="text-gray-700 font-medium">Invoice No</TableHead>
                                      <TableHead className="text-gray-700 font-medium">Date</TableHead>
                                      <TableHead className="text-gray-700 font-medium">Amount</TableHead>
                                      <TableHead className="text-gray-700 font-medium">Payment Status</TableHead>
                                      <TableHead className="text-gray-700 font-medium">Action</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {customer.invoiceHistory.map((invoice) => (
                                      <TableRow key={invoice.invoiceNo} className="hover:bg-gray-50">
                                        <TableCell className="font-medium text-gray-800">
                                          {invoice.invoiceNo}
                                        </TableCell>
                                        <TableCell className="text-gray-600">
                                          {formatDate(invoice.date)}
                                        </TableCell>
                                        <TableCell className="font-medium text-gray-800">
                                          {formatCurrency(invoice.amount)}
                                        </TableCell>
                                        <TableCell>
                                          <Badge className={getPaymentStatusColor(invoice.paymentStatus)}>
                                            {invoice.paymentStatus.charAt(0).toUpperCase() + invoice.paymentStatus.slice(1)}
                                          </Badge>
                                        </TableCell>
                                        <TableCell>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                                          >
                                            View Invoice
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      </CollapsibleContent>
                    </Collapsible>
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50">
          <div className="text-sm text-gray-700">
            Total Outstanding: <span className="font-semibold text-red-600">
              {formatCurrency(customers.reduce((sum, c) => sum + c.outstandingBalance, 0))}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Showing {customers.length} customers
          </div>
        </div>
      </CardContent>
    </Card>
  );
};