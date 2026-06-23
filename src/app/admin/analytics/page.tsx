import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

async function getAnalyticsData() {
  // In a real app, these would come from the database with complex queries
  return {
    revenue: {
      total: 125430.00,
      growth: 15.3,
      monthly: [12000, 15000, 18000, 22000, 25000, 28000],
    },
    orders: {
      total: 1234,
      growth: 12.5,
      monthly: [80, 95, 110, 125, 140, 155],
    },
    users: {
      total: 892,
      growth: 8.7,
      monthly: [50, 65, 80, 95, 110, 125],
    },
    products: {
      total: 156,
      topSelling: [
        { name: 'Wireless Headphones', sales: 234, revenue: 46799.00 },
        { name: 'Smart Watch', sales: 189, revenue: 28311.00 },
        { name: 'Bluetooth Speaker', sales: 156, revenue: 12480.00 },
      ],
    },
    conversion: {
      rate: 3.2,
      growth: 0.8,
    },
    averageOrder: {
      value: 101.70,
      growth: 5.2,
    },
  };
}

async function getSalesByCategory() {
  return [
    { category: 'Electronics', value: 45200, percentage: 36 },
    { category: 'Clothing', value: 31200, percentage: 25 },
    { category: 'Home & Garden', value: 18750, percentage: 15 },
    { category: 'Sports', value: 15600, percentage: 12 },
    { category: 'Other', value: 14750, percentage: 12 },
  ];
}

async function getRecentActivity() {
  return [
    { id: 1, type: 'order', message: 'New order #ORD-1234 received', time: '2 minutes ago' },
    { id: 2, type: 'user', message: 'New user registered: john@example.com', time: '5 minutes ago' },
    { id: 3, type: 'product', message: 'Product "Wireless Mouse" stock low (5 remaining)', time: '10 minutes ago' },
    { id: 4, type: 'order', message: 'Order #ORD-1233 shipped', time: '15 minutes ago' },
    { id: 5, type: 'review', message: 'New 5-star review received', time: '20 minutes ago' },
  ];
}

export default async function AnalyticsPage() {
  const analytics = await getAnalyticsData();
  const salesByCategory = await getSalesByCategory();
  const recentActivity = await getRecentActivity();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Detailed performance metrics and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.revenue.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {analytics.revenue.growth > 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-500">+{analytics.revenue.growth}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 mr-1 text-red-500" />
                  <span className="text-red-500">{analytics.revenue.growth}%</span>
                </>
              )}
              {' '}from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.orders.total}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500">+{analytics.orders.growth}%</span>
              {' '}from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.users.total}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500">+{analytics.users.growth}%</span>
              {' '}from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.conversion.rate}%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500">+{analytics.conversion.growth}%</span>
              {' '}from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesByCategory.map((item) => (
                <div key={item.category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{item.category}</span>
                    <span className="text-sm text-muted-foreground">${item.value.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all bar-fill"
                      style={{ '--bar-width': `${item.percentage}%` } as React.CSSProperties}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.products.topSelling.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sales} sold</p>
                    </div>
                  </div>
                  <p className="font-medium">${product.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Average Order Value */}
        <Card>
          <CardHeader>
            <CardTitle>Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">${analytics.averageOrder.value.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500">+{analytics.averageOrder.growth}%</span>
              {' '}from last month
            </p>
              <div className="mt-4 h-24 bg-secondary rounded-lg flex items-end justify-between p-2 gap-1">
                {analytics.revenue.monthly.map((value, index) => (
                  <div
                    key={index}
                    className="bg-primary rounded-t-sm transition-all hover:bg-primary/80 bar-item"
                    style={{ '--bar-height': `${(value / Math.max(...analytics.revenue.monthly)) * 100}%` } as React.CSSProperties}
                  />
                ))}
              </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'order' ? 'bg-green-500' :
                    activity.type === 'user' ? 'bg-blue-500' :
                    activity.type === 'product' ? 'bg-yellow-500' :
                    'bg-purple-500'
                  }`} />
                  <div>
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
