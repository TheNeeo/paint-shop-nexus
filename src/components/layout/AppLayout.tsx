
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
    <div className="flex h-dvh w-full min-w-0 bg-muted overflow-hidden">
      {/* Sidebar */}
      <div
        className={cn(
          "w-0 shrink-0 transition-all duration-300 ease-in-out relative z-20",
          collapsed ? "md:w-16" : "md:w-72"
        )}
        onClick={() => { if (collapsed) setCollapsed(false); }}
      >
        <Sidebar collapsed={collapsed} />
      </div>

      {/* Toggle button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
        className={cn("hidden md:flex fixed top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-card text-muted-foreground shadow-md transition-all duration-300 hover:bg-accent", collapsed ? "left-16" : "left-72")}
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </Button>

      {/* Main content */}
      <main className="min-w-0 flex-1 overflow-auto bg-muted">
        <div className="w-full min-w-0 px-4 pb-6 pt-20 md:p-6 xl:p-8">{children}</div>
      </main>
      <FloatingActionButton />
    </div>
  );
}
