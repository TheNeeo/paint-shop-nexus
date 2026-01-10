export interface InvoiceHistory {
  id: string;
  invoiceNo: string;
  supplierName: string;
  date: string;
  totalAmount: number;
  paymentStatus: 'Paid' | 'Partial' | 'Pending';
}

export const mockInvoices: InvoiceHistory[] = [
  {
    id: '1',
    invoiceNo: 'PI-2024-001',
    supplierName: 'ABC Suppliers',
    date: '2024-01-15',
    totalAmount: 25000,
    paymentStatus: 'Paid'
  },
  {
    id: '2',
    invoiceNo: 'PI-2024-002',
    supplierName: 'XYZ Industries',
    date: '2024-01-16',
    totalAmount: 18500,
    paymentStatus: 'Partial'
  },
  {
    id: '3',
    invoiceNo: 'PI-2024-003',
    supplierName: 'DEF Traders',
    date: '2024-01-17',
    totalAmount: 12000,
    paymentStatus: 'Pending'
  }
];
