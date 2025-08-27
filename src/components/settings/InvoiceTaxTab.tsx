import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Upload, Eye, Percent, FileImage } from "lucide-react";

export default function InvoiceTaxTab() {
  const [invoiceSettings, setInvoiceSettings] = useState({
    prefix: "INV",
    startNumber: "1001",
    gstEnabled: true,
    gstRate: "18",
    taxInclusive: false,
  });

  return (
    <div className="space-y-6">
      <Card className="border-cadet-gray-200">
        <CardHeader className="bg-cadet-gray-50 border-b border-cadet-gray-200">
          <CardTitle className="flex items-center gap-2 text-cadet-gray-900">
            <FileText className="h-5 w-5" />
            Invoice Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoicePrefix" className="text-cadet-gray-700">Invoice Prefix</Label>
              <Input
                id="invoicePrefix"
                value={invoiceSettings.prefix}
                onChange={(e) => setInvoiceSettings({...invoiceSettings, prefix: e.target.value})}
                className="border-cadet-gray-300 focus:border-cadet-gray-500"
                placeholder="INV"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startNumber" className="text-cadet-gray-700">Starting Number</Label>
              <Input
                id="startNumber"
                value={invoiceSettings.startNumber}
                onChange={(e) => setInvoiceSettings({...invoiceSettings, startNumber: e.target.value})}
                className="border-cadet-gray-300 focus:border-cadet-gray-500"
                placeholder="1001"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-cadet-gray-200">
        <CardHeader className="bg-cadet-gray-50 border-b border-cadet-gray-200">
          <CardTitle className="flex items-center gap-2 text-cadet-gray-900">
            <Percent className="h-5 w-5" />
            Tax Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-cadet-gray-700">Enable GST</Label>
              <p className="text-sm text-cadet-gray-600">Apply GST to all transactions</p>
            </div>
            <Switch
              checked={invoiceSettings.gstEnabled}
              onCheckedChange={(checked) => setInvoiceSettings({...invoiceSettings, gstEnabled: checked})}
            />
          </div>
          
          {invoiceSettings.gstEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gstRate" className="text-cadet-gray-700">Default GST Rate (%)</Label>
                <Select 
                  value={invoiceSettings.gstRate} 
                  onValueChange={(value) => setInvoiceSettings({...invoiceSettings, gstRate: value})}
                >
                  <SelectTrigger className="border-cadet-gray-300 focus:border-cadet-gray-500">
                    <SelectValue />
                  </SelectTrigger>
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
                  <Label className="text-cadet-gray-700">Tax Inclusive Pricing</Label>
                  <p className="text-sm text-cadet-gray-600">Prices include tax by default</p>
                </div>
                <Switch
                  checked={invoiceSettings.taxInclusive}
                  onCheckedChange={(checked) => setInvoiceSettings({...invoiceSettings, taxInclusive: checked})}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-cadet-gray-200">
        <CardHeader className="bg-cadet-gray-50 border-b border-cadet-gray-200">
          <CardTitle className="flex items-center gap-2 text-cadet-gray-900">
            <FileImage className="h-5 w-5" />
            Signature & Stamp
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div>
            <Label className="text-cadet-gray-700">Authorized Signature</Label>
            <div className="mt-2 flex items-center space-x-4">
              <div className="w-32 h-16 bg-cadet-gray-100 border-2 border-dashed border-cadet-gray-300 rounded-lg flex items-center justify-center">
                <Upload className="h-6 w-6 text-cadet-gray-400" />
              </div>
              <div>
                <Button variant="outline" className="border-cadet-gray-300 text-cadet-gray-700 hover:bg-cadet-gray-50">
                  Upload Signature
                </Button>
                <p className="text-sm text-cadet-gray-600 mt-1">PNG, JPG up to 1MB</p>
              </div>
            </div>
          </div>
          
          <div>
            <Label className="text-cadet-gray-700">Company Stamp</Label>
            <div className="mt-2 flex items-center space-x-4">
              <div className="w-32 h-16 bg-cadet-gray-100 border-2 border-dashed border-cadet-gray-300 rounded-lg flex items-center justify-center">
                <Upload className="h-6 w-6 text-cadet-gray-400" />
              </div>
              <div>
                <Button variant="outline" className="border-cadet-gray-300 text-cadet-gray-700 hover:bg-cadet-gray-50">
                  Upload Stamp
                </Button>
                <p className="text-sm text-cadet-gray-600 mt-1">PNG, JPG up to 1MB</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" className="border-cadet-gray-300 text-cadet-gray-700 hover:bg-cadet-gray-50">
          <Eye className="h-4 w-4 mr-2" />
          Preview Sample Invoice
        </Button>
        <Button className="bg-cadet-gray-700 hover:bg-cadet-gray-800 text-white">
          Save Invoice Settings
        </Button>
      </div>
    </div>
  );
}