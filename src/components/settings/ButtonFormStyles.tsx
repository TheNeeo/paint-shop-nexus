import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { MousePointer, Square, Circle } from "lucide-react";

interface ButtonFormStylesProps {
  settings: any;
  setSettings: (settings: any) => void;
}

export function ButtonFormStyles({ settings, setSettings }: ButtonFormStylesProps) {
  return (
    <Card className="border-ruby-blue-200">
      <CardHeader className="bg-ruby-blue-50 border-b border-ruby-blue-200">
        <CardTitle className="flex items-center gap-2 text-ruby-blue-900">
          <MousePointer className="h-5 w-5" />
          Buttons & Forms
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div>
          <Label className="text-ruby-blue-700 mb-3 block">Button Style</Label>
          <RadioGroup 
            value={settings.buttonStyle} 
            onValueChange={(value) => setSettings({...settings, buttonStyle: value})}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rounded" id="rounded" />
              <Label htmlFor="rounded" className="flex items-center gap-2">
                <Circle className="h-4 w-4" />
                Rounded Buttons
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="square" id="square" />
              <Label htmlFor="square" className="flex items-center gap-2">
                <Square className="h-4 w-4" />
                Square Buttons
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-ruby-blue-700 mb-3 block">Button Fill Style</Label>
          <RadioGroup defaultValue="filled" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="filled" id="filled" />
              <Label htmlFor="filled" className="text-ruby-blue-700">
                Filled Buttons
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="outlined" id="outlined" />
              <Label htmlFor="outlined" className="text-ruby-blue-700">
                Outlined Buttons
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label className="text-ruby-blue-700 mb-2 block">Button Primary Color</Label>
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
            <Label className="text-ruby-blue-700 mb-2 block">Button Hover Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                defaultValue="#6B9FDC"
                className="w-12 h-10 rounded border border-ruby-blue-300"
              />
              <input
                type="text"
                defaultValue="#6B9FDC"
                className="flex-1 px-3 py-2 border border-ruby-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-ruby-blue-500"
              />
            </div>
          </div>

          <div>
            <Label className="text-ruby-blue-700 mb-2 block">Form Field Background</Label>
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

        {/* Button Preview */}
        <div className="mt-6 p-4 bg-ruby-blue-50 rounded-lg border border-ruby-blue-200">
          <h4 className="text-ruby-blue-800 font-medium mb-3">Button & Form Preview</h4>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button 
                className={`bg-ruby-blue-500 hover:bg-ruby-blue-600 text-white ${
                  settings.buttonStyle === 'square' ? 'rounded-none' : 'rounded'
                }`}
              >
                Primary Button
              </Button>
              <Button 
                variant="outline" 
                className={`border-ruby-blue-400 text-ruby-blue-700 hover:bg-ruby-blue-50 ${
                  settings.buttonStyle === 'square' ? 'rounded-none' : 'rounded'
                }`}
              >
                Secondary Button
              </Button>
              <Button 
                variant="destructive" 
                className={settings.buttonStyle === 'square' ? 'rounded-none' : 'rounded'}
              >
                Danger Button
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Sample text input"
                className="px-3 py-2 border border-ruby-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-ruby-blue-500"
              />
              <input
                type="email"
                placeholder="Sample email input"
                className="px-3 py-2 border border-ruby-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-ruby-blue-500"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}