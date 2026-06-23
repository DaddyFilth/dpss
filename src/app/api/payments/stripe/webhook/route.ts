import logger from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { handleWebhook } from '@/lib/payments/stripe';
import { prisma } from '@/lib/utils/prisma';
import { getSecurityHeaders } from '@/lib/security/rate-limit';

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      logger.error(`[${requestId}] Missing stripe signature`);
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    logger.info(`[${requestId}] Processing webhook event`);
    const event = await handleWebhook(body, signature);
    logger.info(`[${requestId}] Webhook event verified: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        logger.info(`[${requestId}] Checkout session completed: ${session.id}`);
        
        // Handle checkout session completion
        if (session.metadata?.orderId) {
          await prisma.$transaction(async (tx: any) => {
            const order = await tx.order.findUnique({
              where: { id: session.metadata.orderId },
            });

            if (order && order.paymentStatus === 'PENDING') {
              await tx.order.update({
                where: { id: session.metadata.orderId },
                data: {
                  paymentStatus: 'COMPLETED',
                  status: 'PROCESSING',
                  paymentId: session.payment_intent,
                },
              });

              await tx.auditLog.create({
                data: {
                  action: 'PAYMENT_COMPLETED',
                  entity: 'Order',
                  entityId: session.metadata.orderId,
                  details: `Checkout session completed: ${session.id}`,
                  userId: session.metadata.userId,
                },
              });
            }
          });
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as any;
        logger.info(`[${requestId}] Payment intent succeeded: ${paymentIntent.id}`);
        
        // Update order payment status
        if (paymentIntent.metadata.orderId) {
          await prisma.$transaction(async (tx: any) => {
            const order = await tx.order.findUnique({
              where: { id: paymentIntent.metadata.orderId },
            });

            if (order) {
              await tx.order.update({
                where: { id: paymentIntent.metadata.orderId },
                data: {
                  paymentStatus: 'COMPLETED',
                  status: 'PROCESSING',
                  paymentId: paymentIntent.id,
                },
              });

              await tx.auditLog.create({
                data: {
                  action: 'PAYMENT_COMPLETED',
                  entity: 'Order',
                  entityId: paymentIntent.metadata.orderId,
                  details: `Stripe payment succeeded: ${paymentIntent.id}`,
                  userId: paymentIntent.metadata.userId,
                },
              });
            }
          });
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as any;
        logger.error(`[${requestId}] Payment intent failed: ${paymentIntent.id}`);
        
        if (paymentIntent.metadata.orderId) {
          await prisma.$transaction(async (tx: any) => {
            await tx.order.update({
              where: { id: paymentIntent.metadata.orderId },
              data: {
                paymentStatus: 'FAILED',
                status: 'CANCELLED',
              },
            });

            await tx.auditLog.create({
              data: {
                action: 'PAYMENT_FAILED',
                entity: 'Order',
                entityId: paymentIntent.metadata.orderId,
                details: `Stripe payment failed: ${paymentIntent.id}. Error: ${paymentIntent.last_payment_error?.message || 'Unknown error'}`,
                userId: paymentIntent.metadata.userId,
              },
            });
          });
        }
        break;
      }

      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object as any;
        logger.info(`[${requestId}] Payment intent canceled: ${paymentIntent.id}`);
        
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
        logger.info(`[${requestId}] Charge refunded: ${charge.id}`);
        
        // Find order by payment intent ID
        const order = await prisma.order.findFirst({
          where: { paymentId: charge.payment_intent },
        });

        if (order) {
          await prisma.$transaction(async (tx: any) => {
            await tx.order.update({
              where: { id: order.id },
              data: {
                paymentStatus: 'REFUNDED',
                status: 'REFUNDED',
              },
            });

            await tx.auditLog.create({
              data: {
                action: 'PAYMENT_REFUNDED',
                entity: 'Order',
                entityId: order.id,
                details: `Charge refunded: ${charge.id}. Amount: ${charge.amount_refunded / 100}`,
                userId: order.userId,
              },
            });
          });
        }
        break;
      }

      case 'charge.dispute.created': {
        const charge = event.data.object as any;
        logger.warn(`[${requestId}] Charge dispute created: ${charge.id}`);
        
        const order = await prisma.order.findFirst({
          where: { paymentId: charge.payment_intent },
        });

        if (order) {
          await prisma.auditLog.create({
            data: {
              action: 'PAYMENT_DISPUTE',
              entity: 'Order',
              entityId: order.id,
              details: `Payment dispute created: ${charge.id}. Reason: ${charge.reason}`,
              userId: order.userId,
            },
          });
        }
        break;
      }

      default:
        logger.info(`[${requestId}] Unhandled event type: ${event.type}`);
    }

    logger.info(`[${requestId}] Webhook processed successfully`);
    return NextResponse.json(
      { received: true },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    logger.error({ err: error, requestId }, 'Stripe webhook error');
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
