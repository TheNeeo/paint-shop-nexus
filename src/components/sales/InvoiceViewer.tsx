import React from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { ProfessionalInvoiceTemplate } from "./ProfessionalInvoiceTemplate";

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

  const handleDownloadPDF = () => {
    // Implement PDF download logic
    console.log("Downloading invoice...");
    // You can use libraries like jsPDF or html2pdf here
  };

  // Transform invoice data for the template
  const templateData = {
    invoiceNumber: invoice.invoiceNumber || "PUR-20260301",
    date: invoice.date || new Date().toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }),
    vendorName: invoice.vendorName || "Asian Paints Ltd",
    vendorContact: invoice.vendorContact || "9876543210",
    vendorEmail: invoice.vendorEmail || "rajesh@asianpaints.com",
    vendorGST: invoice.vendorGST || "27AABCA1234B1Z5",
    vendorAddress: invoice.vendorAddress || "Mumbai, MH",
    invoiceStatus: invoice.status || "Received",
    paymentMethod: invoice.paymentMethod || "Bank Transfer",
    items: invoice.items || [
      {
        product: "Premium Emulsion Paint",
        qty: 50,
        unitPrice: 450,
        taxPercent: 18,
        discountPercent: 5,
        total: 21375,
      },
      {
        product: "Weather Coat Exterior",
        qty: 20,
        unitPrice: 1200,
        taxPercent: 18,
        discountPercent: 10,
        total: 25920,
      },
      {
        product: "Wood Primer",
        qty: 10,
        unitPrice: 800,
        taxPercent: 18,
        discountPercent: 0,
        total: 9440,
      },
    ],
    subtotal: invoice.subtotal || 25000,
    taxAmount: invoice.taxAmount || 4500,
    discount: invoice.discount || 1250,
    totalAmount: invoice.totalAmount || 28250,
    paidAmount: invoice.paidAmount || 28250,
    balanceDue: invoice.balanceDue || 0,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto p-0">
        <ProfessionalInvoiceTemplate
          {...templateData}
          onClose={onClose}
          onDownloadPDF={handleDownloadPDF}
          onPrint={handlePrint}
        />
      </DialogContent>
    </Dialog>
  );
}
