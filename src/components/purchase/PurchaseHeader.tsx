
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface PurchaseHeaderProps {
  onNewPurchase: () => void;
}

export const PurchaseHeader: React.FC<PurchaseHeaderProps> = ({ onNewPurchase }) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-3xl font-bold text-pink-800 mb-2">Purchase Management</h1>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-pink-600 hover:text-pink-800">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-pink-700">Purchases</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Button onClick={onNewPurchase} className="bg-pink-600 hover:bg-pink-700 text-white">
        <Plus className="w-4 h-4 mr-2" />
        New Purchase
      </Button>
    </div>
  );
};
