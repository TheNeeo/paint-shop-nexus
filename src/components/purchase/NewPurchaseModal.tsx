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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Plus, Trash2, Upload, X, FileImage } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Vendor } from '@/types/purchase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import purchaseInvoiceIcon from '@/assets/purchase-invoice-icon.png';

// Blue theme colors
const THEME_PRIMARY = '#1e40af';
const THEME_SECONDARY = '#3b82f6';
const THEME_BG = '#f0f9ff';
const THEME_BORDER = '#93c5fd';
const INPUT_BG = '#ffffff';
const INPUT_BORDER = '#93c5fd';

// Validation schema
const purchaseSchema = z.object({
  vendorId: z.string().min(1, { message: 'Please select a vendor' }),
  billNumber: z.string().min(1, { message: 'Bill number is required' }),
  purchaseDate: z.string().min(1, { message: 'Purchase date is required' }),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
});

type PurchaseFormData = z.infer<typeof purchaseSchema>;

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
  const [items, setItems] = useState<PurchaseItem[]>([
    { product_name: '', quantity: 1, unit: 'PCS', unit_price: 0, tax_rate: 18, discount_rate: 0, total_amount: 0 }
  ]);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [billImage, setBillImage] = useState<File | null>(null);
  const [billImagePreview, setBillImagePreview] = useState<string>('');
  const [itemsError, setItemsError] = useState<string>('');

  const form = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      vendorId: '',
      billNumber: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      paymentMethod: '',
      notes: '',
    },
  });

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
    form.setValue('billNumber', `BILL-${year}${month}-${random}`);
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
    const discountAmt = (subtotal * item.discount_rate) / 100;
    const afterDiscount = subtotal - discountAmt;
    const taxAmount = (afterDiscount * item.tax_rate) / 100;
    item.total_amount = afterDiscount + taxAmount;
    
    setItems(updatedItems);
    setItemsError('');
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
      const discountAmt = (itemSubtotal * item.discount_rate) / 100;
      return sum + (itemSubtotal - discountAmt);
    }, 0);

    const taxAmount = items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unit_price;
      const discountAmt = (itemSubtotal * item.discount_rate) / 100;
      const afterDiscount = itemSubtotal - discountAmt;
      return sum + ((afterDiscount * item.tax_rate) / 100);
    }, 0);

    const totalBeforeDiscount = subtotal + taxAmount;
    const total = totalBeforeDiscount - discountAmount;
    const balance = total - paidAmount;

    return { subtotal, taxAmount, total, balance };
  };

  const validateItems = () => {
    const hasValidItems = items.some(item => 
      item.product_name.trim() !== '' && item.quantity > 0 && item.unit_price > 0
    );
    if (!hasValidItems) {
      setItemsError('At least one item with product name, quantity, and price is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (data: PurchaseFormData) => {
    if (!validateItems()) return;

    setLoading(true);
    try {
      const totals = calculateTotals();
      
      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      // Create purchase record
      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .insert([{
          invoice_number: data.billNumber,
          vendor_id: data.vendorId,
          purchase_date: data.purchaseDate,
          subtotal: totals.subtotal,
          tax_amount: totals.taxAmount,
          discount_amount: discountAmount,
          total_amount: totals.total,
          paid_amount: paidAmount,
          balance_amount: totals.balance,
          payment_method: data.paymentMethod || null,
          notes: data.notes || null,
          status: 'pending',
          created_by_user_id: currentUser.id
        }])
        .select()
        .single();

      if (purchaseError) throw purchaseError;

      // Create purchase items with created_by_user_id
      const purchaseItems = items.filter(item => item.product_name.trim() !== '').map(item => ({
        purchase_id: purchase!.id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        tax_rate: item.tax_rate,
        discount_rate: item.discount_rate,
        total_amount: item.total_amount,
        created_by_user_id: currentUser.id
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
    form.reset();
    setItems([{ product_name: '', quantity: 1, unit: 'PCS', unit_price: 0, tax_rate: 18, discount_rate: 0, total_amount: 0 }]);
    setDiscountAmount(0);
    setPaidAmount(0);
    setBillImage(null);
    setBillImagePreview('');
    setItemsError('');
  };

  const totals = calculateTotals();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white"
        style={{
          borderColor: THEME_SECONDARY
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3" style={{ color: THEME_PRIMARY }}>
            <img src={purchaseInvoiceIcon} alt="Purchase" className="w-8 h-8" />
            Add Purchase Entry
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="vendorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: THEME_PRIMARY }}>Vendor *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger style={{ borderColor: INPUT_BORDER, backgroundColor: INPUT_BG }}>
                          <SelectValue placeholder="Select Vendor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vendors.map(vendor => (
                          <SelectItem key={vendor.id} value={vendor.id}>
                            {vendor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="billNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: THEME_PRIMARY }}>Bill Number *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        style={{ borderColor: INPUT_BORDER, backgroundColor: INPUT_BG }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: THEME_PRIMARY }}>Purchase Date *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        style={{ borderColor: THEME_SECONDARY, backgroundColor: THEME_BG }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: THEME_PRIMARY }}>Payment Mode</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger style={{ borderColor: INPUT_BORDER, backgroundColor: INPUT_BG }}>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Items Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold" style={{ color: THEME_PRIMARY }}>Purchase Items</h3>
                <Button 
                  type="button"
                  onClick={addItem} 
                  size="sm" 
                  style={{ backgroundColor: THEME_SECONDARY }}
                  className="text-white hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {itemsError && (
                <p className="text-sm text-red-500 mb-2">{itemsError}</p>
              )}

              <Table>
                <TableHeader>
                  <TableRow style={{ backgroundColor: THEME_BG, borderBottom: `2px solid ${INPUT_BORDER}` }}>
                    <TableHead style={{ color: THEME_PRIMARY, fontWeight: 'bold' }}>Product Name</TableHead>
                    <TableHead style={{ color: THEME_PRIMARY, fontWeight: 'bold' }}>Unit</TableHead>
                    <TableHead style={{ color: THEME_PRIMARY, fontWeight: 'bold' }}>Qty</TableHead>
                    <TableHead style={{ color: THEME_PRIMARY, fontWeight: 'bold' }}>Rate</TableHead>
                    <TableHead style={{ color: THEME_PRIMARY, fontWeight: 'bold' }}>GST %</TableHead>
                    <TableHead style={{ color: THEME_PRIMARY, fontWeight: 'bold' }}>Disc %</TableHead>
                    <TableHead style={{ color: THEME_PRIMARY, fontWeight: 'bold' }}>Total</TableHead>
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
                          style={{ borderColor: INPUT_BORDER, backgroundColor: INPUT_BG }}
                        />
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={item.unit} 
                          onValueChange={(value) => updateItem(index, 'unit', value)}
                        >
                          <SelectTrigger className="w-20" style={{ borderColor: INPUT_BORDER, backgroundColor: INPUT_BG }}>
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
                          className="w-20"
                          style={{ borderColor: INPUT_BORDER, backgroundColor: INPUT_BG }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.unit_price}
                          onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                          className="w-24"
                          style={{ borderColor: INPUT_BORDER, backgroundColor: INPUT_BG }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.tax_rate}
                          onChange={(e) => updateItem(index, 'tax_rate', parseFloat(e.target.value) || 0)}
                          className="w-20"
                          style={{ borderColor: INPUT_BORDER, backgroundColor: INPUT_BG }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.discount_rate}
                          onChange={(e) => updateItem(index, 'discount_rate', parseFloat(e.target.value) || 0)}
                          className="w-20"
                          style={{ borderColor: INPUT_BORDER, backgroundColor: INPUT_BG }}
                        />
                      </TableCell>
                      <TableCell className="font-medium" style={{ color: THEME_PRIMARY }}>₹{item.total_amount.toFixed(2)}</TableCell>
                      <TableCell>
                        {items.length > 1 && (
                          <Button
                            type="button"
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
                <h3 className="text-lg font-semibold mb-4" style={{ color: THEME_PRIMARY }}>Attach Bill Image (Optional)</h3>
                {!billImagePreview ? (
                  <div
                    className="border-2 border-dashed rounded-lg p-6 text-center"
                    style={{ borderColor: INPUT_BORDER, backgroundColor: THEME_BG }}
                  >
                    <Upload className="mx-auto h-12 w-12" style={{ color: THEME_SECONDARY }} />
                    <p className="mt-2 text-sm font-medium" style={{ color: THEME_PRIMARY }}>
                      Drag and drop your bill image here, or click to browse
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBillImageUpload}
                      className="hidden"
                      id="bill-upload"
                    />
                    <Button
                      type="button"
                      className="mt-2 text-white hover:opacity-90"
                      style={{ backgroundColor: THEME_SECONDARY, borderColor: THEME_SECONDARY }}
                      onClick={() => document.getElementById('bill-upload')?.click()}
                    >
                      Choose File
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={billImagePreview}
                      alt="Bill preview"
                      className="w-full h-48 object-cover rounded-lg border"
                      style={{ borderColor: INPUT_BORDER }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white"
                      onClick={removeBillImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="mt-2 flex items-center gap-2">
                      <FileImage className="h-4 w-4" style={{ color: THEME_SECONDARY }} />
                      <span className="text-sm font-medium" style={{ color: THEME_PRIMARY }}>{billImage?.name}</span>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={{ color: THEME_PRIMARY }}>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Additional notes..."
                            style={{ borderColor: INPUT_BORDER, backgroundColor: INPUT_BG }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Purchase Summary */}
              <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: THEME_PRIMARY }}>Purchase Summary</h3>
                <div
                  className="p-4 rounded-lg space-y-3 border"
                  style={{
                    background: THEME_BG,
                    borderColor: INPUT_BORDER
                  }}
                >
                  <div className="flex justify-between">
                    <span style={{ color: THEME_PRIMARY }}>Subtotal:</span>
                    <span style={{ color: THEME_PRIMARY }}>₹{totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: THEME_PRIMARY }}>Tax Amount:</span>
                    <span style={{ color: THEME_PRIMARY }}>₹{totals.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <Label style={{ color: THEME_PRIMARY }}>Discount Amount:</Label>
                    <Input
                      type="number"
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                      className="w-24 text-right"
                      style={{ borderColor: INPUT_BORDER, backgroundColor: INPUT_BG }}
                    />
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2" style={{ color: THEME_PRIMARY, borderColor: INPUT_BORDER }}>
                    <span>Total Amount:</span>
                    <span>₹{totals.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-green-600">
                    <Label style={{ color: THEME_PRIMARY }}>Paid Amount:</Label>
                    <Input
                      type="number"
                      value={paidAmount}
                      onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                      className="w-24 text-right"
                      style={{ borderColor: INPUT_BORDER, backgroundColor: INPUT_BG }}
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
            <div className="flex justify-end gap-4 pt-4 border-t" style={{ borderColor: INPUT_BORDER }}>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                style={{ borderColor: INPUT_BORDER, color: THEME_PRIMARY }}
                className="hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={loading} 
                className="text-white"
                style={{ backgroundColor: THEME_PRIMARY }}
              >
                {loading ? 'Saving...' : 'Save Purchase'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
