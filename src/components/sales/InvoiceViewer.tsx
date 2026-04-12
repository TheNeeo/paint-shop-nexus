
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Printer, FileText, Phone, Mail, MapPin, CheckCircle, CreditCard, Building2, ClipboardList, Package, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface InvoiceViewerProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: any;
}

export function InvoiceViewer({ isOpen, onClose, invoice }: InvoiceViewerProps) {
  const [customer, setCustomer] = useState<any>(null);
  const [saleItems, setSaleItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (invoice && isOpen) {
      fetchSaleDetails();
    }
  }, [invoice, isOpen]);

  const fetchSaleDetails = async () => {
    if (!invoice) return;
    setLoading(true);
    try {
      if (invoice.customer_id) {
        const { data: customerData } = await supabase
          .from('customers')
          .select('*')
          .eq('id', invoice.customer_id)
          .single();
        setCustomer(customerData);
      }

      // Use embedded sale_items if available, otherwise fetch
      if (invoice.sale_items && invoice.sale_items.length > 0) {
        setSaleItems(invoice.sale_items);
      } else {
        const { data: itemsData } = await supabase
          .from('sale_items')
          .select('*')
          .eq('sale_id', invoice.id);
        setSaleItems(itemsData || []);
      }
    } catch (error) {
      console.error('Error fetching sale details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => window.print();
  const handleDownload = () => { window.print(); };

  if (!invoice) return null;

  const subtotal = invoice.subtotal || saleItems.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
  const taxAmount = invoice.tax_amount || 0;
  const discountAmount = invoice.discount_amount || 0;
  const totalAmount = invoice.total_amount || subtotal + taxAmount - discountAmount;
  const paidAmount = invoice.paid_amount || 0;
  const balanceDue = invoice.pending_amount || (totalAmount - paidAmount);

  const statusColor = invoice.payment_status === 'paid' ? 'text-green-600' :
    invoice.payment_status === 'partial' ? 'text-orange-600' : 'text-red-600';

  const statusLabel = invoice.payment_status === 'paid' ? 'Received' :
    invoice.payment_status === 'partial' ? 'Partial' : 'Pending';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[900px] max-h-[95vh] overflow-y-auto p-0 border-0 rounded-2xl">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading invoice details...</div>
        ) : (
          <div className="relative bg-white rounded-2xl">
            {/* Print styles */}
            <style>{`
              @media print {
                body * { visibility: hidden !important; }
                .invoice-print-area, .invoice-print-area * { visibility: visible !important; }
                .invoice-print-area { position: absolute; left: 0; top: 0; width: 100%; }
                .invoice-company-name { -webkit-text-fill-color: #1a237e !important; color: #1a237e !important; background: none !important; }
                .invoice-badge { background: #5c6bc0 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                .invoice-total-badge { background: #5c6bc0 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                .invoice-header-bg { background: #e8eaf6 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              }
            `}</style>
            {/* Header with gradient */}
            <div className="invoice-header-bg relative overflow-hidden rounded-t-2xl px-6 pt-6 pb-5"
              style={{ background: 'linear-gradient(135deg, #e8eaf6 0%, #c5cae9 30%, #bbdefb 60%, #e1f5fe 100%)' }}>
              {/* Decorative dots */}
              <div className="absolute top-3 left-1/2 flex gap-1.5 opacity-30">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
                ))}
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">🎨</span>
                    <div>
                      <h2 className="invoice-company-name text-xl font-bold" style={{ background: 'linear-gradient(90deg, #1a237e, #1565c0, #00897b, #e65100)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        NEO COLOR FACTORY
                      </h2>
                      <p className="text-xs text-gray-500 -mt-0.5">Premium Paints & Coatings</p>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="invoice-badge inline-block px-4 py-1.5 rounded-full text-white font-bold text-sm"
                    style={{ background: 'linear-gradient(135deg, #5c6bc0, #42a5f5, #7e57c2)' }}>
                    SALE INVOICE
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Invoice # {invoice.invoice_number}</p>
                  <p className="text-xs text-gray-600 flex items-center gap-1 justify-end mt-1">
                    📅 Date: {format(new Date(invoice.invoice_date || invoice.created_at), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5 bg-gradient-to-b from-slate-50 to-white">

              {/* Customer Details + Sale Details row */}
              <div className="grid grid-cols-12 gap-4">
                {/* Customer Details - Left */}
                <div className="col-span-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-blue-600" />
                    </span>
                    <span className="font-bold text-gray-800 text-sm">Customer Details</span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-700 pl-1">
                    <p className="font-bold text-gray-900 text-base">{customer?.name || invoice.customer_name || 'Walk-in Customer'}</p>
                    {customer?.mobile && (
                      <p className="flex items-center gap-2 text-xs">
                        <Phone className="w-3 h-3 text-gray-500" /> {customer.mobile}
                      </p>
                    )}
                    {customer?.address && (
                      <p className="flex items-center gap-2 text-xs">
                        <MapPin className="w-3 h-3 text-gray-500" /> {customer.address}
                      </p>
                    )}
                    {customer?.email && (
                      <p className="flex items-center gap-2 text-xs">
                        <Mail className="w-3 h-3 text-gray-500" /> {customer.email}
                      </p>
                    )}
                    {customer?.gst_no && (
                      <p className="flex items-center gap-2 text-xs">
                        <FileText className="w-3 h-3 text-gray-500" /> GST: {customer.gst_no}
                      </p>
                    )}
                  </div>
                </div>

                {/* Dotted vertical separator */}
                <div className="col-span-1 flex justify-center">
                  <div className="border-l-2 border-dashed border-gray-200 h-full" />
                </div>

                {/* Sale Details - Right */}
                <div className="col-span-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center">
                      <ClipboardList className="w-4 h-4 text-indigo-600" />
                    </span>
                    <span className="font-bold text-gray-800 text-sm">Sale Details</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                      <p className="text-[10px] text-gray-500 mb-0.5">Status</p>
                      <p className={`font-bold text-sm flex items-center gap-1 ${statusColor}`}>
                        <CheckCircle className="w-3.5 h-3.5" />
                        {statusLabel}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                      <p className="text-[10px] text-gray-500 mb-0.5">Payment Method</p>
                      <p className="font-bold text-sm text-gray-800 flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5 text-gray-600" />
                        {invoice.payment_mode || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table + Summary side by side */}
              <div className="grid grid-cols-12 gap-4">
                {/* Items Table - Left */}
                <div className="col-span-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center">
                      <Package className="w-4 h-4 text-red-500" />
                    </span>
                    <span className="font-bold text-gray-800 text-sm">Sale Items</span>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-3 py-2.5 text-left font-semibold text-gray-700">Product</th>
                          <th className="px-3 py-2.5 text-center font-semibold text-gray-700">Qty</th>
                          <th className="px-3 py-2.5 text-right font-semibold text-gray-700">Unit Price</th>
                          <th className="px-3 py-2.5 text-center font-semibold text-gray-700">Tax %</th>
                          <th className="px-3 py-2.5 text-center font-semibold text-gray-700">Discount %</th>
                          <th className="px-3 py-2.5 text-right font-semibold text-gray-700">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {saleItems.length > 0 ? saleItems.map((item: any, index: number) => (
                          <tr key={index} className="border-t border-gray-100">
                            <td className="px-3 py-2.5 text-gray-800 flex items-center gap-1.5">
                              <span className="text-sm">🎨</span>
                              {item.product_name}
                            </td>
                            <td className="px-3 py-2.5 text-center text-gray-700">{item.quantity || 0}</td>
                            <td className="px-3 py-2.5 text-right text-gray-700">₹{(item.rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td className="px-3 py-2.5 text-center text-gray-700">{item.gst_percent || 0}%</td>
                            <td className="px-3 py-2.5 text-center text-gray-700">0%</td>
                            <td className="px-3 py-2.5 text-right font-semibold text-gray-900">₹{(item.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={6} className="px-3 py-4 text-center text-gray-400">No items found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Summary - Right */}
                <div className="col-span-4 flex flex-col justify-between">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span className="font-medium">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-blue-600">
                      <span>Tax Amount</span>
                      <span className="font-medium">₹{taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-orange-600">
                      <span>Discount</span>
                      <span className="font-medium">-₹{discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>

                    {/* Total Amount badge */}
                    <div className="invoice-total-badge rounded-full px-4 py-2 flex items-center justify-between text-white font-bold"
                      style={{ background: 'linear-gradient(135deg, #5c6bc0, #42a5f5, #7e57c2)' }}>
                      <span className="text-xs">Total Amount</span>
                      <span>₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex justify-between text-green-600 pt-1">
                      <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Paid Amount</span>
                      <span className="font-bold">₹{paidAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span className="flex items-center gap-1">⚠ Balance Due</span>
                      <span className="font-bold">₹{balanceDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-xl">🤝</span>
                  <div>
                    <p className="font-semibold text-gray-700">Thank you for your business!</p>
                    <p className="text-xs text-gray-400">Generated on {format(new Date(), 'MMM dd, yyyy HH:mm')}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleDownload}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 text-xs"
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    Download PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrint}
                    className="rounded-lg px-4 border-gray-300 text-xs"
                  >
                    <Printer className="w-3.5 h-3.5 mr-1.5" />
                    Print
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onClose}
                    className="rounded-lg px-4 border-gray-300 text-xs"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
