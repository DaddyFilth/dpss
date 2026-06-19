'use client';

import { Product } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
}

export const ProductCard = ({ product, onAddToCart, onAddToWishlist }: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product.id);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    if (onAddToWishlist) {
      onAddToWishlist(product.id);
    }
  };

  const discount = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
            -{discount}%
          </div>
        )}
        
        <Button
          size="icon"
          variant="ghost"
          className={cn(
            "absolute top-2 right-2 rounded-full bg-white/80 hover:bg-white transition-colors",
            isWishlisted && "text-red-500"
          )}
          onClick={handleWishlist}
        >
          <Heart className={isWishlisted ? "fill-current" : ""} size={20} />
        </Button>
        
        {product.featured && (
          <div className="absolute bottom-2 left-2 bg-primary text-white px-2 py-1 rounded-md text-sm font-semibold">
            Featured
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground mb-1">{product.category}</div>
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        
        <div className="flex items-center gap-1 mb-2">
          <Star className="fill-yellow-400 text-yellow-400" size={16} />
          <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">({product.reviewsCount})</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
          {product.comparePrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.comparePrice.toFixed(2)}
            </span>
          )}
        </div>
        
        {product.aiTags && product.aiTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.aiTags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          className="w-full"
          disabled={product.stock === 0}
        >
          <ShoppingCart className="mr-2" size={18} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};
