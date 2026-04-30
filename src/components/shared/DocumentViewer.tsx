import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Printer, CheckCircle, CreditCard, Building2, ClipboardList, Package, Phone, Mail, MapPin, FileText, Heart } from "lucide-react";
import { format } from "date-fns";
import { QRCodeSVG } from "qrcode.react";
import { printElementBySelector } from "@/lib/printUtils";

export type DocumentType = "invoice" | "receipt" | "sales_slip";

interface DocumentItem {
  name: string;
  qty: number;
  rate: number;
  discount: number;
  total: number;
  hsnCode?: string;
  gstPercent?: number;
  unit?: string;
}

export interface DocumentData {
  documentType: DocumentType;
  documentNumber: string;
  date: string;
  // Customer/Vendor info
  partyName: string;
  partyPhone?: string;
  partyEmail?: string;
  partyAddress?: string;
  partyGst?: string;
  // Payment
  paymentStatus: "paid" | "partial" | "pending";
  paymentMode: string;
  transactionId?: string;
  // Items
  items: DocumentItem[];
  // Amounts
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  // Notes
  notes?: string;
  reason?: string;
}

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  data: DocumentData | null;
  loading?: boolean;
}

const DOC_CONFIG: Record<DocumentType, {
  label: string;
  badgeGradient: string;
  headerGradient: string;
  accentColor: string;
  watermarkPaid: string;
  watermarkDue: string;
  partyLabel: string;
  detailsLabel: string;
  itemsLabel: string;
  thankYouMessage: string;
}> = {
  invoice: {
    label: "SALE INVOICE",
    badgeGradient: "linear-gradient(135deg, #5c6bc0, #42a5f5, #7e57c2)",
    headerGradient: "linear-gradient(135deg, #e8eaf6 0%, #c5cae9 30%, #bbdefb 60%, #e1f5fe 100%)",
    accentColor: "#5c6bc0",
    watermarkPaid: "rgba(76, 175, 80, 0.06)",
    watermarkDue: "rgba(244, 67, 54, 0.06)",
    partyLabel: "Customer Details",
    detailsLabel: "Payment Details",
    itemsLabel: "Sale Items",
    thankYouMessage: "Thank you for your business!",
  },
  receipt: {
    label: "CASH RECEIPT",
    badgeGradient: "linear-gradient(135deg, #16583f, #22c55e, #16a34a)",
    headerGradient: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 30%, #d1fae5 60%, #ecfdf5 100%)",
    accentColor: "#16583f",
    watermarkPaid: "rgba(76, 175, 80, 0.06)",
    watermarkDue: "rgba(244, 67, 54, 0.06)",
    partyLabel: "Customer Details",
    detailsLabel: "Payment Details",
    itemsLabel: "Receipt Items",
    thankYouMessage: "Thank you for your payment!",
  },
  sales_slip: {
    label: "SALES SLIP",
    badgeGradient: "linear-gradient(135deg, #f59e0b, #ef4444, #ec4899)",
    headerGradient: "linear-gradient(135deg, #fef3c7 0%, #fde68a 30%, #fed7aa 60%, #fff7ed 100%)",
    accentColor: "#d97706",
    watermarkPaid: "rgba(76, 175, 80, 0.06)",
    watermarkDue: "rgba(244, 67, 54, 0.06)",
    partyLabel: "Customer Details",
    detailsLabel: "Payment Details",
    itemsLabel: "Items",
    thankYouMessage: "Thank you for shopping with us!",
  },
};

function formatINR(val: number) {
  return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}

