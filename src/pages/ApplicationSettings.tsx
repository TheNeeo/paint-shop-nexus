import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Settings, Users, FileText, Palette, Database, BarChart3 } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import GeneralSettingsTab from "@/components/settings/GeneralSettingsTab";
import UserManagementTab from "@/components/settings/UserManagementTab";
import InvoiceTaxTab from "@/components/settings/InvoiceTaxTab";
import ThemeAppearanceTab from "@/components/settings/ThemeAppearanceTab";
import BackupSyncTab from "@/components/settings/BackupSyncTab";
import dashboardHomeIcon from "@/assets/smart-home-3d-icon-9.png";
import settingsIcon from "@/assets/application-settings-icon.png";

const THEME = {
  primary: '#7a5479',
  primaryDark: '#5c3d5b',
  primaryLight: '#A376A2',
  primaryLighter: '#c9a6c8',
  primaryLightest: '#f0e4ef',
  border: '#A376A2',
  gradientFrom: '#c9a6c8',
  gradientMid: '#f0e4ef',
  gradientTo: '#f8f2f8',
};

const tabs = [
  { id: "general", label: "General", icon: Settings, gradient: "from-purple-400 via-fuchsia-500 to-pink-500", description: "Shop info & preferences" },
  { id: "users", label: "Users", icon: Users, gradient: "from-blue-400 via-indigo-500 to-purple-500", description: "Roles & permissions" },
  { id: "invoice", label: "Invoice & Tax", icon: FileText, gradient: "from-amber-400 via-orange-500 to-red-500", description: "Invoice & GST config" },
  { id: "theme", label: "Theme", icon: Palette, gradient: "from-emerald-400 via-teal-500 to-cyan-500", description: "Appearance settings" },
  { id: "backup", label: "Backup", icon: Database, gradient: "from-sky-400 via-blue-500 to-indigo-500", description: "Data backup & sync" },
];

export default function ApplicationSettings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");

  const renderTabContent = () => {
    switch (activeTab) {
      case "general": return <GeneralSettingsTab />;
      case "users": return <UserManagementTab />;
      case "invoice": return <InvoiceTaxTab />;
      case "theme": return <ThemeAppearanceTab />;
      case "backup": return <BackupSyncTab />;
      default: return <GeneralSettingsTab />;
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen p-6 space-y-6" style={{ background: `linear-gradient(to bottom right, ${THEME.primaryLightest}, ${THEME.primaryLighter}22, #fff)` }}>

        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-3"
        >
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => navigate("/")}
                  className="cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1.5"
                >
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
                  <img src={settingsIcon} alt="Application Settings" className="h-5 w-5 object-contain" style={{ mixBlendMode: 'multiply' }} />
                  <span className="font-semibold" style={{ color: THEME.primary }}>Application Settings</span>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl p-6 mb-8 shadow-lg border-2 relative overflow-hidden"
          style={{
            background: `linear-gradient(to right, ${THEME.gradientFrom}, ${THEME.gradientMid}, ${THEME.gradientTo})`,
            borderColor: THEME.border,
          }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: THEME.primary }}></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full blur-3xl animate-pulse delay-1000" style={{ backgroundColor: THEME.border }}></div>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="space-y-3">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-2xl sm:text-4xl font-bold flex items-center gap-3"
                style={{ color: THEME.primaryDark }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <img src={settingsIcon} alt="Application Settings" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
                </motion.div>
                <div className="flex flex-col">
                  <span>Application Settings</span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-sm font-normal italic ml-[1.5ch]"
                    style={{ color: THEME.primary }}
                  >
                    Configure & Customize Your Application
                  </motion.span>
                </div>
              </motion.h1>
            </div>
          </div>
        </motion.div>

        {/* Colorful Tab Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-white/80 rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border-2 shadow-sm p-6"
          style={{
            backgroundColor: 'white',
            borderColor: THEME.primaryLighter,
          }}
        >
          {renderTabContent()}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="rounded-2xl border-2 p-4 text-center shadow-sm"
          style={{
            background: `linear-gradient(to right, ${THEME.primaryLightest}, white, ${THEME.primaryLightest})`,
            borderColor: THEME.primaryLighter,
          }}
        >
          <p className="text-sm font-medium" style={{ color: THEME.primary }}>
            Neo Color Factory ~ The Colors of Your Dreams 🎨
          </p>
        </motion.div>
      </div>
    </AppLayout>
  );
}
