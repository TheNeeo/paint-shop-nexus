import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, Sun, Moon, Type, Layout } from "lucide-react";

const colorOptions = [
  { name: "Cadet Gray", value: "cadet-gray", color: "#9BA2A3" },
  { name: "Turquoise", value: "turquoise", color: "#5AE0C1" },
  { name: "Mindaro", value: "mindaro", color: "#BAEA66" },
  { name: "Default Green", value: "green", color: "#22C55E" },
];

export default function ThemeAppearanceTab() {
  const [themeSettings, setThemeSettings] = useState({
    darkMode: false,
    accentColor: "cadet-gray",
    sidebarExpanded: true,
    iconStyle: "outline",
    fontFamily: "inter",
  });

  return (
    <div className="space-y-6">
      <Card className="border-cadet-gray-200">
        <CardHeader className="bg-cadet-gray-50 border-b border-cadet-gray-200">
          <CardTitle className="flex items-center gap-2 text-cadet-gray-900">
            <Palette className="h-5 w-5" />
            Theme Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {themeSettings.darkMode ? <Moon className="h-5 w-5 text-cadet-gray-700" /> : <Sun className="h-5 w-5 text-cadet-gray-700" />}
              <div>
                <Label className="text-cadet-gray-700">Dark Mode</Label>
                <p className="text-sm text-cadet-gray-600">Switch between light and dark themes</p>
              </div>
            </div>
            <Switch
              checked={themeSettings.darkMode}
              onCheckedChange={(checked) => setThemeSettings({...themeSettings, darkMode: checked})}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-cadet-gray-700">Accent Color</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setThemeSettings({...themeSettings, accentColor: color.value})}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    themeSettings.accentColor === color.value
                      ? "border-cadet-gray-700 bg-cadet-gray-50"
                      : "border-cadet-gray-200 hover:border-cadet-gray-300"
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: color.color }}
                  ></div>
                  <p className="text-sm text-cadet-gray-700">{color.name}</p>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-cadet-gray-200">
        <CardHeader className="bg-cadet-gray-50 border-b border-cadet-gray-200">
          <CardTitle className="flex items-center gap-2 text-cadet-gray-900">
            <Layout className="h-5 w-5" />
            Layout Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-cadet-gray-700">Sidebar Expanded by Default</Label>
              <p className="text-sm text-cadet-gray-600">Keep sidebar open when page loads</p>
            </div>
            <Switch
              checked={themeSettings.sidebarExpanded}
              onCheckedChange={(checked) => setThemeSettings({...themeSettings, sidebarExpanded: checked})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="iconStyle" className="text-cadet-gray-700">Icon Style</Label>
            <Select 
              value={themeSettings.iconStyle} 
              onValueChange={(value) => setThemeSettings({...themeSettings, iconStyle: value})}
            >
              <SelectTrigger className="border-cadet-gray-300 focus:border-cadet-gray-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="outline">Outline</SelectItem>
                <SelectItem value="filled">Filled</SelectItem>
                <SelectItem value="rounded">Rounded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-cadet-gray-200">
        <CardHeader className="bg-cadet-gray-50 border-b border-cadet-gray-200">
          <CardTitle className="flex items-center gap-2 text-cadet-gray-900">
            <Type className="h-5 w-5" />
            Typography
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="fontFamily" className="text-cadet-gray-700">Font Family</Label>
            <Select 
              value={themeSettings.fontFamily} 
              onValueChange={(value) => setThemeSettings({...themeSettings, fontFamily: value})}
            >
              <SelectTrigger className="border-cadet-gray-300 focus:border-cadet-gray-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="roboto">Roboto</SelectItem>
                <SelectItem value="openSans">Open Sans</SelectItem>
                <SelectItem value="systemUi">System UI</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-3">
        <Button variant="outline" className="border-cadet-gray-300 text-cadet-gray-700 hover:bg-cadet-gray-50">
          Reset to Defaults
        </Button>
        <Button className="bg-cadet-gray-700 hover:bg-cadet-gray-800 text-white">
          Apply Theme Changes
        </Button>
      </div>
    </div>
  );
}