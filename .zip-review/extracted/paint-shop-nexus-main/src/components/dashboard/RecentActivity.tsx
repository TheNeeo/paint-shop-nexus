
import React, { useEffect, useState } from "react";
import { ShoppingCart, Package, DollarSign, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  type: 'sale' | 'purchase' | 'expense' | 'customer';
  description: string;
  amount?: number;
  time: string;
}

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'sale': return <ShoppingCart className="h-4 w-4 text-green-600" />;
    case 'purchase': return <Package className="h-4 w-4 text-blue-600" />;
    case 'expense': return <DollarSign className="h-4 w-4 text-red-600" />;
    case 'customer': return <Users className="h-4 w-4 text-purple-600" />;
    default: return <ShoppingCart className="h-4 w-4" />;
  }
};

const getActivityColor = (type: Activity['type']) => {
  switch (type) {
    case 'sale': return "border-l-green-500 bg-green-50";
    case 'purchase': return "border-l-blue-500 bg-blue-50";
    case 'expense': return "border-l-red-500 bg-red-50";
    case 'customer': return "border-l-purple-500 bg-purple-50";
    default: return "border-l-gray-500 bg-gray-50";
  }
};

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);

  const fetchActivities = async () => {
    try {
      const [salesRes, purchasesRes, expensesRes, customersRes] = await Promise.all([
        supabase.from('sales').select('id, invoice_number, customer_name, total_amount, created_at').order('created_at', { ascending: false }).limit(3),
        supabase.from('purchases').select('id, invoice_number, total_amount, created_at').order('created_at', { ascending: false }).limit(3),
        supabase.from('expenses').select('id, type, amount, created_at').order('created_at', { ascending: false }).limit(2),
        supabase.from('customers').select('id, name, created_at').order('created_at', { ascending: false }).limit(2),
      ]);

      const allActivities: Activity[] = [];

      salesRes.data?.forEach(s => allActivities.push({
        id: `sale-${s.id}`, type: 'sale',
        description: `Sale ${s.invoice_number} - ${s.customer_name || 'Walk-in'}`,
        amount: Number(s.total_amount),
        time: formatDistanceToNow(new Date(s.created_at), { addSuffix: true })
      }));

      purchasesRes.data?.forEach(p => allActivities.push({
        id: `purchase-${p.id}`, type: 'purchase',
        description: `Purchase ${p.invoice_number}`,
        amount: Number(p.total_amount),
        time: formatDistanceToNow(new Date(p.created_at), { addSuffix: true })
      }));

      expensesRes.data?.forEach(e => allActivities.push({
        id: `expense-${e.id}`, type: 'expense',
        description: `Expense: ${e.type}`,
        amount: Number(e.amount),
        time: formatDistanceToNow(new Date(e.created_at), { addSuffix: true })
      }));

      customersRes.data?.forEach(c => allActivities.push({
        id: `customer-${c.id}`, type: 'customer',
        description: `New customer: ${c.name}`,
        time: formatDistanceToNow(new Date(c.created_at), { addSuffix: true })
      }));

      allActivities.sort((a, b) => a.time.localeCompare(b.time));
      setActivities(allActivities.slice(0, 5));
    } catch (err) {
      console.error("Error fetching activities:", err);
    }
  };

  useEffect(() => {
    fetchActivities();

    const channel = supabase
      .channel('dashboard-activity')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sales' }, fetchActivities)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'purchases' }, fetchActivities)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'expenses' }, fetchActivities)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'customers' }, fetchActivities)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="paint-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
      </div>
      <div className="space-y-4">
        {activities.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No recent activity yet</p>
        )}
        {activities.map((activity) => (
          <div key={activity.id} className={cn("flex items-center space-x-4 p-3 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md", getActivityColor(activity.type))}>
            <div className="flex-shrink-0">{getActivityIcon(activity.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{activity.description}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
            {activity.amount && (
              <div className="flex-shrink-0">
                <span className="text-sm font-semibold text-foreground">₹{activity.amount.toLocaleString()}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
