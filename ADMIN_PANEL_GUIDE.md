# Admin Panel Guide

## Complete Dashboard Navigation and Usage

## 🎯 Overview

The admin panel provides a centralized hub for managing your dropshipping store's AI-powered automation, customer targeting, product analysis, and social media posting. All features are protected with role-based access control (ADMIN or SUPER_ADMIN only).

## 📍 Admin Hub

### Location: `/admin`

The Admin Hub is your central navigation point to all admin dashboards. It provides:

**Quick Dashboard Access:**

1. **Automation Center** - Lead generation, email sequences, social media posting on autopilot
2. **Customer Finder** - AI-powered customer targeting and acquisition strategies
3. **Product Finder** - Identify winning products and buying opportunities
4. **Social Media** - Manage store's social media accounts and post products

**Quick Actions:**

- Start Automations - Jump to automation dashboard
- Connect Social Accounts - Jump to social media dashboard
- Manage Products - Jump to product management

**Access Control:**

- Requires admin login
- Shows user role (ADMIN or SUPER_ADMIN)
- Redirects non-admins to home page

## 🔧 Automation Center Dashboard

### Location: `/dashboard/automation`

### Automation Features

#### 1. Overview Stats

- Total Leads captured automatically
- Social Posts auto-generated and posted
- Emails Sent through automation
- Active Automations count

### 2. Lead Capture Automations

Toggle on/off these automated lead capture mechanisms:

- **Homepage Popup - 10% Discount**
  - Type: Popup
  - Trigger: 30 seconds on page
  - Target: Home decor enthusiasts, Budget parents
  - Offer: 10% off first order
  - Stats: Views, captures, conversion rate
  - Toggle: Enable/disable

- **Product Page Popup - Free Guide**
  - Type: Popup
  - Trigger: 15 seconds on product page
  - Target: Tech early adopters, Fitness enthusiasts
  - Offer: Free Ultimate Product Guide
  - Stats: Views, captures, conversion rate
  - Toggle: Enable/disable

- **Exit Intent Popup - Special Offer**
  - Type: Exit Intent
  - Trigger: Mouse leaves page
  - Target: All visitors
  - Offer: 15% discount before leaving
  - Stats: Views, captures, conversion rate
  - Toggle: Enable/disable

- **Scroll Triggered Capture - Aesthetic Tips**
  - Type: Scroll Triggered
  - Trigger: 50% page scroll
  - Target: Home decor, Beauty enthusiasts
  - Offer: 7 Aesthetic Room Design Tips
  - Stats: Views, captures, conversion rate
  - Toggle: Enable/disable

- **Instagram Inline CTA**
  - Type: Inline
  - Trigger: Bottom of page
  - Target: All visitors
  - Offer: Follow on Instagram
  - Stats: Views, captures, conversion rate
  - Toggle: Enable/disable

### 3. Email Automations

Toggle on/off these email sequences:

- **Welcome Email Sequence**
  - Trigger: Lead captured
  - 5 emails over 7 days
  - Stats: Sent, opened, clicked, converted
  - Toggle: Enable/disable

- **Cart Abandonment Sequence**
  - Trigger: Cart abandoned (1 hour)
  - 3 emails over 48 hours
  - Stats: Sent, opened, clicked, converted
  - Toggle: Enable/disable

- **Product Viewed Follow-up**
  - Trigger: Product viewed (24 hours)
  - 2 emails over 72 hours
  - Stats: Sent, opened, clicked, converted
  - Toggle: Enable/disable

- **Home Decor Persona Nurture**
  - Trigger: Lead captured (home decor persona)
  - 3 emails over 96 hours
  - Stats: Sent, opened, clicked, converted
  - Toggle: Enable/disable

- **Beauty Persona Nurture**
  - Trigger: Lead captured (beauty persona)
  - 3 emails over 96 hours
  - Stats: Sent, opened, clicked, converted
  - Toggle: Enable/disable

