
import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { signOut, user } = useAuth();

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
        {/* User info and logout button */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Welcome back, <span className="font-medium text-foreground">{user?.email}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
        
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
