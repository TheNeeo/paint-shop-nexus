import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Download, Printer } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Purchase, PurchaseItem, Vendor } from '@/types/purchase';
import { format } from 'date-fns';

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
      // Fetch vendor details
      const { data: vendorData, error: vendorError } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', purchase.vendor_id)
        .single();

      if (vendorError) throw vendorError;
      setVendor(vendorData);

      // Fetch purchase items
      const { data: itemsData, error: itemsError } = await supabase
        .from('purchase_items')
        .select('*')
        .eq('purchase_id', purchase.id);

      if (itemsError) throw itemsError;
      setPurchaseItems(itemsData || []);
    } catch (error) {
      console.error('Error fetching purchase details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real application, you would generate a PDF here
    alert('Download functionality would be implemented here');
  };

  if (!purchase) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Purchase Invoice - {purchase.invoice_number}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="text-center py-8">Loading invoice details...</div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h2 className="text-2xl font-bold text-blue-600">Your Company Name</h2>
                <p className="text-gray-600">123 Business Street</p>
                <p className="text-gray-600">City, State 12345</p>
                <p className="text-gray-600">Phone: +91-1234567890</p>
              </div>
              <div className="text-right">
                <h3 className="text-xl font-semibold">PURCHASE INVOICE</h3>
                <p className="text-gray-600">Invoice #: {purchase.invoice_number}</p>
                <p className="text-gray-600">
                  Date: {format(new Date(purchase.purchase_date), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>

            {/* Vendor Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Vendor Details:</h4>
                {vendor && (
                  <div className="text-gray-600">
                    <p className="font-medium">{vendor.name}</p>
                    {vendor.contact_person && <p>{vendor.contact_person}</p>}
                    {vendor.address && <p>{vendor.address}</p>}
                    {vendor.phone && <p>Phone: {vendor.phone}</p>}
                    {vendor.email && <p>Email: {vendor.email}</p>}
                    {vendor.gst_number && <p>GST: {vendor.gst_number}</p>}
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Purchase Details:</h4>
                <div className="text-gray-600">
                  <p>Status: <span className={`font-medium ${
                    purchase.status === 'received' ? 'text-green-600' :
                    purchase.status === 'pending' ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                  </span></p>
                  {purchase.payment_method && (
                    <p>Payment Method: {purchase.payment_method}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-4">Purchase Items:</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Product</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Qty</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Unit Price</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Tax %</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Discount %</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseItems.map((item, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2">{item.product_name}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">{item.quantity}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">₹{item.unit_price.toFixed(2)}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">{item.tax_rate}%</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">{item.discount_rate}%</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">₹{item.total_amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="flex justify-end">
              <div className="w-80 bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{purchase.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax Amount:</span>
                    <span>₹{purchase.tax_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>₹{purchase.discount_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total Amount:</span>
                    <span>₹{purchase.total_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Paid Amount:</span>
                    <span>₹{purchase.paid_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Balance Due:</span>
                    <span>₹{purchase.balance_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {purchase.notes && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Notes:</h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded">{purchase.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 border-t pt-4">
              <p>Thank you for your business!</p>
              <p>Generated on {format(new Date(), 'MMM dd, yyyy HH:mm')}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 border-t pt-4">
              <Button variant="outline" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
