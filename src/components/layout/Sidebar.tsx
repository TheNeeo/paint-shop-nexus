
import React, { useState } from "react";
import { TreeSidebar } from "./TreeSidebar";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { pathname } = useLocation();

  React.useEffect(() => { setIsMobileOpen(false); }, [pathname]);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label={isMobileOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={isMobileOpen}
        className="fixed top-4 right-4 z-50 h-12 w-12 rounded-lg bg-card text-foreground md:hidden shadow-lg hover:bg-accent transition-colors"
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-foreground/50 z-30 md:hidden" 
          onClick={() => setIsMobileOpen(false)} 
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        <TreeSidebar collapsed={collapsed || false} />
      </div>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="fixed top-0 left-0 h-dvh w-72 max-w-[calc(100vw-5rem)] overflow-x-hidden z-40 md:hidden transform transition-transform duration-300 ease-in-out">
          <TreeSidebar collapsed={false} />
        </div>
      )}
    </>
  );
}
