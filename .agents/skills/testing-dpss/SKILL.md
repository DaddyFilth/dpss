---
name: testing-dpss
description: Test the DPSS (AI Dropship) Next.js app end-to-end. Use when verifying UI, API, or architectural changes to the dropshipping platform.
---

# Testing DPSS (AI Dropship)

## Quick Start

```bash
# Run unit/integration tests (mocked, no DB needed)
npm run test

# Build verification (TypeScript + page generation)
npm run build

# Start dev server for UI testing
npm run dev
```

## Environment Setup

The app requires these env vars to start (validated by `src/lib/env.ts` at startup):
- `DATABASE_URL` — PostgreSQL (Neon). Without a real DB, pages with mock fallbacks still render but API routes return 500.
- `NEXTAUTH_SECRET` — Must be 32+ chars
- `NEXTAUTH_URL` — e.g. `http://localhost:3000`
- OAuth credentials: `GOOGLE_CLIENT_ID/SECRET`, `FACEBOOK_CLIENT_ID/SECRET`, `TWITTER_CLIENT_ID/SECRET`
- Stripe: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- Optional: `UPSTASH_REDIS_REST_URL/TOKEN` (rate limiting falls back to in-memory without these)
- Optional: `FIELD_ENCRYPTION_KEY` (32-char hex for DB field encryption)

For local testing without a real DB, create `.env.local` with fake values. The homepage and products page have mock data fallbacks.

## Testable Without Auth/DB

| Page | What it proves |
|------|---------------|
| `/` (homepage) | Build works, no missing modules, PayPal removed |
| `/products` | Auth config import chain works, mock fallback renders |
| `/auth/signin` | Auth consolidation works, social buttons render |
| `/about` | Static page renders |

## Requires Real Database

| Endpoint | What it proves |
|----------|---------------|
| `GET /api/products?limit=2&cursor=<id>` | Cursor-based pagination |
| `GET /api/admin/orders?limit=5` | Admin orders pagination |
| Social account endpoints | Field encryption/decryption |

## Requires Auth (Admin)

| Page | What it proves |
|------|---------------|
| `/admin/settings` | PayPal removed from payment settings UI |
| `/admin/orders` | Cursor pagination in admin UI |
| `POST /api/admin/printing-sources` | Field encryption on write |

## Vitest Tests

Tests are fully mocked (Prisma, NextAuth) and run without any external services:
- `src/__tests__/api/auth.test.ts` — Registration validation
- `src/__tests__/api/products.test.ts` — Products CRUD + pagination
- `src/__tests__/api/orders.test.ts` — Order endpoints + auth

## Key Architecture Notes

- Auth config consolidated at `src/lib/auth/auth.config.ts` (single source of truth)
- Stripe is lazy-initialized via `getStripeClient()` — won't crash at build time
- `headers()` returns a Promise in Next.js 16 — must `await` it (known issue in `checkout.ts`)
- Pino logger uses `logger.error({ err: error }, 'message')` pattern (not `logger.error('msg', error)`)

## Vercel Deployment

The app deploys to Vercel. Preview URLs may require Vercel team auth (SSO wall). Production URL is accessible publicly after merge. Check PR comments from `vercel[bot]` for preview URLs.

## Devin Secrets Needed

- No Devin-stored secrets are currently needed for basic testing (vitest, build, local dev with mocks)
- For full end-to-end testing with real data: would need `DATABASE_URL` (Neon PostgreSQL connection string)
