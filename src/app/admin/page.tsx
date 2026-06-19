'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Zap, Target, Users, Share2, TrendingUp, Settings, Lock, Database } from 'lucide-react';

export default function AdminHub() {
  const { data: session } = useSession();
  const router = useRouter();
  const [seeding, setSeeding] = useState(false);

  const seedDatabase = async (reset = false) => {
    if (!confirm(reset ? 'This will reset the database and re-seed. Are you sure?' : 'This will seed the database with products. Continue?')) {
      return;
    }
    
    setSeeding(true);
    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: reset ? 'reset' : 'seed' }),
      });
      const result = await response.json();
      
      if (result.success) {
        alert(result.message);
      } else {
        alert(`Failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Failed to seed:', error);
      alert('Failed to seed database');
    } finally {
      setSeeding(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" />
              Admin Access Required
            </CardTitle>
            <CardDescription>Please sign in to access admin features</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/auth/signin')} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userRole = (session.user as any)?.role;
  if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-red-500" />
              Access Denied
            </CardTitle>
            <CardDescription>You need admin privileges to access this area</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/')} className="w-full">
              Return to Store
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const adminDashboards = [
    {
      title: 'Automation Center',
      description: 'Automated lead generation, social media posting, and email sequences',
      icon: Zap,
      color: 'text-yellow-500',
      href: '/dashboard/automation',
      badge: 'Autopilot'
    },
    {
      title: 'Customer Finder',
      description: 'AI-powered customer targeting and acquisition strategies',
      icon: Users,
      color: 'text-blue-500',
      href: '/dashboard/customer-finder',
      badge: 'AI Targeting'
    },
    {
      title: 'Product Finder',
      description: 'Identify winning products and buying opportunities',
      icon: Target,
      color: 'text-green-500',
      href: '/dashboard/product-finder',
      badge: 'AI Analysis'
    },
    {
      title: 'Social Media',
      description: 'Manage store\'s social media accounts and post products',
      icon: Share2,
      color: 'text-purple-500',
      href: '/dashboard/social',
      badge: 'Connected'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-red-600" />
            <h1 className="text-3xl font-bold">Admin Hub</h1>
          </div>
          <p className="text-gray-600">
            Welcome, {session.user?.name || 'Admin'}. Manage your store from here.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Role: <Badge variant="outline">{userRole}</Badge>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminDashboards.map((dashboard) => (
            <Card key={dashboard.href} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(dashboard.href)}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg bg-gray-100 ${dashboard.color}`}>
                    <dashboard.icon className="h-6 w-6" />
                  </div>
                  {dashboard.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {dashboard.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="mt-4">{dashboard.title}</CardTitle>
                <CardDescription>{dashboard.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Open Dashboard
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-gray-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" onClick={() => router.push('/dashboard/automation')}>
                <Zap className="h-4 w-4 mr-2" />
                Start Automations
              </Button>
              <Button variant="outline" onClick={() => router.push('/dashboard/social')}>
                <Share2 className="h-4 w-4 mr-2" />
                Connect Social Accounts
              </Button>
              <Button variant="outline" onClick={() => router.push('/products')}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Manage Products
              </Button>
              <Button 
                variant="outline" 
                onClick={() => seedDatabase(false)}
                disabled={seeding}
              >
                <Database className="h-4 w-4 mr-2" />
                {seeding ? 'Seeding...' : 'Seed Database'}
              </Button>
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button 
                variant="destructive" 
                onClick={() => seedDatabase(true)}
                disabled={seeding}
                className="w-full"
              >
                <Database className="h-4 w-4 mr-2" />
                {seeding ? 'Reset & Seeding...' : 'Reset & Seed Database'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}