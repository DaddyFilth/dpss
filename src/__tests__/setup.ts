import { vi } from 'vitest';

// Mock next-auth
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
  default: vi.fn(),
}));

// Mock prisma
vi.mock('@/lib/utils/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    product: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      updateMany: vi.fn(),
    },
    order: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    cart: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    cartItem: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
    socialAccount: {
      findMany: vi.fn(),
      upsert: vi.fn(),
    },
    printingSource: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

// Mock server-only
vi.mock('server-only', () => ({}));

// Set test environment variables
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.NEXTAUTH_SECRET = 'test-secret-that-is-at-least-32-chars-long';
process.env.NEXTAUTH_URL = 'http://localhost:3000';
process.env.ENCRYPTION_KEY = '12345678901234567890123456789012';
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
