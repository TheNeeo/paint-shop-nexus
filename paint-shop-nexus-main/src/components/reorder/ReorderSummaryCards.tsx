import React from 'react';
import { AlertTriangle, Package, DollarSign, Clock, LucideIcon } from 'lucide-react';
import { ReorderProduct } from '@/pages/ReorderProductList';

interface ReorderSummaryCardsProps {
  products: ReorderProduct[];
}

interface SummaryCard {
  title: string;
  value: string | number;
  Icon: LucideIcon;
  gradient: string;
}

export function ReorderSummaryCards({ products }: ReorderSummaryCardsProps) {
  const totalLowStock = products.filter(p => p.status === 'low' || p.status === 'critical').length;
  const criticalAlerts = products.filter(p => p.status === 'critical').length;
  const totalEstimatedCost = products.reduce((sum, p) => sum + (p.suggestedQty * p.purchaseRate), 0);
  const avgLeadTime = 7;

  const cards: SummaryCard[] = [
    {
      title: 'Total Low Stock Items',
      value: totalLowStock,
      Icon: Package,
      gradient: 'from-pink-400 via-rose-400 to-red-400',
    },
    {
      title: 'Critical Stock Alerts',
      value: criticalAlerts,
      Icon: AlertTriangle,
      gradient: 'from-red-400 via-rose-500 to-pink-500',
    },
    {
      title: 'Total Estimated Cost',
      value: `₹${totalEstimatedCost.toLocaleString()}`,
      Icon: DollarSign,
      gradient: 'from-fuchsia-400 via-pink-500 to-rose-500',
    },
    {
      title: 'Average Lead Time',
      value: `${avgLeadTime} days`,
      Icon: Clock,
      gradient: 'from-purple-400 via-fuchsia-500 to-pink-500',
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
}
