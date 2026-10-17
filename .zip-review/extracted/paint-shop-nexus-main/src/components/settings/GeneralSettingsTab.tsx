import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Upload, MapPin, Phone, FileText, X } from "lucide-react";
import { useShopInfo, defaultShop, fileToBase64 } from "@/hooks/useAppSettings";
import { toast } from "sonner";

export default function GeneralSettingsTab() {
  const [shop, setShop] = useShopInfo();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Logo must be under 2MB"); return; }
    const b64 = await fileToBase64(file);
    setShop({ ...shop, logo: b64 });
    toast.success("Logo uploaded");
  };

  const handleSave = () => {
    setShop(shop);
    toast.success("Shop information saved");
  };

  const handleReset = () => {
    setShop(defaultShop);
    toast.success("Reset to defaults");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-muted/40 border-b">
          <CardTitle className="flex items-center gap-2"><Store className="h-5 w-5" />Shop Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shopName">Shop Name *</Label>
              <Input id="shopName" value={shop.name} onChange={(e) => setShop({ ...shop, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gstin">GSTIN (Optional)</Label>
              <Input id="gstin" value={shop.gstin} onChange={(e) => setShop({ ...shop, gstin: e.target.value })} placeholder="Enter GSTIN" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2"><MapPin className="h-4 w-4" />Address</Label>
            <Textarea id="address" rows={3} value={shop.address} onChange={(e) => setShop({ ...shop, address: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mobile" className="flex items-center gap-2"><Phone className="h-4 w-4" />Mobile Number</Label>
              <Input id="mobile" value={shop.mobile} onChange={(e) => setShop({ ...shop, mobile: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={shop.email} onChange={(e) => setShop({ ...shop, email: e.target.value })} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-muted/40 border-b">
          <CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5" />Shop Logo</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-muted border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden relative">
              {shop.logo ? (
                <>
                  <img src={shop.logo} alt="Logo" className="object-contain w-full h-full" />
                  <button
                    type="button"
                    onClick={() => setShop({ ...shop, logo: "" })}
                    className="absolute top-0 right-0 bg-destructive text-destructive-foreground rounded-bl p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </>
              ) : (
                <FileText className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div>
              <input ref={fileRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleLogo} />
              <Button variant="outline" type="button" onClick={() => fileRef.current?.click()}>
                {shop.logo ? "Change Logo" : "Upload Logo"}
              </Button>
              <p className="text-sm text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={handleReset}>Reset to Defaults</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}
