
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
      <Card className="bg-gradient-to-r from-pink-100 to-purple-100 border-pink-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Purchase Amount</CardTitle>
          <TrendingUp className="h-4 w-4 text-pink-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-pink-700">₹{summaryData.totalPurchaseAmount.toLocaleString()}</div>
          <p className="text-xs text-pink-600">All time purchases</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
          <FileText className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-700">{summaryData.totalInvoices}</div>
          <p className="text-xs text-purple-600">Purchase entries</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-pink-100 to-rose-100 border-pink-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Vendor Due Amount</CardTitle>
          <Clock className="h-4 w-4 text-rose-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rose-700">₹{summaryData.vendorDueAmount.toLocaleString()}</div>
          <p className="text-xs text-rose-600">Outstanding payments</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-fuchsia-100 to-pink-100 border-fuchsia-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month's Purchases</CardTitle>
          <Calendar className="h-4 w-4 text-fuchsia-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-fuchsia-700">₹{summaryData.thisMonthPurchases.toLocaleString()}</div>
          <p className="text-xs text-fuchsia-600">Current month</p>
        </CardContent>
      </Card>
    </div>
  );
};
