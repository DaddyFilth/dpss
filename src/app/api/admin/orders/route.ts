import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/utils/prisma';
import { rateLimit, getClientIP, getSecurityHeaders } from '@/lib/security/rate-limit';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { getSessionRole, isAdminRole } from '@/lib/auth/roles';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !isAdminRole(getSessionRole(session))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const ip = getClientIP(request);
    const rateLimitResult = await rateLimit(ip, 'admin-orders', 50, 900000);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const cursor = searchParams.get('cursor');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    const hasMore = orders.length > limit;
    const items = hasMore ? orders.slice(0, limit) : orders;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    const formattedOrders = items.map((order: any) => ({
      ...order,
      total: Number(order.total),
      subtotal: Number(order.subtotal),
      tax: Number(order.tax),
      shipping: Number(order.shipping),
    }));

    const total = await prisma.order.count({ where });

    return NextResponse.json(
      { orders: formattedOrders, total, nextCursor },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
