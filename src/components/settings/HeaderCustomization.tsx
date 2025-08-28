import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Layout } from "lucide-react";

interface HeaderCustomizationProps {
  settings: any;
  setSettings: (settings: any) => void;
}

export function HeaderCustomization({ settings, setSettings }: HeaderCustomizationProps) {
  return (
    <Card className="border-ruby-blue-200">
      <CardHeader className="bg-ruby-blue-50 border-b border-ruby-blue-200">
        <CardTitle className="flex items-center gap-2 text-ruby-blue-900">
          <Layout className="h-5 w-5" />
          Header Styles
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div>
          <Label className="text-ruby-blue-700 mb-3 block">Header Style</Label>
          <RadioGroup defaultValue="solid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="transparent" id="transparent" />
              <Label htmlFor="transparent" className="text-ruby-blue-700">
                Transparent Header
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="solid" id="solid" />
              <Label htmlFor="solid" className="text-ruby-blue-700">
                Solid Color Header
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-ruby-blue-700 mb-2 block">Header Background Color</Label>
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
            <Label className="text-ruby-blue-700 mb-2 block">Header Text Color</Label>
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

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-ruby-blue-700">Enable Gradient Backgrounds</Label>
            <p className="text-sm text-ruby-blue-600">Add gradient effects to header</p>
          </div>
          <Switch 
            checked={settings.headerTransparent}
            onCheckedChange={(checked) => setSettings({...settings, headerTransparent: checked})}
          />
        </div>

        {/* Header Preview */}
        <div className="mt-6 p-4 bg-ruby-blue-50 rounded-lg border border-ruby-blue-200">
          <h4 className="text-ruby-blue-800 font-medium mb-3">Header Preview</h4>
          <div className="bg-white border border-ruby-blue-200 rounded">
            <div className="h-12 bg-gradient-to-r from-ruby-blue-100 to-ruby-blue-200 border-b border-ruby-blue-200 flex items-center px-4">
              <div className="h-6 w-24 bg-ruby-blue-400 rounded"></div>
              <div className="ml-auto flex gap-2">
                <div className="w-6 h-6 bg-ruby-blue-300 rounded"></div>
                <div className="w-6 h-6 bg-ruby-blue-300 rounded"></div>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <div className="h-2 bg-gray-200 rounded"></div>
              <div className="h-2 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}