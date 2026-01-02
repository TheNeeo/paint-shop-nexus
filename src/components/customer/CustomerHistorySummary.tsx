import React from 'react';
import { Users, DollarSign, ShoppingCart, AlertTriangle, LucideIcon } from 'lucide-react';
import { CustomerHistoryData } from '@/pages/CustomerHistory';

interface CustomerHistorySummaryProps {
  customers: CustomerHistoryData[];
}

interface SummaryCard {
  title: string;
  value: string;
  Icon: LucideIcon;
  gradient: string;
}

export const CustomerHistorySummary: React.FC<CustomerHistorySummaryProps> = ({ customers }) => {
  const totalCustomers = customers.length;
  const totalSalesValue = customers.reduce((sum, customer) => sum + customer.totalPurchaseValue, 0);
  const averagePurchase = totalCustomers > 0 ? totalSalesValue / totalCustomers : 0;
  const totalOutstanding = customers.reduce((sum, customer) => sum + customer.outstandingBalance, 0);

  const cards: SummaryCard[] = [
    {
      title: 'Total Customers',
      value: totalCustomers.toString(),
      Icon: Users,
      gradient: 'from-slate-400 via-gray-500 to-zinc-600',
    },
    {
      title: 'Total Sales Value',
      value: `₹${totalSalesValue.toLocaleString()}`,
      Icon: DollarSign,
      gradient: 'from-blue-400 via-indigo-500 to-purple-500',
    },
    {
      title: 'Average Purchase',
      value: `₹${Math.round(averagePurchase).toLocaleString()}`,
      Icon: ShoppingCart,
      gradient: 'from-cyan-400 via-teal-500 to-emerald-500',
    },
    {
      title: 'Outstanding Dues',
      value: `₹${totalOutstanding.toLocaleString()}`,
      Icon: AlertTriangle,
      gradient: 'from-amber-400 via-orange-500 to-red-500',
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-6 min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
        >
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-white/90 mb-1">
              {card.title}
            </h3>
            <p className="text-2xl font-bold text-white">
              {card.value}
            </p>
          </div>
          
          <div className="absolute right-4 bottom-4 opacity-80">
            <card.Icon className="h-16 w-16 text-white/40" strokeWidth={1.5} />
          </div>
        </div>
      ))}
    </div>
  );
};
