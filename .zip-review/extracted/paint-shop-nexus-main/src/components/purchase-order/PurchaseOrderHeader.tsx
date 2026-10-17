
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export function PurchaseOrderHeader() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-pink-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold text-pink-800 mb-2">Generate Purchase Order</h1>
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
                <BreadcrumbLink href="/purchase/reorder" className="text-pink-600 hover:text-pink-800">
                  Reorder Product List
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-pink-800 font-medium">
                  Generate Purchase Order
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => navigate('/purchase/reorder')}
          className="border-pink-300 text-pink-700 hover:bg-pink-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Reorder List
        </Button>
      </div>
    </div>
  );
}
