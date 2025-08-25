import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddEditVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor?: any;
}

export function AddEditVendorModal({
  isOpen,
  onClose,
  vendor,
}: AddEditVendorModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    gstNo: "",
    address: "",
    openingBalance: "",
    paymentTerms: "net30",
    status: true,
  });

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name || "",
        mobile: vendor.mobile || "",
        email: vendor.email || "",
        gstNo: vendor.gstNo || "",
        address: vendor.address || "",
        openingBalance: vendor.openingBalance || "",
        paymentTerms: vendor.paymentTerms || "net30",
        status: vendor.status === "Active",
      });
    } else {
      setFormData({
        name: "",
        mobile: "",
        email: "",
        gstNo: "",
        address: "",
        openingBalance: "",
        paymentTerms: "net30",
        status: true,
      });
    }
  }, [vendor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving vendor:", formData);
    onClose();
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {vendor ? "Edit Vendor" : "Add New Vendor"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vendor Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">
                Vendor Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter vendor name"
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-200"
                required
              />
            </div>

            {/* Mobile Number */}
            <div className="space-y-2">
              <Label htmlFor="mobile" className="text-gray-700 font-medium">
                Mobile Number *
              </Label>
              <Input
                id="mobile"
                value={formData.mobile}
                onChange={(e) => handleInputChange("mobile", e.target.value)}
                placeholder="Enter mobile number"
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-200"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email (Optional)
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter email address"
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-200"
              />
            </div>

            {/* GST Number */}
            <div className="space-y-2">
              <Label htmlFor="gstNo" className="text-gray-700 font-medium">
                GST No (Optional)
              </Label>
              <Input
                id="gstNo"
                value={formData.gstNo}
                onChange={(e) => handleInputChange("gstNo", e.target.value)}
                placeholder="Enter GST number"
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-200"
              />
            </div>

            {/* Opening Balance */}
            <div className="space-y-2">
              <Label htmlFor="openingBalance" className="text-gray-700 font-medium">
                Opening Balance
              </Label>
              <Input
                id="openingBalance"
                type="number"
                value={formData.openingBalance}
                onChange={(e) => handleInputChange("openingBalance", e.target.value)}
                placeholder="Enter opening balance"
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-200"
              />
            </div>

            {/* Payment Terms */}
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Payment Terms</Label>
              <Select
                value={formData.paymentTerms}
                onValueChange={(value) => handleInputChange("paymentTerms", value)}
              >
                <SelectTrigger className="border-gray-300 focus:border-orange-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="net7">Net 7 days</SelectItem>
                  <SelectItem value="net15">Net 15 days</SelectItem>
                  <SelectItem value="net30">Net 30 days</SelectItem>
                  <SelectItem value="net45">Net 45 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-gray-700 font-medium">
              Address
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Enter complete address"
              className="border-gray-300 focus:border-orange-500 focus:ring-orange-200 min-h-[100px]"
            />
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-gray-700 font-medium">Vendor Status</Label>
              <p className="text-sm text-gray-600">
                Enable to mark vendor as active
              </p>
            </div>
            <Switch
              checked={formData.status}
              onCheckedChange={(checked) => handleInputChange("status", checked)}
              className="data-[state=checked]:bg-orange-600"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {vendor ? "Update Vendor" : "Save Vendor"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}