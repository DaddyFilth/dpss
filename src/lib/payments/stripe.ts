// Stripe payment integration with security-first approach
import 'server-only'
import Stripe from 'stripe';
import { encrypt } from '@/lib/security/encryption';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
  typescript: true,
});

export { stripe };

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

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error('Stripe payment intent creation error:', error);
    throw new Error('Failed to create payment intent');
  }
};

export const confirmPayment = async (paymentIntentId: string) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
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
    console.error('Stripe payment confirmation error:', error);
    throw new Error('Failed to confirm payment');
  }
};

export const createCustomer = async (input: CustomerInput) => {
  try {
    const customer = await stripe.customers.create({
      email: input.email,
      name: input.name,
      metadata: input.metadata,
    });

    return {
      customerId: customer.id,
      customer,
    };
  } catch (error) {
    console.error('Stripe customer creation error:', error);
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
      const customer = await stripe.customers.retrieve(user.stripeCustomerId);
      return {
        customerId: user.stripeCustomerId,
        customer,
        created: false,
      };
    }

    // Create new customer
    const newCustomer = await stripe.customers.create({
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
    console.error('Stripe get or create customer error:', error);
    throw new Error('Failed to get or create customer');
  }
};

export const updateCustomer = async (customerId: string, updates: {
  name?: string;
  email?: string;
  metadata?: Record<string, string>;
}) => {
  try {
    const customer = await stripe.customers.update(customerId, updates);
    return {
      customerId: customer.id,
      customer,
    };
  } catch (error) {
    console.error('Stripe customer update error:', error);
    throw new Error('Failed to update customer');
  }
};

export const getCustomer = async (customerId: string) => {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return customer;
  } catch (error) {
    console.error('Stripe customer retrieval error:', error);
    throw new Error('Failed to retrieve customer');
  }
};

export const listCustomerPaymentMethods = async (customerId: string) => {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });
    return paymentMethods;
  } catch (error) {
    console.error('Stripe payment methods list error:', error);
    throw new Error('Failed to list payment methods');
  }
};

export const attachPaymentMethod = async (paymentMethodId: string, customerId: string) => {
  try {
    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
    return paymentMethod;
  } catch (error) {
    console.error('Stripe payment method attach error:', error);
    throw new Error('Failed to attach payment method');
  }
};

export const detachPaymentMethod = async (paymentMethodId: string) => {
  try {
    const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId);
    return paymentMethod;
  } catch (error) {
    console.error('Stripe payment method detach error:', error);
    throw new Error('Failed to detach payment method');
  }
};

export const setDefaultPaymentMethod = async (customerId: string, paymentMethodId: string) => {
  try {
    const customer = await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
    return customer;
  } catch (error) {
    console.error('Stripe set default payment method error:', error);
    throw new Error('Failed to set default payment method');
  }
};

export const handleWebhook = async (payload: string, signature: string) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set');
  }

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );

    return event;
  } catch (error) {
    console.error('Stripe webhook verification error:', error);
    throw new Error('Invalid webhook signature');
  }
};

export const refundPayment = async (paymentIntentId: string, amount?: number) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    // Create refund using payment intent
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
    });

    return {
      refundId: refund.id,
      refund,
    };
  } catch (error) {
    console.error('Stripe refund error:', error);
    throw new Error('Failed to process refund');
  }
};

// Get payment method details (for display purposes)
export const getPaymentMethod = async (paymentMethodId: string) => {
  try {
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    return paymentMethod;
  } catch (error) {
    console.error('Stripe payment method retrieval error:', error);
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
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      default_payment_method: paymentMethodId,
    });

    return {
      subscriptionId: subscription.id,
      subscription,
    };
  } catch (error) {
    console.error('Stripe subscription creation error:', error);
    throw new Error('Failed to create subscription');
  }
};

export const formatAmount = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
};
