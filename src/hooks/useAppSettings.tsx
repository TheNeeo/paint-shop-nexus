import { useEffect, useState, useCallback } from "react";

export interface ShopInfo {
  name: string;
  address: string;
  mobile: string;
  email: string;
  gstin: string;
  logo: string; // base64 data URL
}

export interface InvoiceSettings {
  prefix: string;
  startNumber: string;
  gstEnabled: boolean;
  gstRate: string;
  taxInclusive: boolean;
  signature: string; // base64
  stamp: string; // base64
}

export interface ThemeSettings {
  darkMode: boolean;
  accentColor: string;
  sidebarExpanded: boolean;
  iconStyle: string;
  fontFamily: string;
}

export interface BackupSettings {
  autoBackup: boolean;
  cloudSync: boolean;
  lastSync: string;
}

const KEYS = {
  shop: "ncf_shop_info",
  invoice: "ncf_invoice_settings",
  theme: "ncf_theme_settings",
  backup: "ncf_backup_settings",
};

export const defaultShop: ShopInfo = {
  name: "NEO COLOR FACTORY",
  address: "",
  mobile: "",
  email: "",
  gstin: "",
  logo: "",
};

export const defaultInvoice: InvoiceSettings = {
  prefix: "INV",
  startNumber: "1001",
  gstEnabled: true,
  gstRate: "18",
  taxInclusive: false,
  signature: "",
  stamp: "",
};

export const defaultTheme: ThemeSettings = {
  darkMode: false,
  accentColor: "cadet-gray",
  sidebarExpanded: true,
  iconStyle: "outline",
  fontFamily: "inter",
};

export const defaultBackup: BackupSettings = {
  autoBackup: true,
  cloudSync: false,
  lastSync: "",
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) };
  } catch {
    return fallback;
  }
}

export function useAppSettings<T>(key: keyof typeof KEYS, fallback: T) {
  const storageKey = KEYS[key];
  const [data, setData] = useState<T>(() => load<T>(storageKey, fallback));

  const save = useCallback(
    (next: T) => {
      setData(next);
      localStorage.setItem(storageKey, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent("app-settings-changed", { detail: { key } }));
    },
    [storageKey, key]
  );

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        try { setData({ ...fallback, ...JSON.parse(e.newValue) }); } catch {}
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [storageKey, fallback]);

  return [data, save] as const;
}

export const useShopInfo = () => useAppSettings<ShopInfo>("shop", defaultShop);
export const useInvoiceSettings = () => useAppSettings<InvoiceSettings>("invoice", defaultInvoice);
export const useThemeSettings = () => useAppSettings<ThemeSettings>("theme", defaultTheme);
export const useBackupSettings = () => useAppSettings<BackupSettings>("backup", defaultBackup);

// Helper for non-hook contexts (e.g. invoice number generation)
export function getInvoiceSettings(): InvoiceSettings {
  return load<InvoiceSettings>(KEYS.invoice, defaultInvoice);
}

export function nextInvoiceNumber(): string {
  const s = getInvoiceSettings();
  const counterKey = "ncf_invoice_counter";
  const start = parseInt(s.startNumber || "1001", 10) || 1001;
  const current = parseInt(localStorage.getItem(counterKey) || String(start), 10);
  const next = Math.max(current, start);
  localStorage.setItem(counterKey, String(next + 1));
  return `${s.prefix || "INV"}-${next}`;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
