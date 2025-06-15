
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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out relative z-20",
          collapsed ? "md:w-0" : "md:w-64"
        )}
      >
        <Sidebar collapsed={collapsed} />
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden md:flex fixed top-1/2 z-30 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 hover:bg-gray-50"
        style={{
          left: collapsed ? "20px" : "256px",
        }}
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
