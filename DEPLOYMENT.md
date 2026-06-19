# Vercel Deployment Guide

This guide will help you deploy your AI Dropship site to Vercel with all the required environment variables.

## 📋 Prerequisites

1. ✅ GitHub repository: https://github.com/DaddyFilth/dpss
2. ✅ Vercel account (sign up at https://vercel.com)
3. ✅ PostgreSQL database (Neon, Supabase, or Railway)
4. ✅ Stripe account (for payments)
5. ✅ PayPal account (for payments)

## 🔧 Step 1: Generate Secure Secrets

Run the provided script to generate secure random secrets:

```bash
cd /home/filth/dpss/dropship-ai
./scripts/generate-secrets.sh
```

This will generate:
- `NEXTAUTH_SECRET` - For NextAuth.js session security
- `ENCRYPTION_KEY` - For data encryption

Copy these values for the next step.

## 📝 Step 2: Prepare Environment Variables

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
- `your_paypal_client_id` with your PayPal client ID
- `your_paypal_client_secret` with your PayPal client secret
- `https://your-project.vercel.app` with your actual Vercel domain

### Option B: Use JSON Format

Edit `vercel-env-import.json` with the same replacements.

## 🚀 Step 3: Deploy to Vercel

### Method 1: Vercel Dashboard (Recommended)

1. **Import Repository**
   - Go to https://vercel.com/new
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

## 🗄️ Step 4: Set Up Database

### Neon (Recommended - Free)

1. Go to https://neon.tech
2. Create account → New Project
3. Copy connection string
4. Add to Vercel as `DATABASE_URL`

### Alternative: Supabase (Free)

1. Go to https://supabase.com
2. Create project
3. Get connection string from Project Settings → Database
4. Add to Vercel as `DATABASE_URL`

## 💳 Step 5: Configure Payment Providers

### Stripe Setup

1. Go to https://dashboard.stripe.com
2. Create account → Get API keys from Developers → API keys
3. For testing, use test mode keys (start with `pk_test_` and `sk_test_`)
4. For webhook secret:
   - Go to Developers → Webhooks → Add endpoint
   - Endpoint: `https://your-domain.vercel.app/api/payments/stripe/webhook`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
   - Copy signing secret → Add as `STRIPE_WEBHOOK_SECRET`

### PayPal Setup

1. Go to https://developer.paypal.com/dashboard
2. Create App → Get credentials
3. For testing, use sandbox credentials
4. Add to Vercel:
   - `PAYPAL_CLIENT_ID`
   - `PAYPAL_CLIENT_SECRET`
   - `PAYPAL_MODE=sandbox`

## 🔧 Step 6: Final Deployment Configuration

### Critical Environment Variables to Update

**After Vercel assigns your domain:**

1. **Copy your Vercel domain** (e.g., `dpss-xyz.vercel.app`)
2. **Update in Vercel Environment Variables:**
   ```
   NEXTAUTH_URL=https://dpss-xyz.vercel.app
   NEXT_PUBLIC_APP_URL=https://dpss-xyz.vercel.app
   ```

### Redeploy

After updating environment variables, trigger a new deployment:
- In Vercel dashboard → Deployments → Redeploy
- Or push a small change to GitHub

## 🗄️ Step 7: Initialize Database

Once deployed, set up your database schema:

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

**For Vercel deployment**, you can also:
- Use Vercel's built-in terminal
- Add a post-deploy script
- Or run this locally with your production database URL

## ✅ Step 8: Test Your Deployment

1. **Check main page**: https://dpss-xyz.vercel.app
2. **Test authentication**: Try signing up
3. **Test admin access**:
   - First user needs admin role (set manually in database)
   - Or create admin user via script
4. **Test payment flow** (sandbox mode)
5. **Check Vercel logs** for errors

## 🔒 Admin Access Setup

To access the admin dashboard, you need an admin account:

### Option 1: Set First User as Admin

After deployment, connect to your database and run:

```sql
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

## 🎯 Post-Deployment Checklist

- [ ] Database connected and schema initialized
- [ ] Environment variables configured correctly
- [ ] NEXTAUTH_URL matches Vercel domain
- [ ] NEXT_PUBLIC_APP_URL matches Vercel domain
- [ ] Stripe webhook configured
- [ ] PayPal sandbox working
- [ ] Admin account created
- [ ] All pages load correctly
- [ ] Authentication working
- [ ] Admin dashboard accessible

## 🔄 Environment Variables Reference

### Required Variables
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Your Vercel domain
- `NEXTAUTH_SECRET` - Random 32+ character string
- `ENCRYPTION_KEY` - Random 32 character string

### Payment Variables
- `STRIPE_PUBLIC_KEY` - Stripe publishable key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `PAYPAL_CLIENT_ID` - PayPal client ID
- `PAYPAL_CLIENT_SECRET` - PayPal client secret
- `PAYPAL_MODE` - sandbox or live

### Optional Variables
- `OPENAI_API_KEY` - For AI recommendations
- `RATE_LIMIT_MAX_REQUESTS` - Default: 100
- `RATE_LIMIT_WINDOW_MS` - Default: 900000

## 🚨 Troubleshooting

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

## 🎉 Success!

Your AI-powered dropshipping site is now live on Vercel! 

**Your admin dashboard:** https://dpss-xyz.vercel.app/admin
**Your storefront:** https://dpss-xyz.vercel.app

You can now:
- Add products via admin panel
- Accept payments (in sandbox mode)
- Manage orders and users
- View analytics
- Scale your business!

---

**Need help?** Check Vercel logs or contact support.
