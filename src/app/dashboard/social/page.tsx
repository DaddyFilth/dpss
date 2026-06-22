'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Plus, Check, Shield } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface SocialAccount {
  id: string;
  provider: string;
  providerAccountId: string;
  isActive: boolean;
  profile?: any;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export default function SocialDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [postContent, setPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    if (session) {
      // Check if user is admin
      const userRole = session.user?.role;
      if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
        router.push('/');
        return;
      }
      
      if (session.user?.id) {
        fetchSocialAccounts();
        fetchProducts();
      }
    }
  }, [session, router]);

  const fetchSocialAccounts = async () => {
    try {
      const response = await fetch('/api/social/accounts');
      const data = await response.json();
      setSocialAccounts(data.accounts || []);
    } catch (error) {
      console.error('Failed to fetch social accounts:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const handleConnectPlatform = (provider: string) => {
    // Trigger OAuth flow
    window.location.href = `/api/auth/signin?callbackUrl=${encodeURIComponent('/dashboard/social')}&provider=${provider}`;
  };

  const handleDisconnectPlatform = async (accountId: string) => {
    try {
      await fetch(`/api/social/accounts/${accountId}`, {
        method: 'DELETE',
      });
      fetchSocialAccounts();
    } catch (error) {
      console.error('Failed to disconnect platform:', error);
    }
  };

  const handlePostProduct = async (scheduleDate?: string) => {
    if (!selectedProduct || !postContent) return;

    setIsPosting(true);
    try {
      const response = await fetch('/api/social/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct,
          platform: selectedPlatform,
          content: postContent,
          scheduledAt: scheduleDate,
        }),
      });

      if (response.ok) {
        alert('Product posted successfully!');
        setPostContent('');
        setSelectedProduct('');
      }
    } catch (error) {
      console.error('Failed to post product:', error);
      alert('Failed to post product');
    } finally {
      setIsPosting(false);
    }
  };

  const generateAIContent = async () => {
    if (!selectedProduct) return;

    try {
      const product = products.find(p => p.id === selectedProduct);
      const response = await fetch('/api/ai/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'social-post',
          product,
          platform: selectedPlatform,
          tone: 'exciting',
        }),
      });

      const data = await response.json();
      setPostContent(data.content);
    } catch (error) {
      console.error('Failed to generate content:', error);
    }
  };

  const getPlatformIcon = (provider: string) => {
    const icons: Record<string, any> = {
      google: Globe,
    };
    const Icon = icons[provider] || Globe;
    return <Icon className="h-5 w-5" />;
  };

  const getPlatformColor = (provider: string) => {
    const colors: Record<string, string> = {
      google: 'bg-red-500',
    };
    return colors[provider] || 'bg-gray-500';
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" />
              Admin Login Required
            </CardTitle>
            <CardDescription>Please sign in as admin to access social selling features</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = '/auth/signin'} className="w-full">
              Admin Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userRole = session.user?.role;
  if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" />
              Access Denied
            </CardTitle>
            <CardDescription>You need admin privileges to access this page</CardDescription>
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold">Admin Social Selling Dashboard</h1>
        </div>
        <p className="text-gray-600 mb-8">Manage your store's social media accounts and post products across platforms</p>

        <Tabs defaultValue="accounts" className="space-y-6">
          <TabsList>
            <TabsTrigger value="accounts">Connected Accounts</TabsTrigger>
            <TabsTrigger value="post">Post Product</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Posts</TabsTrigger>
          </TabsList>

          <TabsContent value="accounts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Connected Social Accounts</CardTitle>
                <CardDescription>Manage your store's connected platforms for selling</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['google'].map((provider) => {
                    const connected = socialAccounts.find(acc => acc.provider === provider);
                    return (
                      <Card key={provider} className="p-4">
                        <div className="flex flex-col items-center space-y-2">
                          <div className={`p-3 rounded-full ${getPlatformColor(provider)}`}>
                            {getPlatformIcon(provider)}
                          </div>
                          <span className="capitalize font-medium">{provider}</span>
                          {connected ? (
                            <div className="flex items-center text-green-600 text-sm">
                              <Check className="h-4 w-4 mr-1" />
                              Connected
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleConnectPlatform(provider)}
                            >
                              Connect
                            </Button>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>

                {socialAccounts.length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Active Connections</h3>
                    <div className="space-y-2">
                      {socialAccounts.map((account) => (
                        <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded ${getPlatformColor(account.provider)}`}>
                              {getPlatformIcon(account.provider)}
                            </div>
                            <div>
                              <p className="font-medium capitalize">{account.provider}</p>
                              <p className="text-sm text-gray-500">
                                {account.profile?.username || account.providerAccountId}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDisconnectPlatform(account.id)}
                          >
                            Disconnect
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="post" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Post Product to Social Media</CardTitle>
                <CardDescription>Share your store's products across connected platforms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Product</label>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - ${product.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Platform</label>
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Post Content</label>
                  <Textarea
                    placeholder="Write your post content..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    rows={4}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={generateAIContent}
                  >
                    ✨ Generate with AI
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handlePostProduct()}
                    disabled={!selectedProduct || !postContent || isPosting}
                    className="flex-1"
                  >
                    {isPosting ? 'Posting...' : 'Post Now'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handlePostProduct(new Date(Date.now() + 86400000).toISOString())}
                    disabled={!selectedProduct || !postContent || isPosting}
                  >
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Posts</CardTitle>
                <CardDescription>Manage your scheduled social media posts</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">No scheduled posts yet.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
