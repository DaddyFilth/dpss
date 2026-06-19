// Automation Scheduler - Runs all automations on autopilot
import { automatedLeadGeneration } from './lead-generation';
import { automatedSocialMedia } from './social-media';

interface AutomationTask {
  id: string;
  name: string;
  type: 'lead-capture' | 'email-automation' | 'social-post' | 'lead-segmentation';
  schedule: string; // cron expression
  lastRun?: Date;
  nextRun?: Date;
  active: boolean;
  stats: {
    runs: number;
    successes: number;
    failures: number;
  };
}

class AutomationScheduler {
  private tasks: AutomationTask[] = [];
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeTasks();
  }

  // Initialize automation tasks
  private initializeTasks() {
    this.tasks = [
      {
        id: 'social-tiktok-home-decor',
        name: 'TikTok Home Decor Posts',
        type: 'social-post',
        schedule: '0 19 * * *', // 7 PM daily
        active: true,
        stats: { runs: 0, successes: 0, failures: 0 }
      },
      {
        id: 'social-tiktok-beauty',
        name: 'TikTok Beauty Posts',
        type: 'social-post',
        schedule: '0 22 * * *', // 10 PM daily
        active: true,
        stats: { runs: 0, successes: 0, failures: 0 }
      },
      {
        id: 'social-instagram-home-decor',
        name: 'Instagram Home Decor Posts',
        type: 'social-post',
        schedule: '0 19 * * *', // 7 PM 3x weekly (handled in logic)
        active: true,
        stats: { runs: 0, successes: 0, failures: 0 }
      },
      {
        id: 'social-pinterest-home-decor',
        name: 'Pinterest Home Decor Posts',
        type: 'social-post',
        schedule: '0 */4 * * *', // Every 4 hours
        active: true,
        stats: { runs: 0, successes: 0, failures: 0 }
      },
      {
        id: 'lead-segmentation',
        name: 'Lead Segmentation',
        type: 'lead-segmentation',
        schedule: '0 0 * * *', // Daily at midnight
        active: true,
        stats: { runs: 0, successes: 0, failures: 0 }
      }
    ];
  }

  // Start the scheduler
  start(): void {
    console.log('Starting automation scheduler...');
    
    // Run every minute to check for tasks
    this.intervalId = setInterval(() => {
      this.checkAndRunTasks();
    }, 60000); // Check every minute

    console.log('Automation scheduler started');
  }

  // Stop the scheduler
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Automation scheduler stopped');
    }
  }

  // Check and run tasks based on schedule
  private async checkAndRunTasks(): Promise<void> {
    const now = new Date();
    
    for (const task of this.tasks) {
      if (!task.active) continue;

      // Check if it's time to run
      if (this.shouldRunTask(task, now)) {
        await this.runTask(task);
      }
    }
  }

  // Determine if task should run
  private shouldRunTask(task: AutomationTask, now: Date): boolean {
    if (!task.nextRun) return true; // Run if never run
    
    // Simple check: if current time >= next run time
    // In production, use proper cron parser
    const timeDiff = now.getTime() - task.nextRun.getTime();
    return timeDiff >= 0;
  }

  // Run a task
  private async runTask(task: AutomationTask): Promise<void> {
    console.log(`Running task: ${task.name}`);
    task.stats.runs++;

    try {
      switch (task.type) {
        case 'social-post':
          await this.runSocialPostTask(task);
          break;
        case 'lead-segmentation':
          await this.runLeadSegmentationTask(task);
          break;
        default:
          console.log(`Task type ${task.type} not implemented`);
      }

      task.stats.successes++;
      task.lastRun = new Date();
      
      // Calculate next run time (simplified - in production use proper cron)
      this.calculateNextRun(task);
      
      console.log(`Task ${task.name} completed successfully`);
    } catch (error) {
      task.stats.failures++;
      console.error(`Task ${task.name} failed:`, error);
    }
  }

  // Run social media posting task
  private async runSocialPostTask(task: AutomationTask): Promise<void> {
    // Map task to automation ID
    const automationMap: Record<string, string> = {
      'social-tiktok-home-decor': 'tiktok-home-decor-daily',
      'social-tiktok-beauty': 'tiktok-beauty-daily',
      'social-instagram-home-decor': 'instagram-home-decor-3x-weekly',
      'social-pinterest-home-decor': 'pinterest-home-decor-daily'
    };

    const automationId = automationMap[task.id];
    if (!automationId) return;

    await automatedSocialMedia.runAutomation(automationId);
  }

  // Run lead segmentation task
  private async runLeadSegmentationTask(task: AutomationTask): Promise<void> {
    // Segment leads based on behavior and engagement
    const leads = automatedLeadGeneration.getLeads();
    
    // In production, implement sophisticated segmentation logic
    console.log(`Segmenting ${leads.length} leads...`);
  }

  // Calculate next run time (simplified)
  private calculateNextRun(task: AutomationTask): void {
    const now = new Date();
    const nextRun = new Date(now);
    
    // Add 24 hours for daily tasks (simplified)
    nextRun.setHours(nextRun.getHours() + 24);
    task.nextRun = nextRun;
  }

  // Manually trigger a task
  async triggerTask(taskId: string): Promise<void> {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    await this.runTask(task);
  }

  // Get all tasks
  getTasks(): AutomationTask[] {
    return this.tasks;
  }

  // Get task by ID
  getTask(taskId: string): AutomationTask | undefined {
    return this.tasks.find(t => t.id === taskId);
  }

  // Toggle task
  toggleTask(taskId: string, active: boolean): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) task.active = active;
  }

  // Get overall stats
  getStats(): {
    totalTasks: number;
    activeTasks: number;
    totalRuns: number;
    successes: number;
    failures: number;
    successRate: number;
  } {
    const totalRuns = this.tasks.reduce((sum, t) => sum + t.stats.runs, 0);
    const successes = this.tasks.reduce((sum, t) => sum + t.stats.successes, 0);
    const failures = this.tasks.reduce((sum, t) => sum + t.stats.failures, 0);

    return {
      totalTasks: this.tasks.length,
      activeTasks: this.tasks.filter(t => t.active).length,
      totalRuns,
      successes,
      failures,
      successRate: totalRuns > 0 ? successes / totalRuns : 0
    };
  }
}

// Singleton instance
let schedulerInstance: AutomationScheduler | null = null;

export function getAutomationScheduler(): AutomationScheduler {
  if (!schedulerInstance) {
    schedulerInstance = new AutomationScheduler();
  }
  return schedulerInstance;
}

// Start scheduler on module import (in development)
if (process.env.NODE_ENV === 'development') {
  // Uncomment to auto-start in development
  // getAutomationScheduler().start();
}