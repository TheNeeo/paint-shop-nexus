
import React, { useState } from "react";
import { TreeSidebar } from "./TreeSidebar";
import { Menu, X } from "lucide-react";

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 p-3 rounded-lg bg-slate-800 text-white md:hidden shadow-lg hover:bg-slate-700 transition-colors"
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setIsMobileOpen(false)} 
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        <TreeSidebar collapsed={collapsed || false} />
      </div>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="fixed top-0 left-0 h-full w-64 z-40 md:hidden transform transition-transform duration-300 ease-in-out">
          <TreeSidebar collapsed={false} />
        </div>
      )}
    </>
  );
}
