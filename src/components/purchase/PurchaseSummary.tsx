
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, ShoppingCart, Users, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const PurchaseSummary = () => {
  const [summaryData, setSummaryData] = useState({
    totalPurchases: 0,
    totalAmount: 0,
    totalVendors: 0,
    topVendors: [] as Array<{ name: string; amount: number }>,
    purchaseTrend: [] as Array<{ date: string; amount: number; label: string }>,
    recentPurchases: [] as Array<any>
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummaryData();
  }, []);

  const fetchSummaryData = async () => {
    try {
      setLoading(true);

      // Fetch total purchases this month
      const currentMonth = new Date();
      const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      
      const { data: monthlyPurchases, error: monthlyError } = await supabase
        .from('purchases')
        .select('total_amount')
        .gte('purchase_date', firstDay.toISOString().split('T')[0]);

      if (monthlyError) throw monthlyError;

      const totalPurchases = monthlyPurchases?.length || 0;
      const totalAmount = monthlyPurchases?.reduce((sum, p) => sum + Number(p.total_amount), 0) || 0;

      // Fetch vendor count
      const { data: vendors, error: vendorError } = await supabase
        .from('vendors')
        .select('id, name');

      if (vendorError) throw vendorError;

      // Fetch top vendors (by purchase amount)
      const { data: topVendorData, error: topVendorError } = await supabase
        .from('purchases')
        .select(`
          vendor_id,
          total_amount,
          vendors (name)
        `)
        .gte('purchase_date', firstDay.toISOString().split('T')[0]);

      if (topVendorError) throw topVendorError;

      // Group by vendor and calculate totals
      const vendorTotals = topVendorData?.reduce((acc: Record<string, number>, purchase) => {
        const vendorName = purchase.vendors?.name || 'Unknown';
        if (!acc[vendorName]) {
          acc[vendorName] = 0;
        }
        acc[vendorName] += Number(purchase.total_amount);
        return acc;
      }, {}) || {};

      const topVendors = Object.entries(vendorTotals)
        .map(([name, amount]) => ({ name, amount: Number(amount) }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

      // Fetch recent purchases
      const { data: recentPurchases, error: recentError } = await supabase
        .from('purchases')
        .select(`
          *,
          vendors (name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentError) throw recentError;

      // Generate purchase trend data (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const trendData = await Promise.all(
        last7Days.map(async (date) => {
          const { data, error } = await supabase
            .from('purchases')
            .select('total_amount')
            .eq('purchase_date', date);

          if (error) throw error;

          const dayTotal = data?.reduce((sum, p) => sum + Number(p.total_amount), 0) || 0;
          return {
            date,
            amount: dayTotal,
            label: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          };
        })
      );

      setSummaryData({
        totalPurchases,
        totalAmount,
        totalVendors: vendors?.length || 0,
        topVendors,
        purchaseTrend: trendData,
        recentPurchases: recentPurchases?.map(p => ({
          ...p,
          vendor_name: p.vendors?.name || 'Unknown'
        })) || []
      });
    } catch (error) {
      console.error('Error fetching summary data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases This Month</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.totalPurchases}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchase Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{summaryData.totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.totalVendors}</div>
            <p className="text-xs text-muted-foreground">+2 new vendors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Purchase Value</CardTitle>
            <Package className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{summaryData.totalPurchases > 0 ? Math.round(summaryData.totalAmount / summaryData.totalPurchases).toLocaleString() : '0'}
            </div>
            <p className="text-xs text-muted-foreground">-2.3% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Purchase Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Purchase Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={summaryData.purchaseTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']} />
                <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Vendors Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Vendors (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={summaryData.topVendors}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']} />
                <Bar dataKey="amount" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Purchase Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {summaryData.recentPurchases.map((purchase, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{purchase.invoice_number}</p>
                  <p className="text-sm text-gray-600">{purchase.vendor_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{Number(purchase.total_amount).toLocaleString()}</p>
                  <Badge variant={
                    purchase.status === 'received' ? 'default' :
                    purchase.status === 'pending' ? 'secondary' : 'destructive'
                  }>
                    {purchase.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-4">
        <p>Last updated: {new Date().toLocaleString()}</p>
        <p>Total Purchase Value: ₹{summaryData.totalAmount.toLocaleString()}</p>
      </div>
    </div>
  );
};
