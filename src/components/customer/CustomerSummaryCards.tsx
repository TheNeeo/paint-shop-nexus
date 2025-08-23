import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, UserCheck, UserPlus } from 'lucide-react';
import { Customer } from '@/pages/CustomerInformation';

interface CustomerSummaryCardsProps {
  customers: Customer[];
}

export const CustomerSummaryCards: React.FC<CustomerSummaryCardsProps> = ({ customers }) => {
  const totalCustomers = customers.length;
  const totalOutstanding = customers.reduce((sum, customer) => sum + customer.outstandingBalance, 0);
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const inactiveCustomers = customers.filter(c => c.status === 'inactive').length;
  
  // Recently added (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentlyAdded = customers.filter(c => c.createdAt >= thirtyDaysAgo).length;

  const cards = [
    {
      title: 'Total Customers',
      value: totalCustomers.toString(),
      icon: Users,
      bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
      textColor: 'text-white'
    },
    {
      title: 'Total Outstanding',
      value: `₹${totalOutstanding.toLocaleString()}`,
      icon: DollarSign,
      bgColor: 'bg-gradient-to-r from-orange-500 to-red-500',
      textColor: 'text-white'
    },
    {
      title: 'Active vs Inactive',
      value: `${activeCustomers} / ${inactiveCustomers}`,
      icon: UserCheck,
      bgColor: 'bg-gradient-to-r from-green-500 to-emerald-600',
      textColor: 'text-white'
    },
    {
      title: 'Recently Added',
      value: recentlyAdded.toString(),
      icon: UserPlus,
      bgColor: 'bg-gradient-to-r from-purple-500 to-violet-600',
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