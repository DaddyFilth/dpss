'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Zap, Users, TrendingUp, Calendar, Play, Pause, RefreshCw, Target, Mail, Share2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export default function AutomationDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [schedulerRunning, setSchedulerRunning] = useState(false);

  useEffect(() => {
    if (session) {
      const userRole = (session.user as any)?.role;
      if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
        router.push('/');
        return;
      }
      
      fetchAutomationData();
    }
  }, [session, router]);

  const fetchAutomationData = async () => {
    try {
      const response = await fetch('/api/automation');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch automation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLeadCapture = async (id: string, active: boolean) => {
    try {
      await fetch('/api/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle-automation', type: 'capture', id, active }),
      });
      fetchAutomationData();
    } catch (error) {
      console.error('Failed to toggle automation:', error);
    }
  };

  const toggleEmailAutomation = async (id: string, active: boolean) => {
    try {
      await fetch('/api/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle-automation', type: 'email', id, active }),
      });
      fetchAutomationData();
    } catch (error) {
      console.error('Failed to toggle email automation:', error);
    }
  };

  const toggleSocialAutomation = async (id: string, active: boolean) => {
    try {
      await fetch('/api/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle-automation', type: 'social', id, active }),
      });
      fetchAutomationData();
    } catch (error) {
      console.error('Failed to toggle social automation:', error);
    }
  };

  const toggleSchedulerTask = async (taskId: string, active: boolean) => {
    try {
      await fetch('/api/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle-scheduler-task', taskId, active }),
      });
      fetchAutomationData();
    } catch (error) {
      console.error('Failed to toggle scheduler task:', error);
    }
  };

  const triggerTask = async (taskId: string) => {
    try {
      await fetch('/api/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'trigger-task', taskId }),
      });
      alert('Task triggered successfully');
      fetchAutomationData();
    } catch (error) {
      console.error('Failed to trigger task:', error);
      alert('Failed to trigger task');
    }
  };

  const toggleScheduler = async (running: boolean) => {
    try {
      await fetch('/api/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: running ? 'start-scheduler' : 'stop-scheduler' }),
      });
      setSchedulerRunning(running);
      fetchAutomationData();
    } catch (error) {
      console.error('Failed to toggle scheduler:', error);
      alert('Failed to toggle scheduler');
    }
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
            <CardDescription>Please sign in as admin to access automation dashboard</CardDescription>
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

  const userRole = (session.user as any)?.role;
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
              <Zap className="h-8 w-8 mx-auto mb-4 animate-spin text-blue-500" />
              <p>Loading automation data...</p>
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
            <Zap className="h-6 w-6 text-yellow-500" />
            <h1 className="text-3xl font-bold">Automation Center</h1>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchAutomationData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button 
              onClick={() => toggleScheduler(!schedulerRunning)}
              variant={schedulerRunning ? 'destructive' : 'default'}
            >
              {schedulerRunning ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Stop Scheduler
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Scheduler
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Total Leads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">
                  {data.leadStats?.total || 0}
                </p>
                <p className="text-sm text-gray-500">Captured automatically</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-purple-500" />
                  Social Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-600">
                  {data.socialStats?.totalPosts || 0}
                </p>
                <p className="text-sm text-gray-500">Auto-generated & posted</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5 text-green-500" />
                  Emails Sent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  {data.automationStats?.emailSent || 0}
                </p>
                <p className="text-sm text-gray-500">Automated sequences</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-yellow-500" />
                  Active Automations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-yellow-600">
                  {data.leadCaptures?.filter((c: any) => c.active).length || 0} + 
                  {data.automations?.filter((a: any) => a.active).length || 0}
                </p>
                <p className="text-sm text-gray-500">Running on autopilot</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Lead Capture Automations */}
        {data?.leadCaptures && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                Lead Capture Automations
              </CardTitle>
              <CardDescription>
                Popups and forms that automatically capture leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.leadCaptures.map((capture: any) => (
                  <div key={capture.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{capture.name}</h3>
                      <p className="text-sm text-gray-600">
                        {capture.type} • {capture.offer.type}: {capture.offer.value}
                      </p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span>Views: {capture.stats.views}</span>
                        <span>Captures: {capture.stats.captures}</span>
                        <span>Conversion: {(capture.stats.conversionRate * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                    <Switch
                      checked={capture.active}
                      onCheckedChange={(checked) => toggleLeadCapture(capture.id, checked)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Email Automations */}
        {data?.emailAutomations && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-green-500" />
                Email Automations
              </CardTitle>
              <CardDescription>
                Automated email sequences that nurture leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.emailAutomations.map((automation: any) => (
                  <div key={automation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{automation.name}</h3>
                      <p className="text-sm text-gray-600">
                        Trigger: {automation.trigger} • {automation.sequence.length} emails
                      </p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span>Sent: {automation.stats.sent}</span>
                        <span>Opened: {automation.stats.opened}</span>
                        <span>Clicked: {automation.stats.clicked}</span>
                        <span>Converted: {automation.stats.converted}</span>
                      </div>
                    </div>
                    <Switch
                      checked={automation.active}
                      onCheckedChange={(checked) => toggleEmailAutomation(automation.id, checked)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Social Media Automations */}
        {data?.automations && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-purple-500" />
                Social Media Automations
              </CardTitle>
              <CardDescription>
                Auto-generated content posted to social media at optimal times
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.automations.map((automation: any) => (
                  <div key={automation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{automation.name}</h3>
                      <p className="text-sm text-gray-600">
                        {automation.platform} • {automation.frequency} • {automation.targetPersona}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Times: {automation.postingTimes.join(', ')}
                      </p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span>Posts: {automation.stats.posts}</span>
                        <span>Avg Engagement: {automation.stats.avgEngagement.toFixed(0)}</span>
                      </div>
                    </div>
                    <Switch
                      checked={automation.active}
                      onCheckedChange={(checked) => toggleSocialAutomation(automation.id, checked)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scheduler Tasks */}
        {data?.schedulerTasks && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-500" />
                Scheduled Tasks
              </CardTitle>
              <CardDescription>
                Automated tasks that run on a schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.schedulerTasks.map((task: any) => (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{task.name}</h3>
                      <p className="text-sm text-gray-600">
                        Schedule: {task.schedule} • Type: {task.type}
                      </p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span>Runs: {task.stats.runs}</span>
                        <span>Successes: {task.stats.successes}</span>
                        <span>Failures: {task.stats.failures}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={task.active}
                        onCheckedChange={(checked) => toggleSchedulerTask(task.id, checked)}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => triggerTask(task.id)}
                      >
                        Run Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}