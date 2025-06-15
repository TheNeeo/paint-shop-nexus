import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";

interface InvoiceViewerProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: any;
}

export function InvoiceViewer({ isOpen, onClose, invoice }: InvoiceViewerProps) {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Implement PDF download logic
    console.log("Downloading invoice...");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Invoice Preview - {invoice.invoiceNumber}</DialogTitle>
            <div className="flex gap-2">
              <Button onClick={handlePrint} size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button onClick={handleDownload} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="bg-white p-8 print:p-0">
          {/* Invoice Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
                <p className="text-gray-600 mt-2">Your Paint Store</p>
                <p className="text-sm text-gray-500">
                  123 Paint Street, Color City, PC 12345<br />
                  Phone: (555) 123-4567<br />
                  Email: info@paintstore.com
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-blue-600 mb-2">LOGO</div>
                <div className="space-y-1 text-sm">
                  <p><strong>Invoice #:</strong> {invoice.invoiceNumber}</p>
                  <p><strong>Date:</strong> {invoice.date}</p>
                  <p><strong>Due Date:</strong> {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Bill To:</h3>
              <p className="font-medium">{invoice.customerName}</p>
              <p className="text-sm text-gray-600">
                Customer Address Line 1<br />
                Customer Address Line 2<br />
                City, State 12345
              </p>
            </div>
          </div>

          {/* Invoice Items Table */}
          <div className="mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Qty</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Unit Price</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    <div>
                      <p className="font-medium">{invoice.productName}</p>
                      {invoice.variants && (
                        <div className="mt-2 space-y-1">
                          {invoice.variants.map((variant: any, index: number) => (
                            <p key={index} className="text-sm text-gray-600 ml-4">
                              └ {variant.name}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{invoice.quantity}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">₹{invoice.unitPrice}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">₹{invoice.totalAmount}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{invoice.totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>₹0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18%):</span>
                  <span>₹{(invoice.totalAmount * 0.18).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Grand Total:</span>
                    <span>₹{(invoice.totalAmount * 1.18).toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                  <div className="flex justify-between">
                    <span>Paid Amount:</span>
                    <span className="font-medium">₹{invoice.paidAmount}</span>
                  </div>
                  {invoice.paidAmount < (invoice.totalAmount * 1.18) && (
                    <div className="flex justify-between text-red-600">
                      <span>Pending Amount:</span>
                      <span className="font-medium">₹{((invoice.totalAmount * 1.18) - invoice.paidAmount).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Payment Information:</h3>
              <p>Payment Mode: <span className="font-medium">{invoice.paymentMode}</span></p>
              <p>Payment Status: <span className={`font-medium ${
                invoice.paymentStatus === 'paid' ? 'text-green-600' : 
                invoice.paymentStatus === 'partial' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {invoice.paymentStatus === 'paid' ? 'Paid' : 
                 invoice.paymentStatus === 'partial' ? 'Partial Paid' : 'Pending'}
              </span></p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t pt-6">
            <div className="text-center text-sm text-gray-500">
              <p><strong>Terms & Conditions:</strong></p>
              <p>Payment is due within 30 days of invoice date.</p>
              <p>Thank you for your business!</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
