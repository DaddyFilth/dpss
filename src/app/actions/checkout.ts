'use server'

import { headers } from 'next/headers'
import { getStripeClient } from '@/lib/payments/stripe'
import logger from '@/lib/logger'
import { prisma } from '@/lib/utils/prisma'
import { rateLimit, getClientIP, getSecurityHeaders } from '@/lib/security/rate-limit'

interface ProductData {
  id: string
  name: string
  description: string
  price: number
}

async function getProduct(productId: string): Promise<ProductData> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  })

  if (!product) {
    throw new Error('Product not found')
  }

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
  }
}

export async function startCheckoutSession(productId: string) {
  try {
    // Rate limiting
    const headersList = await headers()
    const ip = getClientIP({ headers: headersList } as any)
    const rateLimitResult = await rateLimit(ip, 'checkout-session', 10, 60000)
    
    if (!rateLimitResult.success) {
      throw new Error('Too many checkout attempts. Please try again later.')
    }

    // Validate product ID
    if (!productId) {
      throw new Error('Product ID is required')
    }

    // Fetch product from database
    const product = await getProduct(productId)

    // Convert price to cents
    const priceInCents = Math.round(product.price * 100)

    // Create Checkout Session
    const session = await getStripeClient().checkout.sessions.create({
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        productId: product.id,
        productName: product.name,
      },
    })

    if (!session.client_secret) {
      throw new Error('Failed to create checkout session')
    }

    return {
      clientSecret: session.client_secret,
      sessionId: session.id,
      url: session.url,
    }
  } catch (error: any) {
    logger.error({ err: error }, 'Checkout session creation error')
    throw new Error(error.message || 'Failed to create checkout session')
  }
}

export async function startCheckoutSessionForCart(cartId: string) {
  try {
    // Rate limiting
    const headersList = await headers()
    const ip = getClientIP({ headers: headersList } as any)
    const rateLimitResult = await rateLimit(ip, 'checkout-cart', 5, 60000)
    
    if (!rateLimitResult.success) {
      throw new Error('Too many checkout attempts. Please try again later.')
    }

    // Fetch cart with items
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty or not found')
    }

    // Convert cart items to line items
    const lineItems = cart.items.map(item => {
      const priceInCents = Math.round(Number(item.product.price) * 100)
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
            description: item.product.description,
            images: [item.product.image],
          },
          unit_amount: priceInCents,
        },
        quantity: item.quantity,
      }
    })

    // Calculate total
    const totalAmount = lineItems.reduce((sum, item) => sum + (item.price_data.unit_amount * item.quantity), 0)

    // Create Checkout Session
    const session = await getStripeClient().checkout.sessions.create({
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      line_items: lineItems,
      mode: 'payment',
      metadata: {
        cartId: cart.id,
        itemCount: cart.items.length.toString(),
      },
    })

    if (!session.client_secret) {
      throw new Error('Failed to create checkout session')
    }

    return {
      clientSecret: session.client_secret,
      sessionId: session.id,
      url: session.url,
    }
  } catch (error: any) {
    logger.error({ err: error }, 'Cart checkout session creation error')
    throw new Error(error.message || 'Failed to create checkout session')
  }
}

export async function retrieveCheckoutSession(sessionId: string) {
  try {
    const session = await getStripeClient().checkout.sessions.retrieve(sessionId)
    
    return {
      status: session.status,
      paymentStatus: session.payment_status,
      customerEmail: session.customer_details?.email,
      totalAmount: session.amount_total ? session.amount_total / 100 : 0,
    }
  } catch (error: any) {
    logger.error({ err: error }, 'Checkout session retrieval error')
    throw new Error(error.message || 'Failed to retrieve checkout session')
  }
}
