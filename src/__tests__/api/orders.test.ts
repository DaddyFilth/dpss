import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/utils/prisma';
import { getServerSession } from 'next-auth';

const mockPrisma = vi.mocked(prisma);
const mockGetServerSession = vi.mocked(getServerSession);

describe('Orders API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/orders', () => {
    it('should reject unauthenticated requests', async () => {
      const { POST } = await import('@/app/api/orders/route');

      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
    });

    it('should reject invalid order data', async () => {
      const { POST } = await import('@/app/api/orders/route');

      mockGetServerSession.mockResolvedValue({
        user: { id: '1', email: 'user@test.com', role: 'CUSTOMER' },
        expires: '',
      });

      const request = new NextRequest('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify({ items: [] }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid input');
    });
  });

  describe('GET /api/orders', () => {
    it('should reject unauthenticated requests', async () => {
      const { GET } = await import('@/app/api/orders/route');

      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/orders');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
    });

    it('should return orders for authenticated user', async () => {
      const { GET } = await import('@/app/api/orders/route');

      mockGetServerSession.mockResolvedValue({
        user: { id: '1', email: 'user@test.com', role: 'CUSTOMER' },
        expires: '',
      });

      mockPrisma.order.findMany.mockResolvedValue([]);

      const request = new NextRequest('http://localhost:3000/api/orders');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.orders).toBeDefined();
    });
  });
});
