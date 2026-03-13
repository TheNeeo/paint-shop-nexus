import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Printer, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CashReceiptTableProps {
  filters: any;
  onEditReceipt: (receipt: any) => void;
}

export function CashReceiptTable({ filters, onEditReceipt }: CashReceiptTableProps) {
  const queryClient = useQueryClient();

  const { data: receipts = [], isLoading } = useQuery({
    queryKey: ["cash-receipts", filters],
    queryFn: async () => {
      let query = supabase.from("cash_receipts").select("*").order("receipt_date", { ascending: false });
      if (filters.payerName) query = query.ilike("payer_name", `%${filters.payerName}%`);
      if (filters.paymentMode && filters.paymentMode !== "all") query = query.eq("payment_mode", filters.paymentMode);
      if (filters.search) query = query.or(`payer_name.ilike.%${filters.search}%,receipt_no.ilike.%${filters.search}%,reason.ilike.%${filters.search}%`);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const getPaymentModeBadge = (mode: string) => {
    const styles: Record<string, { backgroundColor: string; color: string }> = {
      cash: { backgroundColor: "#7DBE3C", color: "white" },
      upi: { backgroundColor: "#16583f", color: "white" },
      bank_transfer: { backgroundColor: "#059669", color: "white" },
      cheque: { backgroundColor: "#0d9488", color: "white" },
    };
    const label = mode.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return <Badge style={styles[mode] || { backgroundColor: "#6b7280", color: "white" }}>{label}</Badge>;
  };

  const handleDelete = async (receipt: any) => {
    if (!window.confirm("Are you sure you want to delete this receipt?")) return;
    const { error } = await supabase.from("cash_receipts").delete().eq("id", receipt.id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Receipt deleted!");
    queryClient.invalidateQueries({ queryKey: ["cash-receipts"] });
  };

  const totalAmount = receipts.reduce((sum, r) => sum + Number(r.amount), 0);

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
              {isLoading ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-gray-500">Loading...</TableCell></TableRow>
              ) : receipts.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-gray-500">No receipts found</TableCell></TableRow>
              ) : receipts.map((receipt, index) => (
                <TableRow key={receipt.id} className="hover:bg-green-50/50 transition-colors">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium" style={{ color: "#16583f" }}>{receipt.receipt_no}</TableCell>
                  <TableCell>{receipt.receipt_date}</TableCell>
                  <TableCell className="font-medium">{receipt.payer_name}</TableCell>
                  <TableCell className="font-bold" style={{ color: "#7DBE3C" }}>₹{Number(receipt.amount).toLocaleString()}</TableCell>
                  <TableCell>{getPaymentModeBadge(receipt.payment_mode)}</TableCell>
                  <TableCell>{receipt.reason}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onEditReceipt(receipt)} className="h-8 w-8 p-0 hover:bg-green-100">
                        <Edit className="h-4 w-4" style={{ color: "#7DBE3C" }} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(receipt)} className="h-8 w-8 p-0 hover:bg-red-100">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t" style={{ backgroundColor: "rgba(125, 190, 60, 0.05)" }}>
          <div className="text-sm font-medium" style={{ color: "#16583f" }}>
            Total Receipts: {receipts.length} | Total Amount: ₹{totalAmount.toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
