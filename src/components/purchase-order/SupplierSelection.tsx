
import React from 'react';
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

interface SupplierSelectionProps {
  selectedSupplier: SupplierData | null;
  setSelectedSupplier: (supplier: SupplierData | null) => void;
}

// Mock suppliers data
const mockSuppliers: SupplierData[] = [
  {
    id: '1',
    name: 'Asian Paints Ltd',
    contactPerson: 'Rajesh Kumar',
    email: 'rajesh@asianpaints.com',
    phone: '+91 9876543210',
    address: '123 Industrial Area, Mumbai, Maharashtra 400001'
  },
  {
    id: '2',
    name: 'Tools India',
    contactPerson: 'Suresh Gupta',
    email: 'suresh@toolsindia.com',
    phone: '+91 9876543211',
    address: '456 Hardware Street, Delhi, Delhi 110001'
  }
];

export function SupplierSelection({ selectedSupplier, setSelectedSupplier }: SupplierSelectionProps) {
  const handleSupplierChange = (supplierId: string) => {
    const supplier = mockSuppliers.find(s => s.id === supplierId);
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
              <SelectValue placeholder="Choose a supplier" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {mockSuppliers.map((supplier) => (
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
