import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/utils/prisma';

const mockPrisma = vi.mocked(prisma);

describe('Auth API - Register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should reject registration with missing fields', async () => {
    const { POST } = await import('@/app/api/auth/register/route');

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid input');
  });

  it('should reject registration with weak password', async () => {
    const { POST } = await import('@/app/api/auth/register/route');

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'weak',
        name: 'Test User',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
  });

  it('should reject registration for existing user', async () => {
    const { POST } = await import('@/app/api/auth/register/route');

    mockPrisma.user.findUnique.mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      name: 'Existing',
      password: 'hashed',
      role: 'CUSTOMER',
      image: null,
      emailVerified: null,
      stripeCustomerId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null,
    });

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'StrongP@ss1',
        name: 'Test User',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.error).toBe('User already exists');
  });
});

describe('Auth API - Signup (Admin)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should reject admin signup with invalid input', async () => {
    const { POST } = await import('@/app/api/auth/signup/route');

    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email: 'invalid' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid input');
  });
});
