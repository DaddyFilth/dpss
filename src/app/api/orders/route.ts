import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/utils/prisma';
import { rateLimit, getClientIP, getSecurityHeaders } from '@/lib/security/rate-limit';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { getOrCreateCustomer, createPaymentIntent } from '@/lib/payments/stripe';
import { z } from 'zod';

const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
  })),
  shippingAddress: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.string(),
  }),
  paymentMethod: z.enum(['stripe']),
});

// POST - Create order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const userId = (session.user as any).id;
    const ip = getClientIP(request);
    const rateLimitResult = await rateLimit(ip, 'order-create', 10, 3600000);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many order attempts' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const body = await request.json();
    const validationResult = createOrderSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const { items, shippingAddress, paymentMethod } = validationResult.data;

    // Get user information
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }

    // Fetch products and calculate totals
    const products = await prisma.product.findMany({
      where: {
        id: { in: items.map(item => item.productId) },
      },
    });

    if (products.length !== items.length) {
      return NextResponse.json(
        { error: 'Some products not found' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Calculate order totals
    let subtotal = 0;
    const orderItems = items.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) throw new Error('Product not found');
      
      const itemTotal = Number(product.price) * item.quantity;
      subtotal += itemTotal;
      
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: Number(product.price),
      };
    });

    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 50 ? 0 : 10; // Free shipping over $50
    const total = subtotal + tax + shipping;

    // Check stock
    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product?.name}` },
          { status: 400, headers: getSecurityHeaders() }
        );
      }
    }

    // Create or get Stripe customer
    const customerResult = await getOrCreateCustomer(
      user.id,
      user.email,
      user.name || undefined
    );

    // Create order with pending payment status
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId,
          status: 'PENDING',
          paymentMethod: paymentMethod.toUpperCase(),
          paymentStatus: 'PENDING',
          total,
          subtotal,
          tax,
          shipping,
          shippingName: shippingAddress.name,
          shippingEmail: shippingAddress.email,
          shippingPhone: shippingAddress.phone,
          shippingAddress: shippingAddress.address,
          shippingCity: shippingAddress.city,
          shippingState: shippingAddress.state,
          shippingZip: shippingAddress.zip,
          shippingCountry: shippingAddress.country,
          items: {
            create: orderItems,
          },
        },
      });

      // Update product stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Clear cart items
      await tx.cartItem.deleteMany({
        where: {
          cart: {
            userId,
          },
          productId: { in: items.map(i => i.productId) },
        },
      });

      return newOrder;
    });

    // Create payment intent with customer
    const paymentIntent = await createPaymentIntent({
      amount: total,
      currency: 'USD',
      metadata: {
        orderId: order.id,
        userId,
        customerId: customerResult.customerId,
      },
    });

    // Update order with payment intent ID
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentId: paymentIntent.paymentIntentId,
      },
    });

    // Log order creation
    await prisma.auditLog.create({
      data: {
        action: 'ORDER_CREATED',
        entity: 'Order',
        entityId: order.id,
        details: `Order created with ${items.length} items. Total: $${total.toFixed(2)}`,
        userId,
        ipAddress: ip,
        userAgent: request.headers.get('user-agent') || undefined,
      },
    });

    return NextResponse.json(
      {
        order: {
          id: order.id,
          total: Number(order.total),
          status: order.status,
          paymentStatus: order.paymentStatus,
          items: orderItems,
        },
        paymentIntent: {
          clientSecret: paymentIntent.clientSecret,
          paymentIntentId: paymentIntent.paymentIntentId,
        },
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// GET - Get user orders
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const userId = (session.user as any).id;
    const ip = getClientIP(request);
    const rateLimitResult = await rateLimit(ip, 'orders-list', 30, 900000);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
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
    }).then(orders => orders.map((order: any) => ({
      ...order,
      total: Number(order.total),
      subtotal: Number(order.subtotal),
      tax: Number(order.tax),
      shipping: Number(order.shipping),
    })));

    return NextResponse.json(
      { orders },
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
