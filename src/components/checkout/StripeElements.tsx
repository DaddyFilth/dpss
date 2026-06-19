'use client'

import { useState, useEffect } from 'react'
import { loadStripe, StripeElementsOptions, PaymentIntent } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { CheckoutForm } from './CheckoutForm'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripeElementsProps {
  clientSecret: string
  amount: number
  onSuccess?: (paymentIntent: PaymentIntent) => void
  onCancel?: () => void
}

export function StripeElements({ 
  clientSecret, 
  amount, 
  onSuccess,
  onCancel 
}: StripeElementsProps) {
  const [stripe, setStripe] = useState<any>(null)
  const [elements, setElements] = useState<any>(null)

  useEffect(() => {
    const initStripe = async () => {
      const stripeInstance = await stripePromise
      setStripe(stripeInstance)
    }
    initStripe()
  }, [])

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#6366f1',
        colorBackground: '#ffffff',
        colorText: '#1a1a1a',
        colorDanger: '#df1b41',
        fontFamily: 'system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '6px',
      },
    },
    fonts: [
      {
        cssSrc: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
      },
    ],
  }

  return (
    <div className="w-full">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm 
            amount={amount}
            onSuccess={onSuccess}
            onCancel={onCancel}
          />
        </Elements>
      )}
    </div>
  )
}
