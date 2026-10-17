
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, FileText, Send, Mail, MessageCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ActionButtons() {
  const [sendMethod, setSendMethod] = useState<string>('email');

  const handleSaveDraft = () => {
    console.log('Saving draft...');
    // Handle save draft logic
  };

  const handleGeneratePDF = () => {
    console.log('Generating PDF...');
    // Handle PDF generation logic
  };

  const handleSendToSupplier = () => {
    console.log(`Sending via ${sendMethod}...`);
    // Handle send to supplier logic
  };

  return (
    <Card className="border-pink-200">
      <CardContent className="p-4 space-y-3">
        <Button
          variant="outline"
          onClick={handleSaveDraft}
          className="w-full border-pink-300 text-pink-700 hover:bg-pink-100"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>

        <Button
          onClick={handleGeneratePDF}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white"
        >
          <FileText className="h-4 w-4 mr-2" />
          Generate Purchase Order PDF
        </Button>

        <div className="space-y-2">
          <div className="flex gap-2">
            <Select value={sendMethod} onValueChange={setSendMethod}>
              <SelectTrigger className="flex-1 border-pink-300 focus:border-pink-500 focus:ring-pink-500 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="email">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                </SelectItem>
                <SelectItem value="whatsapp">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button
            onClick={handleSendToSupplier}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white"
          >
            <Send className="h-4 w-4 mr-2" />
            Send to Supplier
          </Button>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-pink-600">
            All fields will be validated before generating the order
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
