import { useEffect } from "react";
import { useThemeSettings, useUISettings } from "@/hooks/useAppSettings";

const FONT_MAP: Record<string, string> = {
  inter: "'Inter', system-ui, sans-serif",
  roboto: "'Roboto', system-ui, sans-serif",
  openSans: "'Open Sans', system-ui, sans-serif",
  systemUi: "system-ui, sans-serif",
  arial: "Arial, sans-serif",
  helvetica: "Helvetica, Arial, sans-serif",
};

function hexToHsl(hex: string): string {
  const m = hex.replace("#", "");
  if (m.length !== 6) return "142 69% 45%";
  const r = parseInt(m.slice(0, 2), 16) / 255;
  const g = parseInt(m.slice(2, 4), 16) / 255;
  const b = parseInt(m.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export default function ThemeApplier() {
  const [theme] = useThemeSettings();
  const [ui] = useUISettings();

  useEffect(() => {
    const root = document.documentElement;
    const isDark = theme.darkMode || ui.theme === "dark";
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");

    const fontKey = ui.fontFamily || theme.fontFamily;
    const fam = FONT_MAP[fontKey] || FONT_MAP.inter;
    root.style.setProperty("--app-font-family", fam);
    document.body.style.fontFamily = fam;
    document.body.style.fontSize = `${ui.fontSize || 16}px`;
    document.body.style.lineHeight = String(ui.lineHeight || 1.5);

    if (ui.primaryColor) {
      const hsl = hexToHsl(ui.primaryColor);
      root.style.setProperty("--primary", hsl);
      root.style.setProperty("--ring", hsl);
    }

    if (ui.animationsEnabled === false) {
      root.style.setProperty("--app-anim-duration", "0s");
      root.classList.add("no-animations");
    } else {
      const speedMap: Record<string, string> = { slow: "0.5s", medium: "0.3s", fast: "0.15s" };
      root.style.setProperty("--app-anim-duration", speedMap[ui.animSpeed] || "0.3s");
      root.classList.remove("no-animations");
    }

    root.dataset.accent = theme.accentColor;
  }, [theme, ui]);

  return null;
}
