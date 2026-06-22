import logger from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { 
  detachPaymentMethod,
  setDefaultPaymentMethod 
} from '@/lib/payments/stripe';
import { rateLimit, getClientIP, getSecurityHeaders } from '@/lib/security/rate-limit';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { prisma } from '@/lib/utils/prisma';

// PATCH - Set default payment method
export async function PATCH(
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
    const { id: paymentMethodId } = await params;
    const ip = getClientIP(request);
    const rateLimitResult = await rateLimit(ip, 'payment-method-update', 20, 3600000);
    
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

    const customer = await setDefaultPaymentMethod(user.stripeCustomerId, paymentMethodId);

    return NextResponse.json(
      { customer },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    logger.error('Set default payment method error:', error);
    return NextResponse.json(
      { error: 'Failed to set default payment method' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// DELETE - Detach payment method
export async function DELETE(
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
    const { id: paymentMethodId } = await params;
    const ip = getClientIP(request);
    const rateLimitResult = await rateLimit(ip, 'payment-method-delete', 10, 3600000);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const paymentMethod = await detachPaymentMethod(paymentMethodId);

    return NextResponse.json(
      { paymentMethod },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    logger.error('Detach payment method error:', error);
    return NextResponse.json(
      { error: 'Failed to detach payment method' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
