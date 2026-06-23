import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Package, Clock } from 'lucide-react'

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string; payment_intent?: string; orderId?: string }
}) {
  const { session_id, payment_intent, orderId } = searchParams

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Thank you for your order. We'll send you an email with the order details.
          </p>
          
          {(session_id || payment_intent) && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">
                {session_id ? 'Session ID' : 'Payment Intent ID'}
              </p>
              <p className="text-sm font-mono text-gray-700">
                {session_id || payment_intent}
              </p>
            </div>
          )}

          {orderId && (
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                <p className="font-medium text-blue-900">Order Placed</p>
              </div>
              <p className="text-sm text-blue-700">
                Order ID: <span className="font-mono">{orderId}</span>
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-blue-600">
                <Clock className="w-4 h-4" />
                <span>Processing your order</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Link
              href="/"
              className="block w-full py-2 px-4 bg-primary text-primary-foreground rounded hover:opacity-90 text-center"
            >
              Continue Shopping
            </Link>
            <Link
              href="/admin/orders"
              className="block w-full py-2 px-4 border border-input rounded hover:bg-muted text-center"
            >
              View Orders
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
