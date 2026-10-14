
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
  ChevronRight,
  FileText,
  User,
  Calendar,
  CreditCard,
  IndianRupee,
  Percent,
  Inbox,
  Paperclip,
  Settings,
} from 'lucide-react';
import { TableHeaderCell } from '@/components/shared/TableHeaderCell';
import { supabase } from '@/integrations/supabase/client';
import { Purchase } from '@/types/purchase';
import { format } from 'date-fns';

// Blue theme colors
const THEME_PRIMARY = '#1e40af';
const THEME_SECONDARY = '#3b82f6';
const THEME_BG = 'rgba(59, 130, 246, 0.1)';
const THEME_BORDER = 'rgba(59, 130, 246, 0.3)';

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
      statusClass = 'bg-red-100 text-red-800';
    } else if (balanceAmount === 0) {
      statusText = 'Paid';
      statusClass = 'bg-green-100 text-green-800';
    } else {
      statusClass = 'bg-blue-100 text-blue-800';
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
      cash: 'bg-green-100 text-green-800',
      upi: 'bg-blue-100 text-blue-800',
      bank_transfer: 'bg-indigo-100 text-indigo-800',
      cheque: 'bg-amber-100 text-amber-800',
      credit_card: 'bg-purple-100 text-purple-800'
    };

    return (
      <Badge className={colors[paymentMethod] || 'bg-gray-100 text-gray-800'}>
        {paymentMethod.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8" style={{ borderColor: THEME_BORDER }}>
        <div className="text-center" style={{ color: THEME_PRIMARY }}>Loading purchases...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border" style={{ borderColor: THEME_BORDER }}>
      <div 
        className="p-4 border-b"
        style={{ 
          background: `linear-gradient(90deg, ${THEME_BG} 0%, rgba(30, 64, 175, 0.15) 100%)`,
          borderColor: THEME_BORDER 
        }}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold" style={{ color: THEME_PRIMARY }}>Purchase Records</h2>
          {selectedPurchases.length > 0 && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-white"
                style={{ backgroundColor: THEME_SECONDARY, borderColor: THEME_SECONDARY }}
              >
                Bulk Delete ({selectedPurchases.length})
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-white"
                style={{ backgroundColor: THEME_PRIMARY, borderColor: THEME_PRIMARY }}
              >
                Export Selected
              </Button>
            </div>
          )}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow 
            className="border-b"
            style={{ 
              background: `linear-gradient(90deg, ${THEME_BG} 0%, rgba(30, 64, 175, 0.15) 100%)`,
              borderColor: THEME_BORDER 
            }}
          >
            <TableHead className="w-12">
              <Checkbox
                checked={selectedPurchases.length === purchases.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="w-12"></TableHead>
            <TableHeaderCell icon={FileText} label="Bill No." textColor={THEME_PRIMARY} iconColor="#ec4899" />
            <TableHeaderCell icon={User} label="Vendor Name" textColor={THEME_PRIMARY} iconColor="#1e40af" />
            <TableHeaderCell icon={Calendar} label="Date" textColor={THEME_PRIMARY} iconColor="#0ea5e9" />
            <TableHeaderCell icon={CreditCard} label="Payment Mode" textColor={THEME_PRIMARY} iconColor="#0d9488" />
            <TableHeaderCell icon={IndianRupee} label="Total Amount" textColor={THEME_PRIMARY} iconColor="#f59e0b" />
            <TableHeaderCell icon={Percent} label="GST %" textColor={THEME_PRIMARY} iconColor="#10b981" />
            <TableHeaderCell icon={Inbox} label="Status" textColor={THEME_PRIMARY} iconColor="#ef4444" />
            <TableHeaderCell icon={Paperclip} label="Bill" textColor={THEME_PRIMARY} iconColor="#8b5cf6" />
            <TableHeaderCell icon={Settings} label="Actions" textColor={THEME_PRIMARY} iconColor="#64748b" align="right" className="text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map((purchase) => (
            <React.Fragment key={purchase.id}>
              <TableRow className="hover:bg-blue-50/50">
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
                    style={{ color: THEME_SECONDARY }}
                    className="hover:bg-blue-100"
                  >
                    {expandedRows.includes(purchase.id) ? 
                      <ChevronDown className="h-4 w-4" /> : 
                      <ChevronRight className="h-4 w-4" />
                    }
                  </Button>
                </TableCell>
                <TableCell className="font-medium" style={{ color: THEME_PRIMARY }}>
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
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        style={{ color: THEME_SECONDARY }}
                        className="hover:bg-blue-100"
                      >
                        <FileImage className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        style={{ color: THEME_SECONDARY }}
                        className="hover:bg-blue-100"
                      >
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
                      <Button 
                        variant="ghost" 
                        className="h-8 w-8 p-0 hover:bg-blue-100"
                        style={{ color: THEME_SECONDARY }}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white">
                      <DropdownMenuItem 
                        onClick={() => onViewInvoice(purchase)} 
                        className="text-white cursor-pointer"
                        style={{ backgroundColor: THEME_SECONDARY }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Invoice
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-white cursor-pointer"
                        style={{ backgroundColor: THEME_PRIMARY }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="cursor-pointer"
                        style={{ backgroundColor: THEME_BG, color: THEME_PRIMARY }}
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Return
                      </DropdownMenuItem>
                      <DropdownMenuItem className="bg-red-600 hover:bg-red-700 text-white cursor-pointer">
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
                  <TableCell 
                    colSpan={11} 
                    className="p-4"
                    style={{ 
                      background: `linear-gradient(90deg, ${THEME_BG} 0%, rgba(30, 64, 175, 0.08) 100%)`,
                      borderColor: THEME_BORDER 
                    }}
                  >
                    <div className="text-sm">
                      <h4 className="font-medium mb-2" style={{ color: THEME_PRIMARY }}>Purchase Details:</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p><strong style={{ color: THEME_PRIMARY }}>Subtotal:</strong> ₹{purchase.subtotal.toLocaleString()}</p>
                          <p><strong style={{ color: THEME_PRIMARY }}>Tax Amount:</strong> ₹{purchase.tax_amount.toLocaleString()}</p>
                          <p><strong style={{ color: THEME_PRIMARY }}>Paid Amount:</strong> ₹{purchase.paid_amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p><strong style={{ color: THEME_PRIMARY }}>Discount:</strong> ₹{purchase.discount_amount.toLocaleString()}</p>
                          <p><strong style={{ color: THEME_PRIMARY }}>Balance Due:</strong> ₹{purchase.balance_amount.toLocaleString()}</p>
                          {purchase.notes && <p><strong style={{ color: THEME_PRIMARY }}>Notes:</strong> {purchase.notes}</p>}
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
        <div className="text-center py-8" style={{ color: THEME_PRIMARY }}>
          No purchase records found
        </div>
      )}
    </div>
  );
};
