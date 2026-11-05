
import { useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

import { PaintChart } from "@/components/dashboard/PaintChart";
import { WeatherWidget } from "@/components/dashboard/WeatherWidget";
import { TodoWidget } from "@/components/dashboard/TodoWidget";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format, startOfMonth, subMonths } from "date-fns";
import { 
  ShoppingCart, 
  Package, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Boxes 
} from "lucide-react";

const Index = () => {
  const queryClient = useQueryClient();
  const today = format(new Date(), "yyyy-MM-dd");
  const monthStart = format(startOfMonth(new Date()), "yyyy-MM-dd");
  const previousMonthStart = format(startOfMonth(subMonths(new Date(), 1)), "yyyy-MM-dd");
  const initialStats = {
    todaysSales: 0,
    todaysSalesCount: 0,
    totalProducts: 0,
    totalCategories: 0,
    activeCustomers: 0,
    newCustomersThisMonth: 0,
    monthlyRevenue: 0,
    lowStockCount: 0,
    monthlyGrowth: 0,
  };

  const { data: stats = initialStats, isError: statsError } = useQuery({
    queryKey: ["dashboard-stats", today, monthStart],
    queryFn: async () => {
      const [todaySalesRes, productsRes, categoriesRes, customersRes, newCustomersRes, monthSalesRes, previousMonthSalesRes] = await Promise.all([
        supabase.from("sales").select("total_amount").eq("status", "final").eq("invoice_date", today),
        supabase.from("products").select("id, current_stock, threshold_qty", { count: "exact" }).eq("is_variant", false),
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("customers").select("id", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("customers").select("id", { count: "exact", head: true }).gte("created_at", monthStart),
        supabase.from("sales").select("total_amount").eq("status", "final").gte("invoice_date", monthStart),
        supabase.from("sales").select("total_amount").eq("status", "final").gte("invoice_date", previousMonthStart).lt("invoice_date", monthStart),
      ]);
      const failedResult = [todaySalesRes, productsRes, categoriesRes, customersRes, newCustomersRes, monthSalesRes, previousMonthSalesRes].find((result) => result.error);
      if (failedResult?.error) throw failedResult.error;

      const monthlyRevenue = monthSalesRes.data?.reduce((sum, sale) => sum + Number(sale.total_amount || 0), 0) || 0;
      const previousMonthRevenue = previousMonthSalesRes.data?.reduce((sum, sale) => sum + Number(sale.total_amount || 0), 0) || 0;
      const todaysSales = todaySalesRes.data?.reduce((sum, sale) => sum + Number(sale.total_amount || 0), 0) || 0;

      return {
        todaysSales,
        todaysSalesCount: todaySalesRes.data?.length || 0,
        totalProducts: productsRes.count || 0,
        totalCategories: categoriesRes.count || 0,
        activeCustomers: customersRes.count || 0,
        newCustomersThisMonth: newCustomersRes.count || 0,
        monthlyRevenue,
        lowStockCount: productsRes.data?.filter((product) => Number(product.current_stock || 0) <= Number(product.threshold_qty ?? 10)).length || 0,
        monthlyGrowth: previousMonthRevenue > 0 ? ((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 : 0,
      };
    },
  });

  useEffect(() => {
    const refreshDashboard = () => {
      void queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    };
    const channel = supabase
      .channel("dashboard-stats")
      .on("postgres_changes", { event: "*", schema: "public", table: "sales" }, refreshDashboard)
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, refreshDashboard)
      .on("postgres_changes", { event: "*", schema: "public", table: "customers" }, refreshDashboard)
      .subscribe();

    return () => { void supabase.removeChannel(channel); };
  }, [queryClient]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome to <span className="text-primary">NEO COLOR FACTORY</span>
          </h1>
          <p className="text-muted-foreground">Your complete paint shop management dashboard</p>
          {statsError && <p role="alert" className="text-sm text-destructive">Dashboard figures could not be loaded. Check database access and refresh.</p>}
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

        

        {/* Row 2: Weather + Todo */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <WeatherWidget />
          </div>
          <div className="lg:col-span-2">
            <TodoWidget />
          </div>
        </div>

        {/* Row 3: Chart + Activity + Mini cards */}
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
                value={`${stats.monthlyGrowth >= 0 ? "+" : ""}${stats.monthlyGrowth.toFixed(1)}%`}
                icon={TrendingUp}
                description="vs previous month"
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
