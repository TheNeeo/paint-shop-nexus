
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { PaintChart } from "@/components/dashboard/PaintChart";
import { 
  ShoppingCart, 
  Package, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Boxes 
} from "lucide-react";

const Index = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome to <span className="text-primary">NEO COLOR FACTORY</span>
          </h1>
          <p className="text-muted-foreground">
            Your complete paint shop management dashboard
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <DashboardCard
            title="Today's Sales"
            value="₹45,280"
            icon={ShoppingCart}
            description="15 transactions"
            trend={{ value: 12.5, isPositive: true }}
            gradient="from-green-400/20 to-green-600/10"
          />
          
          <DashboardCard
            title="Total Products"
            value="1,247"
            icon={Package}
            description="23 categories"
            trend={{ value: 8.2, isPositive: true }}
            gradient="from-blue-400/20 to-blue-600/10"
          />
          
          <DashboardCard
            title="Active Customers"
            value="342"
            icon={Users}
            description="28 new this month"
            trend={{ value: 15.3, isPositive: true }}
            gradient="from-purple-400/20 to-purple-600/10"
          />
          
          <DashboardCard
            title="Monthly Revenue"
            value="₹8,45,690"
            icon={DollarSign}
            description="Current month"
            trend={{ value: 22.8, isPositive: true }}
            gradient="from-orange-400/20 to-orange-600/10"
          />
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PaintChart />
          
          <div className="space-y-6">
            <RecentActivity />
            
            {/* Additional Stats */}
            <div className="grid grid-cols-2 gap-4">
              <DashboardCard
                title="Low Stock"
                value="12"
                icon={Boxes}
                description="Items to reorder"
                gradient="from-red-400/20 to-red-600/10"
                className="p-4"
              />
              
              <DashboardCard
                title="Growth"
                value="+18%"
                icon={TrendingUp}
                description="vs last month"
                gradient="from-teal-400/20 to-teal-600/10"
                className="p-4"
              />
            </div>
          </div>
        </div>

        {/* Footer Info */}
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
            <p className="text-muted-foreground">
              Premium quality paints for all your painting needs
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
