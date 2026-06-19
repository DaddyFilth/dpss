#!/bin/bash

# Neon + Vercel Deployment Script

echo "🚀 Starting Neon + Vercel Deployment Setup..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create it first."
    echo "📝 Copy .env.example to .env and fill in your values."
    exit 1
fi

# Check if DATABASE_URL is set
if ! grep -q "DATABASE_URL" .env; then
    echo "❌ DATABASE_URL not found in .env file"
    echo "📝 Please add your Neon connection string:"
    echo "DATABASE_URL=postgresql://[user]:[password]@[neon-host]/[database]?sslmode=require"
    exit 1
fi

# Check if Prisma is installed
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found. Please install Node.js first."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Generating Prisma client..."
npx prisma generate

echo "🗄️  Pushing database schema to Neon..."
npx prisma db push

echo "✅ Database setup complete!"

echo "🔍 Checking for Vercel CLI..."
if ! command -npx vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "🚀 Ready for Vercel deployment!"
echo ""
echo "Next steps:"
echo "1. Run: npx vercel login"
echo "2. Run: npx vercel"
echo "3. Configure environment variables in Vercel dashboard"
echo "4. Deploy!"
