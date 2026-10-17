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
import { Eye, Edit, Trash2, ChevronDown, ChevronRight, FileText, AlertCircle, Hash, User, Phone, Mail, ShoppingBag, IndianRupee, Calendar, AlertTriangle, Settings } from 'lucide-react';
import { TableHeaderCell } from '@/components/shared/TableHeaderCell';
import { CustomerHistoryData } from '@/pages/CustomerHistory';

// Ash Grey theme colors
const THEME_PRIMARY = "#6B7B65"; // Dark Ash Grey
const THEME_SECONDARY = "#8A9A84"; // Medium Ash Grey
const THEME_BORDER = "#B6C2AE"; // Ash Grey border
const THEME_TEXT = "#4A5746"; // Dark text for Ash Grey

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
    <Card className="shadow-lg" style={{ borderColor: THEME_BORDER }}>
      <CardHeader style={{ background: `linear-gradient(135deg, ${THEME_PRIMARY} 0%, ${THEME_SECONDARY} 100%)`, borderBottom: `1px solid ${THEME_BORDER}` }}>
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
              <TableRow style={{ background: `linear-gradient(135deg, rgba(182, 194, 174, 0.2) 0%, rgba(182, 194, 174, 0.15) 100%)` }}>
                <TableHead className="font-semibold w-12" style={{ color: THEME_TEXT }}></TableHead>
                <TableHeaderCell icon={Hash} label="S.No" textColor={THEME_TEXT} iconColor="#64748b" />
                <TableHeaderCell icon={User} label="Customer Name" textColor={THEME_TEXT} iconColor="#1e40af" />
                <TableHeaderCell icon={Phone} label="Mobile Number" textColor={THEME_TEXT} iconColor="#10b981" />
                <TableHeaderCell icon={Mail} label="Email" textColor={THEME_TEXT} iconColor="#0ea5e9" />
                <TableHeaderCell icon={ShoppingBag} label="Total Invoices" textColor={THEME_TEXT} iconColor="#8b5cf6" />
                <TableHeaderCell icon={IndianRupee} label="Total Purchase Value" textColor={THEME_TEXT} iconColor="#f59e0b" />
                <TableHeaderCell icon={Calendar} label="Last Purchase Date" textColor={THEME_TEXT} iconColor="#ec4899" />
                <TableHeaderCell icon={AlertTriangle} label="Outstanding Balance" textColor={THEME_TEXT} iconColor="#ef4444" />
                <TableHeaderCell icon={Settings} label="Actions" textColor={THEME_TEXT} iconColor="#64748b" align="center" className="text-center" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8" style={{ color: THEME_TEXT }}>
                    No customer history found
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer, index) => (
                  <React.Fragment key={customer.id}>
                    {/* Parent Row */}
                    <TableRow 
                      className={`hover:bg-green-50/50 transition-colors border-b ${getRowBackgroundColor(customer)}`}
                      style={{ borderColor: `rgba(182, 194, 174, 0.3)` }}
                    >
                      <TableCell className="py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRow(customer.id)}
                          className="h-8 w-8 p-0 hover:bg-green-100"
                          style={{ color: THEME_PRIMARY }}
                        >
                          {expandedRows.has(customer.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium py-4" style={{ color: THEME_TEXT }}>
                        {index + 1}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="font-medium" style={{ color: THEME_TEXT }}>{customer.name}</div>
                        <Badge 
                          variant={customer.customerType === 'wholesale' ? 'default' : 'secondary'}
                          className={customer.customerType === 'wholesale' 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }
                        >
                          {customer.customerType === 'wholesale' ? 'Wholesale' : 'Retail'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4" style={{ color: THEME_TEXT }}>{customer.mobile}</TableCell>
                      <TableCell className="py-4" style={{ color: THEME_TEXT }}>
                        {customer.email || <span className="text-gray-400">-</span>}
                      </TableCell>
                      <TableCell className="font-medium py-4" style={{ color: THEME_TEXT }}>
                        {customer.totalInvoices}
                      </TableCell>
                      <TableCell className="font-medium text-green-600 py-4">
                        {formatCurrency(customer.totalPurchaseValue)}
                      </TableCell>
                      <TableCell className="py-4" style={{ color: THEME_TEXT }}>
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
                            className="h-8 w-8 p-0 hover:bg-green-100"
                            style={{ color: THEME_PRIMARY }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditCustomer(customer)}
                            className="h-8 w-8 p-0 hover:bg-green-100"
                            style={{ color: THEME_PRIMARY }}
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
                          background: `linear-gradient(135deg, rgba(182, 194, 174, 0.08) 0%, rgba(182, 194, 174, 0.12) 100%)`,
                          borderColor: `rgba(182, 194, 174, 0.3)`
                        }}
                      >
                        <TableCell colSpan={10} className="p-0">
                          <div className="p-4">
                            <div 
                              className="bg-white rounded-lg border p-4"
                              style={{ borderColor: THEME_BORDER }}
                            >
                              <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: THEME_TEXT }}>
                                <FileText className="h-4 w-4" style={{ color: THEME_PRIMARY }} />
                                Invoice History
                              </h4>
                              <div className="overflow-x-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow style={{ background: `rgba(182, 194, 174, 0.15)` }}>
                                      <TableHeaderCell icon={FileText} label="Invoice No" textColor={THEME_TEXT} iconColor="#8b5cf6" />
                                      <TableHeaderCell icon={Calendar} label="Date" textColor={THEME_TEXT} iconColor="#0ea5e9" />
                                      <TableHeaderCell icon={IndianRupee} label="Amount" textColor={THEME_TEXT} iconColor="#f59e0b" />
                                      <TableHeaderCell icon={AlertCircle} label="Payment Status" textColor={THEME_TEXT} iconColor="#ef4444" />
                                      <TableHeaderCell icon={Settings} label="Action" textColor={THEME_TEXT} iconColor="#64748b" />
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {customer.invoiceHistory.map((invoice) => (
                                      <TableRow key={invoice.invoiceNo} className="hover:bg-green-50/50">
                                        <TableCell className="font-medium py-3" style={{ color: THEME_TEXT }}>
                                          {invoice.invoiceNo}
                                        </TableCell>
                                        <TableCell className="py-3" style={{ color: THEME_TEXT }}>
                                          {formatDate(invoice.date)}
                                        </TableCell>
                                        <TableCell className="font-medium py-3" style={{ color: THEME_TEXT }}>
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
                                            className="hover:bg-green-50"
                                            style={{ borderColor: THEME_BORDER, color: THEME_PRIMARY }}
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
            background: `linear-gradient(135deg, rgba(182, 194, 174, 0.12) 0%, rgba(182, 194, 174, 0.18) 100%)`,
            borderColor: THEME_BORDER
          }}
        >
          <div className="text-sm" style={{ color: THEME_TEXT }}>
            Total Outstanding: <span className="font-semibold text-red-600">
              {formatCurrency(customers.reduce((sum, c) => sum + c.outstandingBalance, 0))}
            </span>
          </div>
          <div className="text-sm" style={{ color: THEME_TEXT }}>
            Showing {customers.length} customers
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
