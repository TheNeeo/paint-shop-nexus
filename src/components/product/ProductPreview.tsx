
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Edit, Printer, Download, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface ProductPreviewProps {
  product: any;
}

export function ProductPreview({ product }: ProductPreviewProps) {
  const [showVariants, setShowVariants] = useState(false);

  if (!product) return null;

  const getCategoryColor = (category: string) => {
    const colors = {
      Tools: "bg-blue-100 text-blue-800",
      Paint: "bg-red-100 text-red-800",
      Canvas: "bg-green-100 text-green-800",
      Brushes: "bg-purple-100 text-purple-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { status: "Out of Stock", color: "bg-red-100 text-red-800" };
    if (quantity <= 10) return { status: "Low Stock", color: "bg-coral-100 text-coral-800" };
    return { status: "In Stock", color: "bg-green-100 text-green-800" };
  };

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">Product Details</DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Image */}
        <div className="space-y-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover rounded-lg border"
          />
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
            <Badge className={`mt-2 ${getCategoryColor(product.category)}`}>
              {product.category}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Base Code</p>
              <p className="text-lg font-semibold">{product.baseCode}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Unit Price</p>
              <p className="text-lg font-semibold">₹{product.unitPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Unit</p>
              <p className="text-lg font-semibold">{product.unit}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Stock Status</p>
              <Badge className={getStockStatus(product.stockQuantity).color}>
                {getStockStatus(product.stockQuantity).status}
              </Badge>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Stock Quantity</p>
            <p className="text-2xl font-bold text-gray-900">{product.stockQuantity}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Date Added</p>
            <p className="text-gray-700">{new Date(product.dateAdded).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Description */}
      <div>
        <h4 className="text-lg font-semibold mb-2">Description</h4>
        <p className="text-gray-700">{product.description}</p>
      </div>

      {/* Product Variants */}
      {product.variants && product.variants.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowVariants(!showVariants)}
              className="p-0 h-auto"
            >
              {showVariants ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            <h4 className="text-lg font-semibold">
              Product Variants ({product.variants.length})
            </h4>
          </div>

          {showVariants && (
            <div className="space-y-3">
              {product.variants.map((variant, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Variant Name</p>
                      <p className="font-semibold">{variant.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Unit Price</p>
                      <p className="font-semibold">₹{variant.unitPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Stock Quantity</p>
                      <p className="font-semibold">{variant.stockQuantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <Separator />

      {/* Stock Information Summary */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="text-lg font-semibold mb-3">Stock Information</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Stock Value</p>
            <p className="text-xl font-bold text-blue-600">
              ${(product.unitPrice * product.stockQuantity).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Variants Stock Value</p>
            <p className="text-xl font-bold text-blue-600">
              ${product.variants?.reduce((total, variant) => 
                total + (variant.unitPrice * variant.stockQuantity), 0
              ).toFixed(2) || '0.00'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
