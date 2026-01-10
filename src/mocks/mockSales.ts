export interface SaleRecord {
  id: number;
  date: string;
  invoiceNumber: string;
  customerName: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalAmount: number;
  paidAmount: number;
  paymentMode: string;
  paymentStatus: 'paid' | 'partial' | 'pending';
  variants: SaleVariant[];
}

export interface SaleVariant {
  name: string;
  unitPrice: number;
  stockQuantity: number;
  totalAmount: number;
}

export const mockSales: SaleRecord[] = [
  {
    id: 1,
    date: "2024-01-15",
    invoiceNumber: "INV-001",
    customerName: "John Doe",
    productName: "Paint Brush Set",
    unitPrice: 150,
    quantity: 2,
    totalAmount: 300,
    paidAmount: 300,
    paymentMode: "UPI",
    paymentStatus: "paid",
    variants: [
      { name: "Small Brush", unitPrice: 50, stockQuantity: 25, totalAmount: 100 },
      { name: "Medium Brush", unitPrice: 75, stockQuantity: 15, totalAmount: 150 },
      { name: "Large Brush", unitPrice: 100, stockQuantity: 10, totalAmount: 50 },
    ]
  },
  {
    id: 2,
    date: "2024-01-14",
    invoiceNumber: "INV-002",
    customerName: "Jane Smith",
    productName: "Wall Paint",
    unitPrice: 500,
    quantity: 4,
    totalAmount: 2000,
    paidAmount: 1000,
    paymentMode: "Credit Card",
    paymentStatus: "partial",
    variants: [
      { name: "White Paint 1L", unitPrice: 400, stockQuantity: 50, totalAmount: 1200 },
      { name: "Blue Paint 1L", unitPrice: 450, stockQuantity: 30, totalAmount: 900 },
    ]
  },
  {
    id: 3,
    date: "2024-01-13",
    invoiceNumber: "INV-003",
    customerName: "Bob Johnson",
    productName: "Roller Set",
    unitPrice: 200,
    quantity: 1,
    totalAmount: 200,
    paidAmount: 0,
    paymentMode: "Cash",
    paymentStatus: "pending",
    variants: [
      { name: "9 inch Roller", unitPrice: 120, stockQuantity: 20, totalAmount: 120 },
      { name: "Extension Handle", unitPrice: 80, stockQuantity: 15, totalAmount: 80 },
    ]
  }
];
