
import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronRight, Edit, Trash, Eye, Download } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface SalesTableProps {
  filters: any;
  onViewInvoice: (invoice: any) => void;
}

export function SalesTable({ filters, onViewInvoice }: SalesTableProps) {
  const [sales, setSales] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sales')
        .select('*, sale_items(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSales(data || []);
    } catch (err) {
      console.error('Error fetching sales:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const getPaymentStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      paid: "bg-green-100 text-green-800 border border-green-200",
      partial: "bg-amber-100 text-amber-800 border border-amber-200",
      pending: "bg-red-100 text-red-800 border border-red-200",
    };
    return variants[status] || variants.pending;
  };

  const getPaymentModeBadge = (mode: string) => {
    const variants: Record<string, string> = {
      upi: "bg-purple-100 text-purple-800 border border-purple-200",
      "credit-card": "bg-blue-100 text-blue-800 border border-blue-200",
      cash: "bg-green-100 text-green-800 border border-green-200",
      "bank-transfer": "bg-indigo-100 text-indigo-800 border border-indigo-200",
      cheque: "bg-orange-100 text-orange-800 border border-orange-200",
    };
    return variants[mode || ''] || "bg-gray-100 text-gray-800 border border-gray-200";
  };

  const toggleRowExpansion = (rowId: string) => {
    setExpandedRows(prev => prev.includes(rowId) ? prev.filter(id => id !== rowId) : [...prev, rowId]);
  };

  const toggleRowSelection = (rowId: string) => {
    setSelectedRows(prev => prev.includes(rowId) ? prev.filter(id => id !== rowId) : [...prev, rowId]);
  };

  const filteredSales = sales.filter(sale => {
    const matchesCustomer = !filters.customer || filters.customer === 'all' || (sale.customer_name || '').toLowerCase().includes(filters.customer.toLowerCase());
    const matchesStatus = !filters.status || filters.status === 'all' || sale.payment_status === filters.status;
    const matchesSearch = !filters.search ||
      (sale.invoice_number || '').toLowerCase().includes(filters.search.toLowerCase()) ||
      (sale.customer_name || '').toLowerCase().includes(filters.search.toLowerCase());
    return matchesCustomer && matchesStatus && matchesSearch;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sale?')) return;
    await supabase.from('sales').delete().eq('id', id);
    fetchSales();
  };

  if (loading) {
    return <div className="bg-white rounded-xl border-2 shadow-lg p-8 text-center" style={{ borderColor: '#fce7f3' }}>Loading sales...</div>;
  }

  return (
    <div className="bg-white rounded-xl border-2 shadow-lg overflow-hidden" style={{ borderColor: '#fce7f3' }}>
      <div className="p-4 border-b-2" style={{ background: 'linear-gradient(to right, #fdf2f8, #fff1f2)', borderColor: '#fce7f3' }}>
        <h2 className="text-lg font-semibold" style={{ color: '#831843' }}>Sales Records ({filteredSales.length})</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow style={{ backgroundColor: '#fdf2f8' }}>
            <TableHead className="w-12 font-semibold" style={{ color: '#831843' }}><Checkbox /></TableHead>
            <TableHead className="w-8 font-semibold" style={{ color: '#831843' }}></TableHead>
            <TableHead className="font-semibold" style={{ color: '#831843' }}>Date</TableHead>
            <TableHead className="font-semibold" style={{ color: '#831843' }}>Invoice #</TableHead>
            <TableHead className="font-semibold" style={{ color: '#831843' }}>Customer</TableHead>
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
              <TableRow className="hover:bg-pink-50/50 transition-colors duration-200">
                <TableCell>
                  <Checkbox checked={selectedRows.includes(sale.id)} onCheckedChange={() => toggleRowSelection(sale.id)} />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => toggleRowExpansion(sale.id)} className="p-1 hover:bg-pink-100" style={{ color: '#af0568' }}>
                    {expandedRows.includes(sale.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </TableCell>
                <TableCell className="text-gray-700">{format(new Date(sale.invoice_date), 'MMM dd, yyyy')}</TableCell>
                <TableCell className="font-medium" style={{ color: '#af0568' }}>{sale.invoice_number}</TableCell>
                <TableCell className="text-gray-700">{sale.customer_name || 'Walk-in'}</TableCell>
                <TableCell className="font-semibold" style={{ color: '#831843' }}>₹{Number(sale.total_amount).toLocaleString()}</TableCell>
                <TableCell className="font-semibold text-green-700">₹{Number(sale.paid_amount).toLocaleString()}</TableCell>
                <TableCell>
                  <Badge className={getPaymentModeBadge(sale.payment_mode)}>{(sale.payment_mode || 'N/A').toUpperCase()}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getPaymentStatusBadge(sale.payment_status)}>
                    {sale.payment_status === 'paid' ? 'Paid' : sale.payment_status === 'partial' ? 'Partial' : 'Pending'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="hover:bg-pink-100" style={{ color: '#af0568' }}>Actions</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white border-2" style={{ borderColor: '#fce7f3' }}>
                      <DropdownMenuItem onClick={() => onViewInvoice(sale)} className="hover:bg-pink-50 cursor-pointer">
                        <Eye className="h-4 w-4 mr-2" style={{ color: '#af0568' }} /> View
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 hover:bg-red-50 cursor-pointer" onClick={() => handleDelete(sale.id)}>
                        <Trash className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>

              {expandedRows.includes(sale.id) && sale.sale_items?.map((item: any, index: number) => (
                <TableRow key={`${sale.id}-item-${index}`} style={{ backgroundColor: '#fdf2f8' }} className="border-l-4">
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="pl-8 text-sm" style={{ color: '#9d174d' }}>└ {item.product_name}</TableCell>
                  <TableCell className="text-sm text-gray-600">₹{Number(item.rate).toLocaleString()} × {item.quantity}</TableCell>
                  <TableCell className="text-sm font-medium" style={{ color: '#831843' }}>₹{Number(item.amount).toLocaleString()}</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
          {filteredSales.length === 0 && (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8 text-gray-500">No sales records found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
