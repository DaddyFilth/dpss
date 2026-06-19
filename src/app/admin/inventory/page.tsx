'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  Filter, 
  Download, 
  AlertTriangle,
  Package,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  stock: number;
  category: string;
  price: number;
  lowStockThreshold: number;
  lastRestocked: string;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      // Mock data - in real app, fetch from API
      const mockInventory: InventoryItem[] = [
        { id: '1', name: 'Wireless Headphones', sku: 'WH-001', stock: 45, category: 'Electronics', price: 199.99, lowStockThreshold: 10, lastRestocked: '2024-01-10' },
        { id: '2', name: 'Smart Watch', sku: 'SW-002', stock: 8, category: 'Electronics', price: 149.99, lowStockThreshold: 10, lastRestocked: '2024-01-05' },
        { id: '3', name: 'Bluetooth Speaker', sku: 'BS-003', stock: 23, category: 'Electronics', price: 79.99, lowStockThreshold: 15, lastRestocked: '2024-01-12' },
        { id: '4', name: 'USB-C Hub', sku: 'UC-004', stock: 5, category: 'Accessories', price: 39.99, lowStockThreshold: 20, lastRestocked: '2024-01-02' },
        { id: '5', name: 'Laptop Stand', sku: 'LS-005', stock: 67, category: 'Accessories', price: 49.99, lowStockThreshold: 15, lastRestocked: '2024-01-15' },
        { id: '6', name: 'Wireless Mouse', sku: 'WM-006', stock: 12, category: 'Electronics', price: 29.99, lowStockThreshold: 25, lastRestocked: '2024-01-08' },
      ];
      setInventory(mockInventory);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (itemId: string, newStock: number) => {
    try {
      // In real app, call API to update stock
      setInventory(inventory.map(item =>
        item.id === itemId ? { ...item, stock: newStock } : item
      ));
    } catch (error) {
      console.error('Failed to update stock:', error);
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesLowStock = !showLowStock || item.stock <= item.lowStockThreshold;
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const lowStockItems = inventory.filter(item => item.stock <= item.lowStockThreshold);
  const categories = [...new Set(inventory.map(item => item.category))];
  const totalStock = inventory.reduce((sum, item) => sum + item.stock, 0);

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Monitor and manage stock levels</p>
        </div>
        <Button>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Inventory Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStock}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-600">{item.stock} units</p>
                    <p className="text-sm text-muted-foreground">Threshold: {item.lowStockThreshold}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 w-full rounded-md border border-input bg-background"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-md border border-input bg-background"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="lowStock"
                checked={showLowStock}
                onChange={(e) => setShowLowStock(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="lowStock" className="text-sm font-medium">Low Stock Only</label>
            </div>

            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>

            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredInventory.length} {filteredInventory.length === 1 ? 'Item' : 'Items'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Product</th>
                  <th className="text-left p-3 font-medium">SKU</th>
                  <th className="text-left p-3 font-medium">Category</th>
                  <th className="text-left p-3 font-medium">Stock</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Price</th>
                  <th className="text-left p-3 font-medium">Last Restocked</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{item.name}</td>
                    <td className="p-3 text-sm text-muted-foreground">{item.sku}</td>
                    <td className="p-3">{item.category}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={item.stock}
                          onChange={(e) => handleStockUpdate(item.id, parseInt(e.target.value))}
                          className="w-20 px-2 py-1 rounded border border-input bg-background text-sm"
                          min="0"
                        />
                        <span className="text-sm text-muted-foreground">units</span>
                      </div>
                    </td>
                    <td className="p-3">
                      {item.stock <= item.lowStockThreshold ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-medium">${item.price.toFixed(2)}</td>
                    <td className="p-3 text-sm">
                      {new Date(item.lastRestocked).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          Restock
                        </Button>
                        <Button variant="ghost" size="sm">
                          History
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
