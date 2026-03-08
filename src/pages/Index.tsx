
import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

import { PaintChart } from "@/components/dashboard/PaintChart";
import { supabase } from "@/integrations/supabase/client";
import { 
  ShoppingCart, 
  Package, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Boxes 
} from "lucide-react";

const Index = () => {
  const [stats, setStats] = useState({
    todaysSales: 0,
    todaysSalesCount: 0,
    totalProducts: 0,
    totalCategories: 0,
    activeCustomers: 0,
    newCustomersThisMonth: 0,
    monthlyRevenue: 0,
    lowStockCount: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const today = new Date().toISOString().split('T')[0];
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

      const [todaySalesRes, productsRes, categoriesRes, customersRes, newCustRes, monthSalesRes, lowStockRes] = await Promise.all([
        supabase.from('sales').select('total_amount').eq('invoice_date', today),
        supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_variant', false),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('customers').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('customers').select('id', { count: 'exact', head: true }).gte('created_at', monthStart),
        supabase.from('sales').select('total_amount').gte('invoice_date', monthStart),
        supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_variant', false).lt('current_stock', 10),
      ]);

      setStats({
        todaysSales: todaySalesRes.data?.reduce((sum, s) => sum + Number(s.total_amount), 0) || 0,
        todaysSalesCount: todaySalesRes.data?.length || 0,
        totalProducts: productsRes.count || 0,
        totalCategories: categoriesRes.count || 0,
        activeCustomers: customersRes.count || 0,
        newCustomersThisMonth: newCustRes.count || 0,
        monthlyRevenue: monthSalesRes.data?.reduce((sum, s) => sum + Number(s.total_amount), 0) || 0,
        lowStockCount: lowStockRes.count || 0,
      });
    };

    fetchStats();

    // Realtime updates
    const channel = supabase
      .channel('dashboard-stats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sales' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'customers' }, fetchStats)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome to <span className="text-primary">NEO COLOR FACTORY</span>
          </h1>
          <p className="text-muted-foreground">Your complete paint shop management dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <DashboardCard
            title="Today's Sales"
            value={`₹${stats.todaysSales.toLocaleString()}`}
            icon={ShoppingCart}
            description={`${stats.todaysSalesCount} transactions`}
            gradient="from-green-400/20 to-green-600/10"
            iconColor="from-green-400 to-green-600"
          />
          <DashboardCard
            title="Total Products"
            value={stats.totalProducts.toLocaleString()}
            icon={Package}
            description={`${stats.totalCategories} categories`}
            gradient="from-blue-400/20 to-blue-600/10"
            iconColor="from-blue-400 to-blue-600"
          />
          <DashboardCard
            title="Active Customers"
            value={stats.activeCustomers.toLocaleString()}
            icon={Users}
            description={`${stats.newCustomersThisMonth} new this month`}
            gradient="from-purple-400/20 to-purple-600/10"
            iconColor="from-purple-400 to-purple-600"
          />
          <DashboardCard
            title="Monthly Revenue"
            value={`₹${stats.monthlyRevenue.toLocaleString()}`}
            icon={DollarSign}
            description="Current month"
            gradient="from-orange-400/20 to-orange-600/10"
            iconColor="from-orange-400 to-orange-600"
          />
        </div>

        

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PaintChart />
          <div className="space-y-6">
            <RecentActivity />
            <div className="grid grid-cols-2 gap-4">
              <DashboardCard
                title="Low Stock"
                value={stats.lowStockCount.toString()}
                icon={Boxes}
                description="Items to reorder"
                gradient="from-red-400/20 to-red-600/10"
                iconColor="from-red-400 to-red-600"
                className="p-4"
              />
              <DashboardCard
                title="Growth"
                value="+18%"
                icon={TrendingUp}
                description="vs last month"
                gradient="from-teal-400/20 to-teal-600/10"
                iconColor="from-teal-400 to-teal-600"
                className="p-4"
              />
            </div>
          </div>
        </div>

        <div className="paint-card text-center py-8">
          <div className="space-y-2">
            <h3 className="text-xl font-bold">
              <span className="text-slate-600">NEO</span>{" "}
              <span className="font-bold">
                <span className="text-red-500">C</span>
                <span className="text-orange-500">O</span>
                <span className="text-green-500">L</span>
                <span className="text-blue-500">O</span>
                <span className="text-purple-500">R</span>
              </span>{" "}
              <span className="text-slate-600">FACTORY</span>
            </h3>
            <p className="text-muted-foreground">Premium quality paints for all your painting needs</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
