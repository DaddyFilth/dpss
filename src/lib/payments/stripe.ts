import logger from '@/lib/logger';
// Stripe payment integration with security-first approach
import 'server-only'
import Stripe from 'stripe';
import { encrypt } from '@/lib/security/encryption';

let _stripe: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-05-27.dahlia',
      typescript: true,
    });
  }
  return _stripe;
}

interface PaymentIntentInput {
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
}

interface CustomerInput {
  email: string;
  name: string;
  metadata?: Record<string, string>;
}

export const createPaymentIntent = async (input: PaymentIntentInput & { customerId?: string }) => {
  try {
    const paymentIntentParams: any = {
      amount: Math.round(input.amount * 100), // Convert to cents
      currency: input.currency.toLowerCase(),
      metadata: input.metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    };

    // Add customer if provided
    if (input.customerId) {
      paymentIntentParams.customer = input.customerId;
    }

    const paymentIntent = await getStripeClient().paymentIntents.create(paymentIntentParams);

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    logger.error({ err: error }, 'Stripe payment intent creation error');
    throw new Error('Failed to create payment intent');
  }
};

export const confirmPayment = async (paymentIntentId: string) => {
  try {
    const paymentIntent = await getStripeClient().paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      return {
        success: true,
        paymentIntent,
      };
    }
    
    return {
      success: false,
      status: paymentIntent.status,
    };
  } catch (error) {
    logger.error({ err: error }, 'Stripe payment confirmation error');
    throw new Error('Failed to confirm payment');
  }
};

export const createCustomer = async (input: CustomerInput) => {
  try {
    const customer = await getStripeClient().customers.create({
      email: input.email,
      name: input.name,
      metadata: input.metadata,
    });

    return {
      customerId: customer.id,
      customer,
    };
  } catch (error) {
    logger.error({ err: error }, 'Stripe customer creation error');
    throw new Error('Failed to create customer');
  }
};

export const getOrCreateCustomer = async (userId: string, email: string, name?: string) => {
  try {
    // Check if user already has a Stripe customer ID
    const { prisma } = await import('@/lib/utils/prisma');
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true },
    });

    if (user?.stripeCustomerId) {
      // Retrieve existing customer
      const customer = await getStripeClient().customers.retrieve(user.stripeCustomerId);
      return {
        customerId: user.stripeCustomerId,
        customer,
        created: false,
      };
    }

    // Create new customer
    const newCustomer = await getStripeClient().customers.create({
      email,
      name: name || email,
      metadata: {
        userId,
      },
    });

    // Update user with Stripe customer ID
    await prisma.user.update({
      where: { id: userId },
      data: {
        stripeCustomerId: newCustomer.id,
      },
    });

    return {
      customerId: newCustomer.id,
      customer: newCustomer,
      created: true,
    };
  } catch (error) {
    logger.error({ err: error }, 'Stripe get or create customer error');
    throw new Error('Failed to get or create customer');
  }
};

export const updateCustomer = async (customerId: string, updates: {
  name?: string;
  email?: string;
  metadata?: Record<string, string>;
}) => {
  try {
    const customer = await getStripeClient().customers.update(customerId, updates);
    return {
      customerId: customer.id,
      customer,
    };
  } catch (error) {
    logger.error({ err: error }, 'Stripe customer update error');
    throw new Error('Failed to update customer');
  }
};

export const getCustomer = async (customerId: string) => {
  try {
    const customer = await getStripeClient().customers.retrieve(customerId);
    return customer;
  } catch (error) {
    logger.error({ err: error }, 'Stripe customer retrieval error');
    throw new Error('Failed to retrieve customer');
  }
};

export const listCustomerPaymentMethods = async (customerId: string) => {
  try {
    const paymentMethods = await getStripeClient().paymentMethods.list({
      customer: customerId,
      type: 'card',
    });
    return paymentMethods;
  } catch (error) {
    logger.error({ err: error }, 'Stripe payment methods list error');
    throw new Error('Failed to list payment methods');
  }
};

export const attachPaymentMethod = async (paymentMethodId: string, customerId: string) => {
  try {
    const paymentMethod = await getStripeClient().paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
    return paymentMethod;
  } catch (error) {
    logger.error({ err: error }, 'Stripe payment method attach error');
    throw new Error('Failed to attach payment method');
  }
};

export const detachPaymentMethod = async (paymentMethodId: string) => {
  try {
    const paymentMethod = await getStripeClient().paymentMethods.detach(paymentMethodId);
    return paymentMethod;
  } catch (error) {
    logger.error({ err: error }, 'Stripe payment method detach error');
    throw new Error('Failed to detach payment method');
  }
};

export const setDefaultPaymentMethod = async (customerId: string, paymentMethodId: string) => {
  try {
    const customer = await getStripeClient().customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
    return customer;
  } catch (error) {
    logger.error({ err: error }, 'Stripe set default payment method error');
    throw new Error('Failed to set default payment method');
  }
};

export const handleWebhook = async (payload: string, signature: string) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set');
  }

  try {
    const event = getStripeClient().webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );

    return event;
  } catch (error) {
    logger.error({ err: error }, 'Stripe webhook verification error');
    throw new Error('Invalid webhook signature');
  }
};

export const refundPayment = async (paymentIntentId: string, amount?: number) => {
  try {
    const paymentIntent = await getStripeClient().paymentIntents.retrieve(paymentIntentId);
    
    // Create refund using payment intent
    const refund = await getStripeClient().refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
    });

    return {
      refundId: refund.id,
      refund,
    };
  } catch (error) {
    logger.error({ err: error }, 'Stripe refund error');
    throw new Error('Failed to process refund');
  }
};

// Get payment method details (for display purposes)
export const getPaymentMethod = async (paymentMethodId: string) => {
  try {
    const paymentMethod = await getStripeClient().paymentMethods.retrieve(paymentMethodId);
    return paymentMethod;
  } catch (error) {
    logger.error({ err: error }, 'Stripe payment method retrieval error');
    throw new Error('Failed to retrieve payment method');
  }
};

// Create subscription (for future premium features)
export const createSubscription = async (
  customerId: string,
  priceId: string,
  paymentMethodId: string
) => {
  try {
    const subscription = await getStripeClient().subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      default_payment_method: paymentMethodId,
    });

    return {
      subscriptionId: subscription.id,
      subscription,
    };
  } catch (error) {
    logger.error({ err: error }, 'Stripe subscription creation error');
    throw new Error('Failed to create subscription');
  }
};

export const formatAmount = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
};
