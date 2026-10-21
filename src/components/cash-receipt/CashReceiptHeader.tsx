import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Download, Filter } from "lucide-react";
import cashReceiptIcon from "@/assets/cash-receipt-icon.png";

interface CashReceiptHeaderProps {
  onAddReceipt: () => void;
  onExportCSV: () => void;
}

export function CashReceiptHeader({ onAddReceipt, onExportCSV }: CashReceiptHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 
          className="text-3xl font-bold flex items-center gap-3" 
          style={{ color: "#16583f" }}
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <img
              src={cashReceiptIcon}
              alt="Cash Receipts"
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain neo-icon-3d"
              style={{ mixBlendMode: "multiply" }}
            />
          </motion.div>
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