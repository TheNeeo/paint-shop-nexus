import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, ShoppingCart, AlertTriangle } from 'lucide-react';
import { CustomerHistoryData } from '@/pages/CustomerHistory';

interface CustomerHistorySummaryProps {
  customers: CustomerHistoryData[];
}

export const CustomerHistorySummary: React.FC<CustomerHistorySummaryProps> = ({ customers }) => {
  const totalCustomers = customers.length;
  const totalSalesValue = customers.reduce((sum, customer) => sum + customer.totalPurchaseValue, 0);
  const averagePurchase = totalCustomers > 0 ? totalSalesValue / totalCustomers : 0;
  const totalOutstanding = customers.reduce((sum, customer) => sum + customer.outstandingBalance, 0);

  const cards = [
    {
      title: 'Total Customers',
      value: totalCustomers.toString(),
      icon: Users,
      bgColor: 'bg-gradient-to-r from-gray-500 to-gray-600',
      textColor: 'text-white'
    },
    {
      title: 'Total Sales Value',
      value: `₹${totalSalesValue.toLocaleString()}`,
      icon: DollarSign,
      bgColor: 'bg-gradient-to-r from-slate-500 to-slate-600',
      textColor: 'text-white'
    },
    {
      title: 'Average Purchase',
      value: `₹${Math.round(averagePurchase).toLocaleString()}`,
      icon: ShoppingCart,
      bgColor: 'bg-gradient-to-r from-gray-600 to-gray-700',
      textColor: 'text-white'
    },
    {
      title: 'Outstanding Dues',
      value: `₹${totalOutstanding.toLocaleString()}`,
      icon: AlertTriangle,
      bgColor: 'bg-gradient-to-r from-slate-600 to-slate-700',
      textColor: 'text-white'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card, index) => (
        <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardContent className={`${card.bgColor} ${card.textColor} p-6 rounded-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">{card.title}</p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <card.icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};