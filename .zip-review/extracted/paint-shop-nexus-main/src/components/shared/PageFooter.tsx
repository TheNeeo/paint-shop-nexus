import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PageFooterProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
  accentColor?: "green" | "blue" | "purple" | "orange" | "coral";
}

const colorConfig = {
  green: {
    bg: "from-green-100 via-emerald-50 to-teal-50",
    border: "border-green-200",
    text: "text-green-700",
    buttonBg: "bg-green-600 hover:bg-green-700",
    buttonBorder: "border-green-300 hover:border-green-400",
    disabledBg: "bg-green-100",
  },
  blue: {
    bg: "from-blue-100 via-cyan-50 to-sky-50",
    border: "border-blue-200",
    text: "text-blue-700",
    buttonBg: "bg-blue-600 hover:bg-blue-700",
    buttonBorder: "border-blue-300 hover:border-blue-400",
    disabledBg: "bg-blue-100",
  },
  purple: {
    bg: "from-purple-100 via-pink-50 to-fuchsia-50",
    border: "border-purple-200",
    text: "text-purple-700",
    buttonBg: "bg-purple-600 hover:bg-purple-700",
    buttonBorder: "border-purple-300 hover:border-purple-400",
    disabledBg: "bg-purple-100",
  },
  orange: {
    bg: "from-orange-100 via-amber-50 to-yellow-50",
    border: "border-orange-200",
    text: "text-orange-700",
    buttonBg: "bg-orange-600 hover:bg-orange-700",
    buttonBorder: "border-orange-300 hover:border-orange-400",
    disabledBg: "bg-orange-100",
  },
  coral: {
    bg: "from-rose-100 via-pink-50 to-red-50",
    border: "border-rose-200",
    text: "text-rose-700",
    buttonBg: "bg-rose-600 hover:bg-rose-700",
    buttonBorder: "border-rose-300 hover:border-rose-400",
    disabledBg: "bg-rose-100",
  },
};

export function PageFooter({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemLabel = "items",
  accentColor = "green",
}: PageFooterProps) {
  const colors = colorConfig[accentColor];
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={`bg-gradient-to-r ${colors.bg} rounded-2xl p-4 shadow-lg border-2 ${colors.border} mt-6`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Items info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`text-sm ${colors.text} font-medium`}
        >
          Showing{" "}
          <motion.span
            key={`${startItem}-${endItem}`}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="font-bold"
          >
            {startItem}-{endItem}
          </motion.span>{" "}
          of{" "}
          <motion.span
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="font-bold"
          >
            {totalItems}
          </motion.span>{" "}
          {itemLabel}
        </motion.div>

        {/* Pagination controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className={`${colors.buttonBorder} disabled:opacity-50`}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`${colors.buttonBorder} disabled:opacity-50`}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-1">
            {getPageNumbers().map((page, index) => (
              <motion.div key={index} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                {page === "..." ? (
                  <span className={`px-2 py-1 ${colors.text}`}>...</span>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(page as number)}
                    className={
                      currentPage === page
                        ? `${colors.buttonBg} text-white shadow-md`
                        : `${colors.buttonBorder} ${colors.text}`
                    }
                  >
                    {page}
                  </Button>
                )}
              </motion.div>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`${colors.buttonBorder} disabled:opacity-50`}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`${colors.buttonBorder} disabled:opacity-50`}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
