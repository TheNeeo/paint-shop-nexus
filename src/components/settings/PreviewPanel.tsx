import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Monitor, Tablet, Smartphone } from "lucide-react";

interface PreviewPanelProps {
  settings: any;
}

export function PreviewPanel({ settings }: PreviewPanelProps) {
  const [previewMode, setPreviewMode] = useState("desktop");

  const getPreviewWidth = () => {
    switch (previewMode) {
      case "tablet": return "w-80";
      case "mobile": return "w-64";
      default: return "w-full";
    }
  };

  return (
    <Card className="border-ruby-blue-200">
      <CardHeader className="bg-ruby-blue-50 border-b border-ruby-blue-200">
        <CardTitle className="flex items-center justify-between text-ruby-blue-900">
          <span className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Live Preview
          </span>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={previewMode === "desktop" ? "default" : "outline"}
              onClick={() => setPreviewMode("desktop")}
              className="p-1"
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={previewMode === "tablet" ? "default" : "outline"}
              onClick={() => setPreviewMode("tablet")}
              className="p-1"
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={previewMode === "mobile" ? "default" : "outline"}
              onClick={() => setPreviewMode("mobile")}
              className="p-1"
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-center">
          <div className={`${getPreviewWidth()} transition-all duration-300`}>
            {/* Preview Header */}
            <div 
              className={`h-12 border-b border-ruby-blue-200 flex items-center px-4 ${
                settings.headerTransparent 
                  ? "bg-gradient-to-r from-ruby-blue-100 to-transparent" 
                  : "bg-white"
              }`}
            >
              <div className="h-6 w-20 bg-ruby-blue-400 rounded"></div>
              <div className="ml-auto flex gap-2">
                <div className="w-6 h-6 bg-ruby-blue-300 rounded-full"></div>
                <div className="w-6 h-6 bg-ruby-blue-300 rounded-full"></div>
              </div>
            </div>

            {/* Preview Content Area */}
            <div className="flex h-48 border border-ruby-blue-200 rounded-b">
              {/* Sidebar */}
              <div 
                className={`${
                  settings.sidebarStyle === "floating" ? "w-12" : "w-16"
                } bg-white border-r border-ruby-blue-200 p-2 space-y-2`}
              >
                <div className="h-2 bg-ruby-blue-300 rounded"></div>
                <div className="h-2 bg-ruby-blue-200 rounded"></div>
                <div className="h-2 bg-ruby-blue-200 rounded"></div>
                <div className="h-2 bg-ruby-blue-200 rounded"></div>
              </div>

              {/* Main Content */}
              <div 
                className={`flex-1 p-4 space-y-3 ${
                  settings.backgroundType === "gradient" 
                    ? "bg-gradient-to-br from-ruby-blue-50 to-white" 
                    : "bg-ruby-blue-50"
                }`}
              >
                <div className="h-3 bg-white/70 rounded"></div>
                <div className="h-2 bg-white/50 rounded w-3/4"></div>
                <div className="h-2 bg-white/50 rounded w-1/2"></div>
                
                {/* Sample Buttons */}
                <div className="flex gap-2 mt-4">
                  <div 
                    className={`h-6 w-16 bg-ruby-blue-500 ${
                      settings.buttonStyle === "square" ? "rounded-none" : "rounded"
                    }`}
                  ></div>
                  <div 
                    className={`h-6 w-16 border border-ruby-blue-400 bg-white ${
                      settings.buttonStyle === "square" ? "rounded-none" : "rounded"
                    }`}
                  ></div>
                </div>

                {/* Sample Form */}
                <div className="space-y-2 mt-4">
                  <div className="h-6 bg-white border border-ruby-blue-300 rounded"></div>
                  <div className="h-6 bg-white border border-ruby-blue-300 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Info */}
        <div className="mt-4 text-center">
          <p className="text-sm text-ruby-blue-600">
            Preview Mode: <span className="font-medium capitalize">{previewMode}</span>
          </p>
          <p className="text-xs text-ruby-blue-500 mt-1">
            Real-time preview of your interface customizations
          </p>
        </div>
      </CardContent>
    </Card>
  );
}