- **Re-engagement Sequence**
  - Trigger: 30 days since last engagement
  - 2 emails over 72 hours
  - Stats: Sent, opened, clicked, converted
  - Toggle: Enable/disable

### 4. Social Media Automations

Toggle on/off these content automations:

- **TikTok Home Decor - Daily**
  - Platform: TikTok
  - Target: Home decor enthusiasts
  - Frequency: Daily
  - Times: 7-9 PM
  - Strategy: Viral aesthetic demos, room tours
  - Stats: Posts, avg engagement
  - Toggle: Enable/disable

- **TikTok Beauty - Daily**
  - Platform: TikTok
  - Target: Beauty enthusiasts
  - Frequency: Daily
  - Times: 8 AM, 10 PM
  - Strategy: Skincare routines, demos
  - Stats: Posts, avg engagement
  - Toggle: Enable/disable

- **Instagram Home Decor - 3x Weekly**
  - Platform: Instagram
  - Target: Home decor enthusiasts
  - Frequency: Weekly (3x)
  - Times: 7-9 PM
  - Strategy: Aesthetic photos, carousels
  - Stats: Posts, avg engagement
  - Toggle: Enable/disable

- **Instagram Beauty - 3x Weekly**
  - Platform: Instagram
  - Target: Beauty enthusiasts
  - Frequency: Weekly (3x)
  - Times: 8 AM, 9 PM
  - Strategy: Skincare photos, tutorials
  - Stats: Posts, avg engagement
  - Toggle: Enable/disable

- **Pinterest Home Decor - Daily**
  - Platform: Pinterest
  - Target: Home decor enthusiasts
  - Frequency: Daily
  - Times: 12 PM, 6 PM, 10 PM
  - Strategy: Aesthetic pins, room inspo
  - Stats: Posts, avg engagement
  - Toggle: Enable/disable

- **Facebook Parents - Biweekly**
  - Platform: Facebook
  - Target: Budget-conscious parents
  - Frequency: Biweekly
  - Times: 12 PM, 7 PM
  - Strategy: Deals, family content
  - Stats: Posts, avg engagement
  - Toggle: Enable/disable

- **Twitter Tech - Daily**
  - Platform: Twitter
  - Target: Tech early adopters
  - Frequency: Daily
  - Times: 8 AM, 12 PM, 9 PM
  - Strategy: Tech news, tips, discussions
  - Stats: Posts, avg engagement
  - Toggle: Enable/disable

### 5. Scheduled Tasks

Toggle on/off these scheduled automation tasks:

- **TikTok Home Decor Posts**
  - Schedule: 7 PM daily
  - Type: Social post
  - Stats: Runs, successes, failures
  - Toggle: Enable/disable
  - Button: "Run Now" (manual trigger)

- **TikTok Beauty Posts**
  - Schedule: 10 PM daily
  - Type: Social post
  - Stats: Runs, successes, failures
  - Toggle: Enable/disable
  - Button: "Run Now" (manual trigger)

- **Instagram Home Decor Posts**
  - Schedule: 7 PM (3x weekly)
  - Type: Social post
  - Stats: Runs, successes, failures
  - Toggle: Enable/disable
  - Button: "Run Now" (manual trigger)

- **Pinterest Home Decor Posts**
  - Schedule: Every 4 hours
  - Type: Social post
  - Stats: Runs, successes, failures
  - Toggle: Enable/disable
  - Button: "Run Now" (manual trigger)

- **Daily Lead Segmentation**
  - Schedule: Midnight daily
  - Type: Lead segmentation
  - Stats: Runs, successes, failures
  - Toggle: Enable/disable
  - Button: "Run Now" (manual trigger)

### 6. Global Controls

- **Start Scheduler** - Starts the automation scheduler
- **Stop Scheduler** - Stops the automation scheduler
- **Refresh** - Reloads all automation data

### Button Behavior

**Toggle Switches:**

