
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Welcome to NEO COLOR FACTORY
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Manage your paint products, inventory, and business operations all in one place.
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/product/activity')}>
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
              <Button className="w-full">
                Go to Products
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-50">
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

          <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-50">
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

          <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-50">
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

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">150+</div>
              <p className="text-sm text-slate-600">Products</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">$12,450</div>
              <p className="text-sm text-slate-600">Total Inventory Value</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">25</div>
              <p className="text-sm text-slate-600">Low Stock Items</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">8</div>
              <p className="text-sm text-slate-600">Categories</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
