
import React, { useState, useEffect, useMemo } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Upload, X, FileImage, Package, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Vendor } from '@/types/purchase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import purchaseInvoiceIcon from '@/assets/purchase-invoice-icon.png';

// Blue theme colors
const THEME_PRIMARY = '#1e40af';
const THEME_SECONDARY = '#3b82f6';
const THEME_BG = '#f0f4ff';
const THEME_BORDER = '#bfdbfe';

// Validation schema
const purchaseSchema = z.object({
  vendorId: z.string().min(1, { message: 'Please select a vendor' }),
  billNumber: z.string().min(1, { message: 'Bill number is required' }),
  purchaseDate: z.string().min(1, { message: 'Purchase date is required' }),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
});

type PurchaseFormData = z.infer<typeof purchaseSchema>;

interface ProductData {
  id: string;
  name: string;
  category_id: string | null;
  category_name?: string;
  unit: string | null;
  purchase_price: number | null;
  hsn_code: string | null;
  is_variant: boolean | null;
  parent_product_id: string | null;
  manufacture_date: string | null;
  expiry_date: string | null;
  current_stock: number | null;
}

interface PurchaseItem {
  product_id: string;
  product_name: string;
  variant_id: string;
  variant_name: string;
  category: string;
  unit: string;
  batch_no: string;
  mfg_date: string;
  exp_date: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  discount_rate: number;
  total_amount: number;
  has_expiry: boolean;
}

interface NewPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchaseCreated: () => void;
}

const emptyItem = (): PurchaseItem => ({
  product_id: '',
  product_name: '',
  variant_id: '',
  variant_name: '',
  category: '',
  unit: 'PCS',
  batch_no: '',
  mfg_date: '',
  exp_date: '',
  quantity: 1,
  unit_price: 0,
  tax_rate: 18,
  discount_rate: 0,
  total_amount: 0,
  has_expiry: false,
});

