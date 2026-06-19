'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { StripeElements } from '@/components/checkout/StripeElements'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ShoppingBag } from 'lucide-react'

export default function ElementsCheckoutPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const amount = parseFloat(searchParams.get('amount') || '0')
  const [clientSecret, setClientSecret] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch('/api/payments/stripe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            currency: 'USD',
            orderId: orderId || undefined,
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to create payment intent')
        }

        const data = await response.json()
        setClientSecret(data.clientSecret)
      } catch (err: any) {
        console.error('Payment intent creation error:', err)
        setError(err.message || 'Failed to initialize payment')
      } finally {
        setLoading(false)
      }
    }

    if (amount > 0) {
      createPaymentIntent()
    }
  }, [amount, orderId])

  const handlePaymentSuccess = (paymentIntent: any) => {
    // Redirect to success page or handle success
    window.location.href = `/checkout/success?payment_intent=${paymentIntent.id}`
  }

  const handleCancel = () => {
    window.history.back()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Initializing payment...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Payment Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2 px-4 bg-primary text-primary-foreground rounded hover:opacity-90"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Unable to Initialize Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Please try again or contact support if the problem persists.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <ShoppingBag className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold">Secure Checkout</h1>
          </div>
          <p className="text-muted-foreground">
            Complete your payment securely with Stripe
          </p>
        </div>

        <StripeElements
          clientSecret={clientSecret}
          amount={amount}
          onSuccess={handlePaymentSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}
