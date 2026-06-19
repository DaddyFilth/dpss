import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/utils/prisma';
import { rateLimit, getClientIP, getSecurityHeaders } from '@/lib/security/rate-limit';
import { parseJsonString } from '@/lib/utils/json';
import { 
  getPersonalizedRecommendations,
  getSimilarProducts,
  getTrendingProducts,
  generateAITags,
  calculateAIScore,
} from '@/lib/ai/recommendations';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIP(request);
    const rateLimitResult = await rateLimit(ip, 'recommendations', 50, 900000);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'personalized';
    const productId = searchParams.get('productId');
    const limit = parseInt(searchParams.get('limit') || '10');

    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    // Fetch all products
    const products = await prisma.product.findMany({
      where: { stock: { gt: 0 } },
    }).then(products => products.map(p => ({
      ...p,
      price: Number(p.price),
      comparePrice: p.comparePrice ? Number(p.comparePrice) : undefined,
      images: parseJsonString(p.images),
      tags: parseJsonString(p.tags),
      aiTags: parseJsonString(p.aiTags),
      aiScore: p.aiScore ?? undefined,
    })));

    // Get user behavior if authenticated
    let userBehavior: Array<{
      productId: string;
      action: 'view' | 'cart' | 'purchase' | 'wishlist';
      timestamp: Date;
    }> = [];
    if (userId) {
      const userOrders = await prisma.order.findMany({
        where: { userId },
        include: { items: true },
      });

      const userCart = await prisma.cart.findUnique({
        where: { userId },
        include: { items: true },
      });

      const userWishlist = await prisma.wishlistItem.findMany({
        where: { userId },
      });

      // Convert to behavior format
      userBehavior = [
        ...userOrders.flatMap((order: any) =>
          order.items.map((item: any) => ({
            productId: item.productId,
            action: 'purchase' as const,
            timestamp: order.createdAt,
          }))
        ),
        ...(userCart?.items.map((item: any) => ({
          productId: item.productId,
          action: 'cart' as const,
          timestamp: userCart.updatedAt,
        })) || []),
        ...userWishlist.map((item: any) => ({
          productId: item.productId,
          action: 'wishlist' as const,
          timestamp: item.createdAt,
        })),
      ];
    }

    let recommendedProducts;

    switch (type) {
      case 'similar':
        if (!productId) {
          return NextResponse.json(
            { error: 'productId required for similar recommendations' },
            { status: 400, headers: getSecurityHeaders() }
          );
        }
        const product = await prisma.product.findUnique({
          where: { id: productId },
        });
        if (!product) {
          return NextResponse.json(
            { error: 'Product not found' },
            { status: 404, headers: getSecurityHeaders() }
          );
        }
        const convertedProduct = {
          ...product,
          price: Number(product.price),
          comparePrice: product.comparePrice ? Number(product.comparePrice) : undefined,
          images: parseJsonString(product.images),
          tags: parseJsonString(product.tags),
          aiTags: parseJsonString(product.aiTags),
          aiScore: product.aiScore ?? undefined,
        };
        recommendedProducts = await getSimilarProducts(convertedProduct, products, limit);
        break;

      case 'trending':
        recommendedProducts = getTrendingProducts(products, userBehavior, limit);
        break;

      case 'personalized':
      default:
        recommendedProducts = await getPersonalizedRecommendations(
          products,
          userBehavior,
          limit
        );
        break;
    }

    return NextResponse.json(
      { recommendations: recommendedProducts },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// Update AI scores and tags for products (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const products = await prisma.product.findMany();

    // Update AI tags and scores for all products
    for (const product of products) {
      const convertedProduct = {
        ...product,
        price: Number(product.price),
        comparePrice: product.comparePrice ? Number(product.comparePrice) : undefined,
        aiScore: product.aiScore ?? undefined,
      };
      const aiTags = await generateAITags(convertedProduct);
      const aiScore = calculateAIScore(convertedProduct, []);

      await prisma.product.update({
        where: { id: product.id },
        data: {
          aiTags,
          aiScore,
        },
      });
    }

    return NextResponse.json(
      { message: 'AI recommendations updated successfully' },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('AI update error:', error);
    return NextResponse.json(
      { error: 'Failed to update AI recommendations' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
