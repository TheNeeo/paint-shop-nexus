import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Download, Printer, FileText, Phone, Mail, Globe, CheckCircle, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Purchase, PurchaseItem, Vendor } from '@/types/purchase';
import { format } from 'date-fns';
import { printElementBySelector } from '@/lib/printUtils';

interface PurchaseInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchase: Purchase | null;
}

export const PurchaseInvoiceModal: React.FC<PurchaseInvoiceModalProps> = ({
  isOpen,
  onClose,
  purchase
}) => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (purchase && isOpen) {
      fetchPurchaseDetails();
    }
  }, [purchase, isOpen]);

  const fetchPurchaseDetails = async () => {
    if (!purchase) return;
    setLoading(true);
    try {
      const { data: vendorData } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', purchase.vendor_id)
        .single();
      setVendor(vendorData);

      const { data: itemsData } = await supabase
        .from('purchase_items')
        .select('*')
        .eq('purchase_id', purchase.id);
      setPurchaseItems(itemsData || []);
    } catch (error) {
      console.error('Error fetching purchase details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => printElementBySelector({ selector: '.purchase-invoice-print-area', title: `Purchase Invoice ${purchase?.invoice_number || ''}` });
  const handleDownload = () => printElementBySelector({ selector: '.purchase-invoice-print-area', title: `Purchase Invoice ${purchase?.invoice_number || ''}` });

  if (!purchase) return null;

  const statusColor = purchase.status === 'received' ? 'text-green-600' :
    purchase.status === 'pending' ? 'text-orange-600' : 'text-red-600';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto p-0 border-0 rounded-3xl">
        <DialogTitle className="sr-only">Purchase Invoice Preview</DialogTitle>
        {loading ? (
          <div className="text-center py-12">Loading invoice details...</div>
        ) : (
          <div className="purchase-invoice-print-area relative">
            {/* Colorful Header with gradient */}
            <div className="relative overflow-hidden rounded-t-3xl px-8 pt-8 pb-10"
              style={{ background: 'linear-gradient(135deg, #e8eaf6 0%, #c5cae9 30%, #bbdefb 60%, #e1f5fe 100%)' }}>
              {/* Decorative confetti dots */}
              <div className="absolute top-4 right-20 w-2 h-2 bg-yellow-400 rotate-45"></div>
              <div className="absolute top-8 right-40 w-1.5 h-1.5 bg-indigo-500 rotate-12"></div>
              <div className="absolute top-12 left-1/2 w-1 h-3 bg-orange-400 rotate-45"></div>
              <div className="absolute bottom-6 left-1/3 w-1.5 h-1.5 bg-blue-400 rotate-45"></div>
              
              {/* Invoice illustration placeholder */}
              <div className="absolute right-6 top-4 w-48 h-40 opacity-30">
                <div className="relative w-full h-full">
                  <div className="absolute right-0 top-0 w-24 h-32 bg-white/60 rounded-lg shadow-lg transform rotate-3"></div>
                  <div className="absolute right-4 top-2 w-24 h-32 bg-white/40 rounded-lg shadow-md transform -rotate-3"></div>
                  <div className="absolute right-8 bottom-0 w-16 h-16 bg-amber-300/40 rounded-full"></div>
                </div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 text-gray-700 mb-1">
                  <FileText className="w-5 h-5" />
                  <span className="text-sm font-medium">Purchase Invoice - {purchase.invoice_number}</span>
                </div>
                <h2 className="text-3xl font-bold text-indigo-700 mb-3">Your Company Name</h2>
                <div className="text-gray-700 text-sm space-y-0.5">
                  <p>123 Business Street</p>
                  <p>City, State 12345</p>
                  <p>Phone: +91-1234567890</p>
                </div>
              </div>
            </div>

            {/* Body content */}
            <div className="px-8 py-6 space-y-6" style={{ background: 'linear-gradient(180deg, #f5f3ff 0%, #faf5ff 50%, #fce4ec08 100%)' }}>
              
              {/* Vendor + Purchase Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vendor Details Card */}
                <div className="bg-white/80 rounded-2xl p-5 shadow-sm border border-indigo-100">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    Vendor Details:
                  </h4>
                  {vendor && (
                    <div className="space-y-1.5 text-sm text-gray-700">
                      <p className="font-semibold text-indigo-700 flex items-center gap-2">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                        {vendor.name}
                      </p>
                      {vendor.contact_person && <p className="ml-4">{vendor.contact_person}</p>}
                      {vendor.address && <p className="ml-4">{vendor.address}</p>}
                      {vendor.phone && (
                        <p className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-green-600" />
                          {vendor.phone}
                        </p>
                      )}
                      {vendor.email && (
                        <p className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-blue-600" />
                          {vendor.email}
                        </p>
                      )}
                      {vendor.gst_number && (
                        <p className="flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5 text-indigo-600" />
                          GST: {vendor.gst_number}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Purchase Details Card */}
                <div className="bg-white/80 rounded-2xl p-5 shadow-sm border border-indigo-100">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    Purchase Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-semibold ${statusColor}`}>
                        {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                      </span>
                    </p>
                    {purchase.payment_method && (
                      <p className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-amber-500" />
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="text-gray-800">{purchase.payment_method}</span>
                      </p>
                    )}
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    Date: {format(new Date(purchase.purchase_date), 'MMM dd, yyyy')}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h4 className="font-bold text-gray-800 mb-3">Purchase Items:</h4>
                <div className="overflow-x-auto rounded-xl border border-indigo-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-indigo-50 text-indigo-900">
                        <th className="px-4 py-3 text-left font-semibold border-b border-indigo-100">Product</th>
                        <th className="px-4 py-3 text-center font-semibold border-b border-indigo-100">Qty</th>
                        <th className="px-4 py-3 text-right font-semibold border-b border-indigo-100">Unit Price</th>
                        <th className="px-4 py-3 text-center font-semibold border-b border-indigo-100">Tax %</th>
                        <th className="px-4 py-3 text-center font-semibold border-b border-indigo-100">Discount %</th>
                        <th className="px-4 py-3 text-right font-semibold border-b border-indigo-100">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {purchaseItems.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-indigo-50/30">
                          <td className="px-4 py-3 text-gray-800">{item.product_name}</td>
                          <td className="px-4 py-3 text-center text-gray-700">{item.quantity}</td>
                          <td className="px-4 py-3 text-right text-gray-700">₹{item.unit_price.toFixed(0)}</td>
                          <td className="px-4 py-3 text-center text-gray-700">{item.tax_rate}</td>
                          <td className="px-4 py-3 text-center text-gray-700">{item.discount_rate}%</td>
                          <td className="px-4 py-3 text-right font-semibold text-indigo-800">₹{item.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Labels card */}
                <div className="bg-white/80 rounded-2xl p-5 shadow-sm border border-indigo-100">
                  <div className="space-y-3">
                    <p className="font-semibold text-gray-800">Subtotal:</p>
                    <p className="font-semibold text-gray-800">Tax Amount:</p>
                    <p className="font-semibold text-gray-800">Discount:</p>
                    <div className="border-t border-gray-200 pt-2">
                      <p className="font-bold text-gray-900 text-lg">Total Amount:</p>
                    </div>
                    <p className="text-green-600 font-medium flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Paid Amount
                    </p>
                  </div>
                </div>

                {/* Values card */}
                <div className="bg-white/80 rounded-2xl p-5 shadow-sm border border-indigo-100">
                  <div className="space-y-3 text-right">
                    <p className="text-gray-700">
                      <span className="text-gray-500 float-left text-sm">Subtotal:</span>
                      ₹{purchase.subtotal.toFixed(2)}
                    </p>
                    <p className="text-gray-700">
                      <span className="text-gray-500 float-left text-sm">Tax Amount:</span>
                      ₹{purchase.tax_amount.toFixed(2)}
                    </p>
                    <p className="text-gray-700">
                      <span className="text-gray-500 float-left text-sm">Discount:</span>
                      ₹{purchase.discount_amount.toFixed(2)}
                    </p>
                    <div className="border-t border-gray-200 pt-2">
                      <p className="font-bold text-gray-900 text-lg">
                        <span className="text-gray-700 float-left text-base font-semibold">Total Amount:</span>
                        ₹{purchase.total_amount.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-green-600 font-semibold">
                      <span className="text-green-600 float-left text-sm">Paid Amount:</span>
                      ₹{purchase.paid_amount.toFixed(2)}
                    </p>
                    <p className="text-red-600 font-semibold">
                      <span className="text-red-600 float-left text-sm">Balance Due:</span>
                      ₹{purchase.balance_amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {purchase.notes && (
                <div className="bg-white/80 rounded-2xl p-4 shadow-sm border border-indigo-100">
                  <h4 className="font-semibold text-gray-700 mb-1 text-sm">Notes:</h4>
                  <p className="text-gray-600 text-sm">{purchase.notes}</p>
                </div>
              )}

              {/* Footer */}
              <div className="text-center text-sm text-gray-500 border-t border-gray-200 pt-4">
                <p>Thank you for your business!</p>
                <p>Generated on {format(new Date(), 'MMM dd, yyyy HH:mm')}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 pb-2 no-print">
                <Button 
                  onClick={handleDownload}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handlePrint}
                  className="rounded-full px-6 border-gray-300"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button 
                  onClick={onClose}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
