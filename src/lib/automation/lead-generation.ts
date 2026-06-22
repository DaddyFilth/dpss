import logger from '@/lib/logger';
// Automated Lead Generation System
// Automatically captures, nurtures, and qualifies leads

interface Lead {
  id: string;
  email: string;
  source: string;
  persona?: string;
  capturedAt: Date;
  engagementScore: number;
  lastEngagement: Date;
  status: 'new' | 'engaged' | 'qualified' | 'converted' | 'lost';
  behaviors: string[];
  preferredChannel: string;
  segments: string[];
}

interface LeadCaptureAutomation {
  id: string;
  name: string;
  type: 'popup' | 'inline' | 'exit-intent' | 'scroll-triggered' | 'time-delayed';
  trigger: any;
  targetAudience: string[];
  offer: {
    type: string;
    value: string;
    description: string;
  };
  landingPage?: string;
  active: boolean;
  stats: {
    views: number;
    captures: number;
    conversionRate: number;
  };
}

interface EmailAutomation {
  id: string;
  name: string;
  trigger: 'lead-captured' | 'cart-abandoned' | 'product-viewed' | 'purchase' | 'time-based';
  triggerDelay?: number; // hours
  sequence: EmailStep[];
  targetPersona?: string;
  active: boolean;
  stats: {
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
  };
}

interface EmailStep {
  subject: string;
  content: string;
  delay: number; // hours from trigger
  cta?: string;
}

class AutomatedLeadGeneration {
  private leads: Lead[] = [];
  private leadCaptures: LeadCaptureAutomation[] = [];
  private emailAutomations: EmailAutomation[] = [];

  constructor() {
    this.initializeLeadCaptures();
    this.initializeEmailAutomations();
  }

  // Initialize automated lead capture mechanisms
  private initializeLeadCaptures() {
    this.leadCaptures = [
      {
        id: 'homepage-popup-discount',
        name: 'Homepage Popup - 10% Discount',
        type: 'popup',
        trigger: { delay: 30000 }, // 30 seconds
        targetAudience: ['trendy_home_decor_enthusiast', 'budget_conscious_parent'],
        offer: {
          type: 'discount',
          value: '10%',
          description: 'Get 10% off your first order'
        },
        active: true,
        stats: { views: 0, captures: 0, conversionRate: 0 }
      },
      {
        id: 'product-page-popup-guide',
        name: 'Product Page Popup - Free Guide',
        type: 'popup',
        trigger: { delay: 15000 }, // 15 seconds
        targetAudience: ['tech_early_adopter', 'fitness_enthusiast'],
        offer: {
          type: 'content',
          value: 'Free Guide',
          description: 'Get our Ultimate Product Guide'
        },
        active: true,
        stats: { views: 0, captures: 0, conversionRate: 0 }
      },
      {
        id: 'exit-intent-popup',
        name: 'Exit Intent Popup - Special Offer',
        type: 'exit-intent',
        trigger: { mouseLeave: true },
        targetAudience: ['All'],
        offer: {
          type: 'discount',
          value: '15%',
          description: 'Wait! Get 15% off before you leave'
        },
        active: true,
        stats: { views: 0, captures: 0, conversionRate: 0 }
      },
      {
        id: 'scroll-triggered-capture',
        name: 'Scroll Triggered - Aesthetic Tips',
        type: 'scroll-triggered',
        trigger: { scrollPercentage: 50 },
        targetAudience: ['trendy_home_decor_enthusiast', 'beauty_enthusiast'],
        offer: {
          type: 'content',
          value: 'Aesthetic Tips',
          description: 'Get 7 Aesthetic Room Design Tips'
        },
        active: true,
        stats: { views: 0, captures: 0, conversionRate: 0 }
      },
      {
        id: 'inline-instagram-cta',
        name: 'Instagram Inline CTA',
        type: 'inline',
        trigger: { position: 'bottom' },
        targetAudience: ['All'],
        offer: {
          type: 'follow',
          value: 'Instagram',
          description: 'Follow us for exclusive deals'
        },
        active: true,
        stats: { views: 0, captures: 0, conversionRate: 0 }
      }
    ];
  }

