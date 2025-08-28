import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Image, Upload } from "lucide-react";

interface BackgroundSettingsProps {
  settings: any;
  setSettings: (settings: any) => void;
}

export function BackgroundSettings({ settings, setSettings }: BackgroundSettingsProps) {
  return (
    <Card className="border-ruby-blue-200">
      <CardHeader className="bg-ruby-blue-50 border-b border-ruby-blue-200">
        <CardTitle className="flex items-center gap-2 text-ruby-blue-900">
          <Image className="h-5 w-5" />
          Page Background
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div>
          <Label className="text-ruby-blue-700 mb-3 block">Background Type</Label>
          <RadioGroup 
            value={settings.backgroundType} 
            onValueChange={(value) => setSettings({...settings, backgroundType: value})}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="solid" id="bg-solid" />
              <Label htmlFor="bg-solid" className="text-ruby-blue-700">
                Solid Color
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="gradient" id="bg-gradient" />
              <Label htmlFor="bg-gradient" className="text-ruby-blue-700">
                Gradient
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="image" id="bg-image" />
              <Label htmlFor="bg-image" className="text-ruby-blue-700">
                Background Image
              </Label>
            </div>
          </RadioGroup>
        </div>

        {settings.backgroundType === "solid" && (
          <div>
            <Label className="text-ruby-blue-700 mb-2 block">Background Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                defaultValue="#f9fafb"
                className="w-12 h-10 rounded border border-ruby-blue-300"
              />
              <input
                type="text"
                defaultValue="#f9fafb"
                className="flex-1 px-3 py-2 border border-ruby-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-ruby-blue-500"
              />
            </div>
          </div>
        )}

        {settings.backgroundType === "gradient" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-ruby-blue-700 mb-2 block">Start Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  defaultValue="#83B2E2"
                  className="w-12 h-10 rounded border border-ruby-blue-300"
                />
                <input
                  type="text"
                  defaultValue="#83B2E2"
                  className="flex-1 px-3 py-2 border border-ruby-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-ruby-blue-500"
                />
              </div>
            </div>
            <div>
              <Label className="text-ruby-blue-700 mb-2 block">End Color</Label>
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
          </div>
        )}

        {settings.backgroundType === "image" && (
          <div className="space-y-4">
            <div>
              <Label className="text-ruby-blue-700 mb-2 block">Upload Background Image</Label>
              <Button 
                variant="outline" 
                className="w-full h-32 border-2 border-dashed border-ruby-blue-300 hover:border-ruby-blue-400"
              >
                <div className="text-center">
                  <Upload className="h-8 w-8 text-ruby-blue-500 mx-auto mb-2" />
                  <p className="text-ruby-blue-700">Click to upload image</p>
                  <p className="text-sm text-ruby-blue-500">or drag and drop</p>
                </div>
              </Button>
            </div>
            
            <div>
              <Label className="text-ruby-blue-700 mb-3 block">Image Fit Options</Label>
              <RadioGroup defaultValue="cover" className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cover" id="cover" />
                  <Label htmlFor="cover" className="text-ruby-blue-700">Cover</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="contain" id="contain" />
                  <Label htmlFor="contain" className="text-ruby-blue-700">Contain</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tile" id="tile" />
                  <Label htmlFor="tile" className="text-ruby-blue-700">Tile</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        {/* Background Preview */}
        <div className="mt-6 p-4 bg-ruby-blue-50 rounded-lg border border-ruby-blue-200">
          <h4 className="text-ruby-blue-800 font-medium mb-3">Background Preview</h4>
          <div 
            className={`h-24 rounded border border-ruby-blue-200 ${
              settings.backgroundType === "gradient" 
                ? "bg-gradient-to-r from-ruby-blue-200 to-white" 
                : "bg-ruby-blue-50"
            }`}
          >
            <div className="p-4">
              <div className="h-2 bg-white/50 rounded mb-2"></div>
              <div className="h-2 bg-white/30 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}