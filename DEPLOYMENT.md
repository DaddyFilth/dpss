# Deployment Guide

This guide will help you deploy your AI Dropship site. You can choose between:

- **Prisma Compute** (Recommended) - Integrated with your Prisma database
- **Vercel** - Alternative deployment option

## 🚀 Prisma Compute Deployment (Recommended)

### Overview

Prisma Compute provides seamless deployment integration with your Prisma database and offers automatic scaling, built-in monitoring, and simplified environment management.

### Step 1: Set Up Prisma Compute Account

1. Go to <https://www.prisma.io/cloud>
2. Create an account or sign in
3. Navigate to Prisma Compute section
4. Create a new Compute Service for your Next.js application

### Step 2: Configure GitHub Secrets

Add the following secrets to your GitHub repository (`<https://github.com/DaddyFilth/dpss/settings/secrets/actions>`):

1. **PRISMA_API_TOKEN**
   - Get from: Prisma Cloud Dashboard → API Settings
   - Required for authenticating with Prisma Compute

2. **PRISMA_COMPUTE_SERVICE_ID**
   - Get from: Prisma Compute Dashboard → Your Service → Service ID
   - Format: typically looks like `cmqkj0y0x0k1f07gip4695ivz`

### Step 3: Environment Variables Configuration

Ensure your application has these environment variables configured (in Prisma Compute dashboard):

**Required Variables:**

```env
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require
NEXTAUTH_URL=https://your-app.prisma.cloud
NEXTAUTH_SECRET=your-32-character-random-secret
ENCRYPTION_KEY=your-32-character-encryption-key
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.prisma.cloud
```

**Payment Variables:**

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_your_stripe_key
STRIPE_SECRET_KEY=sk_your_stripe_secret
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

**Social Media OAuth:**

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
PINTEREST_CLIENT_ID=your_pinterest_client_id
PINTEREST_CLIENT_SECRET=your_pinterest_client_secret
```

**Optional AI Services:**

```env
OPENAI_API_KEY=your_openai_api_key
```

### Step 4: Database Setup

1. **Create PostgreSQL Database**
   - Use Prisma's managed PostgreSQL or connect your own
   - Recommended: Neon (free tier), Supabase, or Railway

2. **Configure Database URL**
   - Add `DATABASE_URL` to Prisma Compute environment variables
   - Format: `postgresql://user:password@host:5432/database?sslmode=require`

3. **Initialize Database Schema**

```bash
# Locally with production database URL
export DATABASE_URL="your_production_database_url"
npx prisma db push
```

### Step 5: Automatic Deployment

Once configured, deployment is automatic:

1. **Push to main branch** - GitHub Actions will:
   - Install dependencies
   - Generate Prisma Client
   - Build Next.js application
   - Deploy to Prisma Compute

2. **Monitor Deployment**
   - Check GitHub Actions tab for deployment status
   - View logs in Prisma Compute dashboard

### Step 6: Post-Deployment Setup

1. **Configure NextAuth**
   - Ensure `NEXTAUTH_URL` matches your Prisma Compute domain
   - Set `NEXT_PUBLIC_APP_URL` accordingly

2. **Configure Webhooks**

   - Stripe webhook endpoint: `https://your-app.prisma.cloud/api/payments/stripe/webhook`
   - Set the webhook secret in environment variables

3. **Create Admin User**

   ```sql
   -- Example: connect to your database and grant admin access
   -- NOTE: This is a documentation example only — review before executing
   -- WARNING: Always use a WHERE clause to avoid mass updates
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
   ```

### Prisma Compute Benefits

- ✅ **Integrated Database** - Seamless Prisma ORM integration
- ✅ **Auto-scaling** - Automatically handles traffic spikes
- ✅ **Built-in Monitoring** - Performance metrics and logs
- ✅ **Environment Management** - Easy variable configuration
- ✅ **Zero-downtime Deployments** - Rolling updates
- ✅ **Global CDN** - Fast content delivery worldwide

---

## 📋 Prerequisites

