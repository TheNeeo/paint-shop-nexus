
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

const defaultTerms = `1. Payment terms as agreed upon in the purchase order.
2. Goods must be delivered within the specified delivery date.
3. All items should be in good condition and as per specifications.
4. Supplier is responsible for safe packaging and transportation.
5. Any defective items will be returned or replaced at supplier's cost.
6. This purchase order is subject to our standard terms and conditions.
7. Disputes, if any, will be resolved through mutual discussion.
8. Goods once supplied will not be taken back without prior approval.`;

export function TermsConditions() {
  const [terms, setTerms] = useState(defaultTerms);

  return (
    <Card className="border-pink-200">
      <CardHeader>
        <CardTitle className="text-pink-800">Terms & Conditions</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
          className="border-pink-300 focus:border-pink-500 focus:ring-pink-500 bg-white min-h-[200px]"
          placeholder="Enter terms and conditions..."
        />
      </CardContent>
    </Card>
  );
}
