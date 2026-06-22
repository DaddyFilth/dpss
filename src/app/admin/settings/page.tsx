import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  CreditCard,
  Database,
  Save
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your store settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Two-Factor Authentication</label>
              <select className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background">
                <option>Disabled</option>
                <option>Enabled</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Session Timeout</label>
              <select className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background">
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>24 hours</option>
                <option>7 days</option>
              </select>
            </div>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Security Settings
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive email alerts for important events</p>
              </div>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Low Stock Alerts</p>
                <p className="text-sm text-muted-foreground">Get notified when stock is low</p>
              </div>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New Order Alerts</p>
                <p className="text-sm text-muted-foreground">Instant notification for new orders</p>
              </div>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Notification Settings
            </Button>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Theme</label>
              <select className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background">
                <option>Light</option>
                <option>Dark</option>
                <option>System</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Primary Color</label>
              <div className="flex gap-2 mt-1">
                <div className="w-8 h-8 rounded-full bg-blue-500 cursor-pointer" />
                <div className="w-8 h-8 rounded-full bg-green-500 cursor-pointer" />
                <div className="w-8 h-8 rounded-full bg-purple-500 cursor-pointer" />
                <div className="w-8 h-8 rounded-full bg-orange-500 cursor-pointer" />
              </div>
            </div>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Appearance Settings
            </Button>
          </CardContent>
        </Card>

        {/* Store Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Store Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Store Name</label>
              <input
                type="text"
                defaultValue="AI Dropship"
                className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Store Email</label>
              <input
                type="email"
                defaultValue="support@aidropship.com"
                className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Currency</label>
              <select className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background">
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
              </select>
            </div>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Store Settings
            </Button>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Stripe Status</label>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm">Connected</span>
              </div>
            </div>
            {/* TODO: PayPal integration removed - add back when needed */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Sandbox Mode</p>
                <p className="text-sm text-muted-foreground">Use test environment for payments</p>
              </div>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Payment Settings
            </Button>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Backup Frequency</label>
              <select className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Last Backup</label>
              <p className="text-sm text-muted-foreground mt-1">January 15, 2024 at 2:30 AM</p>
            </div>
            <Button variant="outline">
              Manual Backup
            </Button>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Database Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
