import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Settings, Users, FileText, Palette, Database } from "lucide-react";
import GeneralSettingsTab from "@/components/settings/GeneralSettingsTab";
import UserManagementTab from "@/components/settings/UserManagementTab";
import InvoiceTaxTab from "@/components/settings/InvoiceTaxTab";
import ThemeAppearanceTab from "@/components/settings/ThemeAppearanceTab";
import BackupSyncTab from "@/components/settings/BackupSyncTab";

export default function ApplicationSettings() {
  return (
    <AppLayout>
      <div className="space-y-6 bg-cadet-gray-50 min-h-screen p-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-cadet-gray-200 p-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-cadet-gray-600">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/settings" className="text-cadet-gray-600">Settings</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-cadet-gray-900">Application Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-cadet-gray-900 flex items-center gap-3">
              <Settings className="h-8 w-8 text-cadet-gray-700" />
              Settings
            </h1>
            <p className="text-cadet-gray-600 mt-2">
              Manage system preferences, users, and customization
            </p>
          </div>
        </div>

        {/* Tabbed Content */}
        <div className="bg-white rounded-lg shadow-sm border border-cadet-gray-200">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-cadet-gray-100">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="invoice" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Invoice & Tax
              </TabsTrigger>
              <TabsTrigger value="theme" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Theme
              </TabsTrigger>
              <TabsTrigger value="backup" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Backup
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="general" className="mt-0">
                <GeneralSettingsTab />
              </TabsContent>
              
              <TabsContent value="users" className="mt-0">
                <UserManagementTab />
              </TabsContent>
              
              <TabsContent value="invoice" className="mt-0">
                <InvoiceTaxTab />
              </TabsContent>
              
              <TabsContent value="theme" className="mt-0">
                <ThemeAppearanceTab />
              </TabsContent>
              
              <TabsContent value="backup" className="mt-0">
                <BackupSyncTab />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}