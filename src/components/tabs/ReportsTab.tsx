import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AlertTriangle, TrendingUp, Package, Users } from "lucide-react";

interface InventoryItem {
  id: string;
  item_name: string;
  stock_count: number;
  reorder_level: number;
  unit: string;
}

interface Vendor {
  id: string;
  vendor_name: string;
  category: string;
  rating: number;
}

export const ReportsTab = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [inventoryResult, vendorsResult] = await Promise.all([
        supabase.from('inventory').select('*'),
        supabase.from('vendors').select('*')
      ]);

      if (inventoryResult.data) setItems(inventoryResult.data);
      if (vendorsResult.data) setVendors(vendorsResult.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate analytics
  const lowStockItems = items.filter(item => item.stock_count <= item.reorder_level);
  const totalItems = items.length;
  const totalVendors = vendors.length;
  const averageRating = vendors.length > 0 
    ? (vendors.reduce((sum, v) => sum + v.rating, 0) / vendors.length).toFixed(1)
    : "0";

  // Mock reorder recommendations
  const reorderRecommendations = lowStockItems.map(item => ({
    item_name: item.item_name,
    current_stock: item.stock_count,
    recommended_order: Math.max(item.reorder_level * 3, 50),
    unit: item.unit,
    priority: item.stock_count === 0 ? 'Critical' : 'High'
  }));

  // Prepare chart data
  const stockChartData = items.slice(0, 10).map(item => ({
    name: item.item_name.length > 15 ? item.item_name.substring(0, 15) + '...' : item.item_name,
    stock: item.stock_count,
    reorder_level: item.reorder_level
  }));

  const vendorCategoryData = vendors.reduce((acc: any[], vendor) => {
    const existing = acc.find(item => item.category === vendor.category);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ category: vendor.category, count: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

  const topPerformingVendors = vendors
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5)
    .map(vendor => ({
      name: vendor.vendor_name,
      rating: vendor.rating
    }));

  if (loading) {
    return <div>Loading reports...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports & Insights</h1>
        <p className="text-muted-foreground">Analytics and recommendations for your business</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{totalItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
                <p className="text-2xl font-bold">{lowStockItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Vendors</p>
                <p className="text-2xl font-bold">{totalVendors}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Avg. Vendor Rating</p>
                <p className="text-2xl font-bold">{averageRating}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reorder Recommendations */}
      {reorderRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              AI Reorder Recommendations
            </CardTitle>
            <CardDescription>
              Items that need restocking based on current levels and demand patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reorderRecommendations.map((rec, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant={rec.priority === 'Critical' ? 'destructive' : 'secondary'}>
                      {rec.priority}
                    </Badge>
                    <div>
                      <p className="font-medium">{rec.item_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Current: {rec.current_stock} {rec.unit}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-primary">
                      Order: {rec.recommended_order} {rec.unit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Levels Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Levels vs Reorder Points</CardTitle>
            <CardDescription>Current stock compared to reorder levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stock" fill="#3b82f6" name="Current Stock" />
                <Bar dataKey="reorder_level" fill="#ef4444" name="Reorder Level" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vendor Categories Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Vendor Distribution by Category</CardTitle>
            <CardDescription>Breakdown of vendors by industry category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vendorCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, count }) => `${category}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {vendorCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Vendors */}
      {topPerformingVendors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Vendors</CardTitle>
            <CardDescription>Vendors with highest ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topPerformingVendors} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 5]} />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="rating" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {totalItems === 0 && totalVendors === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
            <p className="text-muted-foreground mb-4">
              Add some inventory items and vendors to see insightful reports and analytics.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};