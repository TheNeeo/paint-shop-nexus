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
      <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: 'rgb(248, 249, 250)' }}>
        {/* Header Section */}
        <div className="rounded-lg shadow-sm border p-6" style={{ 
          backgroundColor: 'white', 
          borderColor: 'rgb(229, 231, 235)' 
        }}>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" style={{ color: 'rgb(107, 114, 128)' }}>Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/settings" style={{ color: 'rgb(107, 114, 128)' }}>Settings</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage style={{ color: 'rgb(31, 41, 55)' }}>Application Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="mt-4">
            <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: 'rgb(31, 41, 55)' }}>
              <Settings className="h-8 w-8" style={{ color: 'rgb(75, 85, 99)' }} />
              Settings
            </h1>
            <p className="mt-2" style={{ color: 'rgb(107, 114, 128)' }}>
              Manage system preferences, users, and customization
            </p>
          </div>
        </div>

        {/* Tabbed Content */}
        <div className="rounded-lg shadow-sm border" style={{ 
          backgroundColor: 'white', 
          borderColor: 'rgb(229, 231, 235)' 
        }}>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-5" style={{ backgroundColor: 'rgb(241, 243, 244)' }}>
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