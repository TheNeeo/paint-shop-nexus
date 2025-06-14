
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Package, ShoppingCart, Users, TrendingUp, DollarSign, AlertTriangle, Eye } from "lucide-react";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { PaintChart } from "@/components/dashboard/PaintChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/50 to-slate-200/30 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
            NEO COLOR FACTORY Dashboard
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Comprehensive paint business management system
          </p>
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Dashboard Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Total Products"
            value="150+"
            icon={Package}
            description="Active paint products"
            trend={{ value: 12, isPositive: true }}
            iconColor="from-blue-400 to-blue-600"
          />
          <DashboardCard
            title="Inventory Value"
            value="₹12,450"
            icon={DollarSign}
            description="Total stock value"
            trend={{ value: 8, isPositive: true }}
            iconColor="from-green-400 to-green-600"
          />
          <DashboardCard
            title="Low Stock Items"
            value="25"
            icon={AlertTriangle}
            description="Items need restocking"
            trend={{ value: -5, isPositive: false }}
            iconColor="from-orange-400 to-orange-600"
          />
          <DashboardCard
            title="Categories"
            value="8"
            icon={Eye}
            description="Product categories"
            iconColor="from-purple-400 to-purple-600"
          />
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PaintChart />
          <RecentActivity />
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1" onClick={() => navigate('/product/activity')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-6 w-6 text-blue-600" />
                Product Management
              </CardTitle>
              <CardDescription>
                Manage your paint products, variants, and inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                Go to Products
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer opacity-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-6 w-6 text-green-600" />
                Sales Management
              </CardTitle>
              <CardDescription>
                Track sales, orders, and customer transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer opacity-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-purple-600" />
                Customer Management
              </CardTitle>
              <CardDescription>
                Manage customer information and relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer opacity-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-red-600" />
                Analytics
              </CardTitle>
              <CardDescription>
                View reports and business insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
