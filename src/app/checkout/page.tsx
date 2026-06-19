import { CheckoutPage } from '@/components/checkout/StripeCheckout'

export default function CheckoutPageComponent({
  searchParams,
}: {
  searchParams: { productId?: string }
}) {
  const productId = searchParams.productId

  if (!productId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground">Please select a product to checkout.</p>
        </div>
      </div>
    )
  }

  return <CheckoutPage productId={productId} />
}
