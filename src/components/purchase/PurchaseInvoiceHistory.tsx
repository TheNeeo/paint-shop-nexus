
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, Eye, Edit, Trash2, FileDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Purchase } from '@/types/purchase';
import { PurchaseInvoiceModal } from './PurchaseInvoiceModal';
import { format } from 'date-fns';

export const PurchaseInvoiceHistory = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select('*, vendors(name)')
        .order('purchase_date', { ascending: false });

      if (error) throw error;

      const mapped: Purchase[] = (data || []).map((p: any) => ({
        id: p.id,
        invoice_number: p.invoice_number,
        vendor_id: p.vendor_id || '',
        vendor_name: p.vendors?.name || 'Unknown Vendor',
        purchase_date: p.purchase_date,
        total_amount: p.total_amount || 0,
        paid_amount: p.paid_amount || 0,
        balance_amount: p.balance_amount || 0,
        subtotal: p.subtotal || 0,
        tax_amount: p.tax_amount || 0,
        discount_amount: p.discount_amount || 0,
        status: p.status || 'pending',
        payment_method: p.payment_method,
        notes: p.notes,
        invoice_file_url: p.invoice_file_url,
        created_at: p.created_at,
      }));
      setPurchases(mapped);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'received': 'bg-green-100 text-green-800 border-green-200',
      'pending': 'bg-orange-100 text-orange-800 border-orange-200',
      'returned': 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleView = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setIsModalOpen(true);
  };

  const filteredPurchases = purchases.filter(p => {
    const matchesSearch = searchTerm === '' ||
      p.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.vendor_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredPurchases.reduce((s, p) => s + p.total_amount, 0);
  const paidAmount = filteredPurchases.reduce((s, p) => s + p.paid_amount, 0);
  const balanceDue = filteredPurchases.reduce((s, p) => s + p.balance_amount, 0);

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="bg-pink-50 border-pink-200">
        <CardHeader className="bg-pink-100 border-b border-pink-200">
          <CardTitle className="text-pink-800">Search & Filters</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-pink-400" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-pink-300 focus:border-pink-500 focus:ring-pink-500"
              />
            </div>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="border-pink-300">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-pink-300">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-pink-300 text-pink-700 hover:bg-pink-100">
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoice History Table */}
      <Card className="bg-pink-50 border-pink-200">
        <CardHeader className="flex flex-row items-center justify-between bg-pink-100 border-b border-pink-200">
          <CardTitle className="text-pink-800">Purchase Invoice History</CardTitle>
          <Button variant="outline" className="border-pink-300 text-pink-700 hover:bg-pink-100">
            <FileDown className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="text-center py-8 text-pink-600">Loading invoices...</div>
          ) : filteredPurchases.length === 0 ? (
            <div className="text-center py-8 text-pink-600">No purchase invoices found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg">
                <thead>
                  <tr className="border-b border-pink-200 bg-pink-100">
                    <th className="text-left p-4 font-medium text-pink-800">Invoice No.</th>
                    <th className="text-left p-4 font-medium text-pink-800">Vendor Name</th>
                    <th className="text-left p-4 font-medium text-pink-800">Date</th>
                    <th className="text-left p-4 font-medium text-pink-800">Total Amount</th>
                    <th className="text-left p-4 font-medium text-pink-800">Status</th>
                    <th className="text-left p-4 font-medium text-pink-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPurchases.map((purchase) => (
                    <tr key={purchase.id} className="border-b border-pink-100 hover:bg-pink-50">
                      <td className="p-4 font-medium text-pink-700">{purchase.invoice_number}</td>
                      <td className="p-4 text-pink-600">{purchase.vendor_name}</td>
                      <td className="p-4 text-pink-600">{format(new Date(purchase.purchase_date), 'dd/MM/yyyy')}</td>
                      <td className="p-4 font-medium text-pink-700">₹{purchase.total_amount.toLocaleString('en-IN')}</td>
                      <td className="p-4">
                        <Badge className={getStatusBadge(purchase.status)}>
                          {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleView(purchase)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm"
                            className="text-red-600 hover:text-red-800 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-pink-600">
              Showing {filteredPurchases.length} results
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-pink-50 border-pink-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-pink-600">{filteredPurchases.length}</div>
            <div className="text-sm text-pink-500">Total Invoices</div>
          </CardContent>
        </Card>
        <Card className="bg-pink-50 border-pink-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">₹{totalAmount.toLocaleString('en-IN')}</div>
            <div className="text-sm text-pink-500">Total Amount</div>
          </CardContent>
        </Card>
        <Card className="bg-pink-50 border-pink-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-pink-600">₹{paidAmount.toLocaleString('en-IN')}</div>
            <div className="text-sm text-pink-500">Paid Amount</div>
          </CardContent>
        </Card>
        <Card className="bg-pink-50 border-pink-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">₹{balanceDue.toLocaleString('en-IN')}</div>
            <div className="text-sm text-pink-500">Balance Due</div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Modal */}
      <PurchaseInvoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        purchase={selectedPurchase}
      />
    </div>
  );
};
