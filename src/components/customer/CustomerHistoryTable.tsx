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
    <Card className="shadow-lg" style={{ borderColor: '#0EACDD' }}>
      <CardHeader style={{ background: 'linear-gradient(135deg, #0EACDD 0%, #0A8CB3 100%)', borderBottom: '1px solid #0EACDD' }}>
        <CardTitle className="text-white flex items-center gap-2">
          Customer Purchase History
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {customers.length} customers
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow style={{ background: 'linear-gradient(135deg, rgba(14, 172, 221, 0.15) 0%, rgba(14, 172, 221, 0.1) 100%)' }}>
                <TableHead className="font-semibold w-12" style={{ color: '#087A9E' }}></TableHead>
                <TableHead className="font-semibold" style={{ color: '#087A9E' }}>S.No</TableHead>
                <TableHead className="font-semibold" style={{ color: '#087A9E' }}>Customer Name</TableHead>
                <TableHead className="font-semibold" style={{ color: '#087A9E' }}>Mobile Number</TableHead>
                <TableHead className="font-semibold" style={{ color: '#087A9E' }}>Email</TableHead>
                <TableHead className="font-semibold" style={{ color: '#087A9E' }}>Total Invoices</TableHead>
                <TableHead className="font-semibold" style={{ color: '#087A9E' }}>Total Purchase Value</TableHead>
                <TableHead className="font-semibold" style={{ color: '#087A9E' }}>Last Purchase Date</TableHead>
                <TableHead className="font-semibold" style={{ color: '#087A9E' }}>Outstanding Balance</TableHead>
                <TableHead className="font-semibold text-center" style={{ color: '#087A9E' }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8" style={{ color: '#087A9E' }}>
                    No customer history found
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer, index) => (
                  <React.Fragment key={customer.id}>
                    {/* Parent Row */}
                    <TableRow 
                      className={`hover:bg-cyan-50/50 transition-colors border-b ${getRowBackgroundColor(customer)}`}
                      style={{ borderColor: 'rgba(14, 172, 221, 0.2)' }}
                    >
                      <TableCell className="py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRow(customer.id)}
                          className="h-8 w-8 p-0 hover:bg-cyan-100"
                          style={{ color: '#0EACDD' }}
                        >
                          {expandedRows.has(customer.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium py-4" style={{ color: '#087A9E' }}>
                        {index + 1}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="font-medium" style={{ color: '#087A9E' }}>{customer.name}</div>
                        <Badge 
                          variant={customer.customerType === 'wholesale' ? 'default' : 'secondary'}
                          className={customer.customerType === 'wholesale' 
                            ? 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200' 
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }
                        >
                          {customer.customerType === 'wholesale' ? 'Wholesale' : 'Retail'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4" style={{ color: '#087A9E' }}>{customer.mobile}</TableCell>
                      <TableCell className="py-4" style={{ color: '#087A9E' }}>
                        {customer.email || <span className="text-gray-400">-</span>}
                      </TableCell>
                      <TableCell className="font-medium py-4" style={{ color: '#087A9E' }}>
                        {customer.totalInvoices}
                      </TableCell>
                      <TableCell className="font-medium text-green-600 py-4">
                        {formatCurrency(customer.totalPurchaseValue)}
                      </TableCell>
                      <TableCell className="py-4" style={{ color: '#087A9E' }}>
                        {formatDate(customer.lastPurchaseDate)}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          {customer.outstandingBalance > 10000 && (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className={customer.outstandingBalance > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                            {formatCurrency(customer.outstandingBalance)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2 justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewDetails(customer)}
                            className="h-8 w-8 p-0 hover:bg-cyan-100"
                            style={{ color: '#0EACDD' }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditCustomer(customer)}
                            className="h-8 w-8 p-0 hover:bg-cyan-100"
                            style={{ color: '#0EACDD' }}
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
                    
                    {/* Child Row - Invoice History (only shown when expanded) */}
                    {expandedRows.has(customer.id) && (
                      <TableRow 
                        className="border-b"
                        style={{ 
                          background: 'linear-gradient(135deg, rgba(14, 172, 221, 0.05) 0%, rgba(14, 172, 221, 0.08) 100%)',
                          borderColor: 'rgba(14, 172, 221, 0.2)'
                        }}
                      >
                        <TableCell colSpan={10} className="p-0">
                          <div className="p-4">
                            <div 
                              className="bg-white rounded-lg border p-4"
                              style={{ borderColor: '#0EACDD' }}
                            >
                              <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#087A9E' }}>
                                <FileText className="h-4 w-4" style={{ color: '#0EACDD' }} />
                                Invoice History
                              </h4>
                              <div className="overflow-x-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow style={{ background: 'rgba(14, 172, 221, 0.08)' }}>
                                      <TableHead className="font-medium" style={{ color: '#087A9E' }}>Invoice No</TableHead>
                                      <TableHead className="font-medium" style={{ color: '#087A9E' }}>Date</TableHead>
                                      <TableHead className="font-medium" style={{ color: '#087A9E' }}>Amount</TableHead>
                                      <TableHead className="font-medium" style={{ color: '#087A9E' }}>Payment Status</TableHead>
                                      <TableHead className="font-medium" style={{ color: '#087A9E' }}>Action</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {customer.invoiceHistory.map((invoice) => (
                                      <TableRow key={invoice.invoiceNo} className="hover:bg-cyan-50/50">
                                        <TableCell className="font-medium py-3" style={{ color: '#087A9E' }}>
                                          {invoice.invoiceNo}
                                        </TableCell>
                                        <TableCell className="py-3" style={{ color: '#087A9E' }}>
                                          {formatDate(invoice.date)}
                                        </TableCell>
                                        <TableCell className="font-medium py-3" style={{ color: '#087A9E' }}>
                                          {formatCurrency(invoice.amount)}
                                        </TableCell>
                                        <TableCell className="py-3">
                                          <Badge className={getPaymentStatusColor(invoice.paymentStatus)}>
                                            {invoice.paymentStatus.charAt(0).toUpperCase() + invoice.paymentStatus.slice(1)}
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="py-3">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="hover:bg-cyan-50"
                                            style={{ borderColor: '#0EACDD', color: '#0EACDD' }}
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
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Footer */}
        <div 
          className="flex items-center justify-between p-4 border-t"
          style={{ 
            background: 'linear-gradient(135deg, rgba(14, 172, 221, 0.08) 0%, rgba(14, 172, 221, 0.12) 100%)',
            borderColor: '#0EACDD'
          }}
        >
          <div className="text-sm" style={{ color: '#087A9E' }}>
            Total Outstanding: <span className="font-semibold text-red-600">
              {formatCurrency(customers.reduce((sum, c) => sum + c.outstandingBalance, 0))}
            </span>
          </div>
          <div className="text-sm" style={{ color: '#087A9E' }}>
            Showing {customers.length} customers
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
