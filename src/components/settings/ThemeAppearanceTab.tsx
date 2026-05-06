import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, Sun, Moon, Type, Layout } from "lucide-react";
import { useThemeSettings, defaultTheme } from "@/hooks/useAppSettings";
import { toast } from "sonner";

const colorOptions = [
  { name: "Cadet Gray", value: "cadet-gray", color: "#9BA2A3" },
  { name: "Turquoise", value: "turquoise", color: "#5AE0C1" },
  { name: "Mindaro", value: "mindaro", color: "#BAEA66" },
  { name: "Default Green", value: "green", color: "#22C55E" },
];

export default function ThemeAppearanceTab() {
  const [t, setT] = useThemeSettings();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-muted/40 border-b">
          <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5" />Theme Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {t.darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <div>
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
              </div>
            </div>
            <Switch checked={t.darkMode} onCheckedChange={(c) => setT({ ...t, darkMode: c })} />
          </div>

          <div className="space-y-3">
            <Label>Accent Color</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setT({ ...t, accentColor: color.value })}
                  className={`p-3 rounded-lg border-2 transition-all ${t.accentColor === color.value ? "border-primary bg-muted" : "border-border hover:border-muted-foreground"}`}
                >
                  <div className="w-8 h-8 rounded-full mx-auto mb-2" style={{ backgroundColor: color.color }} />
                  <p className="text-sm">{color.name}</p>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-muted/40 border-b">
          <CardTitle className="flex items-center gap-2"><Layout className="h-5 w-5" />Layout Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Sidebar Expanded by Default</Label>
              <p className="text-sm text-muted-foreground">Keep sidebar open when page loads</p>
            </div>
            <Switch checked={t.sidebarExpanded} onCheckedChange={(c) => setT({ ...t, sidebarExpanded: c })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="iconStyle">Icon Style</Label>
            <Select value={t.iconStyle} onValueChange={(v) => setT({ ...t, iconStyle: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="outline">Outline</SelectItem>
                <SelectItem value="filled">Filled</SelectItem>
                <SelectItem value="rounded">Rounded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-muted/40 border-b">
          <CardTitle className="flex items-center gap-2"><Type className="h-5 w-5" />Typography</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="fontFamily">Font Family</Label>
            <Select value={t.fontFamily} onValueChange={(v) => setT({ ...t, fontFamily: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
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
        <Button variant="outline" onClick={() => { setT(defaultTheme); toast.success("Reset to defaults"); }}>Reset to Defaults</Button>
        <Button onClick={() => { setT(t); toast.success("Theme applied"); }}>Apply Theme Changes</Button>
      </div>
    </div>
  );
}
