import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export interface InvoiceProductLine {
  id: string;
  productId: string;
  productName: string;
  hsnCode: string;
  quantity: number;
  unit: string;
  rate: number;
  gstPercent: number;
  amount: number;
}

interface ProductLineFormProps {
  onAddProduct: (productLine: InvoiceProductLine) => void;
  onCancel: () => void;
}

export function ProductLineForm({ onAddProduct, onCancel }: ProductLineFormProps) {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [gstPercent, setGstPercent] = useState(18);
  const [errorMessage, setErrorMessage] = useState("");
  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, hsn_code, unit, sale_price, unit_price, current_stock")
        .order("name");
      if (error) throw error;
      return data || [];
    },
  });

  const selectedProduct = products.find((product) => product.id === productId);
  const rate = Number(selectedProduct?.sale_price || selectedProduct?.unit_price || 0);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const availableStock = Number(selectedProduct?.current_stock) || 0;

    if (!selectedProduct) {
      setErrorMessage("Select a product from inventory.");
      return;
    }
    if (!Number.isFinite(quantity) || quantity <= 0) {
      setErrorMessage("Quantity must be greater than zero.");
      return;
    }
    if (quantity > availableStock) {
      setErrorMessage(`Only ${availableStock} ${selectedProduct.unit || "units"} are in stock.`);
      return;
    }
    if (!Number.isFinite(rate) || rate <= 0) {
      setErrorMessage("This product needs a valid sale price before it can be invoiced.");
      return;
    }

    onAddProduct({
      id: crypto.randomUUID(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      hsnCode: selectedProduct.hsn_code || "",
      quantity,
      unit: selectedProduct.unit || "PCS",
      rate,
      gstPercent,
      amount: Math.round(quantity * rate * 100) / 100,
    });
    setProductId("");
    setQuantity(1);
    setGstPercent(18);
    setErrorMessage("");
  };

  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-blue-800">Add Inventory Product</h3>
        <Button type="button" variant="outline" size="sm" onClick={onCancel} aria-label="Close product line form">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {isError && <p role="alert" className="mb-3 text-sm text-red-700">Could not load inventory products.</p>}
      {errorMessage && <p role="alert" className="mb-3 text-sm text-red-700">{errorMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="invoice-product" className="text-blue-700 font-semibold">Product *</Label>
            <Select value={productId} onValueChange={(value) => { setProductId(value); setErrorMessage(""); }}>
              <SelectTrigger id="invoice-product" className="bg-white border-blue-300">
                <SelectValue placeholder={isLoading ? "Loading products..." : "Select inventory product"} />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} · {Number(product.current_stock) || 0} {product.unit || "units"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="invoice-product-hsn" className="text-blue-700 font-semibold">HSN Code</Label>
            <Input id="invoice-product-hsn" value={selectedProduct?.hsn_code || ""} readOnly className="bg-white border-blue-300" />
          </div>

          <div>
            <Label htmlFor="invoice-product-quantity" className="text-blue-700 font-semibold">Quantity *</Label>
            <Input id="invoice-product-quantity" type="number" min="0.01" step="0.01" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className="bg-white border-blue-300" />
            <p className="mt-1 text-xs text-muted-foreground">Available: {Number(selectedProduct?.current_stock) || 0} {selectedProduct?.unit || "units"}</p>
          </div>

          <div>
            <Label htmlFor="invoice-product-rate" className="text-blue-700 font-semibold">Rate (₹)</Label>
            <Input id="invoice-product-rate" type="number" step="0.01" value={rate || ""} readOnly className="bg-white border-blue-300" />
          </div>

          <div>
            <Label htmlFor="invoice-product-unit" className="text-blue-700 font-semibold">Unit</Label>
            <Input id="invoice-product-unit" value={selectedProduct?.unit || ""} readOnly className="bg-white border-blue-300" />
          </div>

          <div>
            <Label htmlFor="invoice-product-gst" className="text-blue-700 font-semibold">GST %</Label>
            <Select value={String(gstPercent)} onValueChange={(value) => setGstPercent(Number(value))}>
              <SelectTrigger id="invoice-product-gst" className="bg-white border-blue-300"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[0, 5, 12, 18, 28].map((rateValue) => <SelectItem key={rateValue} value={String(rateValue)}>{rateValue}%</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-blue-200">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={isLoading || isError || products.length === 0} className="bg-blue-600 hover:bg-blue-700">
            <Check className="h-4 w-4 mr-2" />
            Add Product Line
          </Button>
        </div>
      </form>
    </div>
  );
}
