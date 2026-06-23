'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Target, Users, DollarSign, ArrowRight, CheckCircle, TrendingUp, Clock, Lightbulb } from 'lucide-react';

interface AcquisitionStrategy {
  personas: any[];
  channels: any[];
  recommendedActions: string[];
  budgetAllocation: Record<string, number>;
  expectedResults: {
    totalLeads: number;
    conversionRate: number;
    customerAcquisitionCost: number;
    monthlyRevenue: number;
  };
}

interface LeadCapture {
  strategies: string[];
  conversionOptimizations: string[];
  targetingRecommendations: string[];
}

interface Retargeting {
  audiences: string[];
  messaging: string[];
  timing: string[];
  channels: string[];
}

export default function AICustomerTargetingDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [strategy, setStrategy] = useState<AcquisitionStrategy | null>(null);
  const [leadCapture, setLeadCapture] = useState<LeadCapture | null>(null);
  const [retargeting, setRetargeting] = useState<Retargeting | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [habitats, setHabitats] = useState<any>(null);
  const [bestChannels, setBestChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      const userRole = session.user?.role;
      if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
        router.push('/');
        return;
      }
      
      fetchCustomerStrategy();
    }
  }, [session, router]);

  const fetchCustomerStrategy = async () => {
    try {
      const response = await fetch('/api/ai/customer-finder');
      const data = await response.json();
      setStrategy(data.strategy);
      setLeadCapture(data.leadCapture);
      setRetargeting(data.retargeting);
      
      // Select first persona by default
      if (data.strategy.personas.length > 0) {
        setSelectedPersona(data.strategy.personas[0].id);
        fetchPersonaDetails(data.strategy.personas[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch customer strategy:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPersonaDetails = async (personaId: string) => {
    try {
      const response = await fetch('/api/ai/customer-finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personaId }),
      });
      const data = await response.json();
      setHabitats(data.habitats);
      setBestChannels(data.bestChannels);
    } catch (error) {
      console.error('Failed to fetch persona details:', error);
    }
  };

  const handlePersonaSelect = (personaId: string) => {
    setSelectedPersona(personaId);
    fetchPersonaDetails(personaId);
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
            <CardDescription>Please sign in as admin to access AI customer finder</CardDescription>
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
              <Target className="h-8 w-8 mx-auto mb-4 animate-spin text-blue-500" />
              <p>Analyzing customer data...</p>
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
            <Target className="h-6 w-6 text-green-600" />
            <h1 className="text-3xl font-bold">AI Customer Finder</h1>
          </div>
          <Button onClick={fetchCustomerStrategy} variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            Refresh Analysis
          </Button>
        </div>

        {/* Expected Results */}
        {strategy && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Expected Leads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">
                  {strategy.expectedResults.totalLeads.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Monthly leads from $1000 budget</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Conversion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  {(strategy.expectedResults.conversionRate * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500">Expected conversion</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-yellow-500" />
                  CAC
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-yellow-600">
                  ${strategy.expectedResults.customerAcquisitionCost.toFixed(0)}
                </p>
                <p className="text-sm text-gray-500">Cost per customer</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-purple-500" />
                  Monthly Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-600">
                  ${strategy.expectedResults.monthlyRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Expected monthly revenue</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Customer Personas */}
        {strategy && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Customer Personas</CardTitle>
                <CardDescription>
                  AI-identified target customer segments for your products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {strategy.personas.map((persona: any) => (
                    <Card 
                      key={persona.id} 
                      className={`cursor-pointer border-2 transition-colors ${
                        selectedPersona === persona.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => handlePersonaSelect(persona.id)}
                    >
                      <CardContent className="pt-6">
                        <h3 className="font-semibold mb-2">{persona.name}</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p><strong>Age:</strong> {persona.demographics.ageRange}</p>
                          <p><strong>Income:</strong> {persona.demographics.income}</p>
                          <p><strong>LTV:</strong> ${persona.estimatedLifetimeValue}</p>
                          <p><strong>CAC:</strong> ${persona.acquisitionCost}</p>
                          <div className="mt-2">
                            <p className="font-medium text-gray-900">Interests:</p>
                            <div className="flex flex-wrap gap-1">
                              {persona.interests.slice(0, 4).map((interest: string, i: number) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Persona Details */}
        {selectedPersona && habitats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Where They Hang Out</CardTitle>
                <CardDescription>
                  Platforms, communities, and timing for this customer segment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    Preferred Platforms
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {habitats.platforms.map((platform: string, i: number) => (
                      <Badge key={i} variant="secondary">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-500" />
                    Communities & Groups
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {habitats.communities.map((community: string, i: number) => (
                      <li key={i}>• {community}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-500" />
                    Peak Activity Times
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {habitats.times.map((time: string, i: number) => (
                      <Badge key={i} variant="outline">
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Strategy</h4>
                  <p className="text-sm text-gray-600">{habitats.strategy}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Best Acquisition Channels</CardTitle>
                <CardDescription>
                  Ranked channels for reaching this customer segment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bestChannels.map((channel: any, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{channel.name}</p>
                        <p className="text-sm text-gray-600">
                          CAC: ${channel.costPerAcquisition} | Conv: {(channel.conversionRate * 100).toFixed(1)}%
                        </p>
                      </div>
                      <Badge variant={channel.trending ? 'default' : 'secondary'}>
                        {channel.trending ? 'Trending' : 'Steady'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Budget Allocation */}
        {strategy && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Budget Allocation</CardTitle>
                <CardDescription>
                  AI-optimized budget distribution across acquisition channels (Based on $1,000 monthly budget)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(strategy.budgetAllocation).map(([channel, amount], index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{channel}</span>
                          <span className="text-sm text-gray-500">${amount}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div className={`bg-blue-600 h-2 rounded-full transition-all bar-${Math.round(amount / 5) * 5}`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Lead Capture Strategies */}
        {leadCapture && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Lead Capture Strategies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {leadCapture.strategies.map((strategy: string, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                      {strategy}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Optimizations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {leadCapture.conversionOptimizations.map((opt: string, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      {opt}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Retargeting Strategy */}
        {retargeting && (
          <Card>
            <CardHeader>
              <CardTitle>Retargeting Strategy</CardTitle>
              <CardDescription>
                Automated strategies to bring back lost customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Target Audiences</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {retargeting.audiences.map((audience: string, i: number) => (
                      <li key={i}>• {audience}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Messaging</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {retargeting.messaging.map((msg: string, i: number) => (
                      <li key={i}>• {msg}</li>
                    ))}
                  </ul>
                </div>

                <div className="md:col-span-2">
                  <h4 className="font-semibold mb-2">Optimal Timing</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {retargeting.timing.map((time: string, i: number) => (
                      <li key={i}>• {time}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}