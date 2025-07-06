
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PurchaseOrderProduct } from '@/pages/GeneratePurchaseOrder';

interface ProductSelectionProps {
  products: PurchaseOrderProduct[];
  updateProduct: (productId: string, updates: Partial<PurchaseOrderProduct>) => void;
  removeProduct: (productId: string) => void;
  addProduct: () => void;
}

const units = ['Nos', 'Ltr', 'Kg', 'Mtr', 'Sq Ft', 'Set', 'Box', 'Packet'];

export function ProductSelection({ 
  products, 
  updateProduct, 
  removeProduct, 
  addProduct 
}: ProductSelectionProps) {
  return (
    <Card className="border-pink-200">
      <CardHeader>
        <CardTitle className="text-pink-800">Product Selection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-pink-100">
              <TableRow>
                <TableHead className="text-pink-800 font-semibold">Product Name</TableHead>
                <TableHead className="text-pink-800 font-semibold">Category</TableHead>
                <TableHead className="text-pink-800 font-semibold">HSN Code</TableHead>
                <TableHead className="text-pink-800 font-semibold">Unit</TableHead>
                <TableHead className="text-pink-800 font-semibold">Current Stock</TableHead>
                <TableHead className="text-pink-800 font-semibold">Quantity</TableHead>
                <TableHead className="text-pink-800 font-semibold">Rate</TableHead>
                <TableHead className="text-pink-800 font-semibold">Total</TableHead>
                <TableHead className="text-pink-800 font-semibold">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="hover:bg-pink-50">
                  <TableCell>
                    <Input
                      value={product.name}
                      onChange={(e) => updateProduct(product.id, { name: e.target.value })}
                      className="border-pink-300 focus:border-pink-500 focus:ring-pink-500 bg-white"
                      placeholder="Product name"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <Input
                        value={product.category}
                        onChange={(e) => updateProduct(product.id, { category: e.target.value })}
                        className="border-pink-300 focus:border-pink-500 focus:ring-pink-500 bg-white"
                        placeholder="Category"
                      />
                      {product.category && (
                        <Badge variant="outline" className="border-pink-300 text-pink-700">
                          {product.category}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={product.hsnCode}
                      onChange={(e) => updateProduct(product.id, { hsnCode: e.target.value })}
                      className="border-pink-300 focus:border-pink-500 focus:ring-pink-500 bg-white"
                      placeholder="HSN Code"
                    />
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={product.unit} 
                      onValueChange={(value) => updateProduct(product.id, { unit: value })}
                    >
                      <SelectTrigger className="border-pink-300 focus:border-pink-500 focus:ring-pink-500 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {units.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <span className={`font-medium ${product.currentStock < 10 ? 'text-red-600' : 'text-gray-600'}`}>
                        {product.currentStock}
                      </span>
                      {product.currentStock < 10 && (
                        <div className="text-xs text-red-500">Low Stock</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={product.quantity}
                      onChange={(e) => updateProduct(product.id, { quantity: parseInt(e.target.value) || 0 })}
                      className="w-20 border-pink-300 focus:border-pink-500 focus:ring-pink-500 bg-white"
                      min="0"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={product.rate}
                      onChange={(e) => updateProduct(product.id, { rate: parseFloat(e.target.value) || 0 })}
                      className="w-24 border-pink-300 focus:border-pink-500 focus:ring-pink-500 bg-white"
                      min="0"
                      step="0.01"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-pink-800">
                      ₹{product.totalAmount.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeProduct(product.id)}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4">
          <Button 
            onClick={addProduct}
            className="bg-pink-600 hover:bg-pink-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product Row
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
