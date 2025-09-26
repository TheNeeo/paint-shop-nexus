import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Download, Filter } from "lucide-react";

interface CashReceiptHeaderProps {
  onAddReceipt: () => void;
  onExportCSV: () => void;
}

export function CashReceiptHeader({ onAddReceipt, onExportCSV }: CashReceiptHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 
          className="text-3xl font-bold" 
          style={{ color: "#16583f" }}
        >
          Cash Receipts
        </h1>
      </div>
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={onExportCSV}
          style={{
            borderColor: "#7DBE3C",
            color: "#16583f",
            backgroundColor: "rgba(125, 190, 60, 0.1)"
          }}
          className="hover:bg-opacity-20"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
        <Button 
          onClick={onAddReceipt}
          style={{ 
            backgroundColor: "#7DBE3C",
            color: "white"
          }}
          className="hover:opacity-90"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Receipt
        </Button>
      </div>
    </div>
  );
}