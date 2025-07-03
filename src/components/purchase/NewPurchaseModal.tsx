
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Plus, Trash2, Upload, X, FileImage } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Vendor } from '@/types/purchase';

interface PurchaseItem {
  product_name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  tax_rate: number;
  discount_rate: number;
  total_amount: number;
}

interface NewPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchaseCreated: () => void;
}

export const NewPurchaseModal: React.FC<NewPurchaseModalProps> = ({
  isOpen,
  onClose,
  onPurchaseCreated
}) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState('');
  const [billNumber, setBillNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<PurchaseItem[]>([
    { product_name: '', quantity: 1, unit: 'PCS', unit_price: 0, tax_rate: 18, discount_rate: 0, total_amount: 0 }
  ]);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [billImage, setBillImage] = useState<File | null>(null);
  const [billImagePreview, setBillImagePreview] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      fetchVendors();
      generateBillNumber();
    }
  }, [isOpen]);

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setVendors(data || []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  const generateBillNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    setBillNumber(`BILL-${year}${month}-${random}`);
  };

  const addItem = () => {
    setItems([...items, { 
      product_name: '', 
      quantity: 1, 
      unit: 'PCS',
      unit_price: 0, 
      tax_rate: 18, 
      discount_rate: 0, 
      total_amount: 0 
    }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof PurchaseItem, value: string | number) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Calculate total amount for the item
    const item = updatedItems[index];
    const subtotal = item.quantity * item.unit_price;
    const discountAmount = (subtotal * item.discount_rate) / 100;
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = (afterDiscount * item.tax_rate) / 100;
    item.total_amount = afterDiscount + taxAmount;
    
    setItems(updatedItems);
  };

  const handleBillImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBillImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setBillImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBillImage = () => {
    setBillImage(null);
    setBillImagePreview('');
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unit_price;
      const discountAmount = (itemSubtotal * item.discount_rate) / 100;
      return sum + (itemSubtotal - discountAmount);
    }, 0);

    const taxAmount = items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unit_price;
      const discountAmount = (itemSubtotal * item.discount_rate) / 100;
      const afterDiscount = itemSubtotal - discountAmount;
      return sum + ((afterDiscount * item.tax_rate) / 100);
    }, 0);

    const totalBeforeDiscount = subtotal + taxAmount;
    const total = totalBeforeDiscount - discountAmount;
    const balance = total - paidAmount;

    return { subtotal, taxAmount, total, balance };
  };

  const handleSubmit = async () => {
    if (!selectedVendor || !billNumber || items.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const totals = calculateTotals();
      
      // Create purchase record
      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          invoice_number: billNumber,
          vendor_id: selectedVendor,
          purchase_date: purchaseDate,
          subtotal: totals.subtotal,
          tax_amount: totals.taxAmount,
          discount_amount: discountAmount,
          total_amount: totals.total,
          paid_amount: paidAmount,
          balance_amount: totals.balance,
          payment_method: paymentMethod,
          notes: notes,
          status: 'pending'
        })
        .select()
        .single();

      if (purchaseError) throw purchaseError;

      // Create purchase items
      const purchaseItems = items.map(item => ({
        purchase_id: purchase.id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        tax_rate: item.tax_rate,
        discount_rate: item.discount_rate,
        total_amount: item.total_amount
      }));

      const { error: itemsError } = await supabase
        .from('purchase_items')
        .insert(purchaseItems);

      if (itemsError) throw itemsError;

      onPurchaseCreated();
      resetForm();
    } catch (error) {
      console.error('Error creating purchase:', error);
      alert('Error creating purchase. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedVendor('');
    setBillNumber('');
    setPurchaseDate(new Date().toISOString().split('T')[0]);
    setItems([{ product_name: '', quantity: 1, unit: 'PCS', unit_price: 0, tax_rate: 18, discount_rate: 0, total_amount: 0 }]);
    setDiscountAmount(0);
    setPaidAmount(0);
    setPaymentMethod('');
    setNotes('');
    setBillImage(null);
    setBillImagePreview('');
  };

  const totals = calculateTotals();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-pink-50 to-purple-50">
        <DialogHeader>
          <DialogTitle className="text-pink-800">Add Purchase Entry</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="vendor" className="text-pink-700">Vendor *</Label>
              <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                <SelectTrigger className="bg-pink-600 hover:bg-pink-700 text-white border-pink-600 focus:border-pink-500 focus:ring-pink-500">
                  <SelectValue placeholder="Select Vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map(vendor => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="billNumber" className="text-pink-700">Bill Number *</Label>
              <Input
                id="billNumber"
                value={billNumber}
                onChange={(e) => setBillNumber(e.target.value)}
                className="bg-pink-600 hover:bg-pink-700 text-white border-pink-600 focus:border-pink-500 focus:ring-pink-500 placeholder:text-pink-200"
              />
            </div>
            <div>
              <Label htmlFor="date" className="text-pink-700">Purchase Date</Label>
              <Input
                id="date"
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="border-pink-300 focus:border-pink-500 focus:ring-pink-500"
              />
            </div>
            <div>
              <Label htmlFor="method" className="text-pink-700">Payment Mode</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="bg-pink-600 hover:bg-pink-700 text-white border-pink-600 focus:border-pink-500 focus:ring-pink-500">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Items Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-pink-800">Purchase Items</h3>
              <Button onClick={addItem} size="sm" className="bg-pink-600 hover:bg-pink-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-pink-100 to-purple-100">
                  <TableHead className="text-pink-800">Product Name</TableHead>
                  <TableHead className="text-pink-800">Unit</TableHead>
                  <TableHead className="text-pink-800">Qty</TableHead>
                  <TableHead className="text-pink-800">Rate</TableHead>
                  <TableHead className="text-pink-800">GST %</TableHead>
                  <TableHead className="text-pink-800">Disc %</TableHead>
                  <TableHead className="text-pink-800">Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={item.product_name}
                        onChange={(e) => updateItem(index, 'product_name', e.target.value)}
                        placeholder="Product name"
                        className="bg-pink-600 hover:bg-pink-700 text-white border-pink-600 focus:border-pink-500 focus:ring-pink-500 placeholder:text-pink-200"
                      />
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={item.unit} 
                        onValueChange={(value) => updateItem(index, 'unit', value)}
                      >
                        <SelectTrigger className="w-20 bg-pink-600 hover:bg-pink-700 text-white border-pink-600 focus:border-pink-500 focus:ring-pink-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PCS">PCS</SelectItem>
                          <SelectItem value="KG">KG</SelectItem>
                          <SelectItem value="LTR">LTR</SelectItem>
                          <SelectItem value="MTR">MTR</SelectItem>
                          <SelectItem value="BOX">BOX</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-20 bg-pink-600 hover:bg-pink-700 text-white border-pink-600 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.unit_price}
                        onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                        className="w-24 bg-pink-600 hover:bg-pink-700 text-white border-pink-600 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.tax_rate}
                        onChange={(e) => updateItem(index, 'tax_rate', parseFloat(e.target.value) || 0)}
                        className="w-20 bg-pink-600 hover:bg-pink-700 text-white border-pink-600 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.discount_rate}
                        onChange={(e) => updateItem(index, 'discount_rate', parseFloat(e.target.value) || 0)}
                        className="w-20 bg-pink-600 hover:bg-pink-700 text-white border-pink-600 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </TableCell>
                    <TableCell className="text-pink-700 font-medium">₹{item.total_amount.toFixed(2)}</TableCell>
                    <TableCell>
                      {items.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:bg-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Bottom Section with Bill Upload and Totals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bill Upload */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-pink-800">Attach Bill Image (Optional)</h3>
              {!billImagePreview ? (
                <div className="border-2 border-dashed border-pink-300 rounded-lg p-6 text-center bg-pink-50">
                  <Upload className="mx-auto h-12 w-12 text-pink-400" />
                  <p className="mt-2 text-sm text-pink-600">
                    Drag and drop your bill image here, or click to browse
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBillImageUpload}
                    className="hidden"
                    id="bill-upload"
                  />
                  <Button variant="outline" className="mt-2 bg-pink-600 hover:bg-pink-700 text-white border-pink-600" onClick={() => document.getElementById('bill-upload')?.click()}>
                    Choose File
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <img 
                    src={billImagePreview} 
                    alt="Bill preview" 
                    className="w-full h-48 object-cover rounded-lg border border-pink-300"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white"
                    onClick={removeBillImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="mt-2 flex items-center gap-2">
                    <FileImage className="h-4 w-4 text-pink-600" />
                    <span className="text-sm text-pink-600">{billImage?.name}</span>
                  </div>
                </div>
              )}

              <div className="mt-4">
                <Label htmlFor="notes" className="text-pink-700">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes..."
                  className="bg-pink-600 hover:bg-pink-700 text-white border-pink-600 focus:border-pink-500 focus:ring-pink-500 placeholder:text-pink-200"
                />
              </div>
            </div>

            {/* Purchase Summary */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-pink-800">Purchase Summary</h3>
              <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-4 rounded-lg space-y-3 border border-pink-300">
                <div className="flex justify-between">
                  <span className="text-pink-700">Subtotal:</span>
                  <span className="text-pink-700">₹{totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-pink-700">Tax Amount:</span>
                  <span className="text-pink-700">₹{totals.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="discount" className="text-pink-700">Discount Amount:</Label>
                  <Input
                    id="discount"
                    type="number"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                    className="w-24 text-right bg-pink-600 hover:bg-pink-700 text-white border-pink-600 focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2 text-pink-800">
                  <span>Total Amount:</span>
                  <span>₹{totals.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-green-600">
                  <Label htmlFor="paid" className="text-pink-700">Paid Amount:</Label>
                  <Input
                    id="paid"
                    type="number"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                    className="w-24 text-right bg-pink-600 hover:bg-pink-700 text-white border-pink-600 focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Balance Due:</span>
                  <span>₹{totals.balance.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t border-pink-300">
            <Button variant="outline" onClick={onClose} className="bg-pink-600 hover:bg-pink-700 text-white border-pink-600">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading} className="bg-pink-600 hover:bg-pink-700 text-white">
              {loading ? 'Saving...' : 'Save Purchase'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
