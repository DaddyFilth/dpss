import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/utils/prisma';
import { getSecurityHeaders } from '@/lib/security/rate-limit';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = { stock: { gt: 0 } };
    if (category) where.category = category;

    const products = await prisma.product.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const formattedProducts = products.map(p => ({
      ...p,
      price: Number(p.price),
      comparePrice: p.comparePrice ? Number(p.comparePrice) : undefined,
    }));

    return NextResponse.json(
      { products: formattedProducts },
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