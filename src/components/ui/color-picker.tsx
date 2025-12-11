import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

const presetColors = [
  "#EF4444", // Red
  "#F97316", // Orange
  "#FBBF24", // Amber
  "#84CC16", // Lime
  "#22C55E", // Green
  "#10B981", // Emerald
  "#14B8A6", // Teal
  "#06B6D4", // Cyan
  "#0EA5E9", // Sky
  "#3B82F6", // Blue
  "#6366F1", // Indigo
  "#8B5CF6", // Violet
  "#D946EF", // Fuchsia
  "#EC4899", // Pink
  "#F43F5E", // Rose
  "#64748B", // Slate
  "#6B7280", // Gray
  "#000000", // Black
];

export function ColorPicker({ value, onChange, label = "Select Color" }: ColorPickerProps) {
  const [showPresets, setShowPresets] = useState(false);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let hex = e.target.value.trim();
    if (!hex.startsWith("#")) {
      hex = "#" + hex;
    }
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      onChange(hex);
    }
  };

  const handlePresetColor = (color: string) => {
    onChange(color);
    setShowPresets(false);
  };

  // Ensure value is a valid hex color
  const validColor = /^#[0-9A-F]{6}$/i.test(value) ? value : "#3B82F6";

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>

      <div className="flex gap-3 items-end">
        {/* Color Wheel/Picker */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={validColor}
              onChange={handleColorChange}
              className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-300 hover:border-gray-400"
              title="Click to open color wheel"
            />
            <div
              className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-sm"
              style={{ backgroundColor: validColor }}
              title="Color preview"
            />
          </div>
        </div>

        {/* Hex Input */}
        <div className="flex-1">
          <Input
            type="text"
            value={validColor}
            onChange={handleHexChange}
            placeholder="#000000"
            maxLength={7}
            className="font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">Hex format: #RRGGBB</p>
        </div>
      </div>

      {/* Preset Colors */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {showPresets ? "Hide" : "Show"} Preset Colors
        </button>

        {showPresets && (
          <div className="grid grid-cols-6 gap-2 mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            {presetColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handlePresetColor(color)}
                className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                  validColor === color
                    ? "border-gray-900 ring-2 ring-offset-2 ring-gray-900"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
