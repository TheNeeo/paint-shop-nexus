
import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FloatingActionButton } from "./FloatingActionButton";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="neo-app flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out relative z-20",
          collapsed ? "md:w-16" : "md:w-72"
        )}
      >
        <Sidebar collapsed={collapsed} />
      </div>

      {/* Toggle button */}
      <Button
        variant="outline"
        size="icon"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={() => setCollapsed(!collapsed)}
        className={cn("neo-sidebar-toggle hidden md:flex fixed top-1/2 z-30 -translate-y-1/2 h-8 w-8 rounded-full transition-all duration-300", collapsed ? "left-12" : "left-[272px]")}
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </Button>

      {/* Main content */}
      <main className="neo-main min-w-0 flex-1 overflow-auto">
        <div className="neo-content mx-auto w-full max-w-[1560px] px-4 pb-8 pt-20 md:p-8">{children}</div>
      </main>
      <FloatingActionButton />
    </div>
  );
}
