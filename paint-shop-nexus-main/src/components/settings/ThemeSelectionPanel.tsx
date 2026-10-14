import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Palette, Sun, Moon, Paintbrush } from "lucide-react";

interface ThemeSelectionPanelProps {
  settings: any;
  setSettings: (settings: any) => void;
}

export function ThemeSelectionPanel({ settings, setSettings }: ThemeSelectionPanelProps) {
  return (
    <Card className="border-border">
      <CardHeader className="bg-muted border-b border-border">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Palette className="h-5 w-5" />
          Theme Options
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <RadioGroup 
          value={settings.theme} 
          onValueChange={(value) => setSettings({...settings, theme: value})}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Light Theme */}
            <div className="relative">
              <div className="flex items-center space-x-2 mb-3">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="text-foreground font-medium">
                  Light Theme
                </Label>
              </div>
              <div className="relative overflow-hidden rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer">
                <div className="bg-background p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-primary" />
                    <div className="h-2 bg-muted rounded flex-1"></div>
                  </div>
                  <div className="h-1 bg-muted-foreground/20 rounded w-3/4"></div>
                  <div className="h-1 bg-muted-foreground/20 rounded w-1/2"></div>
                </div>
              </div>
            </div>

            {/* Dark Theme */}
            <div className="relative">
              <div className="flex items-center space-x-2 mb-3">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="text-foreground font-medium">
                  Dark Theme
                </Label>
              </div>
              <div className="relative overflow-hidden rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer">
                <div className="bg-gray-900 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4 text-primary" />
                    <div className="h-2 bg-gray-700 rounded flex-1"></div>
                  </div>
                  <div className="h-1 bg-gray-600 rounded w-3/4"></div>
                  <div className="h-1 bg-gray-600 rounded w-1/2"></div>
                </div>
              </div>
            </div>

            {/* Custom Theme */}
            <div className="relative">
              <div className="flex items-center space-x-2 mb-3">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="text-foreground font-medium">
                  Custom Theme
                </Label>
              </div>
              <div className="relative overflow-hidden rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer">
                <div className="bg-gradient-to-br from-primary/10 to-primary/20 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Paintbrush className="h-4 w-4 text-primary" />
                    <div className="h-2 bg-primary/30 rounded flex-1"></div>
                  </div>
                  <div className="h-1 bg-primary/40 rounded w-3/4"></div>
                  <div className="h-1 bg-primary/40 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </RadioGroup>

        {settings.theme === "custom" && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-foreground mb-2 block">Primary Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                  className="w-12 h-10 rounded border border-border"
                />
                <input
                  type="text"
                  value={settings.primaryColor}
                  onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                  className="flex-1 px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div>
              <Label className="text-foreground mb-2 block">Secondary Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.secondaryColor}
                  onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                  className="w-12 h-10 rounded border border-border"
                />
                <input
                  type="text"
                  value={settings.secondaryColor}
                  onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                  className="flex-1 px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}