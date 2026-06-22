import { NextRequest, NextResponse } from 'next/server';
import { createPaymentIntent } from '@/lib/payments/stripe';
import { rateLimit, getClientIP, getSecurityHeaders } from '@/lib/security/rate-limit';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { z } from 'zod';
import { prisma } from '@/lib/utils/prisma';

const paymentSchema = z.object({
  amount: z.number().positive().optional(),
  currency: z.string().default('USD'),
  metadata: z.record(z.string(), z.string()).optional(),
  orderId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    // Rate limiting
    const ip = getClientIP(request);
    const rateLimitResult = await rateLimit(ip, 'stripe-payment', 10, 3600000);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many payment attempts' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validationResult = paymentSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const { currency, metadata, orderId } = validationResult.data;

    // Add user ID to metadata
    const enhancedMetadata: Record<string, string> = {
      ...metadata,
      userId: session.user.id,
    };

    // Get or create Stripe customer
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        stripeCustomerId: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }

    const { getOrCreateCustomer } = await import('@/lib/payments/stripe');
    const customerResult = await getOrCreateCustomer(
      user.id,
      user.email,
      user.name || undefined
    );

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    if (order.paymentStatus !== 'PENDING') {
      return NextResponse.json(
        { error: 'Order is not pending payment' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    enhancedMetadata.orderId = orderId;

    enhancedMetadata.customerId = customerResult.customerId;

    const result = await createPaymentIntent({
      amount: Number(order.total),
      currency,
      metadata: enhancedMetadata,
      customerId: customerResult.customerId,
    });

    return NextResponse.json(
      result,
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Stripe payment intent error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
