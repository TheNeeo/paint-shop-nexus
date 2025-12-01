import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Edit, Printer, Download, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ProductPreviewProps {
  product: any;
}

const getColorClasses = (colorValue: string) => {
  const colorMap = {
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    red: "bg-red-100 text-red-800 border-red-200",
    green: "bg-green-100 text-green-800 border-green-200",
    purple: "bg-purple-100 text-purple-800 border-purple-200",
    orange: "bg-orange-100 text-orange-800 border-orange-200",
    pink: "bg-pink-100 text-pink-800 border-pink-200",
    indigo: "bg-indigo-100 text-indigo-800 border-indigo-200",
    coral: "bg-orange-100 text-orange-800 border-orange-200",
  };
  return colorMap[colorValue] || "bg-slate-100 text-slate-800 border-slate-200";
};

export function ProductPreview({ product }: ProductPreviewProps) {
  const [showVariants, setShowVariants] = useState(false);
  const { toast } = useToast();

  if (!product) return null;

  const getCategoryColor = (colorValue?: string) => {
    if (colorValue) {
      return getColorClasses(colorValue);
    }
    const colors = {
      Tools: "bg-blue-100 text-blue-800",
      Paint: "bg-red-100 text-red-800",
      Canvas: "bg-green-100 text-green-800",
      Brushes: "bg-purple-100 text-purple-800",
    };
    return colors[product.category] || "bg-gray-100 text-gray-800";
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { status: "Out of Stock", color: "bg-red-100 text-red-800" };
    if (quantity <= 10) return { status: "Low Stock", color: "bg-orange-100 text-orange-800" };
    return { status: "In Stock", color: "bg-green-100 text-green-800" };
  };

  const handlePrint = () => {
    toast({
      title: "Print",
      description: "Product details sent to printer"
    });
    window.print();
  };

  const handleDownload = () => {
    const content = `
Product Details
===============
Product Name: ${product.name}
Category: ${product.category}
HSN/Product Code: ${product.hsnCode || product.baseCode || "-"}
Unit: ${product.unit}
Unit Price: ₹${product.unitPrice?.toFixed(2) || "0.00"}
Stock Quantity: ${product.stockQuantity}
Total Sales: ${product.totalSales || 0}
Description: ${product.description || "No description"}
${product.remainingWarranty ? `Warranty Remaining: ${product.remainingWarranty}` : ""}
`;
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
    element.setAttribute("download", `${product.name}-details.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Download",
      description: "Product details downloaded successfully"
    });
  };

  const handleEdit = () => {
    toast({
      title: "Edit",
      description: "Opening edit form for this product"
    });
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
            className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
          />
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handlePrint}
              className="hover:bg-blue-50"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDownload}
              className="hover:bg-green-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleEdit}
              className="hover:bg-purple-50"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
            <Badge className={`mt-2 ${getCategoryColor(product.categoryColor)}`}>
              {product.category}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">HSN/Product Code</p>
              <p className="text-lg font-semibold">{product.hsnCode || product.baseCode || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Unit Price</p>
              <p className="text-lg font-semibold text-green-600">₹{product.unitPrice?.toFixed(2) || "0.00"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Unit</p>
              <p className="text-lg font-semibold">{product.unit || "-"}</p>
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
            <p className="text-2xl font-bold text-gray-900">{product.stockQuantity || 0}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Product Selling Quantity</p>
            <p className="text-lg font-semibold text-green-700">{product.totalSales || 0} units sold</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Date Added</p>
            <p className="text-gray-700">{new Date(product.dateAdded).toLocaleDateString()}</p>
          </div>

          {product.remainingWarranty && product.remainingWarranty !== "-" && (
            <div>
              <p className="text-sm font-medium text-gray-500">Warranty Remaining</p>
              <Badge className={product.remainingWarranty === "Expired" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                {product.remainingWarranty}
              </Badge>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Description */}
      <div>
        <h4 className="text-lg font-semibold mb-2">Description</h4>
        <p className="text-gray-700">{product.description || "No description provided"}</p>
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
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Variant Name</p>
                      <p className="font-semibold">{variant.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Unit Price</p>
                      <p className="font-semibold text-green-600">₹{variant.unitPrice?.toFixed(2) || "0.00"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Stock Quantity</p>
                      <p className="font-semibold">{variant.stockQuantity || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Stock Value</p>
                      <p className="font-semibold text-green-600">₹{((variant.unitPrice || 0) * (variant.stockQuantity || 0)).toFixed(2)}</p>
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
      <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
        <h4 className="text-lg font-semibold mb-3">Stock Information</h4>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Stock No</p>
              <p className="text-2xl font-bold text-blue-600">{product.stockQuantity || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Stock Value</p>
              <p className="text-2xl font-bold text-blue-600">
                ₹{(product.unitPrice * product.stockQuantity).toFixed(2)}
              </p>
            </div>
          </div>

          {product.variants && product.variants.length > 0 && (
            <div className="mt-4 pt-4 border-t-2 border-blue-200">
              <p className="text-sm text-gray-600 font-medium mb-3">Variants Stock Value</p>
              <div className="space-y-2">
                {product.variants.map((variant, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{variant.name}</span>
                    <span className="font-semibold text-blue-600">₹{((variant.unitPrice || 0) * (variant.stockQuantity || 0)).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 border-t border-blue-200 font-bold">
                  <span>Total Variants Value</span>
                  <span className="text-blue-700">₹{product.variants?.reduce((total, variant) => 
                    total + ((variant.unitPrice || 0) * (variant.stockQuantity || 0)), 0
                  ).toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
