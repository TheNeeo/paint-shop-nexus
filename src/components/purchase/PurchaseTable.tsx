
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
import { Eye, Edit, Trash2, RotateCcw, MoreHorizontal } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Purchase } from '../PurchaseManagement';
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
        vendor_name: purchase.vendors?.name || 'Unknown Vendor'
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

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      received: 'bg-green-100 text-green-800',
      pending: 'bg-orange-100 text-orange-800',
      returned: 'bg-red-100 text-red-800'
    };
    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="text-center">Loading purchases...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Purchase Records</h2>
          {selectedPurchases.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Bulk Delete ({selectedPurchases.length})
              </Button>
              <Button variant="outline" size="sm">
                Export Selected
              </Button>
            </div>
          )}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedPurchases.length === purchases.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>📅 Date</TableHead>
            <TableHead>📄 Invoice Number</TableHead>
            <TableHead>👤 Vendor Name</TableHead>
            <TableHead>💰 Total Amount</TableHead>
            <TableHead>📥 Status</TableHead>
            <TableHead className="text-right">⚙️ Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map((purchase) => (
            <TableRow key={purchase.id}>
              <TableCell>
                <Checkbox
                  checked={selectedPurchases.includes(purchase.id)}
                  onCheckedChange={(checked) => 
                    handleSelectPurchase(purchase.id, checked as boolean)
                  }
                />
              </TableCell>
              <TableCell>
                {format(new Date(purchase.purchase_date), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell className="font-medium">
                {purchase.invoice_number}
              </TableCell>
              <TableCell>{purchase.vendor_name}</TableCell>
              <TableCell>₹{purchase.total_amount.toLocaleString()}</TableCell>
              <TableCell>{getStatusBadge(purchase.status)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
