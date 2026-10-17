import React, { useState, useRef, useEffect, useCallback } from "react";
import { Plus, ShoppingCart, Package, Boxes, Users, Receipt, BookOpen, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "fab-position";

const actions = [
  { label: "New Sale", icon: ShoppingCart, path: "/sales", color: "from-emerald-500 to-emerald-600" },
  { label: "Add Product", icon: Plus, path: "/product/add", color: "from-sky-500 to-sky-600" },
  { label: "New Purchase", icon: Boxes, path: "/purchase/new", color: "from-violet-500 to-violet-600" },
  { label: "Add Customer", icon: Users, path: "/customers", color: "from-amber-500 to-amber-600" },
  { label: "Add Expense", icon: Receipt, path: "/expenses", color: "from-rose-500 to-rose-600" },
  { label: "Day-Book", icon: BookOpen, path: "/reports/day-book", color: "from-teal-500 to-teal-600" },
];

function getInitialPos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { x: window.innerWidth - 90, y: window.innerHeight - 90 };
}

export function FloatingActionButton() {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(getInitialPos);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null);
  const didDrag = useRef(false);
  const navigate = useNavigate();

  const clamp = useCallback((x: number, y: number) => {
    const s = 56;
    return {
      x: Math.max(8, Math.min(window.innerWidth - s - 8, x)),
      y: Math.max(8, Math.min(window.innerHeight - s - 8, y)),
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, startPosX: pos.x, startPosY: pos.y };
    didDrag.current = false;
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) didDrag.current = true;
    const next = clamp(dragRef.current.startPosX + dx, dragRef.current.startPosY + dy);
    setPos(next);
  };

  const onPointerUp = () => {
    if (dragRef.current) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
    }
    dragRef.current = null;
    setDragging(false);
    if (!didDrag.current) {
      setOpen((o) => !o);
    }
  };

  useEffect(() => {
    const onResize = () => setPos((p: { x: number; y: number }) => clamp(p.x, p.y));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [clamp]);

  const handleAction = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[998] bg-black/20 backdrop-blur-[2px] transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Menu items */}
      <div
        className={cn(
          "fixed z-[999] flex flex-col-reverse items-center gap-3 transition-all duration-300",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        style={{ left: pos.x - 20, bottom: window.innerHeight - pos.y + 64 }}
      >
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={() => handleAction(action.path)}
              className={cn(
                "flex items-center gap-3 rounded-full pl-3 pr-4 py-2.5 text-white shadow-lg",
                "bg-gradient-to-r", action.color,
                "hover:scale-105 active:scale-95 transition-all duration-200",
                open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
              style={{ transitionDelay: open ? `${i * 50}ms` : "0ms" }}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium whitespace-nowrap">{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* FAB */}
      <div className="fixed z-[1000]" style={{ left: pos.x, top: pos.y }}>
        {/* Ripple rings */}
        {!open && !dragging && (
          <>
            <span className="absolute inset-0 rounded-full bg-primary/30 animate-[fab-ripple_2s_ease-out_infinite]" />
            <span className="absolute inset-0 rounded-full bg-primary/20 animate-[fab-ripple_2s_ease-out_0.6s_infinite]" />
            <span className="absolute inset-0 rounded-full bg-primary/10 animate-[fab-ripple_2s_ease-out_1.2s_infinite]" />
          </>
        )}

        <button
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className={cn(
            "relative h-14 w-14 rounded-full shadow-xl flex items-center justify-center",
            "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground",
            "hover:shadow-2xl transition-shadow duration-300",
            "touch-none select-none",
            dragging && "cursor-grabbing scale-110"
          )}
        >
          <Plus
            className={cn(
              "h-7 w-7 transition-transform duration-300",
              open && "rotate-45"
            )}
          />
        </button>
      </div>
    </>
  );
}
