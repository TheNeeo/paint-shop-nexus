
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Save, X, Palette, Tag, FileText, ToggleRight } from "lucide-react";
import { FormSectionHeader } from "@/components/shared/FormSectionHeader";
import { FormFieldLabel } from "@/components/shared/FormFieldLabel";

// Extended color options with hex codes and names
const colorOptions = [
  { value: "red", label: "Red", hex: "#EF4444" },
  { value: "orange", label: "Orange", hex: "#F97316" },
  { value: "amber", label: "Amber", hex: "#F59E0B" },
  { value: "yellow", label: "Yellow", hex: "#EAB308" },
  { value: "lime", label: "Lime", hex: "#84CC16" },
  { value: "green", label: "Green", hex: "#22C55E" },
  { value: "emerald", label: "Emerald", hex: "#10B981" },
  { value: "teal", label: "Teal", hex: "#14B8A6" },
  { value: "cyan", label: "Cyan", hex: "#06B6D4" },
  { value: "sky", label: "Sky", hex: "#0EA5E9" },
  { value: "blue", label: "Blue", hex: "#3B82F6" },
  { value: "indigo", label: "Indigo", hex: "#6366F1" },
  { value: "violet", label: "Violet", hex: "#8B5CF6" },
  { value: "purple", label: "Purple", hex: "#A855F7" },
  { value: "fuchsia", label: "Fuchsia", hex: "#D946EF" },
  { value: "pink", label: "Pink", hex: "#EC4899" },
  { value: "rose", label: "Rose", hex: "#F43F5E" },
  { value: "slate", label: "Slate", hex: "#64748B" },
  { value: "gray", label: "Gray", hex: "#6B7280" },
  { value: "zinc", label: "Zinc", hex: "#71717A" },
];

interface CategoryFormData {
  name: string;
  description: string;
  color: string;
  colorHex: string;
  isActive: boolean;
}

interface FormErrors {
  name?: string;
  description?: string;
}

interface CategoryFormProps {
  category?: any;
  onSubmit: (data: CategoryFormData) => void;
  onClose: () => void;
}

