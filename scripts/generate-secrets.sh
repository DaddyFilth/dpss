#!/bin/bash

echo "🔐 Generating secure secrets for your AI Dropship site..."
echo ""

# Generate NEXTAUTH_SECRET (32+ characters recommended)
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo "NEXTAUTH_SECRET: $NEXTAUTH_SECRET"

# Generate ENCRYPTION_KEY (32 characters)
ENCRYPTION_KEY=$(openssl rand -base64 24)
echo "ENCRYPTION_KEY: $ENCRYPTION_KEY"

echo ""
echo "✅ Secrets generated!"
echo ""
echo "Add these to your Vercel environment variables:"
echo ""
echo "1. Go to your Vercel project settings"
echo "2. Navigate to Environment Variables"
echo "3. Add the following variables:"
echo ""
echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET"
echo "ENCRYPTION_KEY=$ENCRYPTION_KEY"
echo ""
echo "📝 Don't forget to add your other required variables:"
echo "- DATABASE_URL (your PostgreSQL connection string)"
echo "- STRIPE_PUBLIC_KEY"
echo "- STRIPE_SECRET_KEY"
echo "- STRIPE_WEBHOOK_SECRET"
echo "- PAYPAL_CLIENT_ID"
echo "- PAYPAL_CLIENT_SECRET"
echo "- NEXTAUTH_URL (your Vercel domain)"
echo "- NEXT_PUBLIC_APP_URL (your Vercel domain)"
