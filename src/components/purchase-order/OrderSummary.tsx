
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OrderSummaryData } from '@/pages/GeneratePurchaseOrder';

interface OrderSummaryProps {
  orderSummary: OrderSummaryData;
  setOrderSummary: (summary: OrderSummaryData) => void;
}

export function OrderSummary({ orderSummary, setOrderSummary }: OrderSummaryProps) {
  const updateDiscount = (value: number) => {
    setOrderSummary({ ...orderSummary, discount: value });
  };

  const updateDiscountType = (type: 'percentage' | 'amount') => {
    setOrderSummary({ ...orderSummary, discountType: type });
  };

  const updateFreightCharges = (value: number) => {
    setOrderSummary({ ...orderSummary, freightCharges: value });
  };

  return (
    <Card className="border-pink-200 sticky top-6">
      <CardHeader>
        <CardTitle className="text-pink-800">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-pink-700">Subtotal:</span>
          <span className="font-medium">₹{orderSummary.subtotal.toLocaleString()}</span>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-pink-700">Discount:</label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={orderSummary.discount}
              onChange={(e) => updateDiscount(parseFloat(e.target.value) || 0)}
              className="flex-1 border-pink-300 focus:border-pink-500 focus:ring-pink-500 bg-white"
              min="0"
              step="0.01"
            />
            <Select value={orderSummary.discountType} onValueChange={updateDiscountType}>
              <SelectTrigger className="w-20 border-pink-300 focus:border-pink-500 focus:ring-pink-500 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="percentage">%</SelectItem>
                <SelectItem value="amount">₹</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-pink-700">GST (18%):</span>
          <span className="font-medium">₹{orderSummary.taxAmount.toLocaleString()}</span>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-pink-700">Freight/Transport:</label>
          <Input
            type="number"
            value={orderSummary.freightCharges}
            onChange={(e) => updateFreightCharges(parseFloat(e.target.value) || 0)}
            className="border-pink-300 focus:border-pink-500 focus:ring-pink-500 bg-white"
            min="0"
            step="0.01"
            placeholder="0.00"
          />
        </div>

        <div className="border-t border-pink-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-pink-800">Grand Total:</span>
            <span className="text-lg font-bold text-pink-800">
              ₹{orderSummary.grandTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
