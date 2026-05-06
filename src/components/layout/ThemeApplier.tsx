import { useEffect } from "react";
import { useThemeSettings } from "@/hooks/useAppSettings";

const FONT_MAP: Record<string, string> = {
  inter: "'Inter', system-ui, sans-serif",
  roboto: "'Roboto', system-ui, sans-serif",
  openSans: "'Open Sans', system-ui, sans-serif",
  systemUi: "system-ui, sans-serif",
};

export default function ThemeApplier() {
  const [theme] = useThemeSettings();

  useEffect(() => {
    const root = document.documentElement;
    if (theme.darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
    root.style.setProperty("--app-font-family", FONT_MAP[theme.fontFamily] || FONT_MAP.inter);
    document.body.style.fontFamily = FONT_MAP[theme.fontFamily] || FONT_MAP.inter;
    root.dataset.accent = theme.accentColor;
  }, [theme]);

  return null;
}
