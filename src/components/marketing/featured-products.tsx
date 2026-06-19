'use client';

import { ProductCard } from '@/components/products/product-card';

interface FeaturedProductsProps {
  products: any[];
  title?: string;
  description?: string;
  limit?: number;
}

export function FeaturedProducts({ 
  products, 
  title = "🔥 Trending Now", 
  description = "Viral TikTok products and AI-predicted bestsellers",
  limit = 4 
}: FeaturedProductsProps) {
  const featuredProducts = products
    .filter(p => p.featured)
    .slice(0, limit);

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
