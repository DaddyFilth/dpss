import logger from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/utils/prisma';
import { rateLimit, getClientIP, getSecurityHeaders } from '@/lib/security/rate-limit';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { getSessionRole, isAdminRole } from '@/lib/auth/roles';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const userId = session.user.id;
    const { id: orderId } = await params;
    const ip = getClientIP(request);
    const rateLimitResult = await rateLimit(ip, 'order-fetch', 30, 900000);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                category: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }

    // Check if user owns the order or is admin
    if (order.userId !== userId && !isAdminRole(getSessionRole(session))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403, headers: getSecurityHeaders() }
      );
    }

    return NextResponse.json(
      {
        order: {
          ...order,
          total: Number(order.total),
          subtotal: Number(order.subtotal),
          tax: Number(order.tax),
          shipping: Number(order.shipping),
        },
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    logger.error('Order fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