export function DocumentViewer({ isOpen, onClose, data, loading }: DocumentViewerProps) {
  if (!data) return null;

  const config = DOC_CONFIG[data.documentType];
  const isPaid = data.paymentStatus === "paid";
  const isPending = data.paymentStatus === "pending";

  const statusColor = isPaid ? "text-green-600" : data.paymentStatus === "partial" ? "text-orange-600" : "text-red-600";
  const statusBg = isPaid ? "bg-green-50 border-green-200" : data.paymentStatus === "partial" ? "bg-orange-50 border-orange-200" : "bg-red-50 border-red-200";
  const statusLabel = isPaid ? "Paid" : data.paymentStatus === "partial" ? "Partial" : "Pending";

  const qrValue = JSON.stringify({
    type: data.documentType,
    no: data.documentNumber,
    amount: data.totalAmount,
    date: data.date,
    status: data.paymentStatus,
  });

  const handlePrint = () => printElementBySelector({ selector: ".doc-print-area", title: `${config.label} ${data.documentNumber}` });
  const handleDownload = () => printElementBySelector({ selector: ".doc-print-area", title: `${config.label} ${data.documentNumber}` });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[900px] max-h-[95vh] overflow-y-auto p-0 border-0 rounded-2xl">
        <DialogTitle className="sr-only">Document Preview</DialogTitle>
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : (
          <div className="doc-print-area relative bg-white rounded-2xl">
            {/* Print styles */}
            <style>{`
              @media print {
                body * { visibility: hidden !important; }
                .doc-print-area, .doc-print-area * { visibility: visible !important; }
                .doc-print-area { position: absolute; left: 0; top: 0; width: 100%; }
                .doc-company-name { -webkit-text-fill-color: #1a237e !important; color: #1a237e !important; background: none !important; }
                .doc-badge, .doc-total-badge { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                .doc-header-bg { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                .doc-watermark { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                .no-print { display: none !important; }
              }
            `}</style>

            {/* Watermark */}
            <div className="doc-watermark absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
              <span
                className="text-[120px] font-black rotate-[-30deg] select-none"
                style={{
                  color: isPaid ? "rgba(76, 175, 80, 0.07)" : "rgba(244, 67, 54, 0.07)",
                }}
              >
                {isPaid ? "PAID" : isPending ? "DUE" : "PARTIAL"}
              </span>
            </div>

            {/* Header */}
            <div
              className="doc-header-bg relative overflow-hidden rounded-t-2xl px-6 pt-6 pb-5"
              style={{ background: config.headerGradient }}
            >
              {/* Decorative dots */}
              <div className="absolute top-3 left-1/2 flex gap-1.5 opacity-30">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
                ))}
              </div>

              {/* Decorative corner gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-30 rounded-bl-full"
                style={{ background: config.badgeGradient }} />

              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">🎨</span>
                    <div>
                      <h2
                        className="doc-company-name text-xl font-bold"
                        style={{
                          background: "linear-gradient(90deg, #1a237e, #1565c0, #00897b, #e65100)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        NEO COLOR FACTORY
                      </h2>
                      <p className="text-xs text-gray-500 -mt-0.5">Premium Paints & Coatings</p>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className="doc-badge inline-block px-4 py-1.5 rounded-full text-white font-bold text-sm shadow-md"
                    style={{ background: config.badgeGradient }}
                  >
                    {config.label}
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    {data.documentType === "receipt" ? "Receipt" : "Invoice"} No: <span className="font-bold text-gray-800">{data.documentNumber}</span>
                  </p>
                  <p className="text-xs text-gray-600 flex items-center gap-1 justify-end mt-1">
                    📅 Date: {format(new Date(data.date), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5 bg-gradient-to-b from-slate-50 to-white relative z-10">

              {/* Customer Details + Payment Details */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-blue-600" />
                    </span>
                    <span className="font-bold text-gray-800 text-sm">{config.partyLabel}</span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-700 pl-1">
                    <p className="font-bold text-gray-900 text-base">{data.partyName || "Walk-in Customer"}</p>
                    {data.partyPhone && (
                      <p className="flex items-center gap-2 text-xs">
                        <Phone className="w-3 h-3 text-gray-500" /> {data.partyPhone}
                      </p>
                    )}
                    {data.partyAddress && (
                      <p className="flex items-center gap-2 text-xs">
                        <MapPin className="w-3 h-3 text-gray-500" /> {data.partyAddress}
                      </p>
                    )}
                    {data.partyEmail && (
                      <p className="flex items-center gap-2 text-xs">
                        <Mail className="w-3 h-3 text-gray-500" /> {data.partyEmail}
                      </p>
                    )}
                    {data.partyGst && (
                      <p className="flex items-center gap-2 text-xs">
                        <FileText className="w-3 h-3 text-gray-500" /> GST: {data.partyGst}
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-span-1 flex justify-center">
                  <div className="border-l-2 border-dashed border-gray-200 h-full" />
                </div>

                <div className="col-span-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center">
                      <ClipboardList className="w-4 h-4 text-indigo-600" />
                    </span>
                    <span className="font-bold text-gray-800 text-sm">{config.detailsLabel}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`rounded-lg px-3 py-2 border ${statusBg}`}>
                      <p className="text-[10px] text-gray-500 mb-0.5">Payment Status</p>
                      <p className={`font-bold text-sm flex items-center gap-1 ${statusColor}`}>
                        <CheckCircle className="w-3.5 h-3.5" />
                        {statusLabel}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                      <p className="text-[10px] text-gray-500 mb-0.5">Payment Mode</p>
                      <p className="font-bold text-sm text-gray-800 flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5 text-gray-600" />
                        {data.paymentMode || "N/A"}
                      </p>
                    </div>
                    {data.transactionId && (
                      <div className="col-span-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                        <p className="text-[10px] text-gray-500 mb-0.5">Transaction ID</p>
                        <p className="font-mono text-xs text-gray-800">{data.transactionId}</p>
                      </div>
                    )}
                    {data.reason && (
                      <div className="col-span-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                        <p className="text-[10px] text-gray-500 mb-0.5">Reason</p>
                        <p className="text-xs text-gray-800">{data.reason}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-red-500" />
                  </span>
                  <span className="font-bold text-gray-800 text-sm">{config.itemsLabel}</span>
                </div>
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-3 py-2.5 text-left font-semibold text-gray-700">Description</th>
                        <th className="px-3 py-2.5 text-center font-semibold text-gray-700">Qty</th>
                        <th className="px-3 py-2.5 text-right font-semibold text-gray-700">Rate</th>
                        <th className="px-3 py-2.5 text-center font-semibold text-gray-700">Discount</th>
                        <th className="px-3 py-2.5 text-right font-semibold text-gray-700">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.items.length > 0 ? data.items.map((item, index) => (
                        <tr key={index} className="border-t border-gray-100">
                          <td className="px-3 py-2.5 text-gray-800 flex items-center gap-1.5">
                            <span className="text-sm">🎨</span>
                            {item.name}
                          </td>
                          <td className="px-3 py-2.5 text-center text-gray-700">{item.qty}</td>
                          <td className="px-3 py-2.5 text-right text-gray-700">{formatINR(item.rate)}</td>
                          <td className="px-3 py-2.5 text-center text-gray-700">{formatINR(item.discount)}</td>
                          <td className="px-3 py-2.5 text-right font-semibold text-gray-900">{formatINR(item.total)}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="px-3 py-4 text-center text-gray-400">No items found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary + QR Code */}
              <div className="grid grid-cols-12 gap-4">
                {/* QR Code */}
                <div className="col-span-4 flex flex-col items-center justify-center">
                  <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                    <QRCodeSVG
                      value={qrValue}
                      size={100}
                      level="M"
                      includeMargin={false}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1.5 text-center">Scan to verify</p>
                </div>

                {/* Summary */}
                <div className="col-span-8">
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal:</span>
                      <span className="font-medium">{formatINR(data.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-blue-600">
                      <span>Tax Amount</span>
                      <span className="font-medium">{formatINR(data.taxAmount)}</span>
                    </div>
                    <div className="flex justify-between text-orange-600">
                      <span>Discount:</span>
                      <span className="font-medium">-{formatINR(data.discountAmount)}</span>
                    </div>

                    <div
                      className="doc-total-badge rounded-full px-4 py-2 flex items-center justify-between text-white font-bold"
                      style={{ background: config.badgeGradient }}
                    >
                      <span className="text-xs">Total</span>
                      <span>{formatINR(data.totalAmount)}</span>
                    </div>

                    <div className="flex justify-between text-green-600 pt-1">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Received Amount:
                      </span>
                      <span className="font-bold">{formatINR(data.paidAmount)}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Balance:</span>
                      <span className="font-bold">{formatINR(data.balanceDue)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Heart className="w-4 h-4 text-red-400" />
                  <div>
                    <p className="font-semibold text-gray-700">{config.thankYouMessage}</p>
                    <p className="text-xs text-gray-400">Generated on {format(new Date(), "MMM dd, yyyy HH:mm")}</p>
                  </div>
                </div>

                <div className="flex gap-2 no-print">
                  <Button
                    onClick={handleDownload}
                    size="sm"
                    className="text-white rounded-lg px-4 text-xs"
                    style={{ background: config.badgeGradient }}
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
