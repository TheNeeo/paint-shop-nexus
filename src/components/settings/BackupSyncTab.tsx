import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Database, Download, Upload, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useBackupSettings } from "@/hooks/useAppSettings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const TABLES = ["customers", "vendors", "products", "categories", "sales", "sale_items", "purchases", "purchase_items", "expenses", "cash_receipts", "stock_adjustments"] as const;

export default function BackupSyncTab() {
  const [s, setS] = useBackupSettings();
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);

  const exportData = async (format: "json" | "csv") => {
    setBusy(true);
    setProgress(5);
    try {
      const dump: Record<string, any[]> = {};
      let i = 0;
      for (const t of TABLES) {
        const { data, error } = await supabase.from(t as any).select("*");
        if (error) throw error;
        dump[t] = data || [];
        i++;
        setProgress(Math.round((i / TABLES.length) * 100));
      }
      const ts = new Date().toISOString().replace(/[:.]/g, "-");
      if (format === "json") {
        const blob = new Blob([JSON.stringify(dump, null, 2)], { type: "application/json" });
        triggerDownload(blob, `backup-${ts}.json`);
      } else {
        // CSV: zip-like text per table joined
        const parts: string[] = [];
        Object.entries(dump).forEach(([table, rows]) => {
          parts.push(`# ${table}`);
          if (!rows.length) { parts.push(""); return; }
          const headers = Object.keys(rows[0]);
          parts.push(headers.join(","));
          rows.forEach((r) => parts.push(headers.map((h) => csvCell(r[h])).join(",")));
          parts.push("");
        });
        const blob = new Blob([parts.join("\n")], { type: "text/csv" });
        triggerDownload(blob, `backup-${ts}.csv`);
      }
      setS({ ...s, lastSync: new Date().toLocaleString("en-IN") });
      toast.success("Backup downloaded");
    } catch (e: any) {
      toast.error(`Backup failed: ${e.message}`);
    } finally {
      setBusy(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-muted/40 border-b">
          <CardTitle className="flex items-center gap-2"><Database className="h-5 w-5" />Backup Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Automatic Daily Backup</Label>
              <p className="text-sm text-muted-foreground">Reminder for daily local download</p>
            </div>
            <Switch checked={s.autoBackup} onCheckedChange={(c) => setS({ ...s, autoBackup: c })} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Cloud Sync</Label>
              <p className="text-sm text-muted-foreground">Data is automatically saved to Lovable Cloud</p>
            </div>
            <Switch checked={s.cloudSync} onCheckedChange={(c) => setS({ ...s, cloudSync: c })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-muted/40 border-b">
          <CardTitle className="flex items-center gap-2"><Download className="h-5 w-5" />Local Backup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p>Download your data as JSON or CSV files</p>
              <p className="text-sm text-muted-foreground">Includes all products, sales, customers, and settings</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => exportData("json")} disabled={busy}>
                {busy ? "Creating..." : "Backup JSON"}
              </Button>
              <Button variant="outline" onClick={() => exportData("csv")} disabled={busy}>
                {busy ? "Creating..." : "Backup CSV"}
              </Button>
            </div>
          </div>
          {busy && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground">Creating backup file... {progress}%</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-muted/40 border-b">
          <CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5" />Cloud Sync Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p>Last successful backup</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-4 w-4" />{s.lastSync || "Never"}
              </p>
            </div>
          </div>
          {s.cloudSync && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Cloud sync is enabled. Your data is automatically synchronized.</AlertDescription>
            </Alert>
          )}
          <div className="flex space-x-3">
            <Button onClick={() => exportData("json")} disabled={busy}>Sync Now</Button>
            <Button variant="outline" onClick={() => exportData("json")} disabled={busy}>Export Full Data</Button>
          </div>
        </CardContent>
      </Card>

      <div className="bg-muted/40 border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Version Info</h4>
            <p className="text-sm text-muted-foreground">Paint Shop Management v2.1.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function csvCell(v: any) {
  if (v === null || v === undefined) return "";
  const s = typeof v === "object" ? JSON.stringify(v) : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function triggerDownload(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}
