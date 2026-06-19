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

export const createPaymentIntent = async (input: PaymentIntentInput) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(input.amount * 100), // Convert to cents
      currency: input.currency.toLowerCase(),
      metadata: input.metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

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
