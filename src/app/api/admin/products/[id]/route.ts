import logger from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/utils/prisma';
import { rateLimit, getClientIP, getSecurityHeaders } from '@/lib/security/rate-limit';
import { sanitizeProductContent, sanitizeDisplayName } from '@/lib/security/sanitize';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { getSessionRole, isAdminRole } from '@/lib/auth/roles';
import { z } from 'zod';
import { parseJsonString, toJsonString } from '@/lib/utils/json';

const productUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  comparePrice: z.number().positive().optional(),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  stock: z.number().int().min(0).optional(),
  sku: z.string().optional(),
  featured: z.boolean().optional(),
});

// GET single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !isAdminRole(getSessionRole(session))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }

    return NextResponse.json(
      { product: { 
        ...product, 
        price: Number(product.price),
        comparePrice: product.comparePrice ? Number(product.comparePrice) : undefined,
        aiScore: product.aiScore ?? undefined,
      } },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    logger.error({ err: error }, 'Product fetch error');
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// PUT update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !isAdminRole(getSessionRole(session))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const ip = getClientIP(request);
    const rateLimitResult = await rateLimit(ip, 'update-product', 30, 3600000);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const body = await request.json();
    const validationResult = productUpdateSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const { id } = await params;
    
    // Sanitize user input
    const updateData: any = { ...validationResult.data };
    if (updateData.name) {
      updateData.name = sanitizeDisplayName(updateData.name);
    }
    if (updateData.description) {
      updateData.description = sanitizeProductContent(updateData.description);
    }
    if (updateData.category) {
      updateData.category = sanitizeDisplayName(updateData.category);
    }
    if (updateData.sku) {
      updateData.sku = sanitizeDisplayName(updateData.sku);
    }
    
    // Convert arrays to JSON strings for SQLite
    if (updateData.images) {
      updateData.images = toJsonString(updateData.images);
    }
    if (updateData.tags) {
      updateData.tags = toJsonString(updateData.tags);
    }
    
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    }).then((p: any) => ({
      ...p,
      price: Number(p.price),
      comparePrice: p.comparePrice ? Number(p.comparePrice) : undefined,
      aiScore: p.aiScore ?? undefined,
    }));

    // Log product update
    await prisma.auditLog.create({
      data: {
        action: 'PRODUCT_UPDATED',
        entity: 'Product',
        entityId: product.id,
        userId: session.user.id,
        details: `Product updated: ${product.name}`,
        ipAddress: ip,
        userAgent: request.headers.get('user-agent') || undefined,
      },
    });

    return NextResponse.json(
      { product },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    logger.error({ err: error }, 'Product update error');
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// DELETE product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !isAdminRole(getSessionRole(session))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const ip = getClientIP(request);
    const rateLimitResult = await rateLimit(ip, 'delete-product', 10, 3600000);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const { id } = await params;
    const product = await prisma.product.delete({
      where: { id },
    });

    // Log product deletion
    await prisma.auditLog.create({
      data: {
        action: 'PRODUCT_DELETED',
        entity: 'Product',
        entityId: product.id,
        userId: session.user.id,
        details: `Product deleted: ${product.name}`,
        ipAddress: ip,
        userAgent: request.headers.get('user-agent') || undefined,
      },
    });

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    logger.error({ err: error }, 'Product deletion error');
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
