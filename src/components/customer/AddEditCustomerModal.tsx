import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Customer } from '@/pages/CustomerInformation';

interface AddEditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onSave: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
}

export const AddEditCustomerModal: React.FC<AddEditCustomerModalProps> = ({
  isOpen,
  onClose,
  customer,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    gstNo: '',
    address: '',
    customerType: 'retail' as 'retail' | 'wholesale',
    totalSales: 0,
    outstandingBalance: 0,
    status: 'active' as 'active' | 'inactive'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        mobile: customer.mobile,
        email: customer.email || '',
        gstNo: customer.gstNo || '',
        address: customer.address,
        customerType: customer.customerType,
        totalSales: customer.totalSales,
        outstandingBalance: customer.outstandingBalance,
        status: customer.status
      });
    } else {
      // Reset form for new customer
      setFormData({
        name: '',
        mobile: '',
        email: '',
        gstNo: '',
        address: '',
        customerType: 'retail',
        totalSales: 0,
        outstandingBalance: 0,
        status: 'active'
      });
    }
    setErrors({});
  }, [customer, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Customer name is required';
    }
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.mobile.replace(/\s/g, ''))) {
      newErrors.mobile = 'Please enter a valid mobile number';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200">
        <DialogHeader>
          <DialogTitle className="text-blue-900 text-xl">
            {customer ? 'Edit Customer' : 'Add New Customer'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-blue-800">Customer Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`mt-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${
                  errors.name ? 'border-red-400' : ''
                }`}
                placeholder="Enter customer name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Mobile Number */}
            <div>
              <Label htmlFor="mobile" className="text-blue-800">Mobile Number *</Label>
              <Input
                id="mobile"
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                className={`mt-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${
                  errors.mobile ? 'border-red-400' : ''
                }`}
                placeholder="+91 98765 43210"
              />
              {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
            </div>
          </div>

          {/* Email and GST */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="text-blue-800">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`mt-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${
                  errors.email ? 'border-red-400' : ''
                }`}
                placeholder="customer@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="gstNo" className="text-blue-800">GST Number (Optional)</Label>
              <Input
                id="gstNo"
                value={formData.gstNo}
                onChange={(e) => handleInputChange('gstNo', e.target.value)}
                className="mt-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                placeholder="07AABCU9603R1ZX"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address" className="text-blue-800">Address *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className={`mt-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${
                errors.address ? 'border-red-400' : ''
              }`}
              placeholder="Enter complete address"
              rows={3}
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          {/* Customer Type and Opening Balance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-blue-800">Customer Type</Label>
              <Select 
                value={formData.customerType} 
                onValueChange={(value: 'retail' | 'wholesale') => handleInputChange('customerType', value)}
              >
                <SelectTrigger className="mt-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="wholesale">Wholesale</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="outstandingBalance" className="text-blue-800">Opening Balance</Label>
              <Input
                id="outstandingBalance"
                type="number"
                value={formData.outstandingBalance}
                onChange={(e) => handleInputChange('outstandingBalance', Number(e.target.value))}
                className="mt-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center space-x-3">
            <Label htmlFor="status" className="text-blue-800">Active Status</Label>
            <Switch
              id="status"
              checked={formData.status === 'active'}
              onCheckedChange={(checked) => handleInputChange('status', checked ? 'active' : 'inactive')}
            />
            <span className={`text-sm font-medium ${
              formData.status === 'active' ? 'text-green-600' : 'text-gray-500'
            }`}>
              {formData.status === 'active' ? 'Active' : 'Inactive'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-blue-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {customer ? 'Update Customer' : 'Save Customer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};