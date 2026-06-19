import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string }
}) {
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
          {searchParams.session_id && (
            <p className="text-sm text-muted-foreground">
              Session ID: {searchParams.session_id}
            </p>
          )}
          <div className="space-y-2">
            <a
              href="/"
              className="block w-full py-2 px-4 bg-primary text-primary-foreground rounded hover:opacity-90 text-center"
            >
              Continue Shopping
            </a>
            <a
              href="/admin/orders"
              className="block w-full py-2 px-4 border border-input rounded hover:bg-muted text-center"
            >
              View Orders
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