- Click to enable/disable automation
- Shows loading state during API call
- Disables temporarily while processing
- Shows success/error alert
- Refreshes data after toggle

**Run Now Buttons:**

- Triggers task immediately
- Shows "Running..." during execution
- Disabled while running
- Shows success/error alert
- Refreshes data after execution

**Scheduler Controls:**

- Start/Stop scheduler button
- Shows "Processing..." during action
- Changes button text based on state
- Disabled while processing

## 👥 Customer Finder Dashboard

### Location: `/dashboard/customer-finder`

### Customer Finder Features

#### 1. Expected Results Overview

- Expected monthly leads from budget
- Conversion rate projection
- Customer acquisition cost (CAC)
- Expected monthly revenue

#### 2. Customer Personas (6 segments)

- Trendy Home Decor Enthusiast
- Tech Early Adopter
- Budget-Conscious Parent
- Beauty Enthusiast
- Pet Lover
- Fitness Enthusiast

Click any persona to see:

- Where they hang out (platforms, communities)
- Hashtags they follow
- Peak activity times
- Content preferences
- Tailored strategy

### 3. Where They Hang Out

- Preferred platforms per persona
- Communities and groups
- Hashtags
- Peak times
- Content types
- Strategy

#### 4. Best Acquisition Channels

- Ranked channels for persona
- CAC and conversion rates
- Trending indicators
- AI strategy per channel

#### 5. Budget Allocation

- Visual budget breakdown
- AI-optimized percentages
- Channel-specific allocation

#### 6. Lead Capture Strategies

- AI-recommended capture methods
- Conversion optimizations
- Targeting recommendations

#### 7. Retargeting Strategy

- Target audiences
- Messaging frameworks
- Optimal timing
- Channel selection

## 🎯 Product Finder Dashboard

### Location: `/dashboard/product-finder`

### Product Finder Features

#### 1. Market Insights Cards

- Trending Categories
- Emerging Trends
- High Margin Opportunities

#### 2. Buying Opportunities List

- Products ranked by AI confidence
- Profit margin percentages
- Estimated monthly sales and profit
- AI reasoning with insights
- Recommended action badges
- Priority ranking

#### 3. Action Recommendations

- Add to Store (high confidence, good margin)
- Price Adjustment (good confidence, low margin)
- Investigate (good confidence, low competition)
- Skip (low confidence, poor metrics)

## 📱 Social Media Dashboard

### Location: `/dashboard/social`

### Social Media Features

#### 1. Connected Accounts

- Visual platform cards with status
- Connect/disconnect buttons
- Account information display

#### 2. Post Product

- Product selection dropdown
- Platform selector
- Content editor with AI generation
- Post now / Schedule options

#### 3. Scheduled Posts

- View scheduled posts
- Track post status
- Edit/delete functionality

## 🔐 Access Control

### Admin-Only Access

All admin dashboards require:

- **ADMIN** role
- **SUPER_ADMIN** role

**If not logged in:**

- Shows "Admin Login Required" screen
- Button to sign in at `/auth/signin`

**If logged in but not admin:**

- Shows "Access Denied" screen
- Button to return to store

**Role Display:**

- Admin Hub shows current user role
- Badge displays ADMIN or SUPER_ADMIN

## 🚀 Quick Start

### Day 1: Access and Explore

1. **Sign in as admin**
   - Go to `/auth/signup` (first user becomes SUPER_ADMIN)
   - Or go to `/auth/signin` if you have an account

2. **Navigate to Admin Hub**
   - Click User icon in header
   - Goes to `/admin`
   - See all dashboard options

3. **Explore each dashboard**
   - Click on each dashboard card
   - Review features and data
   - Understand what each does

### Day 2: Enable Automations

1. **Go to Automation Center**
   - Navigate to `/dashboard/automation`
   - Review all lead capture automations
   - Enable desired popups and captures