  // Initialize email automation sequences
  private initializeEmailAutomations() {
    this.emailAutomations = [
      {
        id: 'welcome-sequence',
        name: 'Welcome Email Sequence',
        trigger: 'lead-captured',
        sequence: [
          {
            subject: 'Welcome! Here\'s Your 10% Off Code',
            content: 'Thanks for joining! Your exclusive 10% discount code: WELCOME10. Explore our viral products like Sunset Lamps and Ice Rollers.',
            delay: 0,
            cta: 'Shop Now'
          },
          {
            subject: 'Trending Products You\'ll Love',
            content: 'Discover our most popular items: Sunset Projection Lamp, Mushroom Night Light, and Ice Roller. All trending on TikTok!',
            delay: 24,
            cta: 'Shop Trending'
          },
          {
            subject: 'Did You See This?',
            content: 'Our Aesthetic Home Decor collection is flying off the shelves! Transform your space with viral aesthetic lighting.',
            delay: 72,
            cta: 'Shop Decor'
          },
          {
            subject: 'Last Chance - 5 Days Left',
            content: 'Your welcome discount expires in 5 days. Use WELCOME10 before it\'s gone!',
            delay: 120, // 5 days
            cta: 'Use Discount Now'
          },
          {
            subject: 'New Arrivals Just In',
            content: 'Check out our latest additions! AI Smart Mirrors, Biometric Smart Locks, and more trending products.',
            delay: 168, // 7 days
            cta: 'Shop New Arrivals'
          }
        ],
        targetPersona: undefined,
        active: true,
        stats: { sent: 0, opened: 0, clicked: 0, converted: 0 }
      },
      {
        id: 'cart-abandonment-sequence',
        name: 'Cart Abandonment Sequence',
        trigger: 'cart-abandoned',
        triggerDelay: 1, // 1 hour
        sequence: [
          {
            subject: 'You Left Something Behind! 🔥',
            content: 'Items in your cart are reserved but won\'t last long. Complete your order now!',
            delay: 0,
            cta: 'Complete Order'
          },
          {
            subject: 'Still Thinking? Here\'s 5% Extra',
            content: 'Here\'s an extra 5% off to help you decide: CART5. Complete your purchase now.',
            delay: 24,
            cta: 'Apply Discount'
          },
          {
            subject: 'Your Cart is About to Expire',
            content: 'Reserved items will be released in 24 hours. Complete your order before they\'re gone!',
            delay: 48,
            cta: 'Complete Order Now'
          }
        ],
        targetPersona: undefined,
        active: true,
        stats: { sent: 0, opened: 0, clicked: 0, converted: 0 }
      },
      {
        id: 'product-viewed-sequence',
        name: 'Product Viewed Follow-up',
        trigger: 'product-viewed',
        triggerDelay: 24, // 24 hours
        sequence: [
          {
            subject: 'Still Interested in [Product Name]?',
            content: 'You viewed [Product Name]. It\'s still in stock and trending! Here\'s 10% off if you\'re ready to buy: VIEWED10',
            delay: 0,
            cta: 'Shop Now'
          },
          {
            subject: 'Similar Products You Might Like',
            content: 'Based on your interest in [Product Name], you might also love these trending items: [Related Products]',
            delay: 72,
            cta: 'Browse Related'
          }
        ],
        targetPersona: undefined,
        active: true,
        stats: { sent: 0, opened: 0, clicked: 0, converted: 0 }
      },
      {
        id: 'persona-home-decor',
        name: 'Home Decor Persona Nurture',
        trigger: 'lead-captured',
        sequence: [
          {
            subject: 'Transform Your Space with Aesthetic Vibes',
            content: 'As a home decor enthusiast, you\'ll love our viral aesthetic lighting. Check out Sunset Lamp and Mushroom Light!',
            delay: 0,
            cta: 'Shop Aesthetic Decor'
          },
          {
            subject: '5 Aesthetic Room Makeover Tips',
            content: '1. Start with lighting 2. Add texture 3. Choose a color palette 4. Add greenery 5. Personal touches. Shop our aesthetic collection!',
            delay: 48,
            cta: 'Shop Decor'
          },
          {
            subject: 'Pinterest Inspiration Just for You',
            content: 'We curated aesthetic pins just for you! Follow our Pinterest for daily inspiration and exclusive deals.',
            delay: 96,
            cta: 'Follow on Pinterest'
          }
        ],
        targetPersona: 'trendy_home_decor_enthusiast',
        active: true,
        stats: { sent: 0, opened: 0, clicked: 0, converted: 0 }
      },
      {
        id: 'persona-beauty',
        name: 'Beauty Persona Nurture',
        trigger: 'lead-captured',
        sequence: [
          {
            subject: 'Skincare Secrets Revealed 🌟',
            content: 'Discover viral skincare products everyone is talking about: Ice Roller, LED Teeth Whitening, Silk Pillowcase.',
            delay: 0,
            cta: 'Shop Beauty'
          },
          {
            subject: 'Your Skincare Routine Upgrade',
            content: 'Trending products to upgrade your routine: Ice Roller for de-puffing, Silk Pillowcase for anti-aging.',
            delay: 48,
            cta: 'Shop Now'
          },
          {
            subject: 'TikTok Beauty Tips',
            content: 'Follow us on TikTok for daily beauty hacks, product demos, and trending skincare tips!',
            delay: 96,
            cta: 'Follow on TikTok'
          }
        ],
        targetPersona: 'beauty_enthusiast',
        active: true,
        stats: { sent: 0, opened: 0, clicked: 0, converted: 0 }
      },
      {
        id: 'reengagement-sequence',
        name: 'Re-engagement Sequence',
        trigger: 'time-based',
        triggerDelay: 720, // 30 days since last engagement
        sequence: [
          {
            subject: 'We Miss You! Here\'s 20% Off',
            content: 'It\'s been a while! Here\'s 20% off to welcome you back: COMEBACK20. Check out our new arrivals.',
            delay: 0,
            cta: 'Shop Now with 20% Off'
          },
          {
            subject: 'What\'s New Since You Left?',
            content: 'We\'ve added AI Smart Mirrors, Biometric Smart Locks, and more trending products. See what\'s new!',
            delay: 72,
            cta: 'Browse New Arrivals'
          }
        ],
        targetPersona: undefined,
        active: true,
        stats: { sent: 0, opened: 0, clicked: 0, converted: 0 }
      }
    ];
  }

