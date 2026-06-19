import { NextRequest, NextResponse } from 'next/server';
import { handleWebhook } from '@/lib/payments/stripe';
import { prisma } from '@/lib/utils/prisma';
import { getSecurityHeaders } from '@/lib/security/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const event = await handleWebhook(body, signature);

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as any;
        
        // Update order payment status
        if (paymentIntent.metadata.orderId) {
          await prisma.order.update({
            where: { id: paymentIntent.metadata.orderId },
            data: {
              paymentStatus: 'COMPLETED',
              status: 'PROCESSING',
            },
          });

          // Log successful payment
          await prisma.auditLog.create({
            data: {
              action: 'PAYMENT_COMPLETED',
              entity: 'Order',
              entityId: paymentIntent.metadata.orderId,
              details: `Stripe payment succeeded: ${paymentIntent.id}`,
              userId: paymentIntent.metadata.userId,
            },
          });
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as any;
        
        if (paymentIntent.metadata.orderId) {
          await prisma.order.update({
            where: { id: paymentIntent.metadata.orderId },
            data: {
              paymentStatus: 'FAILED',
              status: 'CANCELLED',
            },
          });
        }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as any;
        
        // Find order by payment intent ID
        const order = await prisma.order.findFirst({
          where: { paymentId: charge.payment_intent },
        });

        if (order) {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: 'REFUNDED',
              status: 'REFUNDED',
            },
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json(
      { received: true },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
