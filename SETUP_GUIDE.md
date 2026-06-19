# Dropshipping Store Setup Guide

## 🚀 Quick Start (5 minutes)

### 1. Set up Free PostgreSQL Database

**Option A: Neon (Recommended)**
1. Go to https://neon.tech and sign up for free
2. Create a new project (it's free)
3. Copy your database connection string
4. Update your `.env` file:

```env
DATABASE_URL="postgres://your-username:your-password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
```

**Option B: Supabase (Free Alternative)**
1. Go to https://supabase.com and sign up
2. Create a new project
3. Copy the connection string from Settings → Database
4. Update your `.env` file

### 2. Set Up NextAuth Secret

Generate a secure secret:
```bash
openssl rand -base64 32
```

Update your `.env` file:
```env
NEXTAUTH_SECRET="your-generated-secret-here"
```

### 3. Install Dependencies and Initialize Database

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
```

### 4. Start Your Store

```bash
npm run dev
```

Visit http://localhost:3000 to see your dropshipping store!

## 🛍️ What's Included

Your store comes pre-configured with:

### Products (85 Dropshipping Products):
- **Custom Apparel**: Premium T-Shirts, Hoodies (with custom printing)
- **Home Decor**: Canvas Prints, Posters, Throw Pillows, Sunset Lamps, Mushroom Lights
- **Accessories**: Phone Cases, Tote Bags, Coffee Mugs, Watches, Backpacks
- **Electronics**: 23 popular electronics including smart watches, gaming gear, audio equipment
- **Beauty**: LED mirrors, makeup brushes, skincare products, ice rollers, teeth whitening
- **Pet Supplies**: Orthopedic beds, grooming tools, toys, AI pet cameras
- **Home & Kitchen**: Organizers, gadgets, appliances, smart home devices
- **Baby Products**: Monitors, carriers
- **Automotive**: Phone mounts, LED lights
- **Fitness**: Equipment, resistance bands, yoga gear, smart yoga mats
- **Health**: Massage devices, posture correctors, sleep trackers, smart bottles
- **Smart Home**: Smart plugs, bulbs, mirrors, locks, plant monitors, air quality monitors
- **AI-Predicted**: Next-generation smart devices and biometric products

### Features:
- ✅ Shopping cart with quantity management
- ✅ Product customization (text, images, colors, sizes)
- ✅ User authentication and accounts
- ✅ Order management system
- ✅ Admin dashboard for product management
- ✅ Payment integration (Stripe/PayPal ready)
- ✅ Printful integration for dropshipping
- ✅ Security features (rate limiting, input sanitization)
- ✅ AI-powered product recommendations

### Dropshipping Integration:
- Printful API integration configured
- Automatic print order creation
- Customization support for print-on-demand products
- Shipping and production time estimates

## 🔧 Configuration

### Payment Gateways (Optional)

**Stripe:**
1. Get API keys from https://stripe.com
2. Update `.env`:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
```

**PayPal:**
1. Get API credentials from https://developer.paypal.com
2. Update `.env`:
```env
PAYPAL_CLIENT_ID="your_client_id"
PAYPAL_CLIENT_SECRET="your_secret"
```

### Printful Integration (For Real Dropshipping)

1. Get API key from https://www.printful.com/dashboard/app/api
2. Update the printing source in your database:
```bash
npx prisma studio
```
3. Navigate to `PrintingSource` and add your Printful API key

### AI Recommendations (Optional)

1. Get OpenAI API key from https://platform.openai.com
2. Update `.env`:
```env
OPENAI_API_KEY="sk-..."
```

## 📱 Testing Your Store

1. **Browse Products**: Visit http://localhost:3000/products
2. **Customize Products**: Click on a customizable product and add custom text/images
3. **Add to Cart**: Add products to your shopping cart
4. **Checkout**: Complete the checkout process
5. **Admin Panel**: Visit http://localhost:3000/admin to manage products

## 🎯 Next Steps

1. **Add Your Own Products**: Use the admin panel or API to add products
2. **Configure Payment Gateways**: Set up Stripe or PayPal for real payments
3. **Connect Printful**: Add your Printful API key for real dropshipping
4. **Customize Design**: Modify the frontend in `src/app/` and `src/components/`
5. **Deploy**: Deploy to Vercel, Netlify, or your preferred platform

## 📚 Important Files

- `prisma/schema.prisma` - Database schema
- `prisma/seed.ts` - Product seed data
- `src/app/api/products/route.ts` - Product API
- `src/app/cart/page.tsx` - Shopping cart
- `src/lib/printing/printing-service.ts` - Printful integration

## 🆘 Troubleshooting

**Database Connection Error:**
- Make sure your `DATABASE_URL` is correct
- Check that your PostgreSQL database is running

**Products Not Showing:**
- Run `npm run db:seed` to add products
- Check the database in Prisma Studio: `npx prisma studio`

**Build Errors:**
- Run `npx prisma generate` to regenerate Prisma client
- Delete `.next` folder and run `npm run dev`

## 🔒 Security Notes

- Never commit `.env` file to version control
- Change `NEXTAUTH_SECRET` in production
- Use strong, unique API keys
- Enable rate limiting in production
- Keep dependencies updated

## 🚀 Deployment

The app is ready to deploy to Vercel:
```bash
vercel deploy
```

Make sure to add environment variables in your deployment platform.

## 📞 Support

- Neon Support: https://neon.tech/docs
- Printful API: httpsdevelopers.printful.com
- NextAuth: https://next-auth.js.org
- Prisma: https://www.prisma.io/docs
