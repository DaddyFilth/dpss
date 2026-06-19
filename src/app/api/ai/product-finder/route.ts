import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/utils/prisma';
import { aiProductFinder } from '@/lib/ai/product-finder';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getSecurityHeaders } from '@/lib/security/rate-limit';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Admin only access
    const userRole = (session?.user as any)?.role;
    if (!session || (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    // Get all products
    const products = await prisma.product.findMany({
      where: { stock: { gt: 0 } },
      take: 50,
    });

    const formattedProducts = products.map(p => ({
      ...p,
      price: Number(p.price),
      comparePrice: p.comparePrice ? Number(p.comparePrice) : undefined,
    }));

    // Find all buying opportunities
    const opportunities = await aiProductFinder.findAllBuyingOpportunities(formattedProducts);

    // Get market insights
    const insights = aiProductFinder.getMarketInsights();

    return NextResponse.json(
      {
        opportunities,
        insights,
        meta: {
          algorithm: 'ai-product-finder',
          version: '2.0',
          timestamp: new Date().toISOString()
        }
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('AI product finder error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze products' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    const userRole = (session?.user as any)?.role;
    if (!session || (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const body = await request.json();
    const { productIds } = body;

    if (!productIds || !Array.isArray(productIds)) {
      return NextResponse.json(
        { error: 'Invalid product IDs' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Analyze specific products
    const products = await prisma.product.findMany({
      where: { 
        id: { in: productIds },
        stock: { gt: 0 }
      },
    });

    const formattedProducts = products.map(p => ({
      ...p,
      price: Number(p.price),
      comparePrice: p.comparePrice ? Number(p.comparePrice) : undefined,
    }));

    const opportunities = await aiProductFinder.findAllBuyingOpportunities(formattedProducts);

    return NextResponse.json(
      { opportunities },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('AI product analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze products' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}