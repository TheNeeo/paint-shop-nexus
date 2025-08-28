import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap } from "lucide-react";

interface AnimationSettingsProps {
  settings: any;
  setSettings: (settings: any) => void;
}

export function AnimationSettings({ settings, setSettings }: AnimationSettingsProps) {
  return (
    <Card className="border-ruby-blue-200">
      <CardHeader className="bg-ruby-blue-50 border-b border-ruby-blue-200">
        <CardTitle className="flex items-center gap-2 text-ruby-blue-900">
          <Zap className="h-5 w-5" />
          Animations
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-ruby-blue-700">Page Transition Animations</Label>
              <p className="text-sm text-ruby-blue-600">Smooth transitions between pages</p>
            </div>
            <Switch 
              checked={settings.animationsEnabled}
              onCheckedChange={(checked) => setSettings({...settings, animationsEnabled: checked})}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-ruby-blue-700">Hover Animations</Label>
              <p className="text-sm text-ruby-blue-600">Enable hover effects on interactive elements</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>

        <div>
          <Label className="text-ruby-blue-700 mb-2 block">Animation Speed</Label>
          <Select defaultValue="medium">
            <SelectTrigger className="border-ruby-blue-300 focus:border-ruby-blue-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="slow">Slow (0.5s)</SelectItem>
              <SelectItem value="medium">Medium (0.3s)</SelectItem>
              <SelectItem value="fast">Fast (0.15s)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-ruby-blue-700">Fade Animations</Label>
              <p className="text-sm text-ruby-blue-600">Fade in/out effects</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-ruby-blue-700">Scale Animations</Label>
              <p className="text-sm text-ruby-blue-600">Scaling effects on interactions</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-ruby-blue-700">Slide Animations</Label>
            <p className="text-sm text-ruby-blue-600">Sliding effects for drawers and panels</p>
          </div>
          <Switch defaultChecked />
        </div>

        {/* Animation Preview */}
        <div className="mt-6 p-4 bg-ruby-blue-50 rounded-lg border border-ruby-blue-200">
          <h4 className="text-ruby-blue-800 font-medium mb-3">Animation Preview</h4>
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-ruby-blue-300 rounded transform transition-all duration-300 hover:scale-110 hover:rotate-3 cursor-pointer flex items-center justify-center">
              <span className="text-white text-xs">Hover</span>
            </div>
            <div className="w-16 h-16 bg-ruby-blue-400 rounded animate-pulse cursor-pointer flex items-center justify-center">
              <span className="text-white text-xs">Pulse</span>
            </div>
            <div className="w-16 h-16 bg-ruby-blue-500 rounded transition-all duration-300 hover:bg-ruby-blue-600 cursor-pointer flex items-center justify-center">
              <span className="text-white text-xs">Fade</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}