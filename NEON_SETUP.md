# Neon PostgreSQL Setup Guide

## Step 1: Create a Free Neon Account

1. Go to https://neon.tech
2. Click "Sign up" and create a free account
3. Neon offers a free tier with:
   - 0.5GB storage
   - 1 compute node (with auto-suspend)
   - Perfect for development and small projects

## Step 2: Create a New Project

1. After signing in, click "Create a project"
2. Choose a name (e.g., "dropship-store")
3. Select a region closest to you
4. Click "Create project"

## Step 3: Get Your Database URL

1. Once the project is created, you'll see your connection string
2. Copy the connection string (it looks like: `postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`)
3. It will be in the format: `postgres://user:password@host/dbname?sslmode=require`

## Step 4: Update Your .env File

Replace the DATABASE_URL in your .env file with your Neon connection string:

```env
DATABASE_URL="postgres://your-username:your-password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
```

## Step 5: Install Dependencies and Run Migrations

```bash
npm install
npx prisma generate
npx prisma db push
```

## Alternative: Supabase (Another Free Option)

If you prefer Supabase:

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up and create a new project
4. Wait for the database to be provisioned (2-3 minutes)
5. Go to Settings → Database
6. Copy the "Connection string" under "URI"
7. Use the format: `postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres`

## Alternative: Railway (Another Free Option)

1. Go to https://railway.app
2. Click "New Project" → "Provision PostgreSQL"
3. Railway will create a free PostgreSQL database
4. Click on the database → "Connection Variables"
5. Copy the DATABASE_URL
