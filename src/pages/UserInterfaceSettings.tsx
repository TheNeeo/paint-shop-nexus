import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Palette, Type, PanelLeft, LayoutDashboard, Image, MousePointerClick, Sparkles, BarChart3 } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import dashboardHomeIcon from "@/assets/smart-home-3d-icon-10.png";
import uiIcon from "@/assets/user-interface-icon.png";

const THEME = {
  primary: '#B87C4C',
  primaryDark: '#8B5E3C',
  primaryLight: '#D4A574',
  primaryLighter: '#E8C9A8',
  primaryLightest: '#F5E6D3',
  border: '#D4A574',
  gradientFrom: '#E8C9A8',
  gradientMid: '#F5E6D3',
  gradientTo: '#FBF3EB',
};

const tabs = [
  { id: "theme", label: "Theme", icon: Palette, gradient: "from-amber-400 via-orange-500 to-red-500", description: "Color scheme & mode" },
  { id: "typography", label: "Typography", icon: Type, gradient: "from-purple-400 via-fuchsia-500 to-pink-500", description: "Fonts & text sizes" },
  { id: "sidebar", label: "Sidebar", icon: PanelLeft, gradient: "from-blue-400 via-indigo-500 to-purple-500", description: "Navigation style" },
  { id: "header", label: "Header", icon: LayoutDashboard, gradient: "from-emerald-400 via-teal-500 to-cyan-500", description: "Header appearance" },
  { id: "background", label: "Background", icon: Image, gradient: "from-sky-400 via-blue-500 to-indigo-500", description: "Page backgrounds" },
  { id: "buttons", label: "Buttons", icon: MousePointerClick, gradient: "from-rose-400 via-pink-500 to-fuchsia-500", description: "Button & form styles" },
  { id: "animations", label: "Animations", icon: Sparkles, gradient: "from-yellow-400 via-amber-500 to-orange-500", description: "Motion & effects" },
];

export default function UserInterfaceSettings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("theme");
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
    toast({ title: "Settings Saved", description: "Your interface settings have been applied successfully." });
  };

  const handleResetSettings = () => {
    setSettings({
      theme: "light", primaryColor: "#5959f7", secondaryColor: "#83B2E2",
      fontFamily: "inter", fontSize: 16, sidebarStyle: "fixed",
      headerTransparent: false, backgroundType: "solid",
      buttonStyle: "rounded", animationsEnabled: true,
    });
    toast({ title: "Settings Reset", description: "All settings have been reset to default values." });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "theme": return <ThemeSelectionPanel settings={settings} setSettings={setSettings} />;
      case "typography": return <TypographySettings settings={settings} setSettings={setSettings} />;
      case "sidebar": return <SidebarCustomization settings={settings} setSettings={setSettings} />;
      case "header": return <HeaderCustomization settings={settings} setSettings={setSettings} />;
      case "background": return <BackgroundSettings settings={settings} setSettings={setSettings} />;
      case "buttons": return <ButtonFormStyles settings={settings} setSettings={setSettings} />;
      case "animations": return <AnimationSettings settings={settings} setSettings={setSettings} />;
      default: return <ThemeSelectionPanel settings={settings} setSettings={setSettings} />;
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen p-6 space-y-6" style={{ background: `linear-gradient(to bottom right, ${THEME.primaryLightest}, ${THEME.primaryLighter}22, #fff)` }}>

        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="mb-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navigate("/")} className="cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1.5">
                  <img src={dashboardHomeIcon} alt="Dashboard" className="h-5 w-5 object-contain bg-transparent" style={{ mixBlendMode: 'multiply' }} />
                  <span className="text-cyan-600 font-medium">Dashboard</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-1.5">
                  <BarChart3 className="h-4 w-4 text-orange-400" />
                  <span className="text-orange-600 font-medium">Settings</span>
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-1.5">
                  <img src={uiIcon} alt="User Interface Settings" className="h-5 w-5 object-contain" style={{ mixBlendMode: 'multiply' }} />
                  <span className="font-semibold" style={{ color: THEME.primary }}>User Interface Settings</span>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="rounded-3xl p-6 mb-8 shadow-lg border-2 relative overflow-hidden"
          style={{ background: `linear-gradient(to right, ${THEME.gradientFrom}, ${THEME.gradientMid}, ${THEME.gradientTo})`, borderColor: THEME.border }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: THEME.primary }}></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full blur-3xl animate-pulse delay-1000" style={{ backgroundColor: THEME.border }}></div>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="space-y-3">
              <motion.h1
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
                className="text-2xl sm:text-4xl font-bold flex items-center gap-3" style={{ color: THEME.primaryDark }}
              >
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
                  <img src={uiIcon} alt="User Interface Settings" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
                </motion.div>
                <div className="flex flex-col">
                  <span>User Interface Settings</span>
                  <motion.span
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-sm font-normal italic ml-[1.5ch]" style={{ color: THEME.primary }}
                  >
                    Personalize Your Visual Experience
                  </motion.span>
                </div>
              </motion.h1>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleResetSettings}
                style={{ borderColor: THEME.border, color: THEME.primaryDark }}
                className="hover:opacity-80"
              >
                Reset to Default
              </Button>
              <Button onClick={handleSaveSettings}
                style={{ backgroundColor: THEME.primary, color: 'white' }}
                className="hover:opacity-90"
              >
                Save & Apply
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Colorful Tab Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                onClick={() => setActiveTab(tab.id)}
                className={`relative overflow-hidden rounded-2xl p-5 min-h-[120px] shadow-lg transition-all duration-300 cursor-pointer text-left ${
                  isActive
                    ? `bg-gradient-to-br ${tab.gradient} scale-[1.02] shadow-xl ring-2 ring-white/50`
                    : `bg-gradient-to-br ${tab.gradient} opacity-60 hover:opacity-90 hover:scale-[1.02] hover:shadow-xl`
                }`}
              >
                <div className="relative z-10">
                  <h3 className="text-base font-bold text-white/95 mb-1">{tab.label}</h3>
                  <p className="text-xs text-white/70">{tab.description}</p>
                </div>
                <div className="absolute right-3 bottom-3 opacity-80">
                  <Icon className="h-12 w-12 text-white/30" strokeWidth={1.5} />
                </div>
                {isActive && (
                  <motion.div layoutId="uiActiveTab" className="absolute bottom-0 left-0 right-0 h-1 bg-white/80 rounded-full" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Tab Content + Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
            className="lg:col-span-2 rounded-2xl border-2 shadow-sm p-6"
            style={{ backgroundColor: 'white', borderColor: THEME.primaryLighter }}
          >
            {renderTabContent()}
          </motion.div>
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <PreviewPanel settings={settings} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.4 }}
          className="rounded-2xl border-2 p-4 text-center shadow-sm"
          style={{ background: `linear-gradient(to right, ${THEME.primaryLightest}, white, ${THEME.primaryLightest})`, borderColor: THEME.primaryLighter }}
        >
          <p className="text-sm font-medium" style={{ color: THEME.primary }}>
            Neo Color Factory ~ The Colors of Your Dreams 🎨
          </p>
        </motion.div>
      </div>
    </AppLayout>
  );
}