  // Capture lead automatically
  async captureLead(email: string, source: string, persona?: string): Promise<Lead> {
    const lead: Lead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      source,
      persona,
      capturedAt: new Date(),
      engagementScore: 10, // Initial score
      lastEngagement: new Date(),
      status: 'new',
      behaviors: ['email-captured'],
      preferredChannel: this.determinePreferredChannel(persona),
      segments: this.segmentLead(persona)
    };

    this.leads.push(lead);

    // Trigger welcome automation
    this.triggerEmailAutomation(lead, 'lead-captured');

    return lead;
  }

  // Determine preferred channel based on persona
  private determinePreferredChannel(persona?: string): string {
    const channels: Record<string, string> = {
      'trendy_home_decor_enthusiast': 'email',
      'tech_early_adopter': 'email',
      'budget_conscious_parent': 'email',
      'beauty_enthusiast': 'email',
      'pet_lover': 'email',
      'fitness_enthusiast': 'email'
    };
    return persona ? channels[persona] || 'email' : 'email';
  }

  // Segment lead based on persona
  private segmentLead(persona?: string): string[] {
    const segments = ['all-leads'];
    if (persona) segments.push(persona);
    return segments;
  }

  // Trigger email automation
  async triggerEmailAutomation(lead: Lead, trigger: EmailAutomation['trigger']): Promise<void> {
    const automation = this.emailAutomations.find(
      a => a.trigger === trigger && 
      (a.targetPersona === undefined || a.targetPersona === lead.persona) &&
      a.active
    );

    if (!automation) return;

    automation.stats.sent++;

    for (const step of automation.sequence) {
      // Schedule email
      setTimeout(() => {
        this.sendEmail(lead, step);
      }, step.delay * 60 * 60 * 1000); // Convert hours to ms
    }
  }

  // Send email (simulated)
  private async sendEmail(lead: Lead, step: EmailStep): Promise<void> {
    logger.info(`Sending email to ${lead.email}: ${step.subject}`);
    // In production, integrate with email service (SendGrid, Mailchimp, etc.)
    
    // Update lead engagement
    lead.lastEngagement = new Date();
    lead.engagementScore += 5;
    lead.behaviors.push('email-sent');
  }

  // Get lead capture automations
  getLeadCaptures(): LeadCaptureAutomation[] {
    return this.leadCaptures;
  }

  // Get email automations
  getEmailAutomations(): EmailAutomation[] {
    return this.emailAutomations;
  }

  // Get all leads
  getLeads(): Lead[] {
    return this.leads;
  }

  // Get leads by persona
  getLeadsByPersona(persona: string): Lead[] {
    return this.leads.filter(l => l.persona === persona);
  }

  // Get lead stats
  getLeadStats(): {
    total: number;
    byStatus: Record<string, number>;
    bySource: Record<string, number>;
    byPersona: Record<string, number>;
    averageEngagementScore: number;
  } {
    return {
      total: this.leads.length,
      byStatus: this.leads.reduce((acc, l) => {
        acc[l.status] = (acc[l.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      bySource: this.leads.reduce((acc, l) => {
        acc[l.source] = (acc[l.source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byPersona: this.leads.reduce((acc, l) => {
        if (l.persona) {
          acc[l.persona] = (acc[l.persona] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>),
      averageEngagementScore: this.leads.length > 0 
        ? this.leads.reduce((sum, l) => sum + l.engagementScore, 0) / this.leads.length 
        : 0
    };
  }

  // Toggle automation
  toggleAutomation(type: 'capture' | 'email', id: string, active: boolean): void {
    if (type === 'capture') {
      const capture = this.leadCaptures.find(c => c.id === id);
      if (capture) capture.active = active;
    } else {
      const automation = this.emailAutomations.find(a => a.id === id);
      if (automation) automation.active = active;
    }
  }

  // Get automation stats
  getAutomationStats(): {
    leadCaptureViews: number;
    leadCaptureCaptures: number;
    emailSent: number;
    emailOpened: number;
    emailClicked: number;
    emailConverted: number;
  } {
    return {
      leadCaptureViews: this.leadCaptures.reduce((sum, c) => sum + c.stats.views, 0),
      leadCaptureCaptures: this.leadCaptures.reduce((sum, c) => sum + c.stats.captures, 0),
      emailSent: this.emailAutomations.reduce((sum, e) => sum + e.stats.sent, 0),
      emailOpened: this.emailAutomations.reduce((sum, e) => sum + e.stats.opened, 0),
      emailClicked: this.emailAutomations.reduce((sum, e) => sum + e.stats.clicked, 0),
      emailConverted: this.emailAutomations.reduce((sum, e) => sum + e.stats.converted, 0)
    };
  }
}

export const automatedLeadGeneration = new AutomatedLeadGeneration();