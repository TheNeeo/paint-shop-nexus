import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Printer, X } from "lucide-react";
import { motion } from "framer-motion";

interface InvoiceItem {
  product: string;
  qty: number;
  unitPrice: number;
  taxPercent: number;
  discountPercent: number;
  total: number;
}

interface ProfessionalInvoiceTemplateProps {
  invoiceNumber: string;
  date: string;
  vendorName: string;
  vendorContact: string;
  vendorEmail: string;
  vendorGST: string;
  vendorAddress: string;
  invoiceStatus: "Received" | "Pending" | "Paid";
  paymentMethod: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  onClose?: () => void;
  onDownloadPDF?: () => void;
  onPrint?: () => void;
}

export function ProfessionalInvoiceTemplate({
  invoiceNumber,
  date,
  vendorName,
  vendorContact,
  vendorEmail,
  vendorGST,
  vendorAddress,
  invoiceStatus,
  paymentMethod,
  items,
  subtotal,
  taxAmount,
  discount,
  totalAmount,
  paidAmount,
  balanceDue,
  onClose,
  onDownloadPDF,
  onPrint,
}: ProfessionalInvoiceTemplateProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Received":
        return "bg-green-100 text-green-700";
      case "Paid":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-5xl mx-auto"
    >
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">NEO COLOR FACTORY</h1>
          <p className="text-blue-100 text-sm">Premium Paints & Coatings</p>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold text-white">PURCHASE INVOICE</h2>
          <p className="text-blue-100 text-sm">Invoice # {invoiceNumber}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 space-y-6">
        {/* Top Section - Date and Status */}
        <div className="flex items-start justify-between border-b pb-4">
          <div>
            <p className="text-sm text-gray-600">Date</p>
            <p className="text-lg font-semibold text-gray-900">📅 {date}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge className={`${getStatusColor(invoiceStatus)} border-0`}>
                  ✓ {invoiceStatus}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="text-sm font-medium text-gray-900">🏦 {paymentMethod}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vendor and Purchase Details */}
        <div className="grid grid-cols-2 gap-8">
          {/* Vendor Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b">
              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                <span className="text-pink-600 font-bold">🏢</span>
              </div>
              <h3 className="font-bold text-gray-900">Vendor Details</h3>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-gray-900">{vendorName}</p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span>☎️</span> {vendorContact}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span>📍</span> {vendorAddress}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span>✉️</span> {vendorEmail}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span>📋</span> GST: {vendorGST}
              </p>
            </div>
          </div>

          {/* Purchase Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold">📦</span>
              </div>
              <h3 className="font-bold text-gray-900">Purchase Details</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status</span>
                <Badge className={`${getStatusColor(invoiceStatus)} border-0`}>
                  ✓ {invoiceStatus}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment Method</span>
                <p className="font-medium text-gray-900">🏦 {paymentMethod}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="space-y-3">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <span className="w-6 h-6 bg-red-100 rounded flex items-center justify-center text-red-600">🛒</span>
            Purchase Items
          </h3>
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#f5f7fa" }}>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Product</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Qty</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Unit Price</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Tax %</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Discount %</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📍</span>
                        <span className="font-medium text-gray-900">{item.product}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">{item.qty}</td>
                    <td className="px-4 py-3 text-right text-gray-900 font-medium">
                      ₹{item.unitPrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {item.taxPercent}%
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {item.discountPercent}%
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                      ₹{item.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {/* Empty column for layout */}
          <div></div>

          {/* Financial Summary */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Tax Amount</span>
              <span className="font-semibold text-gray-900">₹{taxAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Discount</span>
              <span className="font-semibold text-red-600">-₹{discount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg">
              <span className="text-white font-semibold">Total Amount</span>
              <span className="text-white font-bold text-xl">₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Paid Amount</span>
              <span className="font-semibold text-green-600">✓ ₹{paidAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 font-semibold">Balance Due</span>
              <span className={`font-bold text-lg ${balanceDue > 0 ? "text-red-600" : "text-green-600"}`}>
                {balanceDue > 0 ? "🔴" : "✅"} ₹{balanceDue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <span className="text-xl">❤️</span>
          <div>
            <p className="font-semibold text-gray-900">Thank you for your business!</p>
            <p className="text-sm text-gray-600">Generated on {new Date().toLocaleString("en-IN", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-gray-50 border-t px-8 py-4 flex items-center justify-end gap-3">
        <Button
          onClick={onDownloadPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        <Button
          onClick={onPrint}
          variant="outline"
        >
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button
          onClick={onClose}
          variant="outline"
        >
          <X className="h-4 w-4 mr-2" />
          Close
        </Button>
      </div>
    </motion.div>
  );
}
