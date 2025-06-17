
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronDown,
  ChevronRight,
  Eye,
  Edit,
  MoreHorizontal,
  Copy,
  Archive,
  Trash2,
  Star,
  AlertTriangle,
  BarChart3,
} from "lucide-react";
import { ProductPreview } from "@/components/product/ProductPreview";

interface ProductTableProps {
  products: any[];
  expandedRows: Set<string>;
  selectedProducts: Set<string>;
  onToggleRowExpansion: (id: string) => void;
  onToggleProductSelection: (id: string) => void;
  onSelectAllProducts: () => void;
  onSetSelectedProduct: (product: any) => void;
  selectedProduct: any;
  getCategoryColor: (category: string) => string;
  getStockStatus: (quantity: number) => { status: string; color: string };
}

export function ProductTable({
  products,
  expandedRows,
  selectedProducts,
  onToggleRowExpansion,
  onToggleProductSelection,
  onSelectAllProducts,
  onSetSelectedProduct,
  selectedProduct,
  getCategoryColor,
  getStockStatus,
}: ProductTableProps) {
  return (
    <Card className="shadow-lg overflow-hidden border-green-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-green-100 via-green-200 to-blue-100 border-b-2 border-green-300 hover:bg-gradient-to-r hover:from-green-200 hover:to-blue-200">
            <TableHead className="w-12 text-green-800 font-bold text-sm">
              <Checkbox
                checked={selectedProducts.size === products.length && products.length > 0}
                onCheckedChange={onSelectAllProducts}
                className="border-green-500 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              />
            </TableHead>
            <TableHead className="w-12 text-green-800 font-bold text-sm"></TableHead>
            <TableHead className="w-16 text-green-800 font-bold text-sm">Image</TableHead>
            <TableHead className="text-green-800 font-bold text-sm">Product Details</TableHead>
            <TableHead className="text-green-800 font-bold text-sm">Unit</TableHead>
            <TableHead className="text-green-800 font-bold text-sm">Pricing</TableHead>
            <TableHead className="text-green-800 font-bold text-sm">Stock</TableHead>
            <TableHead className="text-green-800 font-bold text-sm">Performance</TableHead>
            <TableHead className="w-32 text-green-800 font-bold text-sm">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white">
          {products.map((product) => (
            <React.Fragment key={product.id}>
              <TableRow className="hover:bg-green-50/50 transition-colors group border-b border-green-100">
                <TableCell className="bg-white">
                  <Checkbox
                    checked={selectedProducts.has(product.id)}
                    onCheckedChange={() => onToggleProductSelection(product.id)}
                    className="border-green-500 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                </TableCell>
                <TableCell className="bg-white">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleRowExpansion(product.id)}
                    className="opacity-60 group-hover:opacity-100 transition-opacity hover:bg-green-100"
                  >
                    {expandedRows.has(product.id) ? (
                      <ChevronDown className="h-4 w-4 text-green-600" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-green-600" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="bg-white">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg border-2 border-green-200 shadow-sm"
                    />
                    {product.featured && (
                      <Star className="absolute -top-1 -right-1 h-4 w-4 text-green-500 fill-current" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="bg-white">
                  <div className="space-y-1">
                    <div className="font-medium text-gray-900 cursor-pointer hover:text-green-600 transition-colors"
                         onClick={() => onToggleRowExpansion(product.id)}>
                      {product.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getCategoryColor(product.category)}`}>
                        {product.category}
                      </Badge>
                      <span className="text-xs text-gray-500">#{product.baseCode}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(product.rating) 
                              ? "text-green-400 fill-current" 
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="bg-white">
                  <span className="text-sm font-medium">{product.unit}</span>
                </TableCell>
                <TableCell className="bg-white">
                  <div className="space-y-1">
                    <div className="font-medium text-lg text-green-700">${product.unitPrice.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">
                      Total: ${(product.unitPrice * product.stockQuantity).toFixed(2)}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="bg-white">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{product.stockQuantity}</span>
                      <Badge className={getStockStatus(product.stockQuantity).color}>
                        {getStockStatus(product.stockQuantity).status}
                      </Badge>
                    </div>
                    {product.stockQuantity <= 10 && product.stockQuantity > 0 && (
                      <div className="text-xs text-orange-600 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Reorder soon
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="bg-white">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <BarChart3 className="h-3 w-3 text-green-600" />
                      <span className="font-medium">{product.totalSales}</span>
                      <span className="text-gray-500">sold</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Last: {new Date(product.lastSold).toLocaleDateString()}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="bg-white">
                  <div className="flex gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="opacity-60 hover:opacity-100 hover:bg-green-100"
                              onClick={() => onSetSelectedProduct(product)}
                            >
                              <Eye className="h-4 w-4 text-green-600" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <ProductPreview product={selectedProduct} />
                          </DialogContent>
                        </Dialog>
                      </TooltipTrigger>
                      <TooltipContent>View details</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="opacity-60 hover:opacity-100 hover:bg-green-100">
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit product</TooltipContent>
                    </Tooltip>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="opacity-60 hover:opacity-100 hover:bg-green-100">
                          <MoreHorizontal className="h-4 w-4 text-gray-600" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white" align="end">
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
              
              {/* Variant Rows */}
              {expandedRows.has(product.id) && product.variants?.map((variant, index) => (
                <TableRow key={variant.id} className="bg-gradient-to-r from-green-50/30 to-blue-50/10 border-l-4 border-green-300">
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center border border-green-200">
                      <span className="text-xs font-medium text-green-700">{index + 1}</span>
                    </div>
                  </TableCell>
                  <TableCell className="pl-8">
                    <div className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3 text-green-400" />
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-gray-700">{variant.name}</span>
                        <div className="text-xs text-gray-500">SKU: {variant.sku}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">-</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-green-700">${variant.unitPrice.toFixed(2)}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{variant.stockQuantity}</span>
                      <Badge className={`text-xs ${getStockStatus(variant.stockQuantity).color}`}>
                        {getStockStatus(variant.stockQuantity).status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-gray-500">Variant data</span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="opacity-60 hover:opacity-100 hover:bg-green-100">
                      <Edit className="h-3 w-3 text-blue-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
