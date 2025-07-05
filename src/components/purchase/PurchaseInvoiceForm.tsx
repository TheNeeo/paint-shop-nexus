
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Upload, Save, FileText, Printer, Mail, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InvoiceItem {
  id: string;
  productName: string;
  category: string;
  hsnCode: string;
  unit: string;
  quantity: number;
  rate: number;
  amount: number;
}

export const PurchaseInvoiceForm = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', productName: '', category: '', hsnCode: '', unit: 'PC', quantity: 1, rate: 0, amount: 0 }
  ]);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<'percentage' | 'flat'>('percentage');

  const addNewItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      productName: '',
      category: '',
      hsnCode: '',
      unit: 'PC',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const discountAmount = discountType === 'percentage' ? (subtotal * discount) / 100 : discount;
  const taxableAmount = subtotal - discountAmount;
  const gstAmount = taxableAmount * 0.18; // 18% GST
  const grandTotal = taxableAmount + gstAmount;

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Invoice has been saved as draft successfully.",
    });
  };

  const handleGeneratePDF = () => {
    toast({
      title: "PDF Generated",
      description: "Invoice PDF has been generated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Supplier Information */}
      <Card className="bg-pink-50 border-pink-200">
        <CardHeader className="bg-pink-100 border-b border-pink-200">
          <CardTitle className="text-pink-800">Supplier Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-pink-700">Supplier</Label>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="flex-1 border-pink-300 focus:border-pink-500 focus:ring-pink-500">
                    <SelectValue placeholder="Select Existing Supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supplier1">ABC Suppliers</SelectItem>
                    <SelectItem value="supplier2">XYZ Industries</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="whitespace-nowrap border-pink-300 text-pink-700 hover:bg-pink-100">
                  <Plus className="w-4 h-4 mr-1" />
                  Add New
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-pink-700">GSTIN</Label>
              <Input placeholder="Enter GSTIN" className="border-pink-300 focus:border-pink-500 focus:ring-pink-500" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-pink-700">Mobile / Email</Label>
              <Input placeholder="Contact information" className="border-pink-300 focus:border-pink-500 focus:ring-pink-500" />
            </div>
            <div className="space-y-2">
              <Label className="text-pink-700">Billing Address</Label>
              <Textarea placeholder="Enter billing address" className="h-20 border-pink-300 focus:border-pink-500 focus:ring-pink-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Details */}
      <Card className="bg-pink-50 border-pink-200">
        <CardHeader className="bg-pink-100 border-b border-pink-200">
          <CardTitle className="text-pink-800">Purchase Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-pink-700">Invoice No.</Label>
              <Input placeholder="Auto-generated" className="border-pink-300 focus:border-pink-500 focus:ring-pink-500" />
            </div>
            <div className="space-y-2">
              <Label className="text-pink-700">Purchase Date</Label>
              <Input type="date" className="border-pink-300 focus:border-pink-500 focus:ring-pink-500" />
            </div>
            <div className="space-y-2">
              <Label className="text-pink-700">Due Date</Label>
              <Input type="date" className="border-pink-300 focus:border-pink-500 focus:ring-pink-500" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-pink-700">Payment Terms</Label>
              <Select>
                <SelectTrigger className="border-pink-300 focus:border-pink-500 focus:ring-pink-500">
                  <SelectValue placeholder="Select payment terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="net30">Net 30</SelectItem>
                  <SelectItem value="net60">Net 60</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-pink-700">Purchase Type</Label>
              <Select>
                <SelectTrigger className="border-pink-300 focus:border-pink-500 focus:ring-pink-500">
                  <SelectValue placeholder="Select purchase type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">Local</SelectItem>
                  <SelectItem value="interstate">Interstate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product/Item Table */}
      <Card className="bg-pink-50 border-pink-200">
        <CardHeader className="flex flex-row items-center justify-between bg-pink-100 border-b border-pink-200">
          <CardTitle className="text-pink-800">Products/Items</CardTitle>
          <Button onClick={addNewItem} size="sm" className="bg-pink-600 hover:bg-pink-700 text-white">
            <Plus className="w-4 h-4 mr-1" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-pink-200">
                  <th className="text-left p-2 text-pink-800">S.No</th>
                  <th className="text-left p-2 text-pink-800">Product Name</th>
                  <th className="text-left p-2 text-pink-800">HSN Code</th>
                  <th className="text-left p-2 text-pink-800">Unit</th>
                  <th className="text-left p-2 text-pink-800">Quantity</th>
                  <th className="text-left p-2 text-pink-800">Rate</th>
                  <th className="text-left p-2 text-pink-800">Amount</th>
                  <th className="text-left p-2 text-pink-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} className="border-b border-pink-100 hover:bg-pink-100/50">
                    <td className="p-2 text-pink-700">{index + 1}</td>
                    <td className="p-2">
                      <Input
                        placeholder="Product name"
                        value={item.productName}
                        onChange={(e) => updateItem(item.id, 'productName', e.target.value)}
                        className="border-pink-300 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        placeholder="HSN"
                        value={item.hsnCode}
                        onChange={(e) => updateItem(item.id, 'hsnCode', e.target.value)}
                        className="border-pink-300 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </td>
                    <td className="p-2">
                      <Select value={item.unit} onValueChange={(value) => updateItem(item.id, 'unit', value)}>
                        <SelectTrigger className="border-pink-300 focus:border-pink-500 focus:ring-pink-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PC">PC</SelectItem>
                          <SelectItem value="KG">KG</SelectItem>
                          <SelectItem value="LTR">LTR</SelectItem>
                          <SelectItem value="MTR">MTR</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                        className="border-pink-300 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                        className="border-pink-300 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </td>
                    <td className="p-2">
                      <span className="font-medium text-pink-700">₹{item.amount.toFixed(2)}</span>
                    </td>
                    <td className="p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Additional Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-pink-50 border-pink-200">
            <CardHeader className="bg-pink-100 border-b border-pink-200">
              <CardTitle className="text-pink-800">Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label className="text-pink-700">Notes</Label>
                <Textarea placeholder="Add any notes..." className="h-20 border-pink-300 focus:border-pink-500 focus:ring-pink-500" />
              </div>
              <div className="space-y-2">
                <Label className="text-pink-700">Terms & Conditions</Label>
                <Textarea placeholder="Enter terms and conditions..." className="h-20 border-pink-300 focus:border-pink-500 focus:ring-pink-500" />
              </div>
              <div className="space-y-2">
                <Label className="text-pink-700">Upload Invoice Copy</Label>
                <div className="border-2 border-dashed border-pink-300 rounded-lg p-6 text-center bg-white hover:bg-pink-50">
                  <Upload className="w-8 h-8 mx-auto text-pink-400 mb-2" />
                  <p className="text-pink-600">Drag & drop files here or click to browse</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Summary */}
        <Card className="lg:sticky lg:top-6 bg-pink-50 border-pink-200">
          <CardHeader className="bg-pink-100 border-b border-pink-200">
            <CardTitle className="text-pink-800">Financial Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-pink-700">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Select value={discountType} onValueChange={(value: 'percentage' | 'flat') => setDiscountType(value)}>
                    <SelectTrigger className="w-20 border-pink-300 focus:border-pink-500 focus:ring-pink-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">%</SelectItem>
                      <SelectItem value="flat">₹</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Discount"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="border-pink-300 focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
                <div className="flex justify-between text-sm text-pink-600">
                  <span>Discount Amount:</span>
                  <span>₹{discountAmount.toFixed(2)}</span>
                </div>
              </div>

              <Separator className="bg-pink-200" />
              
              <div className="flex justify-between text-pink-700">
                <span>Taxable Amount:</span>
                <span>₹{taxableAmount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-pink-700">
                <span>GST (18%):</span>
                <span>₹{gstAmount.toFixed(2)}</span>
              </div>
              
              <Separator className="bg-pink-200" />
              
              <div className="flex justify-between font-bold text-lg text-pink-800">
                <span>Grand Total:</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
              
              <div className="space-y-2">
                <Label className="text-pink-700">Paid Amount</Label>
                <Input type="number" placeholder="0.00" className="border-pink-300 focus:border-pink-500 focus:ring-pink-500" />
              </div>
              
              <div className="flex justify-between text-red-600 font-medium">
                <span>Balance Due:</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card className="bg-pink-50 border-pink-200">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="outline" onClick={handleSaveDraft} className="border-pink-300 text-pink-700 hover:bg-pink-100">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button className="bg-pink-600 hover:bg-pink-700 text-white" onClick={handleGeneratePDF}>
              <FileText className="w-4 h-4 mr-2" />
              Generate PDF
            </Button>
            <Button variant="outline" className="border-pink-300 text-pink-700 hover:bg-pink-100">
              <Printer className="w-4 h-4 mr-2" />
              Print Invoice
            </Button>
            <Button variant="outline" className="border-pink-300 text-pink-700 hover:bg-pink-100">
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </Button>
            <Button variant="outline" className="border-pink-300 text-pink-700 hover:bg-pink-100">
              <MessageCircle className="w-4 h-4 mr-2" />
              Send WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
