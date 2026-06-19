import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/utils/prisma';
import { rateLimit, getClientIP, getSecurityHeaders } from '@/lib/security/rate-limit';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { parseJsonString, toJsonString } from '@/lib/utils/json';

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIP(request);
    const rateLimitResult = await rateLimit(ip, 'products', 100, 900000);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {};
    
    if (category) {
      where.category = category;
    }
    
    if (featured === 'true') {
      where.featured = true;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        take: Math.min(limit, 100),
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }).then(products => products.map(p => ({
        ...p,
        price: Number(p.price),
        comparePrice: p.comparePrice ? Number(p.comparePrice) : undefined,
        images: parseJsonString(p.images),
        tags: parseJsonString(p.tags),
        aiTags: parseJsonString(p.aiTags),
        aiScore: p.aiScore ?? undefined,
      }))),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json(
      {
        products,
        total,
        hasMore: offset + limit < total,
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    // Rate limiting for admins
    const ip = getClientIP(request);
    const rateLimitResult = await rateLimit(ip, 'create-product', 20, 3600000);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const body = await request.json();

    // Validate required fields
    const { name, description, price, category, image, sku } = body;
    
    if (!name || !description || !price || !category || !image) {
      return NextResponse.json(
        { error: 'Missing required fields', details: { name, description, price, category, image } },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        comparePrice: body.comparePrice ? parseFloat(body.comparePrice) : null,
        image,
        images: toJsonString(body.images || [image]),
        category,
        tags: toJsonString(body.tags || []),
        stock: body.stock || 0,
        sku,
        featured: body.featured || false,
      },
    }).then(p => ({
      ...p,
      price: Number(p.price),
      comparePrice: p.comparePrice ? Number(p.comparePrice) : undefined,
      images: parseJsonString(p.images),
      tags: parseJsonString(p.tags),
      aiTags: parseJsonString(p.aiTags),
      aiScore: p.aiScore ?? undefined,
    }));

    // Log product creation
    await prisma.auditLog.create({
      data: {
        action: 'PRODUCT_CREATED',
        entity: 'Product',
        entityId: product.id,
        userId: (session.user as any).id,
        details: `Product created: ${product.name}`,
        ipAddress: ip,
        userAgent: request.headers.get('user-agent') || undefined,
      },
    });

    return NextResponse.json(
      { product },
      { status: 201, headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
