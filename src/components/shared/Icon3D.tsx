import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import home from "@/assets/neo-3d-home.png";
import paint from "@/assets/neo-3d-paint.png";
import cart from "@/assets/neo-3d-cart.png";
import boxes from "@/assets/neo-3d-boxes.png";
import truck from "@/assets/neo-3d-truck.png";
import contacts from "@/assets/neo-3d-contacts.png";
import chart from "@/assets/neo-3d-chart.png";
import settings from "@/assets/neo-3d-settings.png";
import invoice from "@/assets/neo-3d-invoice.png";

export type Icon3DName = "home" | "paint" | "cart" | "boxes" | "truck" | "contacts" | "chart" | "settings" | "invoice";
const images: Record<Icon3DName, string> = { home, paint, cart, boxes, truck, contacts, chart, settings, invoice };

export function resolve3DIcon(label: string): Icon3DName {
  if (/dashboard|home/i.test(label)) return "home";
  if (/settings|interface|monitor|gear/i.test(label)) return "settings";
  if (/vendor|supplier|truck|purchase|reorder/i.test(label)) return "truck";
  if (/customer|contact|user|profile/i.test(label)) return "contacts";
  if (/invoice|receipt|expense|revenue|dollar|pricing|payment|credit|book|payable|due|profit|gst|cash|balance|cost|transaction/i.test(label)) return "invoice";
  if (/report|chart|growth|trend|analytics|period/i.test(label)) return "chart";
  if (/inventory|stock|box|package|product|categor|sku|layer/i.test(label)) return "boxes";
  if (/sales|sale|cart/i.test(label)) return "cart";
  return "paint";
}

/** Shared raster icon pack; labels and controls remain independently accessible. */
export function Icon3D({ name, label, icon, className }: { name?: Icon3DName; label?: string; icon?: LucideIcon; className?: string }) {
  const resolved = name ?? resolve3DIcon(label || icon?.displayName || "paint");
  return <img src={images[resolved]} alt="" aria-hidden="true" width={512} height={512} loading="lazy" className={cn("neo-icon-3d h-12 w-12 shrink-0 object-contain", className)} />;
}