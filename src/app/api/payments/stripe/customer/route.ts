import logger from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { 
  getOrCreateCustomer, 
  updateCustomer, 
  getCustomer,
  listCustomerPaymentMethods 
} from '@/lib/payments/stripe';
import { rateLimit, getClientIP, getSecurityHeaders } from '@/lib/security/rate-limit';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { prisma } from '@/lib/utils/prisma';
import { z } from 'zod';

const updateCustomerSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  metadata: z.record(z.string(), z.string()).optional(),
});

// GET - Retrieve customer information
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
    const rateLimitResult = await rateLimit(ip, 'customer-info', 30, 900000);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    // Get user with Stripe customer ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
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

    // Get or create Stripe customer
    const customerResult = await getOrCreateCustomer(
      user.id,
      user.email,
      user.name || undefined
    );

    // Get payment methods
    let paymentMethods: any[] = [];
    if (customerResult.customerId) {
      const methods = await listCustomerPaymentMethods(customerResult.customerId);
      paymentMethods = methods.data;
    }

    return NextResponse.json(
      {
        customerId: customerResult.customerId,
        customerCreated: customerResult.created,
        paymentMethods,
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    logger.error('Customer retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve customer information' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// POST - Create or get customer
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
    const rateLimitResult = await rateLimit(ip, 'customer-create', 10, 3600000);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const customerResult = await getOrCreateCustomer(userId, email, name);

    return NextResponse.json(
      {
        customerId: customerResult.customerId,
        customerCreated: customerResult.created,
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    logger.error('Customer creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create or retrieve customer' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// PATCH - Update customer
export async function PATCH(request: NextRequest) {
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
    const rateLimitResult = await rateLimit(ip, 'customer-update', 20, 3600000);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const body = await request.json();
    const validationResult = updateCustomerSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Get user's Stripe customer ID
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

    const result = await updateCustomer(user.stripeCustomerId, validationResult.data);

    return NextResponse.json(
      {
        customerId: result.customerId,
        customer: result.customer,
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    logger.error('Customer update error:', error);
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
