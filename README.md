# AI Dropship - AI-Powered E-Commerce Platform

A secure, AI-powered dropshipping e-commerce platform built with Next.js 16, TypeScript, and modern web technologies. Features personalized product recommendations, secure payment processing with Stripe and PayPal, and security-first architecture.

## 🚀 Features

### AI-Powered Features
- **Personalized Recommendations**: Machine learning-based product suggestions
- **Smart Search**: Natural language processing for better search results
- **Auto-Tagging**: AI-generated product tags and categories
- **Trending Analysis**: Real-time trending product detection

### Security Features
- **Encryption**: AES-256-GCM encryption for sensitive data
- **Rate Limiting**: Comprehensive API rate limiting
- **Authentication**: Secure JWT-based authentication with NextAuth.js
- **Input Validation**: Comprehensive input sanitization and validation
- **Security Headers**: CSP, HSTS, X-Frame-Options, etc.
- **Audit Logging**: Complete security audit trail

### E-Commerce Features
- **Product Catalog**: Full product management with categories and tags
- **Shopping Cart**: Persistent cart with quantity management
- **Checkout Process**: Streamlined checkout with multiple payment options
- **Order Management**: Complete order lifecycle tracking
- **Reviews System**: Customer reviews with verification
- **Wishlist**: Save favorite products for later

### Payment Integration
- **Stripe**: Credit card and Apple Pay integration
- **PayPal**: PayPal payment processing
- **Webhooks**: Secure payment webhook handling
- **Refunds**: Automated refund processing

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe SDK + PayPal Server SDK
- **AI/ML**: Custom recommendation engine
- **Deployment**: Vercel, Netlify, or any Node.js hosting

## 📋 Prerequisites

- Node.js 20 or higher
- PostgreSQL database
- Stripe account (for payments)
- PayPal account (for payments)
- OpenAI API key (for AI features - optional)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dropship-ai.git
   cd dropship-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your configuration:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/dropship_db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"
   STRIPE_PUBLIC_KEY="pk_test_..."
   STRIPE_SECRET_KEY="sk_test_..."
   PAYPAL_CLIENT_ID="your_paypal_client_id"
   PAYPAL_CLIENT_SECRET="your_paypal_client_secret"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
dropship-ai/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── products/      # Product endpoints
│   │   │   ├── payments/      # Payment processing
│   │   │   └── cart/          # Shopping cart
│   │   ├── auth/              # Auth pages
│   │   ├── products/          # Product pages
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── products/         # Product components
│   │   ├── auth/             # Auth components
│   │   └── layout/           # Layout components
│   ├── lib/                  # Utilities and libraries
│   │   ├── auth/            # Authentication configuration
│   │   ├── security/        # Security utilities
│   │   ├── ai/              # AI recommendations
│   │   ├── payments/        # Payment integrations
│   │   └── utils/           # General utilities
│   └── types/               # TypeScript types
├── prisma/
│   └── schema.prisma        # Database schema
├── public/                  # Static assets
└── .github/
    └── workflows/           # GitHub Actions
```

## 🔒 Security Architecture

### Authentication & Authorization
- JWT-based session management
- Role-based access control (Customer, Admin, Super Admin)
- Secure password hashing with bcrypt
- Email verification support

### Data Protection
- AES-256-GCM encryption for sensitive data
- SHA-256 hashing for PII
- Secure random token generation
- Input sanitization to prevent XSS

### API Security
- Rate limiting on all endpoints
- IP-based monitoring
- CSRF protection
- CORS configuration
- Security headers (CSP, HSTS, X-Frame-Options)

### Payment Security
- PCI DSS compliant via Stripe
- Secure webhook signature verification
- Tokenized payment processing
- No card data storage

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy is using Vercel:

1. **Push your code to GitHub**
2. **Import your repository in Vercel**
3. **Add environment variables** in Vercel dashboard:
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `STRIPE_PUBLIC_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `PAYPAL_CLIENT_ID`
   - `PAYPAL_CLIENT_SECRET`
   - `PAYPAL_MODE`
4. **Deploy** - Vercel will automatically build and deploy

### Other Platforms

This is a standard Next.js application and can be deployed to:
- **Netlify**: Use the Next.js build adapter
- **Railway**: Full-stack deployment with database
- **DigitalOcean App Platform**: Container-based deployment
- **Self-hosted**: Use `npm run build` and `npm start`

### Environment Variables

Make sure to add all required environment variables to your hosting platform's configuration.

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Products
- `GET /api/products` - Get products with filtering
- `POST /api/products` - Create product (admin only)
- `GET /api/products/recommendations` - Get AI recommendations
- `POST /api/products/recommendations` - Update AI scores (admin only)

### Payments
- `POST /api/payments/stripe` - Create Stripe payment intent
- `POST /api/payments/stripe/webhook` - Stripe webhook handler
- `POST /api/payments/paypal` - Create/capture PayPal order

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart` - Remove item from cart

## 🤖 AI Features

### Recommendation Engine
The AI recommendation engine uses:
- Collaborative filtering based on user behavior
- Content-based filtering using product attributes
- Time-decay weighting for recent interactions
- Hybrid scoring for personalized results

### Smart Tagging
Products are automatically tagged with:
- Price range categories
- Quality indicators (top-rated, popular)
- Feature-based tags (wireless, sustainable, etc.)
- Category-specific attributes

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run linter
npm run lint

# Type check
npm run type-check
```

## 📝 Environment Variables

See `.env.example` for all required environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - NextAuth.js URL
- `NEXTAUTH_SECRET` - NextAuth.js secret key
- `ENCRYPTION_KEY` - 32-character encryption key
- `STRIPE_PUBLIC_KEY` - Stripe publishable key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `PAYPAL_CLIENT_ID` - PayPal client ID
- `PAYPAL_CLIENT_SECRET` - PayPal client secret
- `PAYPAL_MODE` - sandbox or live
- `OPENAI_API_KEY` - OpenAI API key (optional)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- shadcn/ui for the beautiful components
- Stripe and PayPal for payment processing
- The open-source community

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

Built with ❤️ using Next.js, TypeScript, and security-first principles.
