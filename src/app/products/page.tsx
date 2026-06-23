import { ProductCard } from '@/components/products/product-card';
import { Button } from '@/components/ui/button';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { prisma } from '@/lib/utils/prisma';

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { stock: { gt: 0 } },
      orderBy: { createdAt: 'desc' },
    });
    
    return products.map((p: any) => ({
      ...p,
      price: Number(p.price),
      comparePrice: p.comparePrice ? Number(p.comparePrice) : undefined,
      sku: p.sku || undefined,
      aiScore: p.aiScore || undefined,
    }));
  } catch (error) {
    // Return mock data if database is not available
    return [
      {
        id: '1',
        name: 'Wireless Noise-Canceling Headphones',
        description: 'Premium sound quality with active noise cancellation',
        price: 199.99,
        comparePrice: 299.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
        images: [],
        category: 'Electronics',
        tags: ['wireless', 'audio', 'premium'],
        stock: 50,
        featured: true,
        rating: 4.8,
        reviewsCount: 245,
        aiScore: 0.9,
        aiTags: ['top-rated', 'wireless', 'premium'],
        createdAt: new Date(),
        updatedAt: new Date(),
        sku: 'HEAD-001',
      },
      {
        id: '2',
        name: 'Smart Fitness Watch',
        description: 'Track your health and fitness with advanced sensors',
        price: 149.99,
        comparePrice: 199.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
        images: [],
        category: 'Electronics',
        tags: ['smart', 'fitness', 'wearable'],
        stock: 30,
        featured: true,
        rating: 4.6,
        reviewsCount: 189,
        aiScore: 0.85,
        aiTags: ['popular', 'smart-device'],
        createdAt: new Date(),
        updatedAt: new Date(),
        sku: 'WATCH-002',
      },
      {
        id: '3',
        name: 'Organic Cotton T-Shirt',
        description: 'Sustainable and comfortable everyday wear',
        price: 29.99,
        comparePrice: 39.99,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
        images: [],
        category: 'Clothing',
        tags: ['organic', 'sustainable', 'cotton'],
        stock: 100,
        featured: true,
        rating: 4.5,
        reviewsCount: 312,
        aiScore: 0.88,
        aiTags: ['sustainable', 'budget-friendly'],
        createdAt: new Date(),
        updatedAt: new Date(),
        sku: 'SHIRT-003',
      },
      {
        id: '4',
        name: 'Portable Bluetooth Speaker',
        description: 'Waterproof speaker with 20-hour battery life',
        price: 79.99,
        comparePrice: 99.99,
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop',
        images: [],
        category: 'Electronics',
        tags: ['wireless', 'bluetooth', 'portable'],
        stock: 45,
        featured: true,
        rating: 4.7,
        reviewsCount: 156,
        aiScore: 0.82,
        aiTags: ['wireless', 'budget-friendly'],
        createdAt: new Date(),
        updatedAt: new Date(),
        sku: 'SPEAKER-004',
      },
    ];
  }
}

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);
  const products = await getProducts();

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">All Products</h1>
          <p className="text-muted-foreground text-lg">
            Browse our complete collection of premium products
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}