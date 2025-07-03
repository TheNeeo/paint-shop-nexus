
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Eye, 
  Edit, 
  Trash2, 
  RotateCcw, 
  MoreHorizontal, 
  FileImage, 
  Download,
  ChevronDown,
  ChevronRight 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Purchase } from '@/types/purchase';
import { format } from 'date-fns';

interface PurchaseTableProps {
  onViewInvoice: (purchase: Purchase) => void;
  refreshTrigger: number;
}

export const PurchaseTable: React.FC<PurchaseTableProps> = ({ 
  onViewInvoice, 
  refreshTrigger 
}) => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [selectedPurchases, setSelectedPurchases] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
  }, [refreshTrigger]);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          *,
          vendors (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedPurchases = data.map(purchase => ({
        ...purchase,
        vendor_name: purchase.vendors?.name || 'Unknown Vendor',
        status: purchase.status as 'pending' | 'received' | 'returned'
      }));

      setPurchases(formattedPurchases);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedPurchases(checked ? purchases.map(p => p.id) : []);
  };

  const handleSelectPurchase = (purchaseId: string, checked: boolean) => {
    setSelectedPurchases(prev => 
      checked 
        ? [...prev, purchaseId]
        : prev.filter(id => id !== purchaseId)
    );
  };

  const toggleRowExpansion = (purchaseId: string) => {
    setExpandedRows(prev =>
      prev.includes(purchaseId)
        ? prev.filter(id => id !== purchaseId)
        : [...prev, purchaseId]
    );
  };

  const getStatusBadge = (status: string, balanceAmount: number) => {
    let statusText = status;
    let statusClass = '';

    if (balanceAmount > 0) {
      statusText = 'Due';
      statusClass = 'bg-rose-100 text-rose-800';
    } else if (balanceAmount === 0) {
      statusText = 'Paid';
      statusClass = 'bg-pink-100 text-pink-800';
    } else {
      statusClass = 'bg-purple-100 text-purple-800';
    }

    return (
      <Badge className={statusClass}>
        {statusText.charAt(0).toUpperCase() + statusText.slice(1)}
      </Badge>
    );
  };

  const getPaymentModeBadge = (paymentMethod: string | null) => {
    if (!paymentMethod) return <span className="text-gray-400">-</span>;
    
    const colors: { [key: string]: string } = {
      cash: 'bg-pink-100 text-pink-800',
      upi: 'bg-purple-100 text-purple-800',
      bank_transfer: 'bg-fuchsia-100 text-fuchsia-800',
      cheque: 'bg-rose-100 text-rose-800',
      credit_card: 'bg-violet-100 text-violet-800'
    };

    return (
      <Badge className={colors[paymentMethod] || 'bg-gray-100 text-gray-800'}>
        {paymentMethod.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-pink-200 p-8">
        <div className="text-center text-pink-700">Loading purchases...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-pink-200">
      <div className="p-4 border-b border-pink-200 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-pink-800">Purchase Records</h2>
          {selectedPurchases.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-pink-300 text-pink-700 hover:bg-pink-100">
                Bulk Delete ({selectedPurchases.length})
              </Button>
              <Button variant="outline" size="sm" className="border-pink-300 text-pink-700 hover:bg-pink-100">
                Export Selected
              </Button>
            </div>
          )}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-pink-100 to-purple-100 border-pink-200">
            <TableHead className="w-12">
              <Checkbox
                checked={selectedPurchases.length === purchases.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="w-12"></TableHead>
            <TableHead className="text-pink-800">📄 Bill No.</TableHead>
            <TableHead className="text-pink-800">👤 Vendor Name</TableHead>
            <TableHead className="text-pink-800">📅 Date</TableHead>
            <TableHead className="text-pink-800">💳 Payment Mode</TableHead>
            <TableHead className="text-pink-800">💰 Total Amount</TableHead>
            <TableHead className="text-pink-800">📊 GST %</TableHead>
            <TableHead className="text-pink-800">📥 Status</TableHead>
            <TableHead className="text-pink-800">📎 Bill</TableHead>
            <TableHead className="text-right text-pink-800">⚙️ Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map((purchase) => (
            <React.Fragment key={purchase.id}>
              <TableRow className="hover:bg-pink-50/50">
                <TableCell>
                  <Checkbox
                    checked={selectedPurchases.includes(purchase.id)}
                    onCheckedChange={(checked) => 
                      handleSelectPurchase(purchase.id, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleRowExpansion(purchase.id)}
                    className="text-pink-600 hover:bg-pink-100"
                  >
                    {expandedRows.includes(purchase.id) ? 
                      <ChevronDown className="h-4 w-4" /> : 
                      <ChevronRight className="h-4 w-4" />
                    }
                  </Button>
                </TableCell>
                <TableCell className="font-medium text-pink-700">
                  {purchase.invoice_number}
                </TableCell>
                <TableCell>{purchase.vendor_name}</TableCell>
                <TableCell>
                  {format(new Date(purchase.purchase_date), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>{getPaymentModeBadge(purchase.payment_method)}</TableCell>
                <TableCell className="font-medium">₹{purchase.total_amount.toLocaleString()}</TableCell>
                <TableCell>{((purchase.tax_amount / purchase.subtotal) * 100).toFixed(1)}%</TableCell>
                <TableCell>{getStatusBadge(purchase.status, purchase.balance_amount)}</TableCell>
                <TableCell>
                  {purchase.invoice_file_url ? (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="text-pink-600 hover:bg-pink-100">
                        <FileImage className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-pink-600 hover:bg-pink-100">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-gray-400">No file</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 text-pink-600 hover:bg-pink-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewInvoice(purchase)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Invoice
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Return
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
              
              {/* Expanded Row for Purchase Details */}
              {expandedRows.includes(purchase.id) && (
                <TableRow>
                  <TableCell colSpan={11} className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 border-pink-200">
                    <div className="text-sm">
                      <h4 className="font-medium mb-2 text-pink-800">Purchase Details:</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p><strong className="text-pink-700">Subtotal:</strong> ₹{purchase.subtotal.toLocaleString()}</p>
                          <p><strong className="text-pink-700">Tax Amount:</strong> ₹{purchase.tax_amount.toLocaleString()}</p>
                          <p><strong className="text-pink-700">Paid Amount:</strong> ₹{purchase.paid_amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p><strong className="text-pink-700">Discount:</strong> ₹{purchase.discount_amount.toLocaleString()}</p>
                          <p><strong className="text-pink-700">Balance Due:</strong> ₹{purchase.balance_amount.toLocaleString()}</p>
                          {purchase.notes && <p><strong className="text-pink-700">Notes:</strong> {purchase.notes}</p>}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>

      {purchases.length === 0 && (
        <div className="text-center py-8 text-pink-600">
          No purchase records found
        </div>
      )}
    </div>
  );
};
