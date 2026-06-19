import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/utils/prisma';
import { aiRecommendationEngine } from '@/lib/ai/product-recommendations';
import { rateLimit, getClientIP, getSecurityHeaders } from '@/lib/security/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIP(request);
    const rateLimitResult = await rateLimit(ip, 'ai-recommendations', 50, 60000);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const body = await request.json();
    const { userId, behavior } = body;

    // Update user behavior analysis
    if (userId && behavior) {
      aiRecommendationEngine.analyzeUserBehavior(userId, behavior);
    }

    // Fetch all products
    const products = await prisma.product.findMany({
      where: { stock: { gt: 0 } },
    });

    const formattedProducts = products.map(p => ({
      ...p,
      price: Number(p.price),
      comparePrice: p.comparePrice ? Number(p.comparePrice) : undefined,
      aiScore: p.aiScore ?? undefined,
      aiTags: p.aiTags ?? undefined,
    }));

    // Get AI recommendations
    const recommendations = await aiRecommendationEngine.getRecommendations(
      userId || 'anonymous',
      formattedProducts
    );

    return NextResponse.json(
      {
        recommendations,
        meta: {
          algorithm: 'collaborative-filtering',
          version: '1.0',
          timestamp: new Date().toISOString()
        }
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('AI recommendations error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIP(request);
    const rateLimitResult = await rateLimit(ip, 'ai-recommendations', 30, 60000);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Fetch products with AI scores
    const where: any = { stock: { gt: 0 } };
    if (category) where.category = category;

    const products = await prisma.product.findMany({
      where,
      take: limit,
      orderBy: { aiScore: 'desc' },
    });

    const formattedProducts = products.map(p => ({
      ...p,
      price: Number(p.price),
      comparePrice: p.comparePrice ? Number(p.comparePrice) : undefined,
      aiScore: p.aiScore ?? undefined,
      aiTags: p.aiTags ?? undefined,
    }));

    return NextResponse.json(
      {
        products: formattedProducts,
        meta: {
          algorithm: 'ai-score-based',
          version: '1.0',
          timestamp: new Date().toISOString()
        }
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('AI recommendations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}