2. **Enable email sequences**
   - Review all email automations
   - Enable welcome sequence
   - Enable cart abandonment
   - Enable persona nurtures

3. **Enable social media automations**
   - Review content automations
   - Enable TikTok automations for your target personas
   - Enable Instagram automations
   - Enable Pinterest automations

4. **Start scheduler**
   - Click "Start Scheduler" button
   - Monitor scheduler status
   - Tasks will run automatically

### Day 3: Review AI Insights

1. **Check Customer Finder**
   - Go to `/dashboard/customer-finder`
   - Review target customer personas
   - Click personas to see where they hang out
   - Note optimal posting times

2. **Check Product Finder**
   - Go to `/dashboard/product-finder`
   - Review top buying opportunities
   - Check AI reasoning for each
   - Note recommended actions

3. **Implement recommendations**
   - Add high-confidence products to featured
   - Adjust prices where recommended
   - Focus marketing on top opportunities

## 📊 Monitoring

### Daily Checks

**Automation Dashboard:**

- Check lead capture stats
- Monitor email open rates
- Review social post engagement
- Verify scheduler is running

**Customer Finder:**

- Review customer personas
- Check where customers hang out
- Note optimal posting times

**Product Finder:**

- Check top buying opportunities
- Review new AI recommendations
- Implement recommended actions

### Weekly Reviews

**Automation Performance:**

- Total leads captured
- Email conversion rates
- Social media engagement
- Overall automation health

**Customer Acquisition:**

- CAC by channel
- Conversion rates
- ROI analysis
- Channel optimization

**Product Performance:**

- AI prediction accuracy
- Top selling products
- Margin analysis
- Inventory optimization

## 🆘 Troubleshooting

### Buttons Not Working

**Issue:** Buttons don't respond when clicked

**Solutions:**

1. Check browser console for errors
2. Verify you're logged in as admin
3. Refresh the page
4. Check network tab for failed API calls
5. Ensure API route is accessible

### Automation Not Triggering

**Issue:** Automations not running despite being enabled

**Solutions:**

1. Check if scheduler is started
2. Verify automation toggles are on
3. Check scheduled task status
4. Review error logs
5. Manually trigger task to test

### Data Not Loading

**Issue:** Dashboard shows no data or loading spinner

**Solutions:**

1. Click "Refresh" button
2. Check browser console for errors
3. Verify API endpoint is accessible
4. Check server logs for errors
5. Try different browser

### Access Denied

**Issue:** Seeing "Access Denied" screen

**Solutions:**

1. Sign out and sign in again
2. Verify user role is ADMIN or SUPER_ADMIN
3. Check database user role field
4. Contact system admin if role is incorrect

## 🔧 Configuration

### Environment Variables Required

For full functionality, ensure these are set in `.env`:

```bash
# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Email Service (for automations)
# Add your email service credentials here

# Social Media APIs (for posting)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
FACEBOOK_CLIENT_ID="your-facebook-client-id"
FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"
INSTAGRAM_CLIENT_ID="your-instagram-client-id"
INSTAGRAM_CLIENT_SECRET="your-instagram-client-secret"
TWITTER_CLIENT_ID="your-twitter-client-id"
TWITTER_CLIENT_SECRET="your-twitter-client-secret"
PINTEREST_CLIENT_ID="your-pinterest-client-id"
PINTEREST_CLIENT_SECRET="your-pinterest-client-secret"

# AI Services
OPENAI_API_KEY="your-openai-key"
```

## 📚 Additional Documentation

- [Social Selling Guide](./SOCIAL_SELLING_GUIDE.md)
- [AI Product Finder Guide](./AI_PRODUCT_FINDER_GUIDE.md)
- [AI Customer Finder Guide](./AI_CUSTOMER_FINDER_GUIDE.md)
- [AI Marketing Automation](./AI_MARKETING_AUTOMATION.md)

Your admin panel is fully connected and ready to manage your store on autopilot! 🚀
