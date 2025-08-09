import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Package, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  ShoppingCart,
  DollarSign,
  Activity,
  Clock
} from "lucide-react";
import { Bar, BarChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// Mock data
const monthlyStockData = [
  { month: "Jan", usage: 120, procurement: 150 },
  { month: "Feb", usage: 190, procurement: 180 },
  { month: "Mar", usage: 300, procurement: 220 },
  { month: "Apr", usage: 200, procurement: 250 },
  { month: "May", usage: 278, procurement: 200 },
  { month: "Jun", usage: 189, procurement: 300 },
];

const vendorDistribution = [
  { name: "Tech Solutions", value: 35, color: "hsl(217, 91%, 60%)" },
  { name: "Office Supplies", value: 25, color: "hsl(217, 91%, 70%)" },
  { name: "Manufacturing", value: 20, color: "hsl(217, 91%, 80%)" },
  { name: "Others", value: 20, color: "hsl(217, 50%, 85%)" },
];

const recentActivities = [
  { action: "Stock updated", item: "Office Chair", time: "2 min ago", type: "update" },
  { action: "New vendor added", item: "TechCorp Solutions", time: "1 hour ago", type: "add" },
  { action: "Low stock alert", item: "A4 Paper", time: "3 hours ago", type: "alert" },
  { action: "Order placed", item: "Laptop Stand", time: "1 day ago", type: "order" },
];

const pendingTasks = [
  { task: "Review vendor proposals", priority: "high", dueDate: "Today" },
  { task: "Update inventory count", priority: "medium", dueDate: "Tomorrow" },
  { task: "Process pending orders", priority: "high", dueDate: "Today" },
  { task: "Vendor performance review", priority: "low", dueDate: "Next week" },
];

export const DashboardTab = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's your business overview at a glance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Inventory Items"
          value="1,247"
          change="+12% from last month"
          changeType="positive"
          icon={Package}
          className="animate-scale-in"
        />
        <StatCard
          title="Active Vendors"
          value="24"
          change="+3 new this month"
          changeType="positive"
          icon={Users}
          className="animate-scale-in"
          style={{ animationDelay: "100ms" }}
        />
        <StatCard
          title="Pending Orders"
          value="8"
          change="-5 from yesterday"
          changeType="positive"
          icon={ShoppingCart}
          className="animate-scale-in"
          style={{ animationDelay: "200ms" }}
        />
        <StatCard
          title="Monthly Spending"
          value="₹45,320"
          change="+8% from last month"
          changeType="neutral"
          icon={DollarSign}
          className="animate-scale-in"
          style={{ animationDelay: "300ms" }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Stock Usage Chart */}
        <Card className="shadow-soft border-0 animate-slide-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Monthly Stock Analysis
            </CardTitle>
            <CardDescription>
              Stock usage vs procurement trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyStockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }} 
                />
                <Legend />
                <Bar dataKey="usage" name="Usage" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="procurement" name="Procurement" fill="hsl(217, 91%, 80%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vendor Distribution Pie Chart */}
        <Card className="shadow-soft border-0 animate-slide-in" style={{ animationDelay: "200ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Vendor Distribution
            </CardTitle>
            <CardDescription>
              Purchase distribution by vendor category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vendorDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {vendorDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activity and Tasks Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <Card className="shadow-soft border-0 animate-slide-in" style={{ animationDelay: "300ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Activities
            </CardTitle>
            <CardDescription>
              Latest updates and changes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === "alert" ? "bg-warning" :
                    activity.type === "add" ? "bg-success" :
                    activity.type === "order" ? "bg-primary" : "bg-muted-foreground"
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.item}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {activity.time}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card className="shadow-soft border-0 animate-slide-in" style={{ animationDelay: "400ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Pending Tasks
            </CardTitle>
            <CardDescription>
              Important tasks requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:shadow-soft transition-all hover-lift">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded border-2 border-primary cursor-pointer hover:bg-primary-light transition-colors" />
                  <div>
                    <p className="text-sm font-medium">{task.task}</p>
                    <p className="text-xs text-muted-foreground">Due: {task.dueDate}</p>
                  </div>
                </div>
                <Badge variant={
                  task.priority === "high" ? "destructive" :
                  task.priority === "medium" ? "secondary" : "outline"
                } className="text-xs">
                  {task.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-soft border-0 animate-fade-in" style={{ animationDelay: "500ms" }}>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Frequently used actions for faster workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button className="h-12 hover-scale" variant="outline">
              <Package className="mr-2 h-4 w-4" />
              Add Inventory
            </Button>
            <Button className="h-12 hover-scale" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Add Vendor
            </Button>
            <Button className="h-12 hover-scale" variant="outline">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Create Order
            </Button>
            <Button className="h-12 hover-scale" variant="outline">
              <TrendingUp className="mr-2 h-4 w-4" />
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};