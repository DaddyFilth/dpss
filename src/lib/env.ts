import { z } from 'zod';

const PLACEHOLDER_PATTERNS = [
  /^your[_-]/i,
  /^xxx/i,
  /^placeholder/i,
  /^change[_-]this/i,
  /^sk_test_your/i,
  /^pk_test_your/i,
  /^whsec_your/i,
];

function isPlaceholder(value: string): boolean {
  return PLACEHOLDER_PATTERNS.some(pattern => pattern.test(value));
}

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // NextAuth
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),

  // OAuth Providers (optional - empty string allowed)
  GOOGLE_CLIENT_ID: z.string().default(''),
  GOOGLE_CLIENT_SECRET: z.string().default(''),
  FACEBOOK_CLIENT_ID: z.string().default(''),
  FACEBOOK_CLIENT_SECRET: z.string().default(''),
  TWITTER_CLIENT_ID: z.string().default(''),
  TWITTER_CLIENT_SECRET: z.string().default(''),

  // Security
  ENCRYPTION_KEY: z.string().length(32, 'ENCRYPTION_KEY must be exactly 32 characters'),

  // Stripe (optional)
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().default(''),
  STRIPE_SECRET_KEY: z.string().default(''),
  STRIPE_WEBHOOK_SECRET: z.string().default(''),

  // AI/ML
  OPENAI_API_KEY: z.string().default(''),

  // App Configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),

  // Rate Limiting
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100'),
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'),

  // Redis/KV (Upstash)
  UPSTASH_REDIS_REST_URL: z.string().default(''),
  UPSTASH_REDIS_REST_TOKEN: z.string().default(''),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.issues
      .map(issue => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    throw new Error(
      `Environment validation failed:\n${formatted}\n\nPlease check your .env file.`
    );
  }

  // Check for placeholder values
  const warnings: string[] = [];
  for (const [key, value] of Object.entries(result.data)) {
    if (typeof value === 'string' && value.length > 0 && isPlaceholder(value)) {
      warnings.push(`  - ${key} appears to still have a placeholder value from .env.example`);
    }
  }

  if (warnings.length > 0) {
    const message = `Environment placeholder values detected:\n${warnings.join('\n')}`;
    if (process.env.NODE_ENV === 'production') {
      throw new Error(message);
    } else {
      console.warn(`[env] WARNING: ${message}`);
    }
  }

  return result.data;
}

export const env = validateEnv();
