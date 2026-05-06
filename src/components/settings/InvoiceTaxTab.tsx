import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Upload, Eye, Percent, FileImage, X } from "lucide-react";
import { useInvoiceSettings, useShopInfo, fileToBase64 } from "@/hooks/useAppSettings";
import { toast } from "sonner";

export default function InvoiceTaxTab() {
  const [s, setS] = useInvoiceSettings();
  const [shop] = useShopInfo();
  const sigRef = useRef<HTMLInputElement>(null);
  const stampRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: "signature" | "stamp") => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) { toast.error("File must be under 1MB"); return; }
    const b64 = await fileToBase64(file);
    setS({ ...s, [key]: b64 });
    toast.success(`${key === "signature" ? "Signature" : "Stamp"} uploaded`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-muted/40 border-b">
          <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Invoice Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
              <Input id="invoicePrefix" value={s.prefix} onChange={(e) => setS({ ...s, prefix: e.target.value })} placeholder="INV" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startNumber">Starting Number</Label>
              <Input id="startNumber" type="number" value={s.startNumber} onChange={(e) => setS({ ...s, startNumber: e.target.value })} placeholder="1001" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Next invoice will be: <span className="font-semibold">{s.prefix || "INV"}-{s.startNumber || "1001"}</span></p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-muted/40 border-b">
          <CardTitle className="flex items-center gap-2"><Percent className="h-5 w-5" />Tax Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable GST</Label>
              <p className="text-sm text-muted-foreground">Apply GST to all transactions</p>
            </div>
            <Switch checked={s.gstEnabled} onCheckedChange={(c) => setS({ ...s, gstEnabled: c })} />
          </div>
          {s.gstEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gstRate">Default GST Rate (%)</Label>
                <Select value={s.gstRate} onValueChange={(v) => setS({ ...s, gstRate: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5%</SelectItem>
                    <SelectItem value="12">12%</SelectItem>
                    <SelectItem value="18">18%</SelectItem>
                    <SelectItem value="28">28%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Tax Inclusive Pricing</Label>
                  <p className="text-sm text-muted-foreground">Prices include tax by default</p>
                </div>
                <Switch checked={s.taxInclusive} onCheckedChange={(c) => setS({ ...s, taxInclusive: c })} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-muted/40 border-b">
          <CardTitle className="flex items-center gap-2"><FileImage className="h-5 w-5" />Signature & Stamp</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {(["signature", "stamp"] as const).map((key) => {
            const ref = key === "signature" ? sigRef : stampRef;
            const label = key === "signature" ? "Authorized Signature" : "Company Stamp";
            return (
              <div key={key}>
                <Label>{label}</Label>
                <div className="mt-2 flex items-center space-x-4">
                  <div className="w-32 h-16 bg-muted border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden relative">
                    {s[key] ? (
                      <>
                        <img src={s[key]} alt={label} className="object-contain w-full h-full" />
                        <button type="button" onClick={() => setS({ ...s, [key]: "" })} className="absolute top-0 right-0 bg-destructive text-destructive-foreground rounded-bl p-0.5">
                          <X className="h-3 w-3" />
                        </button>
                      </>
                    ) : (
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <input ref={ref} type="file" accept="image/png,image/jpeg" className="hidden" onChange={(e) => handleUpload(e, key)} />
                    <Button variant="outline" type="button" onClick={() => ref.current?.click()}>
                      {s[key] ? `Change ${label.split(" ").pop()}` : `Upload ${label.split(" ").pop()}`}
                    </Button>
                    <p className="text-sm text-muted-foreground mt-1">PNG, JPG up to 1MB</p>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setPreview(true)}>
          <Eye className="h-4 w-4 mr-2" />Preview Sample Invoice
        </Button>
        <Button onClick={() => { setS(s); toast.success("Invoice settings saved"); }}>
          Save Invoice Settings
        </Button>
      </div>

      <Dialog open={preview} onOpenChange={setPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Sample Invoice Preview</DialogTitle></DialogHeader>
          <div className="border rounded p-6 bg-white text-black space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                {shop.logo && <img src={shop.logo} alt="logo" className="h-14 w-14 object-contain" />}
                <div>
                  <h2 className="text-xl font-bold">{shop.name || "Shop Name"}</h2>
                  <p className="text-xs">{shop.address}</p>
                  <p className="text-xs">{shop.mobile} {shop.email && `• ${shop.email}`}</p>
                  {shop.gstin && <p className="text-xs">GSTIN: {shop.gstin}</p>}
                </div>
              </div>
              <div className="text-right">
                <h3 className="text-lg font-bold">TAX INVOICE</h3>
                <p className="text-sm">No: {s.prefix}-{s.startNumber}</p>
                <p className="text-xs">Date: {new Date().toLocaleDateString("en-IN")}</p>
              </div>
            </div>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-muted text-left">
                  <th className="border p-2">Item</th>
                  <th className="border p-2 text-right">Qty</th>
                  <th className="border p-2 text-right">Rate</th>
                  <th className="border p-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border p-2">Sample Product</td><td className="border p-2 text-right">1</td><td className="border p-2 text-right">₹1,000</td><td className="border p-2 text-right">₹1,000</td></tr>
              </tbody>
            </table>
            <div className="flex justify-between">
              <div className="text-xs space-y-1">
                <p>Payment Terms: As per agreement</p>
                {s.gstEnabled && <p>GST @ {s.gstRate}% {s.taxInclusive ? "(inclusive)" : "(exclusive)"}</p>}
              </div>
              <div className="text-right text-sm">
                <p>Subtotal: ₹1,000</p>
                {s.gstEnabled && <p>GST ({s.gstRate}%): ₹{(1000 * Number(s.gstRate) / 100).toFixed(0)}</p>}
                <p className="font-bold">Total: ₹{(1000 + (s.gstEnabled ? 1000 * Number(s.gstRate) / 100 : 0)).toFixed(0)}</p>
              </div>
            </div>
            <div className="flex justify-end gap-6 pt-4">
              {s.stamp && <div className="text-center"><img src={s.stamp} alt="stamp" className="h-16 object-contain" /><p className="text-xs">Stamp</p></div>}
              {s.signature && <div className="text-center"><img src={s.signature} alt="sig" className="h-16 object-contain" /><p className="text-xs border-t mt-1">Authorized Signatory</p></div>}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
