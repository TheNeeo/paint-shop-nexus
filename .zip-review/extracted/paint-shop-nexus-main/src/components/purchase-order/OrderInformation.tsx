
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function OrderInformation() {
  const [purchaseDate, setPurchaseDate] = useState<Date>(new Date());
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [poNumber, setPoNumber] = useState(`PO-${Date.now()}`);
  const [paymentTerms, setPaymentTerms] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <Card className="border-pink-200">
      <CardHeader>
        <CardTitle className="text-pink-800">Purchase Order Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-pink-700 mb-2 block">PO Number</label>
            <Input
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
              className="border-pink-300 focus:border-pink-500 focus:ring-pink-500 bg-white"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-pink-700 mb-2 block">Purchase Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-pink-300 focus:border-pink-500 focus:ring-pink-500 bg-white",
                    !purchaseDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {purchaseDate ? format(purchaseDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={purchaseDate}
                  onSelect={setPurchaseDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-pink-700 mb-2 block">Expected Delivery Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-pink-300 focus:border-pink-500 focus:ring-pink-500 bg-white",
                    !deliveryDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deliveryDate ? format(deliveryDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={deliveryDate}
                  onSelect={setDeliveryDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <label className="text-sm font-medium text-pink-700 mb-2 block">Payment Terms</label>
            <Select value={paymentTerms} onValueChange={setPaymentTerms}>
              <SelectTrigger className="border-pink-300 focus:border-pink-500 focus:ring-pink-500 bg-white">
                <SelectValue placeholder="Select payment terms" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="net-30">Net 30 Days</SelectItem>
                <SelectItem value="net-15">Net 15 Days</SelectItem>
                <SelectItem value="net-7">Net 7 Days</SelectItem>
                <SelectItem value="cod">Cash on Delivery</SelectItem>
                <SelectItem value="advance">100% Advance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-pink-700 mb-2 block">Reference / Notes</label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes or references..."
            className="border-pink-300 focus:border-pink-500 focus:ring-pink-500 bg-white"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
