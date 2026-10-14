import React, { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { z } from "zod";
import { validateInput, vendorCustomerSchemas } from "@/lib/validation";
import addNewVendorIcon from "@/assets/add-new-vendor-icon.png";
import { Building2, Phone, Mail, FileText, MapPin, User, ToggleRight, UserCircle, Settings } from "lucide-react";
import { FormSectionHeader } from "@/components/shared/FormSectionHeader";
import { FormFieldLabel } from "@/components/shared/FormFieldLabel";
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
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    gst_number: "",
    address: "",
    contact_person: "",
    status: true,
  });

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name || "",
        phone: vendor.phone || "",
        email: vendor.email || "",
        gst_number: vendor.gst_number || "",
        address: vendor.address || "",
        contact_person: vendor.contact_person || "",
        status: vendor.status === "Active",
      });
    } else {
      setFormData({
        name: "",
        phone: "",
        email: "",
        gst_number: "",
        address: "",
        contact_person: "",
        status: true,
      });
    }
  }, [vendor, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to create vendors");
      return;
    }

    setLoading(true);
    try {
      // Client-side validation before reaching the database
      const validation = validateInput(
        z.object({
          name: vendorCustomerSchemas.name,
          contact_person: vendorCustomerSchemas.contactPerson,
          email: vendorCustomerSchemas.email,
          phone: vendorCustomerSchemas.phone,
          address: vendorCustomerSchemas.address,
          gst_number: vendorCustomerSchemas.gstNumber,
        }),
        {
          name: formData.name,
          contact_person: formData.contact_person,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          gst_number: formData.gst_number,
        }
      );

      if (!validation.success) {
        toast.error(validation.error || "Please check the form fields");
        setLoading(false);
        return;
      }

      const vendorData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        gst_number: formData.gst_number,
        address: formData.address,
        contact_person: formData.contact_person,
        status: formData.status ? 'active' : 'inactive',
        created_by_user_id: user.id,
      };

      if (vendor) {
        const { error } = await supabase
          .from("vendors")
          .update(vendorData)
          .eq("id", vendor.id);
        
        if (error) throw error;
        toast.success("Vendor updated successfully");
      } else {
        const { error } = await supabase
          .from("vendors")
          .insert([vendorData]);
        
        if (error) throw error;
        toast.success("Vendor created successfully");
      }
      
      onClose();
      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        gst_number: "",
        address: "",
        contact_person: "",
        status: true,
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to save vendor");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-purple-50 via-cyan-50 to-teal-50 border-purple-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 via-cyan-500 to-teal-500 p-0.5 shadow-lg">
                <div className="w-full h-full rounded-xl bg-white/90 flex items-center justify-center overflow-hidden">
                  <img src={addNewVendorIcon} alt="Add Vendor" className="w-8 h-8 object-contain" />
                </div>
              </div>
            </motion.div>
            <span className="text-xl font-semibold bg-gradient-to-r from-purple-700 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
              {vendor ? "Edit Vendor" : "Add New Vendor"}
            </span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Basic Details */}
          <div>
            <FormSectionHeader icon={UserCircle} title="Basic Details" color="purple" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <FormFieldLabel icon={Building2} label="Vendor Name" htmlFor="name" required color="purple" />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter vendor name"
                  className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-100 bg-white/80"
                  required
                />
              </div>

              <div className="space-y-1">
                <FormFieldLabel icon={Phone} label="Phone Number" htmlFor="phone" required color="purple" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                  className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-100 bg-white/80"
                  required
                />
              </div>

              <div className="space-y-1">
                <FormFieldLabel icon={Mail} label="Email (Optional)" htmlFor="email" color="purple" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                  className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-100 bg-white/80"
                />
              </div>

              <div className="space-y-1">
                <FormFieldLabel icon={FileText} label="GST No (Optional)" htmlFor="gst_number" color="purple" />
                <Input
                  id="gst_number"
                  value={formData.gst_number}
                  onChange={(e) => handleInputChange("gst_number", e.target.value)}
                  placeholder="Enter GST number"
                  className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-100 bg-white/80"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <FormFieldLabel icon={User} label="Contact Person (Optional)" htmlFor="contact_person" color="purple" />
                <Input
                  id="contact_person"
                  value={formData.contact_person}
                  onChange={(e) => handleInputChange("contact_person", e.target.value)}
                  placeholder="Enter contact person name"
                  className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-100 bg-white/80"
                />
              </div>
            </div>
          </div>

          {/* Section: Address */}
          <div>
            <FormSectionHeader icon={MapPin} title="Address Details" color="cyan" />
            <div className="space-y-1">
              <FormFieldLabel icon={MapPin} label="Address" htmlFor="address" color="cyan" />
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter complete address"
                className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-100 bg-white/80 min-h-[100px]"
              />
            </div>
          </div>

          {/* Section: Settings */}
          <div>
            <FormSectionHeader icon={Settings} title="Vendor Settings" color="teal" />
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-100/50 to-cyan-100/50 rounded-lg border border-purple-200">
              <div>
                <FormFieldLabel icon={ToggleRight} label="Vendor Status" color="teal" className="mb-0" />
                <p className="text-sm text-purple-600/80 mt-1">
                  Enable to mark vendor as active
                </p>
              </div>
              <Switch
                checked={formData.status}
                onCheckedChange={(checked) => handleInputChange("status", checked)}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-cyan-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 via-cyan-600 to-teal-600 hover:from-purple-700 hover:via-cyan-700 hover:to-teal-700 text-white disabled:opacity-50"
            >
              {loading 
                ? (vendor ? "Updating..." : "Saving...") 
                : (vendor ? "Update Vendor" : "Save Vendor")
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}