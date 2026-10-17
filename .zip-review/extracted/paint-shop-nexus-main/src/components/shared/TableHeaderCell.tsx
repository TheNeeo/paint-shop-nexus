import React from "react";
import { LucideIcon } from "lucide-react";
import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface TableHeaderCellProps {
  icon: LucideIcon;
  label: string;
  iconColor?: string;
  textColor?: string;
  className?: string;
  align?: "left" | "right" | "center";
}

/**
 * Standard table header cell with a small colored Lucide icon next to the label.
 * Matches the global table header style across the app.
 */
export function TableHeaderCell({
  icon: Icon,
  label,
  iconColor,
  textColor,
  className,
  align = "left",
}: TableHeaderCellProps) {
  const justify =
    align === "right" ? "justify-end" : align === "center" ? "justify-center" : "justify-start";

  return (
    <TableHead
      className={cn("font-semibold whitespace-nowrap", className)}
      style={textColor ? { color: textColor } : undefined}
    >
      <div className={cn("flex items-center gap-1.5", justify)}>
        <Icon
          className="h-4 w-4 flex-shrink-0"
          style={iconColor ? { color: iconColor } : undefined}
        />
        <span>{label}</span>
      </div>
    </TableHead>
  );
}
