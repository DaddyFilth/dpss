'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCustomizer, CustomizationData } from '@/components/customization/product-customizer';
import { useCart } from '@/lib/cart/cart-context';
import { ArrowLeft, ShoppingBag, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  customizable: boolean;
  customizationConfig?: any;
}

export default function ProductCustomizePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [customizationData, setCustomizationData] = useState<CustomizationData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [customizationCost, setCustomizationCost] = useState(0);

  const productId = searchParams.get('id') || '1';

  useEffect(() => {
    // Fetch product data - for now using mock data
    const mockProduct: Product = {
      id: productId || '1',
      name: 'Customizable T-Shirt',
      description: 'Premium cotton t-shirt that you can customize with your own design',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
      customizable: true,
      customizationConfig: {
        text: {
          enabled: true,
          maxChars: 50,
          required: false,
        },
        image: {
          enabled: true,
          maxFiles: 3,
          required: false,
        },
        color: {
          enabled: true,
          options: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'],
        },
      },
    };

    setProduct(mockProduct);
    setIsLoading(false);
  }, [productId]);

  const calculateCost = (data: CustomizationData) => {
    let cost = 0;
    
    if (data.customText?.length > 0) cost += 5;
    if (data.customImage?.length > 0) cost += 10 * data.customImage.length;
    if (data.customColors?.length > 0) cost += 3;
    if (data.material === 'premium') cost += 10;
    else if (data.material === 'luxury') cost += 25;
    if (data.quality === 'high') cost += 8;
    else if (data.quality === 'premium') cost += 15;
    
    setCustomizationCost(cost);
  };

  const handleCustomizationChange = (data: CustomizationData) => {
    setCustomizationData(data);
    calculateCost(data);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, customizationData);
      router.push('/cart');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Button asChild>
            <Link href="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!product.customizable) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">This product cannot be customized</h2>
          <Button asChild>
            <Link href="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const totalPrice = product.price + customizationCost;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/products">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Customize {product.name}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Preview */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <div className="mt-4">
                  <h2 className="text-2xl font-bold">{product.name}</h2>
                  <p className="text-muted-foreground mt-2">{product.description}</p>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base Price:</span>
                      <span className="font-medium">${product.price.toFixed(2)}</span>
                    </div>
                    {customizationCost > 0 && (
                      <div className="flex justify-between text-primary">
                        <span>Customization:</span>
                        <span className="font-medium">+${customizationCost.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-bold">Total:</span>
                      <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleAddToCart} size="lg" className="w-full">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Add to Cart - ${totalPrice.toFixed(2)}
            </Button>
          </div>

          {/* Customizer */}
          <div>
            <ProductCustomizer
              productId={product.id}
              customizationConfig={product.customizationConfig}
              onCustomizationChange={handleCustomizationChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}