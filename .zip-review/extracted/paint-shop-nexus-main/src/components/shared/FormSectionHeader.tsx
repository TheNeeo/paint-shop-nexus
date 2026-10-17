import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormSectionHeaderProps {
  icon: LucideIcon;
  title: string;
  /** Tailwind color name like "blue", "green", "orange", "purple", "pink", "amber", "cyan", "emerald", "rose", "indigo", "teal", "yellow" */
  color?: string;
  className?: string;
  description?: string;
}

const COLOR_MAP: Record<string, { bg: string; text: string; iconBg: string; iconText: string }> = {
  blue: { bg: "bg-blue-50/60", text: "text-blue-900", iconBg: "bg-blue-100", iconText: "text-blue-600" },
  green: { bg: "bg-green-50/60", text: "text-green-900", iconBg: "bg-green-100", iconText: "text-green-600" },
  emerald: { bg: "bg-emerald-50/60", text: "text-emerald-900", iconBg: "bg-emerald-100", iconText: "text-emerald-600" },
  orange: { bg: "bg-orange-50/60", text: "text-orange-900", iconBg: "bg-orange-100", iconText: "text-orange-600" },
  amber: { bg: "bg-amber-50/60", text: "text-amber-900", iconBg: "bg-amber-100", iconText: "text-amber-600" },
  purple: { bg: "bg-purple-50/60", text: "text-purple-900", iconBg: "bg-purple-100", iconText: "text-purple-600" },
  pink: { bg: "bg-pink-50/60", text: "text-pink-900", iconBg: "bg-pink-100", iconText: "text-pink-600" },
  cyan: { bg: "bg-cyan-50/60", text: "text-cyan-900", iconBg: "bg-cyan-100", iconText: "text-cyan-600" },
  rose: { bg: "bg-rose-50/60", text: "text-rose-900", iconBg: "bg-rose-100", iconText: "text-rose-600" },
  indigo: { bg: "bg-indigo-50/60", text: "text-indigo-900", iconBg: "bg-indigo-100", iconText: "text-indigo-600" },
  teal: { bg: "bg-teal-50/60", text: "text-teal-900", iconBg: "bg-teal-100", iconText: "text-teal-600" },
  yellow: { bg: "bg-yellow-50/60", text: "text-yellow-900", iconBg: "bg-yellow-100", iconText: "text-yellow-600" },
  slate: { bg: "bg-slate-50/60", text: "text-slate-900", iconBg: "bg-slate-100", iconText: "text-slate-600" },
};

/**
 * Section header for forms — pastel rounded icon badge + bold title.
 * Matches the global form section style (screenshot reference: Main Product Details).
 */
export function FormSectionHeader({
  icon: Icon,
  title,
  color = "blue",
  className,
  description,
}: FormSectionHeaderProps) {
  const c = COLOR_MAP[color] ?? COLOR_MAP.blue;

  return (
    <div className={cn("flex items-center gap-3 mb-4", className)}>
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm",
          c.iconBg
        )}
      >
        <Icon className={cn("h-5 w-5", c.iconText)} />
      </div>
      <div className="flex flex-col">
        <h3 className={cn("text-base font-bold leading-tight", c.text)}>{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}
