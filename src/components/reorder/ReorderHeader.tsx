
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Palette } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export function ReorderHeader() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-pink-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold text-pink-800 mb-2">Reorder Product List</h1>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-pink-600 hover:text-pink-800">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/purchase" className="text-pink-600 hover:text-pink-800">
                  Purchase
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-pink-800 font-medium">
                  Reorder Product List
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm"
            className="border-pink-300 text-pink-700 hover:bg-pink-100"
          >
            <Palette className="h-4 w-4 mr-2" />
            Theme
          </Button>
          <Button 
            className="bg-pink-600 hover:bg-pink-700 text-white"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Generate Purchase Order
          </Button>
        </div>
      </div>
    </div>
  );
}
