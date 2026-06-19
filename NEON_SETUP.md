# Neon Setup for Dropship AI

## 1. Create Neon Project

1. Go to [neon.tech](https://neon.tech)
2. Sign up or log in
3. Click "Create a project"
4. Configure your project:
   - **Name**: dropship-ai (or your preferred name)
   - **Region**: Choose closest to your users
   - **Postgres Version**: 16 (recommended)
   - **Size**: Free tier is fine for development

## 2. Get Database Connection String

After creating the project:

1. Go to Dashboard → Select your project
2. Copy the connection string from the dashboard
3. Format: `postgresql://[user]:[password]@[neon-host]/[database]?sslmode=require`
4. Or use the connection details in "Connection Details"

## 3. Configure Environment Variables

Add these to your `.env` file and Vercel environment variables:

```bash
# Database
DATABASE_URL="postgresql://[user]:[password]@[neon-host]/[database]?sslmode=require"

# NextAuth
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"

# Security
ENCRYPTION_KEY="your-32-character-encryption-key-here"
RATE_LIMIT_MAX_REQUESTS="100"
RATE_LIMIT_WINDOW_MS="900000"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# PayPal (optional)
PAYPAL_CLIENT_ID="your_paypal_client_id"
PAYPAL_CLIENT_SECRET="your_paypal_client_secret"
PAYPAL_MODE="sandbox"

# AI/ML Services
OPENAI_API_KEY="your_openai_api_key_for_recommendations"

# App Configuration
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
```

## 4. Update Prisma Schema for Neon

The current schema is already configured for PostgreSQL and will work with Neon:
- ✅ PostgreSQL provider
- ✅ Decimal types for prices
- ✅ Array types for images/tags
- ✅ Enums for status fields
- ✅ SSL mode in connection string

## 5. Run Database Migrations

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push schema to Neon
npx prisma db push

# Or use migrations (recommended for production)
npx prisma migrate dev --name init

# For production deployment
npx prisma migrate deploy
```

## 6. Neon-Specific Benefits

- **Serverless**: Auto-scaling PostgreSQL
- **Branching**: Create database branches for development
- **Bottomless Storage**: Storage scales automatically
- **Free Tier**: Generous free tier for development
- **Vercel Integration**: Native Vercel integration available

## 7. Set Up Neon with Vercel Integration (Optional)

Neon has native Vercel integration:

1. Go to Neon Dashboard → Integrations
2. Add Vercel integration
3. Connect your Vercel project
4. Neon will automatically set environment variables

## 8. Configure Vercel Deployment

1. Push your code to GitHub
2. Import project in Vercel:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository: `DaddyFilth/dpss`
3. Configure environment variables in Vercel settings
4. Add build command: `prisma generate && next build`
5. Deploy

## 9. Configure Webhooks

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-app.vercel.app/api/payments/stripe/webhook`
3. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
4. Copy webhook secret to environment variables

## 10. Test the Deployment

1. Check database connection
2. Test authentication
3. Test product creation
4. Test checkout flow
5. Verify webhooks

## Neon CLI Commands (Optional)

Install Neon CLI for advanced management:

```bash
npm install -g neonctl

# List projects
neonctl projects list

# Create branch
neonctl branches create --project-id your-project-id --name dev

# Get connection string
neonctl connection-string --project-id your-project-id
```

## Troubleshooting

### Connection Issues
- Ensure SSL mode is enabled in connection string
- Check Neon project status
- Verify network connectivity

### Migration Issues
- Ensure Prisma client is generated
- Check database permissions
- Verify connection string format

### Performance Issues
- Use connection pooling
- Enable read replicas for scaling
- Optimize database queries
