import React from 'react';
import { Users, DollarSign, UserCheck, UserPlus, LucideIcon } from 'lucide-react';
import { Customer } from '@/pages/CustomerInformation';

interface CustomerSummaryCardsProps {
  customers: Customer[];
}

interface SummaryCard {
  title: string;
  value: string;
  Icon: LucideIcon;
  gradient: string;
}

export const CustomerSummaryCards: React.FC<CustomerSummaryCardsProps> = ({ customers }) => {
  const totalCustomers = customers.length;
  const totalOutstanding = customers.reduce((sum, customer) => sum + customer.outstandingBalance, 0);
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const inactiveCustomers = customers.filter(c => c.status === 'inactive').length;
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentlyAdded = customers.filter(c => c.createdAt >= thirtyDaysAgo).length;

  const cards: SummaryCard[] = [
    {
      title: 'Total Customers',
      value: totalCustomers.toString(),
      Icon: Users,
      gradient: 'from-blue-400 via-blue-500 to-indigo-500',
    },
    {
      title: 'Total Outstanding',
      value: `₹${totalOutstanding.toLocaleString()}`,
      Icon: DollarSign,
      gradient: 'from-orange-400 via-red-400 to-rose-500',
    },
    {
      title: 'Active vs Inactive',
      value: `${activeCustomers} / ${inactiveCustomers}`,
      Icon: UserCheck,
      gradient: 'from-emerald-400 via-green-500 to-teal-500',
    },
    {
      title: 'Recently Added',
      value: recentlyAdded.toString(),
      Icon: UserPlus,
      gradient: 'from-purple-400 via-violet-500 to-indigo-500',
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
