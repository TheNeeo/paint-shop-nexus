
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Package, DollarSign, Clock } from 'lucide-react';
import { ReorderProduct } from '@/pages/ReorderProductList';

interface ReorderSummaryCardsProps {
  products: ReorderProduct[];
}

export function ReorderSummaryCards({ products }: ReorderSummaryCardsProps) {
  const totalLowStock = products.filter(p => p.status === 'low' || p.status === 'critical').length;
  const criticalAlerts = products.filter(p => p.status === 'critical').length;
  const totalEstimatedCost = products.reduce((sum, p) => sum + (p.suggestedQty * p.purchaseRate), 0);
  const avgLeadTime = 7; // Mock average lead time

  const cards = [
    {
      title: 'Total Low Stock Items',
      value: totalLowStock,
      icon: Package,
      description: 'Items below threshold',
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    },
    {
      title: 'Critical Stock Alerts',
      value: criticalAlerts,
      icon: AlertTriangle,
      description: 'Urgent reorder required',
      color: 'text-rose-600',
      bgColor: 'bg-rose-100'
    },
    {
      title: 'Total Estimated Cost',
      value: `₹${totalEstimatedCost.toLocaleString()}`,
      icon: DollarSign,
      description: 'For suggested quantities',
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    },
    {
      title: 'Average Lead Time',
      value: `${avgLeadTime} days`,
      icon: Clock,
      description: 'Expected delivery time',
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="border-pink-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-pink-700">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-800">{card.value}</div>
            <p className="text-xs text-pink-600 mt-1">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
