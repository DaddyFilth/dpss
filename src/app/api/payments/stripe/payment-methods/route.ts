import logger from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { 
  attachPaymentMethod, 
  detachPaymentMethod,
  setDefaultPaymentMethod,
  listCustomerPaymentMethods 
} from '@/lib/payments/stripe';
import { rateLimit, getClientIP, getSecurityHeaders } from '@/lib/security/rate-limit';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { prisma } from '@/lib/utils/prisma';
import { z } from 'zod';

const attachSchema = z.object({
  paymentMethodId: z.string(),
});

const setDefaultSchema = z.object({
  paymentMethodId: z.string(),
});

// GET - List payment methods
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const userId = session.user.id;
    const ip = getClientIP(request);
    const rateLimitResult = await rateLimit(ip, 'payment-methods-list', 30, 900000);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true },
    });

    if (!user?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'Stripe customer not found' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }

    const paymentMethods = await listCustomerPaymentMethods(user.stripeCustomerId);

    return NextResponse.json(
      {
        paymentMethods: paymentMethods.data,
        hasMore: paymentMethods.has_more,
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    logger.error('Payment methods list error:', error);
    return NextResponse.json(
      { error: 'Failed to list payment methods' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// POST - Attach payment method
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const userId = session.user.id;
    const ip = getClientIP(request);
    const rateLimitResult = await rateLimit(ip, 'payment-method-attach', 10, 3600000);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const body = await request.json();
    const validationResult = attachSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true },
    });

    if (!user?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'Stripe customer not found' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }

    const paymentMethod = await attachPaymentMethod(
      validationResult.data.paymentMethodId,
      user.stripeCustomerId
    );

    return NextResponse.json(
      { paymentMethod },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    logger.error('Payment method attach error:', error);
    return NextResponse.json(
      { error: 'Failed to attach payment method' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
