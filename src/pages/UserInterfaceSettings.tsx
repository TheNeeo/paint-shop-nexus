import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { UserInterfaceHeader } from "@/components/settings/UserInterfaceHeader";
import { ThemeSelectionPanel } from "@/components/settings/ThemeSelectionPanel";
import { TypographySettings } from "@/components/settings/TypographySettings";
import { SidebarCustomization } from "@/components/settings/SidebarCustomization";
import { HeaderCustomization } from "@/components/settings/HeaderCustomization";
import { BackgroundSettings } from "@/components/settings/BackgroundSettings";
import { ButtonFormStyles } from "@/components/settings/ButtonFormStyles";
import { AnimationSettings } from "@/components/settings/AnimationSettings";
import { PreviewPanel } from "@/components/settings/PreviewPanel";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function UserInterfaceSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    theme: "light",
    primaryColor: "#5959f7",
    secondaryColor: "#83B2E2",
    fontFamily: "inter",
    fontSize: 16,
    sidebarStyle: "fixed",
    headerTransparent: false,
    backgroundType: "solid",
    buttonStyle: "rounded",
    animationsEnabled: true,
  });

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your interface settings have been applied successfully.",
    });
  };

  const handleResetSettings = () => {
    setSettings({
      theme: "light",
      primaryColor: "#5959f7",
      secondaryColor: "#83B2E2",
      fontFamily: "inter",
      fontSize: 16,
      sidebarStyle: "fixed",
      headerTransparent: false,
      backgroundType: "solid",
      buttonStyle: "rounded",
      animationsEnabled: true,
    });
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
    });
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-ruby-blue-50">
        <UserInterfaceHeader />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Settings Panels */}
            <div className="lg:col-span-2 space-y-8">
              <ThemeSelectionPanel settings={settings} setSettings={setSettings} />
              <TypographySettings settings={settings} setSettings={setSettings} />
              <SidebarCustomization settings={settings} setSettings={setSettings} />
              <HeaderCustomization settings={settings} setSettings={setSettings} />
              <BackgroundSettings settings={settings} setSettings={setSettings} />
              <ButtonFormStyles settings={settings} setSettings={setSettings} />
              <AnimationSettings settings={settings} setSettings={setSettings} />
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <PreviewPanel settings={settings} />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-white rounded-lg border border-ruby-blue-200 shadow-sm">
            <p className="text-sm text-ruby-blue-600">
              Changes will apply on next page load
            </p>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={handleResetSettings}
                className="border-ruby-blue-300 text-ruby-blue-700 hover:bg-ruby-blue-50"
              >
                Reset to Default
              </Button>
              <Button 
                onClick={handleSaveSettings}
                className="bg-ruby-blue-600 hover:bg-ruby-blue-700 text-white"
              >
                Save & Apply Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}