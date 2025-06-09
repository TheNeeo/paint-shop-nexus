
import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-background/90 to-background overflow-hidden">
      {/* Sidebar */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out relative z-20",
          collapsed ? "md:w-0" : "md:w-64"
        )}
      >
        <Sidebar collapsed={collapsed} />
      </div>

      {/* Toggle button with paint-inspired design */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden md:flex fixed top-1/2 z-30 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 paint-shimmer"
        style={{
          left: collapsed ? "20px" : "256px",
        }}
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {/* Main content with paint sparkle effect */}
      <main className="flex-1 overflow-auto paint-sparkle">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
