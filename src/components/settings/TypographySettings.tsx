import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Type } from "lucide-react";

interface TypographySettingsProps {
  settings: any;
  setSettings: (settings: any) => void;
}

export function TypographySettings({ settings, setSettings }: TypographySettingsProps) {
  return (
    <Card className="border-ruby-blue-200">
      <CardHeader className="bg-ruby-blue-50 border-b border-ruby-blue-200">
        <CardTitle className="flex items-center gap-2 text-ruby-blue-900">
          <Type className="h-5 w-5" />
          Typography
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-ruby-blue-700 mb-2 block">Primary Font Family</Label>
            <Select 
              value={settings.fontFamily} 
              onValueChange={(value) => setSettings({...settings, fontFamily: value})}
            >
              <SelectTrigger className="border-ruby-blue-300 focus:border-ruby-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="roboto">Roboto</SelectItem>
                <SelectItem value="openSans">Open Sans</SelectItem>
                <SelectItem value="systemUi">System UI</SelectItem>
                <SelectItem value="arial">Arial</SelectItem>
                <SelectItem value="helvetica">Helvetica</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-ruby-blue-700 mb-2 block">Secondary Font Family</Label>
            <Select defaultValue="roboto">
              <SelectTrigger className="border-ruby-blue-300 focus:border-ruby-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="roboto">Roboto</SelectItem>
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="openSans">Open Sans</SelectItem>
                <SelectItem value="systemUi">System UI</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-ruby-blue-700 mb-2 block">
              Base Font Size: {settings.fontSize}px
            </Label>
            <Slider
              value={[settings.fontSize]}
              onValueChange={(value) => setSettings({...settings, fontSize: value[0]})}
              max={20}
              min={12}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-ruby-blue-700 mb-2 block">
              Heading Font Size: {Math.round(settings.fontSize * 1.5)}px
            </Label>
            <Slider
              value={[Math.round(settings.fontSize * 1.5)]}
              max={32}
              min={16}
              step={1}
              className="w-full"
              disabled
            />
          </div>

          <div>
            <Label className="text-ruby-blue-700 mb-2 block">Line Height: 1.5</Label>
            <Slider
              defaultValue={[1.5]}
              max={2}
              min={1}
              step={0.1}
              className="w-full"
            />
          </div>
        </div>

        {/* Font Preview */}
        <div className="mt-6 p-4 bg-ruby-blue-50 rounded-lg border border-ruby-blue-200">
          <h4 className="text-ruby-blue-800 font-medium mb-3">Font Preview</h4>
          <div 
            style={{ 
              fontFamily: settings.fontFamily === 'inter' ? 'Inter' : 
                         settings.fontFamily === 'roboto' ? 'Roboto' : 
                         settings.fontFamily === 'openSans' ? 'Open Sans' : 'system-ui',
              fontSize: `${settings.fontSize}px`
            }}
          >
            <h3 className="text-xl font-bold text-ruby-blue-900 mb-2">
              Sample Heading Text
            </h3>
            <p className="text-ruby-blue-700 mb-2">
              This is a sample paragraph showing how your selected typography will appear in the interface. 
              The quick brown fox jumps over the lazy dog.
            </p>
            <p className="text-sm text-ruby-blue-600">
              Small text sample for captions and descriptions.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}