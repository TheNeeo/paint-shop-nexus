import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Save, RotateCcw } from "lucide-react";
import userInterfaceIcon from "@/assets/user-interface-icon.png";

export function UserInterfaceHeader() {
  return (
    <header className="bg-white border-b border-ruby-blue-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-6 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <img
                  src={userInterfaceIcon}
                  alt="User Interface Settings"
                  className="h-10 w-10 sm:h-12 sm:w-12 object-contain neo-icon-3d"
                  style={{ mixBlendMode: "multiply" }}
                />
              </motion.div>
              <h1 className="text-2xl font-bold text-ruby-blue-900">
                User Interface Settings
              </h1>
            </div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink 
                    href="/" 
                    className="text-ruby-blue-600 hover:text-ruby-blue-800"
                  >
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-ruby-blue-400" />
                <BreadcrumbItem>
                  <BreadcrumbLink 
                    href="/settings" 
                    className="text-ruby-blue-600 hover:text-ruby-blue-800"
                  >
                    Settings
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-ruby-blue-400" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-ruby-blue-800 font-medium">
                    User Interface
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              className="border-ruby-blue-300 text-ruby-blue-700 hover:bg-ruby-blue-50"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Default
            </Button>
            <Button 
              size="sm"
              className="bg-ruby-blue-600 hover:bg-ruby-blue-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}