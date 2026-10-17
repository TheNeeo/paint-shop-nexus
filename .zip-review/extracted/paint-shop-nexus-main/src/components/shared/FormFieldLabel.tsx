import React from "react";
import { LucideIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldLabelProps {
  icon: LucideIcon;
  label: string;
  htmlFor?: string;
  required?: boolean;
  /** Tailwind color name (matches FormSectionHeader palette) */
  color?: string;
  className?: string;
}

const COLOR_MAP: Record<string, string> = {
  blue: "text-blue-700",
  green: "text-green-700",
  emerald: "text-emerald-700",
  orange: "text-orange-700",
  amber: "text-amber-700",
  purple: "text-purple-700",
  pink: "text-pink-700",
  cyan: "text-cyan-700",
  rose: "text-rose-700",
  indigo: "text-indigo-700",
  teal: "text-teal-700",
  yellow: "text-yellow-700",
  slate: "text-slate-700",
  red: "text-red-700",
};

/**
 * Form field label with a small colored Lucide icon prefix.
 * Matches the global form label style (screenshot reference: 🎨 Product Name *, 🔖 HSN Code *).
 */
export function FormFieldLabel({
  icon: Icon,
  label,
  htmlFor,
  required,
  color = "slate",
  className,
}: FormFieldLabelProps) {
  const textColor = COLOR_MAP[color] ?? COLOR_MAP.slate;

  return (
    <Label
      htmlFor={htmlFor}
      className={cn("flex items-center gap-1.5 text-sm font-semibold mb-1.5", textColor, className)}
    >
      <Icon className="h-3.5 w-3.5 flex-shrink-0" />
      <span>{label}</span>
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </Label>
  );
}
