'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  // For now, use mock wishlist data. In a real app, this would come from state management
  const wishlistItems = [
    {
      id: '1',
      name: 'Wireless Noise-Canceling Headphones',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      category: 'Electronics',
      rating: 4.8,
      reviewsCount: 245,
    },
    {
      id: '3',
      name: 'Organic Cotton T-Shirt',
      price: 29.99,
      comparePrice: 39.99,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
      category: 'Clothing',
      rating: 4.5,
      reviewsCount: 312,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Heart className="h-8 w-8 fill-red-500 text-red-500" />
            My Wishlist
          </h1>
        </div>

        {wishlistItems.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">
                Save items you love by clicking the heart icon
              </p>
              <Button asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="group">
                <CardContent className="p-6">
                  <div className="relative aspect-square mb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 rounded-full bg-white/80 hover:bg-white"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground mb-1">{item.category}</div>
                  <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold">${item.price.toFixed(2)}</span>
                    {item.comparePrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${item.comparePrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <Button className="w-full mt-4" asChild>
                    <Link href="/cart">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}