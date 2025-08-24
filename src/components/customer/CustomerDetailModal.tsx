import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  DollarSign,
  FileText,
  Clock
} from 'lucide-react';
import { CustomerHistoryData } from '@/pages/CustomerHistory';

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerHistoryData | null;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  isOpen,
  onClose,
  customer
}) => {
  if (!customer) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-gray-100 text-gray-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <User className="h-5 w-5 text-gray-600" />
            Customer Details
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Complete profile and purchase history information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Customer Profile Section */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Profile
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{customer.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Mobile</p>
                    <p className="font-medium text-gray-900">{customer.mobile}</p>
                  </div>
                </div>
                
                {customer.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{customer.email}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Customer Type</p>
                    <Badge 
                      variant={customer.customerType === 'wholesale' ? 'default' : 'secondary'}
                      className={customer.customerType === 'wholesale' 
                        ? 'bg-gray-100 text-gray-700' 
                        : 'bg-slate-100 text-slate-700'
                      }
                    >
                      {customer.customerType === 'wholesale' ? 'Wholesale' : 'Retail'}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Customer Since</p>
                    <p className="font-medium text-gray-900">{formatDate(customer.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="border-gray-200" />

          {/* Purchase Summary */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Purchase Summary
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Total Invoices</p>
                <p className="text-xl font-bold text-gray-900">{customer.totalInvoices}</p>
              </div>
              
              <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Total Purchase</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(customer.totalPurchaseValue)}</p>
              </div>
              
              <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Outstanding</p>
                <p className={`text-xl font-bold ${customer.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(customer.outstandingBalance)}
                </p>
              </div>
              
              <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Last Purchase</p>
                <p className="text-sm font-medium text-gray-900">
                  {customer.lastPurchaseDate ? formatDate(customer.lastPurchaseDate) : 'Never'}
                </p>
              </div>
            </div>
          </div>

          <Separator className="border-gray-200" />

          {/* Purchase History Timeline */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Purchase History
            </h3>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {customer.invoiceHistory.map((invoice) => (
                <div key={invoice.invoiceNo} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">{invoice.invoiceNo}</p>
                      <p className="text-sm text-gray-500">{formatDate(invoice.date)}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(invoice.amount)}</p>
                    <Badge className={getPaymentStatusColor(invoice.paymentStatus)}>
                      {invoice.paymentStatus.charAt(0).toUpperCase() + invoice.paymentStatus.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
              
              {customer.invoiceHistory.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No purchase history available
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-200">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Close
          </Button>
          <Button 
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Edit Customer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};