1. ✅ GitHub repository: <https://github.com/DaddyFilth/dpss>
2. ✅ Prisma Compute account (sign up at <https://www.prisma.io/cloud>) OR Vercel account (<https://vercel.com>)
3. ✅ PostgreSQL database (Neon, Supabase, or Railway)
4. ✅ Stripe account (for payments)

## 🚀 Vercel Deployment (Alternative)

### 🔧 Step 1: Generate Secure Secrets

Run the provided script to generate secure random secrets:

```bash
cd /home/filth/dpss/dropship-ai
./scripts/generate-secrets.sh
```

This will generate:
- `NEXTAUTH_SECRET` - For NextAuth.js session security
- `ENCRYPTION_KEY` - For data encryption

Copy these values for the next step.

### 📝 Step 2: Prepare Environment Variables

### Option A: Use the Template File

Edit `.env.vercel` and replace the placeholder values:

```bash
nano .env.vercel
```

Replace:

- `your_32_character_random_secret_here` with your generated NEXTAUTH_SECRET
- `your_32_character_encryption_key_here` with your generated ENCRYPTION_KEY
- `postgresql://user:password@host:5432/database_name` with your database URL
- `your_stripe_publishable_key` with your Stripe public key
- `your_stripe_secret_key` with your Stripe secret key
- `your_stripe_webhook_secret` with your Stripe webhook secret
- `https://your-project.vercel.app` with your actual Vercel domain

### Option B: Use JSON Format

Edit `vercel-env-import.json` with the same replacements.

### 🚀 Step 3: Deploy to Vercel

### Method 1: Vercel Dashboard (Recommended)

1. **Import Repository**
   - Go to <https://vercel.com/new>
   - Select "DaddyFilth/dpss" from your repositories
   - Click "Import"

2. **Configure Project**
   - Framework: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Add Environment Variables**
   - Go to "Environment Variables" tab
   - Click "Add Variable"
   - Import from file (choose method):
     - **Option A**: Copy each variable from `.env.vercel`
     - **Option B**: Use Vercel CLI import (see below)

### Method 2: Vercel CLI Import

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Import environment variables from file
vercel env pull .env.vercel

# Deploy
vercel --prod
```

### 🗄️ Step 4: Set Up Database

### Neon (Recommended - Free)

1. Go to <https://neon.tech>
2. Create account → New Project
3. Copy connection string
4. Add to Vercel as `DATABASE_URL`

### Alternative: Supabase (Free)

1. Go to <https://supabase.com>
2. Create project
3. Get connection string from Project Settings → Database
4. Add to Vercel as `DATABASE_URL`

### 💳 Step 5: Configure Payment Providers

### Stripe Setup

1. Go to <https://dashboard.stripe.com>
2. Create account → Get API keys from Developers → API keys
3. For testing, use test mode keys (start with `pk_test_` and `sk_test_`)
4. For webhook secret:
   - Go to Developers → Webhooks → Add endpoint
   - Endpoint: `https://your-domain.vercel.app/api/payments/stripe/webhook`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
   - Copy signing secret → Add as `STRIPE_WEBHOOK_SECRET`

### 🔧 Step 6: Final Deployment Configuration

### Critical Environment Variables to Configure

**After Vercel assigns your domain:**

1. **Copy your Vercel domain** (e.g., `dpss-xyz.vercel.app`)

2. **Configure in Vercel Environment Variables:**

    ```env
    NEXTAUTH_URL=https://dpss-xyz.vercel.app
    NEXT_PUBLIC_APP_URL=https://dpss-xyz.vercel.app
    ```

### Redeploy

After updating environment variables, trigger a new deployment:

- In Vercel dashboard → Deployments → Redeploy
- Or push a small change to GitHub

```bash
# Install Prisma CLI
npm install -g prisma

# Set your DATABASE_URL environment variable
export DATABASE_URL="your_postgresql_connection_string"

# Generate Prisma Client
npx prisma generate

# Push database schema
npx prisma db push
```

### ✅ Step 8: Test Your Deployment

1. **Check main page**: <https://dpss-xyz.vercel.app>
2. **Test authentication**: Try signing up
3. **Test admin access**:
   - First user needs admin role (set manually in database)
   - Or create admin user via script
4. **Test payment flow** (sandbox mode)
5. **Check Vercel logs** for errors

### 🔒 Admin Access Setup

To access the admin dashboard, you need an admin account:

### Option 1: Set First User as Admin

After deployment, connect to your database and run:

```sql
-- Verify the target user exists first (SELECT is non-destructive):
-- SELECT id, email FROM "User" WHERE email = 'your@email.com';
-- Grant admin role to the verified user:
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
```

### Option 2: Create Admin User

```sql
INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@yourdomain.com',
  'Admin',
  '$2a$12$hash_of_password', -- Hash your password first
  'ADMIN',
  NOW(),
  NOW()
);
```

### 🎯 Post-Deployment Checklist

- [ ] Database connected and schema initialized
- [ ] Environment variables configured correctly
- [ ] NEXTAUTH_URL matches Vercel domain
- [ ] NEXT_PUBLIC_APP_URL matches Vercel domain
- [ ] Stripe webhook configured
- [ ] Admin account created
- [ ] All pages load correctly
- [ ] Authentication working
- [ ] Admin dashboard accessible

### 🔄 Environment Variables Reference

### Required Variables

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Your Vercel domain
- `NEXTAUTH_SECRET` - Random 32+ character string
- `ENCRYPTION_KEY` - Random 32 character string

### Payment Variables

- `STRIPE_PUBLIC_KEY` - Stripe publishable key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret

### Optional Variables

- `OPENAI_API_KEY` - For AI recommendations
- `RATE_LIMIT_MAX_REQUESTS` - Default: 100
- `RATE_LIMIT_WINDOW_MS` - Default: 900000

### 🚨 Troubleshooting

### Build Failures

- Check environment variables are set correctly
- Verify database connection string format
- Check Prisma client generation

### Runtime Errors

- Check Vercel function logs
- Verify database connectivity
- Ensure NEXTAUTH_URL is correct

### Authentication Issues

- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches domain
- Ensure database sessions table exists

### Payment Errors

- Verify API keys are correct
- Check webhook endpoint is accessible
- Ensure webhook secret matches

### 🎉 Success

Your AI-powered dropshipping site is now live on Vercel!

**Your admin dashboard:** <https://dpss-xyz.vercel.app/admin>
**Your storefront:** <https://dpss-xyz.vercel.app>

You can now:
- Add products via admin panel
- Accept payments (in sandbox mode)
- Manage orders and users
- View analytics
- Scale your business!

---

**Need help?** Check Vercel logs or contact support.