export const NewPurchaseModal: React.FC<NewPurchaseModalProps> = ({
  isOpen,
  onClose,
  onPurchaseCreated
}) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [allProducts, setAllProducts] = useState<ProductData[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [items, setItems] = useState<PurchaseItem[]>([emptyItem()]);
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

  // Separate parent products and variants
  const parentProducts = useMemo(() => 
    allProducts.filter(p => !p.is_variant), [allProducts]
  );

  const getVariantsForProduct = (parentId: string) => 
    allProducts.filter(p => p.is_variant && p.parent_product_id === parentId);

  useEffect(() => {
    if (isOpen) {
      fetchVendors();
      fetchProducts();
      fetchCategories();
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

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, category_id, unit, purchase_price, hsn_code, is_variant, parent_product_id, manufacture_date, expiry_date, current_stock')
        .order('name');
      if (error) throw error;
      setAllProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const generateBillNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    form.setValue('billNumber', `BILL-${year}${month}-${random}`);
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return '';
    const cat = categories.find(c => c.id === categoryId);
    return cat?.name || '';
  };

  const addItem = () => {
    setItems([...items, emptyItem()]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateItemTotal = (item: PurchaseItem) => {
    const subtotal = item.quantity * item.unit_price;
    const discountAmt = (subtotal * item.discount_rate) / 100;
    const afterDiscount = subtotal - discountAmt;
    const taxAmount = (afterDiscount * item.tax_rate) / 100;
    return afterDiscount + taxAmount;
  };

  const handleProductSelect = (index: number, productId: string) => {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    const updatedItems = [...items];
    const hasExpiry = !!(product.manufacture_date || product.expiry_date);
    
    updatedItems[index] = {
      ...updatedItems[index],
      product_id: productId,
      product_name: product.name,
      variant_id: '',
      variant_name: '',
      category: getCategoryName(product.category_id),
      unit: product.unit || 'PCS',
      unit_price: product.purchase_price || 0,
      tax_rate: 18,
      mfg_date: product.manufacture_date || '',
      exp_date: product.expiry_date || '',
      has_expiry: hasExpiry,
    };
    updatedItems[index].total_amount = calculateItemTotal(updatedItems[index]);
    setItems(updatedItems);
    setItemsError('');
  };

  const handleVariantSelect = (index: number, variantId: string) => {
    const variant = allProducts.find(p => p.id === variantId);
    if (!variant) return;

    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      variant_id: variantId,
      variant_name: variant.name,
      unit_price: variant.purchase_price || updatedItems[index].unit_price,
      mfg_date: variant.manufacture_date || updatedItems[index].mfg_date,
      exp_date: variant.expiry_date || updatedItems[index].exp_date,
      has_expiry: !!(variant.manufacture_date || variant.expiry_date) || updatedItems[index].has_expiry,
    };
    updatedItems[index].total_amount = calculateItemTotal(updatedItems[index]);
    setItems(updatedItems);
  };

  const updateItem = (index: number, field: keyof PurchaseItem, value: string | number | boolean) => {
    const updatedItems = [...items];
    (updatedItems[index] as any)[field] = value;
    updatedItems[index].total_amount = calculateItemTotal(updatedItems[index]);
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
      item.product_id !== '' && item.quantity > 0 && item.unit_price > 0
    );
    if (!hasValidItems) {
      setItemsError('At least one item with product, quantity, and rate is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (data: PurchaseFormData) => {
    if (!validateItems()) return;

    setLoading(true);
    try {
      const totals = calculateTotals();
      
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

      // Create purchase items
      const validItems = items.filter(item => item.product_id !== '');
      const purchaseItems = validItems.map(item => ({
        purchase_id: purchase!.id,
        product_name: item.variant_name || item.product_name,
        product_id: item.variant_id || item.product_id || null,
        quantity: item.quantity,
        unit_price: item.unit_price,
        tax_rate: item.tax_rate,
        discount_rate: item.discount_rate,
        total_amount: item.total_amount,
        created_by_user_id: currentUser.id
      }));

      const { error: itemsErr } = await supabase
        .from('purchase_items')
        .insert(purchaseItems);

      if (itemsErr) throw itemsErr;

      // Update stock for each item
      for (const item of validItems) {
        const targetProductId = item.variant_id || item.product_id;
        if (!targetProductId) continue;

        const product = allProducts.find(p => p.id === targetProductId);
        const currentStock = product?.current_stock || 0;
        const newStock = currentStock + item.quantity;

        await supabase
          .from('products')
          .update({ current_stock: newStock })
          .eq('id', targetProductId);

        // If variant, also update parent stock
        if (item.variant_id && item.product_id) {
          const parentProduct = allProducts.find(p => p.id === item.product_id);
          if (parentProduct) {
            const parentStock = (parentProduct.current_stock || 0) + item.quantity;
            await supabase
              .from('products')
              .update({ current_stock: parentStock })
              .eq('id', item.product_id);
          }
        }

        // Log stock adjustment
        await supabase
          .from('stock_adjustments')
          .insert({
            product_id: targetProductId,
            quantity: item.quantity,
            adjustment_type: 'purchase',
            reason: `Purchase: ${data.billNumber}`,
            reference_id: purchase!.id,
            created_by_user_id: currentUser.id
          });
      }

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
    setItems([emptyItem()]);
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
        className="max-w-7xl max-h-[95vh] overflow-y-auto z-[100]"
        style={{ 
          background: '#eef2ff',
          borderColor: THEME_SECONDARY 
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3" style={{ color: THEME_PRIMARY }}>
            <img src={purchaseInvoiceIcon} alt="Purchase" className="w-8 h-8 animate-bounce" />
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
                        <SelectTrigger style={{ borderColor: THEME_SECONDARY, backgroundColor: THEME_BG }}>
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
                        style={{ borderColor: THEME_SECONDARY, backgroundColor: THEME_BG }}
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
                        <SelectTrigger style={{ borderColor: THEME_SECONDARY, backgroundColor: THEME_BG }}>
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
                <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: THEME_PRIMARY }}>
                  <Package className="w-5 h-5" />
                  Purchase Items
                </h3>
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
                <div className="flex items-center gap-2 text-sm text-red-500 mb-2">
                  <AlertCircle className="w-4 h-4" />
                  {itemsError}
                </div>
              )}

              <div className="overflow-x-auto rounded-lg border" style={{ borderColor: THEME_BORDER }}>
                <Table>
                  <TableHeader>
                    <TableRow style={{ background: `linear-gradient(90deg, ${THEME_BG} 0%, rgba(30, 64, 175, 0.15) 100%)` }}>
                      <TableHead style={{ color: THEME_PRIMARY }} className="font-semibold">Product *</TableHead>
                      <TableHead style={{ color: THEME_PRIMARY }} className="font-semibold">Variant</TableHead>
                      <TableHead style={{ color: THEME_PRIMARY }} className="font-semibold">Category</TableHead>
                      <TableHead style={{ color: THEME_PRIMARY }} className="font-semibold">Unit</TableHead>
                      <TableHead style={{ color: THEME_PRIMARY }} className="font-semibold">Batch No</TableHead>
                      <TableHead style={{ color: THEME_PRIMARY }} className="font-semibold">MFG Date</TableHead>
                      <TableHead style={{ color: THEME_PRIMARY }} className="font-semibold">EXP Date</TableHead>
                      <TableHead style={{ color: THEME_PRIMARY }} className="font-semibold">Qty *</TableHead>
                      <TableHead style={{ color: THEME_PRIMARY }} className="font-semibold">Rate *</TableHead>
                      <TableHead style={{ color: THEME_PRIMARY }} className="font-semibold">GST %</TableHead>
                      <TableHead style={{ color: THEME_PRIMARY }} className="font-semibold">Disc %</TableHead>
                      <TableHead style={{ color: THEME_PRIMARY }} className="font-semibold">Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => {
                      const variants = item.product_id ? getVariantsForProduct(item.product_id) : [];
                      const showExpiryFields = item.has_expiry;

                      return (
                        <TableRow key={index} className="hover:bg-blue-50/50">
                          {/* Product Dropdown */}
                          <TableCell className="min-w-[160px]">
                            <Select 
                              value={item.product_id} 
                              onValueChange={(val) => handleProductSelect(index, val)}
                            >
                              <SelectTrigger className="w-full text-xs" style={{ borderColor: THEME_SECONDARY, backgroundColor: THEME_BG }}>
                                <SelectValue placeholder="Select Product" />
                              </SelectTrigger>
                              <SelectContent>
                                {parentProducts.map(product => (
                                  <SelectItem key={product.id} value={product.id}>
                                    {product.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>

                          {/* Variant Dropdown */}
                          <TableCell className="min-w-[140px]">
                            {variants.length > 0 ? (
                              <Select 
                                value={item.variant_id} 
                                onValueChange={(val) => handleVariantSelect(index, val)}
                              >
                                <SelectTrigger className="w-full text-xs" style={{ borderColor: THEME_SECONDARY, backgroundColor: THEME_BG }}>
                                  <SelectValue placeholder="Select Variant" />
                                </SelectTrigger>
                                <SelectContent>
                                  {variants.map(v => (
                                    <SelectItem key={v.id} value={v.id}>
                                      {v.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <span className="text-xs text-muted-foreground italic">No variants</span>
                            )}
                          </TableCell>

                          {/* Category (Auto) */}
                          <TableCell>
                            {item.category ? (
                              <Badge variant="outline" className="text-xs border-blue-300 text-blue-700 whitespace-nowrap">
                                {item.category}
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>

                          {/* Unit (Auto) */}
                          <TableCell>
                            <span className="text-xs font-medium" style={{ color: THEME_PRIMARY }}>
                              {item.unit || '—'}
                            </span>
                          </TableCell>

                          {/* Batch No */}
                          <TableCell className="min-w-[100px]">
                            {showExpiryFields ? (
                              <Input
                                value={item.batch_no}
                                onChange={(e) => updateItem(index, 'batch_no', e.target.value)}
                                placeholder="Batch"
                                className="w-full text-xs"
                                style={{ borderColor: THEME_SECONDARY, backgroundColor: THEME_BG }}
                              />
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>

                          {/* MFG Date */}
                          <TableCell className="min-w-[120px]">
                            {showExpiryFields ? (
                              <Input
                                type="date"
                                value={item.mfg_date}
                                onChange={(e) => updateItem(index, 'mfg_date', e.target.value)}
                                className="w-full text-xs"
                                style={{ borderColor: THEME_SECONDARY, backgroundColor: THEME_BG }}
                              />
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>

                          {/* EXP Date */}
                          <TableCell className="min-w-[120px]">
                            {showExpiryFields ? (
                              <Input
                                type="date"
                                value={item.exp_date}
                                onChange={(e) => updateItem(index, 'exp_date', e.target.value)}
                                className="w-full text-xs"
                                style={{ borderColor: THEME_SECONDARY, backgroundColor: THEME_BG }}
                              />
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>

                          {/* Qty */}
                          <TableCell>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                              className="w-16 text-xs"
                              min="0"
                              style={{ borderColor: THEME_SECONDARY, backgroundColor: THEME_BG }}
                            />
                          </TableCell>

                          {/* Rate */}
                          <TableCell>
                            <Input
                              type="number"
                              value={item.unit_price}
                              onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                              className="w-20 text-xs"
                              min="0"
                              step="0.01"
                              style={{ borderColor: THEME_SECONDARY, backgroundColor: THEME_BG }}
                            />
                          </TableCell>

                          {/* GST % (Auto but editable) */}
                          <TableCell>
                            <Input
                              type="number"
                              value={item.tax_rate}
                              onChange={(e) => updateItem(index, 'tax_rate', parseFloat(e.target.value) || 0)}
                              className="w-16 text-xs"
                              min="0"
                              style={{ borderColor: THEME_SECONDARY, backgroundColor: THEME_BG }}
                            />
                          </TableCell>

                          {/* Discount % */}
                          <TableCell>
                            <Input
                              type="number"
                              value={item.discount_rate}
                              onChange={(e) => updateItem(index, 'discount_rate', parseFloat(e.target.value) || 0)}
                              className="w-16 text-xs"
                              min="0"
                              style={{ borderColor: THEME_SECONDARY, backgroundColor: THEME_BG }}
                            />
                          </TableCell>

                          {/* Total (Auto) */}
                          <TableCell>
                            <span className="font-semibold text-xs whitespace-nowrap" style={{ color: THEME_PRIMARY }}>
                              ₹{item.total_amount.toFixed(2)}
                            </span>
                          </TableCell>

                          {/* Delete */}
                          <TableCell>
                            {items.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(index)}
                                className="text-red-600 hover:bg-red-100 h-7 w-7 p-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Bottom Section with Bill Upload and Totals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bill Upload */}
              <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: THEME_PRIMARY }}>Attach Bill Image (Optional)</h3>
                {!billImagePreview ? (
                  <div 
                    className="border-2 border-dashed rounded-lg p-6 text-center"
                    style={{ borderColor: THEME_SECONDARY, backgroundColor: THEME_BG }}
                  >
                    <Upload className="mx-auto h-12 w-12" style={{ color: THEME_SECONDARY }} />
                    <p className="mt-2 text-sm" style={{ color: THEME_PRIMARY }}>
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
                      variant="outline" 
                      className="mt-2 text-white"
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
                      style={{ borderColor: THEME_SECONDARY }}
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
                      <span className="text-sm" style={{ color: THEME_PRIMARY }}>{billImage?.name}</span>
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
                            style={{ borderColor: THEME_SECONDARY, backgroundColor: THEME_BG }}
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
                    background: `linear-gradient(90deg, ${THEME_BG} 0%, rgba(30, 64, 175, 0.15) 100%)`,
                    borderColor: THEME_SECONDARY 
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
                      style={{ borderColor: THEME_SECONDARY, backgroundColor: THEME_BG }}
                    />
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2" style={{ color: THEME_PRIMARY, borderColor: THEME_BORDER }}>
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
                      style={{ borderColor: THEME_SECONDARY, backgroundColor: THEME_BG }}
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
            <div className="flex justify-end gap-4 pt-4 border-t" style={{ borderColor: THEME_BORDER }}>
              <Button 
                type="button"
                variant="outline" 
                onClick={onClose}
                style={{ borderColor: THEME_SECONDARY, color: THEME_PRIMARY }}
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
