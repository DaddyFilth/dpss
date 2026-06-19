# Social Selling Platform Integration
## Multi-Platform Selling Guide

## 🌐 Overview

Your dropshipping store now includes a comprehensive social selling platform that allows you to connect multiple social media accounts and post products across platforms automatically with AI-generated content.

## 🎯 Features Implemented

### 1. **User Authentication System**
- **Technology:** NextAuth.js with multiple OAuth providers
- **Providers:**
  - Google (OAuth 2.0)
  - Facebook (OAuth 2.0)
  - Instagram (Facebook Graph API)
  - Twitter/X (OAuth 1.0a/2.0)
  - Pinterest (OAuth 2.0)
  - Email/Password (credentials)
- **Features:**
  - Secure session management
  - Token storage for API access
  - Automatic token refresh
  - Account linking

### 2. **Social Account Management**
- **Dashboard:** `/dashboard/social`
- **Features:**
  - Connect/disconnect social platforms
  - View active connections
  - Manage multiple accounts per platform
  - Token expiration monitoring
  - Profile information display

### 3. **Product Posting System**
- **API:** `/api/social/posts`
- **Features:**
  - Post products to connected platforms
  - Schedule posts for future dates
  - AI-generated content integration
  - Post status tracking
  - Engagement metrics (likes, shares, comments)
  - Bulk posting support

### 4. **AI Content Generation**
- **Integration:** Uses existing AI content generator
- **Features:**
  - Platform-specific content (Instagram, TikTok, Facebook, Pinterest, Twitter)
  - Trending hashtag suggestions
  - Emoji optimization
  - Best practices per platform
  - Content scoring

## 🔧 API Endpoints

### Authentication

#### POST `/api/auth/signup`
Create a new user account.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "user_123",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

#### GET/POST `/api/auth/signin`
Sign in with OAuth or credentials.

**OAuth Flow:**
```
Redirect to: /api/auth/signin?provider=instagram
Callback: /dashboard/social
```

### Social Accounts

#### GET `/api/social/accounts`
Get all connected social accounts for the current user.

**Response:**
```json
{
  "accounts": [
    {
      "id": "acc_123",
      "provider": "instagram",
      "providerAccountId": "123456789",
      "isActive": true,
      "profile": {
        "username": "@yourbusiness",
        "followers": 10000
      }
    }
  ]
}
```

#### DELETE `/api/social/accounts/[id]`
Disconnect a social account.

**Response:**
```json
{
  "message": "Account disconnected successfully"
}
```

### Social Posts

#### POST `/api/social/posts`
Create a new social media post.

**Request:**
```json
{
  "productId": "prod_123",
  "platform": "instagram",
  "content": "🔥 New arrival! Sunset Projection Lamp creating viral aesthetic lighting",
  "scheduledAt": "2024-06-20T10:00:00Z"
}
```

**Response:**
```json
{
  "message": "Post scheduled successfully",
  "post": {
    "id": "post_123",
    "status": "SCHEDULED",
    "scheduledAt": "2024-06-20T10:00:00Z"
  }
}
```

#### GET `/api/social/posts`
Get all social posts (optionally filtered by status).

**Query Parameters:**
- `status` (optional): PENDING, SCHEDULED, POSTED, FAILED

**Response:**
```json
{
  "posts": [
    {
      "id": "post_123",
      "productId": "prod_123",
      "platform": "instagram",
      "content": "Post content...",
      "status": "POSTED",
      "metrics": {
        "likes": 150,
        "shares": 25,
        "comments": 30
      },
      "postedAt": "2024-06-19T12:00:00Z"
    }
  ]
}
```

### Products

#### GET `/api/products`
Get all available products for posting.

**Query Parameters:**
- `category` (optional): Filter by category
- `limit` (optional): Number of results (default: 50)

## 🎨 UI Components

### Sign In Page (`/auth/signin`)
- Social login buttons for all platforms
- Email/password authentication
- Error handling
- Redirect to dashboard after login

### Sign Up Page (`/auth/signup`)
- User registration form
- Password confirmation
- Email validation
- Auto-login after signup

### Social Dashboard (`/dashboard/social`)
- **Tab 1: Connected Accounts**
  - Visual platform cards with status
  - Connect/disconnect buttons
  - Account information display
  
- **Tab 2: Post Product**
  - Product selection dropdown
  - Platform selector
  - Content editor
  - AI content generation button
  - Post now / Schedule options
  
- **Tab 3: Scheduled Posts**
  - List of scheduled posts
  - Edit/delete functionality
  - Status indicators

## 📋 Setup Guide

### 1. Set Up OAuth Providers

#### Google
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://yourdomain.com/api/auth/callback/google`
6. Copy Client ID and Secret to `.env`

#### Facebook & Instagram
1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create a new app
3. Add Facebook Login product
4. Add Instagram Graph API product
5. Configure OAuth redirect URIs
6. Copy Client ID and Secret to `.env`

