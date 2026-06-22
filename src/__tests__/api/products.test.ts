import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/utils/prisma';
import { getServerSession } from 'next-auth';

const mockPrisma = vi.mocked(prisma);
const mockGetServerSession = vi.mocked(getServerSession);

describe('Products API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/products', () => {
    it('should return products list', async () => {
      const { GET } = await import('@/app/api/products/route');

      const mockProducts = [
        {
          id: '1',
          name: 'Test Product',
          description: 'A test product',
          price: { toNumber: () => 29.99 } as any,
          comparePrice: null,
          image: 'http://example.com/img.jpg',
          images: [],
          category: 'test',
          tags: [],
          stock: 10,
          sku: 'TEST-001',
          featured: false,
          rating: 4.5,
          reviewsCount: 10,
          aiScore: null,
          aiTags: [],
          customizable: false,
          customizationConfig: null,
          printingSourceId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.product.findMany.mockResolvedValue(mockProducts as any);

      const request = new NextRequest('http://localhost:3000/api/products');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.products).toBeDefined();
      expect(mockPrisma.product.findMany).toHaveBeenCalled();
    });

    it('should filter by category', async () => {
      const { GET } = await import('@/app/api/products/route');

      mockPrisma.product.findMany.mockResolvedValue([]);

      const request = new NextRequest('http://localhost:3000/api/products?category=electronics');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ category: 'electronics' }),
        })
      );
    });
  });

  describe('PUT /api/admin/products/[id]', () => {
    it('should reject unauthenticated requests', async () => {
      const { PUT } = await import('@/app/api/admin/products/[id]/route');

      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/admin/products/1', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated' }),
      });

      const response = await PUT(request, { params: Promise.resolve({ id: '1' }) });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should reject non-admin users', async () => {
      const { PUT } = await import('@/app/api/admin/products/[id]/route');

      mockGetServerSession.mockResolvedValue({
        user: { id: '1', email: 'user@test.com', role: 'CUSTOMER' },
        expires: '',
      });

      const request = new NextRequest('http://localhost:3000/api/admin/products/1', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated' }),
      });

      const response = await PUT(request, { params: Promise.resolve({ id: '1' }) });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('DELETE /api/admin/products/[id]', () => {
    it('should reject unauthenticated requests', async () => {
      const { DELETE } = await import('@/app/api/admin/products/[id]/route');

      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/admin/products/1', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params: Promise.resolve({ id: '1' }) });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });
});
