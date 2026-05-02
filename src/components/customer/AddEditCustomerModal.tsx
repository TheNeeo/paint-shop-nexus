import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Customer } from '@/pages/CustomerInformation';
import addNewCustomerIcon from '@/assets/add-new-customer-icon.png';
import { User, Phone, Mail, FileText, MapPin, Tag, IndianRupee, ToggleRight, UserCircle } from 'lucide-react';
import { FormSectionHeader } from '@/components/shared/FormSectionHeader';
import { FormFieldLabel } from '@/components/shared/FormFieldLabel';

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
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto border-2"
        style={{ 
          background: 'linear-gradient(135deg, #E8F5EE 0%, #D1F2E0 100%)',
          borderColor: '#35CA7B40'
        }}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center animate-bounce">
              <img 
                src={addNewCustomerIcon} 
                alt="Customer" 
                className="w-10 h-10 object-contain" 
              />
            </div>
            <DialogTitle className="text-xl" style={{ color: '#1D7A4A' }}>
              {customer ? 'Edit Customer' : 'Add New Customer'}
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" style={{ color: '#1D7A4A' }}>Customer Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`mt-1 bg-white border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 ${
                  errors.name ? 'border-red-400' : ''
                }`}
                placeholder="Enter customer name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Mobile Number */}
            <div>
              <Label htmlFor="mobile" style={{ color: '#1D7A4A' }}>Mobile Number *</Label>
              <Input
                id="mobile"
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                className={`mt-1 bg-white border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 ${
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
              <Label htmlFor="email" style={{ color: '#1D7A4A' }}>Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`mt-1 bg-white border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 ${
                  errors.email ? 'border-red-400' : ''
                }`}
                placeholder="customer@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="gstNo" style={{ color: '#1D7A4A' }}>GST Number (Optional)</Label>
              <Input
                id="gstNo"
                value={formData.gstNo}
                onChange={(e) => handleInputChange('gstNo', e.target.value)}
                className="mt-1 bg-white border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                placeholder="07AABCU9603R1ZX"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address" style={{ color: '#1D7A4A' }}>Address *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className={`mt-1 bg-white border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 ${
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
              <Label style={{ color: '#1D7A4A' }}>Customer Type</Label>
              <Select 
                value={formData.customerType} 
                onValueChange={(value: 'retail' | 'wholesale') => handleInputChange('customerType', value)}
              >
                <SelectTrigger className="mt-1 bg-white border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="wholesale">Wholesale</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="outstandingBalance" style={{ color: '#1D7A4A' }}>Opening Balance</Label>
              <Input
                id="outstandingBalance"
                type="number"
                value={formData.outstandingBalance}
                onChange={(e) => handleInputChange('outstandingBalance', Number(e.target.value))}
                className="mt-1 bg-white border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center space-x-3">
            <Label htmlFor="status" style={{ color: '#1D7A4A' }}>Active Status</Label>
            <Switch
              id="status"
              checked={formData.status === 'active'}
              onCheckedChange={(checked) => handleInputChange('status', checked ? 'active' : 'inactive')}
              className="data-[state=checked]:bg-emerald-500"
            />
            <span className={`text-sm font-medium ${
              formData.status === 'active' ? '' : 'text-gray-500'
            }`} style={formData.status === 'active' ? { color: '#35CA7B' } : {}}>
              {formData.status === 'active' ? 'Active' : 'Inactive'}
            </span>
          </div>

          {/* Action Buttons */}
          <div 
            className="flex justify-end gap-3 pt-4 border-t"
            style={{ borderColor: '#35CA7B40' }}
          >
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-emerald-300 hover:bg-emerald-50"
              style={{ color: '#1D7A4A' }}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              style={{ backgroundColor: '#35CA7B' }}
            >
              {customer ? 'Update Customer' : 'Save Customer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};