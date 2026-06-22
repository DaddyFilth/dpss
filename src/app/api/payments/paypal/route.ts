import logger from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { createPayPalOrder, capturePayPalOrder } from '@/lib/payments/paypal';
import { rateLimit, getClientIP, getSecurityHeaders } from '@/lib/security/rate-limit';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { z } from 'zod';

const paypalOrderSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  description: z.string().optional(),
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
    const rateLimitResult = await rateLimit(ip, 'paypal-payment', 10, 3600000);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many payment attempts' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const body = await request.json();
    const action = body.action;

    if (action === 'create') {
      // Validate input
      const validationResult = paypalOrderSchema.safeParse(body);
      
      if (!validationResult.success) {
        return NextResponse.json(
          { error: 'Invalid input', details: validationResult.error.issues },
          { status: 400, headers: getSecurityHeaders() }
        );
      }

      const { amount, currency, description } = validationResult.data;

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      
      const result = await createPayPalOrder({
        amount,
        currency,
        description: description || 'Order payment',
        returnUrl: `${baseUrl}/checkout/success?method=paypal`,
        cancelUrl: `${baseUrl}/checkout/cancel?method=paypal`,
      });

      return NextResponse.json(
        result,
        { headers: getSecurityHeaders() }
      );
    } else if (action === 'capture') {
      const { orderId } = body;
      
      if (!orderId) {
        return NextResponse.json(
          { error: 'orderId is required' },
          { status: 400, headers: getSecurityHeaders() }
        );
      }

      const result = await capturePayPalOrder(orderId);

      return NextResponse.json(
        result,
        { headers: getSecurityHeaders() }
      );
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }
  } catch (error) {
    logger.error('PayPal payment error:', error);
    return NextResponse.json(
      { error: 'Failed to process PayPal payment' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
