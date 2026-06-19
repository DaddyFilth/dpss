import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { XCircle } from 'lucide-react'

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Your payment was cancelled. You can try again anytime.
          </p>
          <div className="space-y-2">
            <a
              href="/"
              className="block w-full py-2 px-4 bg-primary text-primary-foreground rounded hover:opacity-90 text-center"
            >
              Return to Store
            </a>
            <a
              href="#products"
              className="block w-full py-2 px-4 border border-input rounded hover:bg-muted text-center"
            >
              Browse Products
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
