import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/utils/prisma';
import { getSecurityHeaders } from '@/lib/security/rate-limit';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const cursor = searchParams.get('cursor');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

    const where: any = { stock: { gt: 0 } };
    if (category) where.category = category;

    const products = await prisma.product.findMany({
      where,
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: 'desc' },
    });

    const hasMore = products.length > limit;
    const items = hasMore ? products.slice(0, limit) : products;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    const formattedProducts = items.map(p => ({
      ...p,
      price: Number(p.price),
      comparePrice: p.comparePrice ? Number(p.comparePrice) : undefined,
    }));

    return NextResponse.json(
      { products: formattedProducts, nextCursor },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
