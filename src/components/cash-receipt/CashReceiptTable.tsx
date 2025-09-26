import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Printer, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CashReceiptTableProps {
  filters: any;
  onEditReceipt: (receipt: any) => void;
}

export function CashReceiptTable({ filters, onEditReceipt }: CashReceiptTableProps) {
  // Mock data
  const receipts = [
    {
      id: 1,
      receiptNo: "CR-2024-001",
      date: "2024-01-15",
      payerName: "ABC Corporation",
      amount: 25000,
      paymentMode: "UPI",
      reason: "Product Payment",
    },
    {
      id: 2,
      receiptNo: "CR-2024-002",
      date: "2024-01-16",
      payerName: "XYZ Ltd",
      amount: 45000,
      paymentMode: "Bank Transfer",
      reason: "Service Payment",
    },
    {
      id: 3,
      receiptNo: "CR-2024-003",
      date: "2024-01-17",
      payerName: "John Doe",
      amount: 15000,
      paymentMode: "Cash",
      reason: "Advance Payment",
    },
  ];

  const getPaymentModeBadge = (mode: string) => {
    const styles = {
      Cash: { backgroundColor: "#7DBE3C", color: "white" },
      UPI: { backgroundColor: "#16583f", color: "white" },
      "Bank Transfer": { backgroundColor: "#059669", color: "white" },
      Cheque: { backgroundColor: "#0d9488", color: "white" },
    };
    
    return (
      <Badge 
        style={styles[mode as keyof typeof styles] || { backgroundColor: "#6b7280", color: "white" }}
      >
        {mode}
      </Badge>
    );
  };

  const handleView = (receipt: any) => {
    console.log("View receipt:", receipt);
  };

  const handlePrint = (receipt: any) => {
    console.log("Print receipt:", receipt);
  };

  const handleDelete = (receipt: any) => {
    console.log("Delete receipt:", receipt);
  };

  return (
    <Card className="shadow-lg border-0">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow style={{ backgroundColor: "rgba(125, 190, 60, 0.1)" }}>
                <TableHead style={{ color: "#16583f", fontWeight: "600" }}>S.No</TableHead>
                <TableHead style={{ color: "#16583f", fontWeight: "600" }}>Receipt No</TableHead>
                <TableHead style={{ color: "#16583f", fontWeight: "600" }}>Date</TableHead>
                <TableHead style={{ color: "#16583f", fontWeight: "600" }}>Payer Name</TableHead>
                <TableHead style={{ color: "#16583f", fontWeight: "600" }}>Amount</TableHead>
                <TableHead style={{ color: "#16583f", fontWeight: "600" }}>Payment Mode</TableHead>
                <TableHead style={{ color: "#16583f", fontWeight: "600" }}>Reason</TableHead>
                <TableHead style={{ color: "#16583f", fontWeight: "600" }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receipts.map((receipt, index) => (
                <TableRow 
                  key={receipt.id}
                  className="hover:bg-green-50/50 transition-colors"
                >
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell 
                    className="font-medium"
                    style={{ color: "#16583f" }}
                  >
                    {receipt.receiptNo}
                  </TableCell>
                  <TableCell>{receipt.date}</TableCell>
                  <TableCell className="font-medium">{receipt.payerName}</TableCell>
                  <TableCell 
                    className="font-bold"
                    style={{ color: "#7DBE3C" }}
                  >
                    ₹{receipt.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>{getPaymentModeBadge(receipt.paymentMode)}</TableCell>
                  <TableCell>{receipt.reason}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(receipt)}
                        className="h-8 w-8 p-0 hover:bg-green-100"
                      >
                        <Eye className="h-4 w-4" style={{ color: "#16583f" }} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditReceipt(receipt)}
                        className="h-8 w-8 p-0 hover:bg-green-100"
                      >
                        <Edit className="h-4 w-4" style={{ color: "#7DBE3C" }} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePrint(receipt)}
                        className="h-8 w-8 p-0 hover:bg-green-100"
                      >
                        <Printer className="h-4 w-4" style={{ color: "#059669" }} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(receipt)}
                        className="h-8 w-8 p-0 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination Footer */}
        <div 
          className="flex items-center justify-between px-6 py-4 border-t"
          style={{ backgroundColor: "rgba(125, 190, 60, 0.05)" }}
        >
          <div 
            className="text-sm font-medium"
            style={{ color: "#16583f" }}
          >
            Total Receipts: {receipts.length} | Total Amount: ₹{receipts.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              style={{ borderColor: "#7DBE3C", color: "#16583f" }}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              style={{ borderColor: "#7DBE3C", color: "#16583f" }}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}