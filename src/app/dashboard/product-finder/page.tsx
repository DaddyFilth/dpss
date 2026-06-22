'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, TrendingUp, DollarSign, AlertTriangle, CheckCircle, Sparkles, BarChart3 } from 'lucide-react';

interface BuyingOpportunity {
  product: any;
  profitMargin: number;
  marketDemand: number;
  competitionLevel: number;
  recommendedAction: 'add-to-store' | 'price-adjustment' | 'skip' | 'investigate';
  confidenceScore: number;
  reasoning: string[];
  suggestedPrice: number;
  estimatedMonthlySales: number;
  estimatedMonthlyProfit: number;
}

interface MarketInsights {
  trendingCategories: string[];
  emergingTrends: string[];
  highMarginOpportunities: string[];
}

export default function AIProductFinderDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<BuyingOpportunity[]>([]);
  const [insights, setInsights] = useState<MarketInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      const userRole = session.user?.role;
      if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
        router.push('/');
        return;
      }
      
      fetchBuyingOpportunities();
    }
  }, [session, router]);

  const fetchBuyingOpportunities = async () => {
    try {
      const response = await fetch('/api/ai/product-finder');
      const data = await response.json();
      setOpportunities(data.opportunities || []);
      setInsights(data.insights || null);
    } catch (error) {
      console.error('Failed to fetch buying opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action: BuyingOpportunity['recommendedAction']) => {
    const variants = {
      'add-to-store': 'bg-green-500',
      'price-adjustment': 'bg-yellow-500',
      'investigate': 'bg-blue-500',
      'skip': 'bg-gray-500'
    };
    
    const labels = {
      'add-to-store': 'Add to Store',
      'price-adjustment': 'Adjust Price',
      'investigate': 'Investigate',
      'skip': 'Skip'
    };

    return (
      <Badge className={variants[action]}>
        {labels[action]}
      </Badge>
    );
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
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
            <CardDescription>Please sign in as admin to access AI product finder</CardDescription>
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Sparkles className="h-8 w-8 mx-auto mb-4 animate-spin text-blue-500" />
              <p>Analyzing market trends...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <h1 className="text-3xl font-bold">AI Product Finder</h1>
          </div>
          <Button onClick={fetchBuyingOpportunities} variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Refresh Analysis
          </Button>
        </div>

        {/* Market Insights */}
        {insights && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Trending Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {insights.trendingCategories.map((cat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{cat}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  Emerging Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {insights.emergingTrends.map((trend, i) => (
                    <li key={i} className="text-sm text-gray-600">
                      • {trend}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-yellow-500" />
                  High Margin Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {insights.highMarginOpportunities.map((opp, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">{opp}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Buying Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Top Buying Opportunities</CardTitle>
            <CardDescription>
              AI-identified products with highest potential for sales and profit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {opportunities.map((opp, index) => (
                <Card key={opp.product.id} className="border-2 border-purple-100 hover:border-purple-300 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{opp.product.name}</h3>
                          {getActionBadge(opp.recommendedAction)}
                          <Badge variant="outline">
                            #{index + 1}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{opp.product.category}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500">Confidence</p>
                            <p className={`font-semibold ${getConfidenceColor(opp.confidenceScore)}`}>
                              {(opp.confidenceScore * 100).toFixed(0)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Profit Margin</p>
                            <p className="font-semibold text-green-600">
                              {(opp.profitMargin * 100).toFixed(0)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Est. Monthly Sales</p>
                            <p className="font-semibold">{opp.estimatedMonthlySales}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Est. Monthly Profit</p>
                            <p className="font-semibold text-blue-600">
                              ${opp.estimatedMonthlyProfit.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2">AI Reasoning:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {opp.reasoning.map((reason, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {opp.recommendedAction === 'price-adjustment' && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                            <div className="flex items-center gap-2 text-yellow-700">
                              <AlertTriangle className="h-4 w-4" />
                              <span className="font-medium">Price Adjustment Recommended</span>
                            </div>
                            <p className="text-sm text-yellow-600 mt-1">
                              Current: ${opp.product.price.toFixed(2)} → Suggested: ${opp.suggestedPrice.toFixed(2)}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="ml-4">
                        <img
                          src={opp.product.image}
                          alt={opp.product.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        size="sm"
                        onClick={() => window.location.href = `/products/${opp.product.id}`}
                        className="flex-1"
                      >
                        View Product
                      </Button>
                      {opp.recommendedAction === 'add-to-store' && (
                        <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Prioritize
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {opportunities.length === 0 && (
              <div className="text-center py-12">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Buying Opportunities Found</h3>
                <p className="text-sm text-gray-500">
                  The AI analysis didn't identify any strong buying opportunities in the current product catalog.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}