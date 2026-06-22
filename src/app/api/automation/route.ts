import logger from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { automatedLeadGeneration } from '@/lib/automation/lead-generation';
import { automatedSocialMedia } from '@/lib/automation/social-media';
import { getAutomationScheduler } from '@/lib/automation/scheduler';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { getSecurityHeaders } from '@/lib/security/rate-limit';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    const userRole = (session?.user as any)?.role;
    if (!session || (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section') || 'all';

    let data: any = {};

    if (section === 'all' || section === 'leads') {
      data.leadStats = automatedLeadGeneration.getLeadStats();
      data.leads = automatedLeadGeneration.getLeads().slice(0, 50);
      data.leadCaptures = automatedLeadGeneration.getLeadCaptures();
      data.emailAutomations = automatedLeadGeneration.getEmailAutomations();
    }

    if (section === 'all' || section === 'social') {
      data.socialStats = automatedSocialMedia.getStats();
      data.posts = automatedSocialMedia.getPosts().slice(0, 50);
      data.automations = automatedSocialMedia.getAutomations();
    }

    if (section === 'all' || section === 'scheduler') {
      const scheduler = getAutomationScheduler();
      data.schedulerTasks = scheduler.getTasks();
      data.schedulerStats = scheduler.getStats();
    }

    if (section === 'all') {
      data.automationStats = automatedLeadGeneration.getAutomationStats();
    }

    return NextResponse.json(
      data,
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    logger.error({ err: error }, 'Automation API error');
    return NextResponse.json(
      { error: 'Failed to fetch automation data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    const userRole = (session?.user as any)?.role;
    if (!session || (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const body = await request.json();
    const { action, ...params } = body;

    logger.info({ action, params }, 'Automation action');

    let result: any = {};

    switch (action) {
      case 'capture-lead':
        result = await automatedLeadGeneration.captureLead(
          params.email,
          params.source,
          params.persona
        );
        break;

      case 'schedule-post':
        result = await automatedSocialMedia.schedulePost(
          params.platform,
          params.persona,
          new Date(params.scheduledAt),
          params.product
        );
        break;

      case 'post-now':
        result = await automatedSocialMedia.postNow(
          params.platform,
          params.persona,
          params.product
        );
        break;

      case 'toggle-automation':
        if (params.type === 'capture') {
          automatedLeadGeneration.toggleAutomation('capture', params.id, params.active);
        } else if (params.type === 'email') {
          automatedLeadGeneration.toggleAutomation('email', params.id, params.active);
        } else if (params.type === 'social') {
          automatedSocialMedia.toggleAutomation(params.id, params.active);
        }
        result = { success: true, message: `Automation ${params.id} toggled to ${params.active}` };
        break;

      case 'trigger-task':
        const scheduler = getAutomationScheduler();
        await scheduler.triggerTask(params.taskId);
        result = { success: true, message: `Task ${params.taskId} triggered` };
        break;

      case 'toggle-scheduler-task':
        const sched = getAutomationScheduler();
        sched.toggleTask(params.taskId, params.active);
        result = { success: true, message: `Scheduler task ${params.taskId} toggled to ${params.active}` };
        break;

      case 'start-scheduler':
        getAutomationScheduler().start();
        result = { success: true, message: 'Scheduler started' };
        break;

      case 'stop-scheduler':
        getAutomationScheduler().stop();
        result = { success: true, message: 'Scheduler stopped' };
        break;

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400, headers: getSecurityHeaders() }
        );
    }

    return NextResponse.json(
      result,
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    logger.error({ err: error }, 'Automation action error');
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to perform action', details: error instanceof Error ? error.stack : undefined },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}