// Helper to find closest color name from hex
const getColorNameFromHex = (hex: string): { name: string; value: string } => {
  const cleanHex = hex.replace('#', '').toLowerCase();
  const found = colorOptions.find(c => c.hex.replace('#', '').toLowerCase() === cleanHex);
  if (found) return { name: found.label, value: found.value };
  
  // Find closest match by comparing RGB values
  const hexToRgb = (h: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };
  
  const inputRgb = hexToRgb(hex);
  let closestColor = colorOptions[0];
  let minDistance = Infinity;
  
  colorOptions.forEach(color => {
    const colorRgb = hexToRgb(color.hex);
    const distance = Math.sqrt(
      Math.pow(inputRgb.r - colorRgb.r, 2) +
      Math.pow(inputRgb.g - colorRgb.g, 2) +
      Math.pow(inputRgb.b - colorRgb.b, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = color;
    }
  });
  
  return { name: closestColor.label, value: closestColor.value };
};

export function CategoryForm({ category, onSubmit, onClose }: CategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    color: "blue",
    colorHex: "#3B82F6",
    isActive: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const colorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (category) {
      const colorOption = colorOptions.find(c => c.value === category.color) || colorOptions[10]; // default blue
      setFormData({
        name: category.name || "",
        description: category.description || "",
        color: category.color || "blue",
        colorHex: colorOption.hex,
        isActive: category.isActive !== undefined ? category.isActive : true,
      });
    }
  }, [category]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
    
    // Reset form if it's for adding (not editing)
    if (!category) {
      setFormData({
        name: "",
        description: "",
        color: "blue",
        colorHex: "#3B82F6",
        isActive: true,
      });
    }
  };

  const handleInputChange = (field: keyof CategoryFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleColorChange = (hex: string) => {
    const colorInfo = getColorNameFromHex(hex);
    setFormData(prev => ({
      ...prev,
      colorHex: hex.toUpperCase(),
      color: colorInfo.value,
    }));
  };

  const handlePresetColorClick = (color: typeof colorOptions[0]) => {
    setFormData(prev => ({
      ...prev,
      colorHex: color.hex,
      color: color.value,
    }));
  };

  const currentColorName = colorOptions.find(c => c.value === formData.color)?.label || getColorNameFromHex(formData.colorHex).name;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
      <div className="grid grid-cols-1 gap-6">
        {/* Category Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-purple-800">
            Category Name *
          </Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter category name"
            className={`border-purple-200 focus:border-purple-400 focus:ring-purple-400 ${errors.name ? "border-red-500" : ""}`}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium text-purple-800">
            Description *
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Enter category description"
            rows={3}
            className={`border-purple-200 focus:border-purple-400 focus:ring-purple-400 ${errors.description ? "border-red-500" : ""}`}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        {/* Color Selection with Color Wheel */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-purple-800">
            Category Color
          </Label>
          
          <div className="flex items-center gap-4">
            {/* Color Preview and Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-purple-200 hover:border-purple-400 justify-start gap-3"
                >
                  <div 
                    className="w-8 h-8 rounded-lg shadow-inner border border-gray-200"
                    style={{ backgroundColor: formData.colorHex }}
                  />
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-gray-800">{currentColorName}</span>
                    <span className="text-xs text-gray-500">{formData.colorHex}</span>
                  </div>
                  <Palette className="h-4 w-4 ml-auto text-purple-500" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4 bg-white border-purple-200" align="start">
                <div className="space-y-4">
                  {/* Color Wheel Input */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-purple-800">Color Wheel</Label>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <input
                          ref={colorInputRef}
                          type="color"
                          value={formData.colorHex}
                          onChange={(e) => handleColorChange(e.target.value)}
                          className="w-16 h-16 rounded-xl cursor-pointer border-2 border-purple-200 hover:border-purple-400 transition-colors"
                          style={{ padding: 0 }}
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">Hex:</span>
                          <Input
                            type="text"
                            value={formData.colorHex}
                            onChange={(e) => {
                              let val = e.target.value;
                              if (!val.startsWith('#')) val = '#' + val;
                              if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                                if (val.length === 7) {
                                  handleColorChange(val);
                                } else {
                                  setFormData(prev => ({ ...prev, colorHex: val.toUpperCase() }));
                                }
                              }
                            }}
                            className="h-8 text-sm font-mono border-purple-200"
                            maxLength={7}
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          Base Color: <span className="font-medium text-purple-700">{currentColorName}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Preset Colors Grid */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-purple-800">Preset Colors</Label>
                    <div className="grid grid-cols-10 gap-1">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => handlePresetColorClick(color)}
                          className={`w-6 h-6 rounded-md border-2 transition-all hover:scale-110 ${
                            formData.color === color.value 
                              ? 'border-purple-600 ring-2 ring-purple-300' 
                              : 'border-transparent hover:border-gray-300'
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={`${color.label} (${color.hex})`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Active Status */}
        <div className="flex items-center justify-between bg-purple-50 p-4 rounded-xl border border-purple-200">
          <Label htmlFor="isActive" className="text-sm font-medium text-purple-800">
            Active Status
          </Label>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${!formData.isActive ? 'text-purple-700 font-medium' : 'text-gray-400'}`}>Inactive</span>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleInputChange("isActive", checked)}
              className="data-[state=checked]:bg-purple-600"
            />
            <span className={`text-sm ${formData.isActive ? 'text-purple-700 font-medium' : 'text-gray-400'}`}>Active</span>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 border-t border-purple-200">
        <Button
          type="submit"
          className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg"
        >
          <Save className="h-4 w-4 mr-2" />
          {category ? "Update Category" : "Create Category"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </form>
  );
}
