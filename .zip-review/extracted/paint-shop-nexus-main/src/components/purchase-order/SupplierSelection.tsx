
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, User, Mail, Phone, MapPin } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SupplierData } from '@/pages/GeneratePurchaseOrder';
import { supabase } from '@/integrations/supabase/client';

interface SupplierSelectionProps {
  selectedSupplier: SupplierData | null;
  setSelectedSupplier: (supplier: SupplierData | null) => void;
}

export function SupplierSelection({ selectedSupplier, setSelectedSupplier }: SupplierSelectionProps) {
  const [suppliers, setSuppliers] = useState<SupplierData[]>([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('id, name, contact_person, email, phone, address')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching suppliers:', error);
        return;
      }

      const mapped: SupplierData[] = (data || []).map((v) => ({
        id: v.id,
        name: v.name,
        contactPerson: v.contact_person || '',
        email: v.email || '',
        phone: v.phone || '',
        address: v.address || '',
      }));

      setSuppliers(mapped);
    };

    fetchSuppliers();
  }, []);

  const handleSupplierChange = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    setSelectedSupplier(supplier || null);
  };

  return (
    <Card className="border-pink-200">
      <CardHeader>
        <CardTitle className="text-pink-800 flex items-center justify-between">
          Supplier Details
          <Button 
            variant="outline" 
            size="sm"
            className="border-pink-300 text-pink-700 hover:bg-pink-100"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Supplier
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-pink-700 mb-2 block">Select Supplier</label>
          <Select onValueChange={handleSupplierChange}>
            <SelectTrigger className="border-pink-300 focus:border-pink-500 focus:ring-pink-500 bg-white">
              <SelectValue placeholder={suppliers.length ? "Choose a supplier" : "No suppliers found"} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {suppliers.map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedSupplier && (
          <div className="bg-pink-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-pink-600" />
              <span className="text-sm font-medium text-pink-700">Contact Person:</span>
              <span className="text-sm text-gray-600">{selectedSupplier.contactPerson}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-pink-600" />
              <span className="text-sm font-medium text-pink-700">Email:</span>
              <span className="text-sm text-gray-600">{selectedSupplier.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-pink-600" />
              <span className="text-sm font-medium text-pink-700">Phone:</span>
              <span className="text-sm text-gray-600">{selectedSupplier.phone}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-pink-600 mt-0.5" />
              <span className="text-sm font-medium text-pink-700">Address:</span>
              <span className="text-sm text-gray-600">{selectedSupplier.address}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
