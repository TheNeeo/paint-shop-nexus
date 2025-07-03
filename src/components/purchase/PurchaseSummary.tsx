
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, FileText, Clock, Calendar } from 'lucide-react';

export const PurchaseSummary = () => {
  // Mock data - in real app this would come from API
  const summaryData = {
    totalPurchaseAmount: 125000,
    totalInvoices: 42,
    vendorDueAmount: 25000,
    thisMonthPurchases: 85000
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Purchase Amount</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{summaryData.totalPurchaseAmount.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">All time purchases</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summaryData.totalInvoices}</div>
          <p className="text-xs text-muted-foreground">Purchase entries</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Vendor Due Amount</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">₹{summaryData.vendorDueAmount.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Outstanding payments</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month's Purchases</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">₹{summaryData.thisMonthPurchases.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Current month</p>
        </CardContent>
      </Card>
    </div>
  );
};
