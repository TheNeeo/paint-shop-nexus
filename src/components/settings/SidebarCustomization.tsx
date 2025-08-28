import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PanelLeft, Square, Circle, Minus } from "lucide-react";

interface SidebarCustomizationProps {
  settings: any;
  setSettings: (settings: any) => void;
}

export function SidebarCustomization({ settings, setSettings }: SidebarCustomizationProps) {
  return (
    <Card className="border-ruby-blue-200">
      <CardHeader className="bg-ruby-blue-50 border-b border-ruby-blue-200">
        <CardTitle className="flex items-center gap-2 text-ruby-blue-900">
          <PanelLeft className="h-5 w-5" />
          Sidebar Styles
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-ruby-blue-700">Enable Collapse</Label>
              <p className="text-sm text-ruby-blue-600">Allow users to collapse sidebar</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div>
            <Label className="text-ruby-blue-700 mb-2 block">Sidebar Position</Label>
            <Select 
              value={settings.sidebarStyle} 
              onValueChange={(value) => setSettings({...settings, sidebarStyle: value})}
            >
              <SelectTrigger className="border-ruby-blue-300 focus:border-ruby-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed Position</SelectItem>
                <SelectItem value="floating">Floating</SelectItem>
                <SelectItem value="overlay">Overlay</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-ruby-blue-700 mb-2 block">Sidebar Background Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                defaultValue="#ffffff"
                className="w-12 h-10 rounded border border-ruby-blue-300"
              />
              <input
                type="text"
                defaultValue="#ffffff"
                className="flex-1 px-3 py-2 border border-ruby-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-ruby-blue-500"
              />
            </div>
          </div>

          <div>
            <Label className="text-ruby-blue-700 mb-2 block">Sidebar Text Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                defaultValue="#374151"
                className="w-12 h-10 rounded border border-ruby-blue-300"
              />
              <input
                type="text"
                defaultValue="#374151"
                className="flex-1 px-3 py-2 border border-ruby-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-ruby-blue-500"
              />
            </div>
          </div>
        </div>

        <div>
          <Label className="text-ruby-blue-700 mb-3 block">Icon Style</Label>
          <RadioGroup defaultValue="outline" className="grid grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="flat" id="flat" />
              <Label htmlFor="flat" className="flex items-center gap-2">
                <Square className="h-4 w-4" />
                Flat
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3d" id="3d" />
              <Label htmlFor="3d" className="flex items-center gap-2">
                <Circle className="h-4 w-4" />
                3D
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="outline" id="outline" />
              <Label htmlFor="outline" className="flex items-center gap-2">
                <Minus className="h-4 w-4" />
                Outline
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Sidebar Preview */}
        <div className="mt-6 p-4 bg-ruby-blue-50 rounded-lg border border-ruby-blue-200">
          <h4 className="text-ruby-blue-800 font-medium mb-3">Sidebar Preview</h4>
          <div className="flex gap-4">
            <div className="w-16 bg-white border border-ruby-blue-200 rounded p-2 space-y-2">
              <div className="h-2 bg-ruby-blue-300 rounded"></div>
              <div className="h-2 bg-ruby-blue-200 rounded"></div>
              <div className="h-2 bg-ruby-blue-200 rounded"></div>
              <div className="h-2 bg-ruby-blue-200 rounded"></div>
            </div>
            <div className="flex-1 bg-gray-50 border border-ruby-blue-200 rounded p-2">
              <div className="h-2 bg-gray-300 rounded mb-2"></div>
              <div className="h-1 bg-gray-200 rounded mb-1"></div>
              <div className="h-1 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}