'use client'

import { useCallback, useState, useEffect } from 'react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { startCheckoutSession } from '@/app/actions/checkout'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripeCheckoutProps {
  productId?: string
  cartId?: string
}

export default function StripeCheckout({ productId, cartId }: StripeCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  const fetchClientSecret = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      let result
      if (productId) {
        result = await startCheckoutSession(productId)
      } else if (cartId) {
        const { startCheckoutSessionForCart } = await import('@/app/actions/checkout')
        result = await startCheckoutSessionForCart(cartId)
      } else {
        throw new Error('Either productId or cartId is required')
      }

      setClientSecret(result.clientSecret)
    } catch (err: any) {
      console.error('Failed to create checkout session:', err)
      setError(err.message || 'Failed to initialize checkout')
    } finally {
      setLoading(false)
    }
  }, [productId, cartId])

  useEffect(() => {
    fetchClientSecret()
  }, [fetchClientSecret])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchClientSecret}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Unable to initialize checkout</p>
      </div>
    )
  }

  const options: any = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#6366f1',
        colorBackground: '#ffffff',
        colorText: '#1a1a1a',
      },
    },
  }

  return (
    <div id="checkout" className="w-full">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}

// Standalone checkout page component
export function CheckoutPage({ productId }: { productId: string }) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h1 className="text-2xl font-bold">Checkout</h1>
          </div>
          <div className="p-6">
            <StripeCheckout productId={productId} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Cart checkout page component
export function CartCheckoutPage({ cartId }: { cartId: string }) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h1 className="text-2xl font-bold">Complete Your Order</h1>
          </div>
          <div className="p-6">
            <StripeCheckout cartId={cartId} />
          </div>
        </div>
      </div>
    </div>
  )
}
