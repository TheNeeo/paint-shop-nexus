import React from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AnimatedTableProps {
  headers: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function AnimatedTable({ headers, children, className = "" }: AnimatedTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${className}`}
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
            {headers}
          </TableRow>
        </TableHeader>
        <TableBody>{children}</TableBody>
      </Table>
    </motion.div>
  );
}

interface AnimatedTableRowProps {
  children: React.ReactNode;
  index?: number;
  className?: string;
  onClick?: () => void;
}

export function AnimatedTableRow({
  children,
  index = 0,
  className = "",
  onClick,
}: AnimatedTableRowProps) {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
      onClick={onClick}
      className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer ${className}`}
    >
      {children}
    </motion.tr>
  );
}