#### Twitter/X
1. Go to [Twitter Developer Portal](https://developer.twitter.com)
2. Create a new app
3. Enable OAuth 1.0a/2.0
4. Configure callback URLs
5. Copy API Key and Secret to `.env`

#### Pinterest
1. Go to [Pinterest Developers](https://developers.pinterest.com)
2. Create a new app
3. Configure OAuth redirect URIs
4. Copy Client ID and Secret to `.env`

### 2. Update Environment Variables

Add to your `.env` file:

```bash
# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-32-char-secret-key"

# OAuth Providers
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

FACEBOOK_CLIENT_ID="your_facebook_client_id"
FACEBOOK_CLIENT_SECRET="your_facebook_client_secret"

INSTAGRAM_CLIENT_ID="your_instagram_client_id"
INSTAGRAM_CLIENT_SECRET="your_instagram_client_secret"

TWITTER_CLIENT_ID="your_twitter_client_id"
TWITTER_CLIENT_SECRET="your_twitter_client_secret"

PINTEREST_CLIENT_ID="your_pinterest_client_id"
PINTEREST_CLIENT_SECRET="your_pinterest_client_secret"
```

### 3. Update Database Schema

Run the migration:

```bash
npx prisma db push
```

This adds:
- `SocialAccount` model (stores OAuth tokens)
- `SocialPost` model (tracks posts to platforms)
- Relations to User and Product models

### 4. Test Authentication

```bash
npm run dev
```

Visit:
- `/auth/signin` - Test sign in
- `/auth/signup` - Test sign up
- `/dashboard/social` - View social dashboard

## 🚀 Usage Examples

### Connect Instagram Account
```typescript
// User clicks "Connect Instagram"
// Redirects to Instagram OAuth
// After authorization, redirects back to dashboard
// Account is stored with access tokens
```

### Post Product to Instagram
```typescript
// 1. Select product from dropdown
// 2. Choose Instagram as platform
// 3. Generate AI content with one click
// 4. Post immediately or schedule
// 5. Track engagement metrics
```

### Schedule Posts for Multiple Platforms
```typescript
// 1. Select product
// 2. Generate AI content once
// 3. Post to Instagram now
// 4. Schedule same content for Facebook tomorrow
// 5. Schedule for Pinterest in 2 days
// 6. All posts tracked in dashboard
```

## 📊 Database Schema

### SocialAccount Model
```prisma
model SocialAccount {
  id                String   @id @default(cuid())
  userId            String
  provider          String   // google, facebook, instagram, twitter, pinterest
  providerAccountId String
  accessToken       String?
  refreshToken      String?
  profile           Json?
  expiresAt         DateTime?
  isActive          Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  user User @relation(fields: [userId], references: [id])
  socialPosts SocialPost[]
}
```

### SocialPost Model
```prisma
model SocialPost {
  id          String          @id @default(cuid())
  productId   String
  accountId   String
  platform    String
  content     String
  imageUrl    String?
  status      SocialPostStatus // SCHEDULED, POSTED, FAILED, PENDING
  externalId  String?
  metrics     Json?
  scheduledAt DateTime?
  postedAt    DateTime?
  error       String?
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  product       Product
  socialAccount SocialAccount
}
```

## 🔒 Security Features

- **OAuth 2.0:** Industry-standard authentication
- **Token Encryption:** Access tokens stored securely
- **Token Refresh:** Automatic token renewal
- **Rate Limiting:** API endpoint protection
- **Session Management:** Secure session handling
- **CORS Protection:** Cross-origin resource sharing controls

## 📈 Advanced Features (Future)

1. **Bulk Posting:** Post multiple products at once
2. **Analytics Dashboard:** View engagement metrics across platforms
3. **Auto-Posting Rules:** Set up automated posting schedules
4. **Cross-Platform Syndication:** One post to all platforms simultaneously
5. **Hashtag Optimization:** AI-powered hashtag suggestions
6. **Best Time Posting:** AI-recommended posting times
7. **A/B Testing:** Test different content variations
8. **Influencer Collaboration:** Collaborative posting features

## 🎯 Best Practices

### Content Strategy
1. **Platform-Specific Content:** Tailor content for each platform
2. **Visual-First:** Use high-quality images (especially for Instagram/Pinterest)
3. **Consistent Branding:** Maintain brand voice across platforms
4. **Engagement:** Respond to comments and messages promptly
5. **Analytics:** Track performance and optimize

### Posting Schedule
- **Instagram:** 1-3 posts/day, best times 11AM-1PM and 7PM-9PM
- **Facebook:** 1-2 posts/day, best times 1PM-4PM
- **Twitter/X:** 3-5 tweets/day, best times 8AM-10AM
- **Pinterest:** 5-10 pins/day, best times 8PM-11PM
- **TikTok:** 1-3 videos/day, best times 7AM-9AM and 7PM-11PM

### Product Promotion
1. **Feature Viral Products:** Focus on sunset lamp, mushroom light, ice roller
2. **Seasonal Content:** Align with seasons and holidays
3. **User-Generated Content:** Share customer photos
4. **Behind-the-Scenes:** Show product development
5. **Educational Content:** How-to guides and tutorials

## 📚 Additional Resources

### Platform Documentation
- [Instagram Graph API](https://developers.facebook.com/docs/instagram)
- [Facebook Marketing API](https://developers.facebook.com/docs/marketing-apis)
- [Twitter API](https://developer.twitter.com/en/docs/twitter-api)
- [Pinterest API](https://developers.pinterest.com/docs/)

### NextAuth.js
- [NextAuth.js Documentation](https://next-auth.js.org)
- [OAuth Providers Guide](https://next-auth.js.org/providers)
- [Session Management](https://next-auth.js.org/configuration/session)

## 🆘 Troubleshooting

### OAuth Callback Errors
**Issue:** OAuth redirect fails or shows error
**Solution:** Check redirect URI matches exactly in provider settings

### Token Expiration
**Issue:** Posts fail due to expired tokens
**Solution:** System auto-refreshes tokens, check refresh token configuration

### Platform API Limits
**Issue:** Posts fail due to rate limits
**Solution:** Implement rate limiting and scheduling buffer

### Content Generation Fails
**Issue:** AI content generation not working
**Solution:** Check AI service API key and rate limits

Your social selling platform is now ready! Connect your accounts and start posting products across platforms with AI-powered content generation. 🚀
