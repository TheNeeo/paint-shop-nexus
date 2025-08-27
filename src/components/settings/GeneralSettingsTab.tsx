import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Upload, MapPin, Phone, FileText } from "lucide-react";

export default function GeneralSettingsTab() {
  const [shopData, setShopData] = useState({
    name: "Paint Shop Pro",
    address: "123 Main Street, City, State 12345",
    mobile: "+1 234 567 8900",
    email: "info@paintshoppro.com",
    gstin: "27ABCDE1234F1Z5",
  });

  return (
    <div className="space-y-6">
      <Card className="border-cadet-gray-200">
        <CardHeader className="bg-cadet-gray-50 border-b border-cadet-gray-200">
          <CardTitle className="flex items-center gap-2 text-cadet-gray-900">
            <Store className="h-5 w-5" />
            Shop Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shopName" className="text-cadet-gray-700">Shop Name</Label>
              <Input
                id="shopName"
                value={shopData.name}
                onChange={(e) => setShopData({...shopData, name: e.target.value})}
                className="border-cadet-gray-300 focus:border-cadet-gray-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gstin" className="text-cadet-gray-700">GSTIN (Optional)</Label>
              <Input
                id="gstin"
                value={shopData.gstin}
                onChange={(e) => setShopData({...shopData, gstin: e.target.value})}
                className="border-cadet-gray-300 focus:border-cadet-gray-500"
                placeholder="Enter GSTIN number"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address" className="text-cadet-gray-700 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address
            </Label>
            <Textarea
              id="address"
              value={shopData.address}
              onChange={(e) => setShopData({...shopData, address: e.target.value})}
              className="border-cadet-gray-300 focus:border-cadet-gray-500"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mobile" className="text-cadet-gray-700 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Mobile Number
              </Label>
              <Input
                id="mobile"
                value={shopData.mobile}
                onChange={(e) => setShopData({...shopData, mobile: e.target.value})}
                className="border-cadet-gray-300 focus:border-cadet-gray-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-cadet-gray-700">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={shopData.email}
                onChange={(e) => setShopData({...shopData, email: e.target.value})}
                className="border-cadet-gray-300 focus:border-cadet-gray-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-cadet-gray-200">
        <CardHeader className="bg-cadet-gray-50 border-b border-cadet-gray-200">
          <CardTitle className="flex items-center gap-2 text-cadet-gray-900">
            <Upload className="h-5 w-5" />
            Shop Logo
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-cadet-gray-100 border-2 border-dashed border-cadet-gray-300 rounded-lg flex items-center justify-center">
              <FileText className="h-8 w-8 text-cadet-gray-400" />
            </div>
            <div>
              <Button variant="outline" className="border-cadet-gray-300 text-cadet-gray-700 hover:bg-cadet-gray-50">
                Upload Logo
              </Button>
              <p className="text-sm text-cadet-gray-600 mt-1">PNG, JPG up to 2MB</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end space-x-3">
        <Button variant="outline" className="border-cadet-gray-300 text-cadet-gray-700 hover:bg-cadet-gray-50">
          Reset to Defaults
        </Button>
        <Button className="bg-cadet-gray-700 hover:bg-cadet-gray-800 text-white">
          Save Changes
        </Button>
      </div>
    </div>
  );
}