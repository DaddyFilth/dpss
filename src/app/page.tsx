import { ProductCard } from '@/components/products/product-card';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Shield, Zap } from 'lucide-react';

async function getFeaturedProducts() {
  // In a real app, this would fetch from the database
  // For now, we'll return mock data
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
    },
  ];
}

async function getTrendingProducts() {
  return [
    {
      id: '5',
      name: 'Minimalist Backpack',
      description: 'Sleek design with laptop compartment',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
      images: [],
      category: 'Accessories',
      tags: ['backpack', 'minimalist', 'travel'],
      stock: 25,
      featured: false,
      rating: 4.4,
      reviewsCount: 98,
      aiScore: 0.75,
      aiTags: ['affordable'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '6',
      name: 'Wireless Charging Pad',
      description: 'Fast charging for all Qi-compatible devices',
      price: 34.99,
      image: 'https://images.unsplash.com/photo-1591815302525-756a9bcc3425?w=500&h=500&fit=crop',
      images: [],
      category: 'Electronics',
      tags: ['wireless', 'charging', 'accessories'],
      stock: 60,
      featured: false,
      rating: 4.3,
      reviewsCount: 87,
      aiScore: 0.78,
      aiTags: ['affordable', 'wireless'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  const trendingProducts = await getTrendingProducts();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            AI-Powered Shopping
            <span className="text-primary"> Experience</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover products tailored just for you with our AI-powered recommendations.
            Secure payments, fast shipping, and the best deals.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="#products">Shop Now</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#about">Learn More</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30" id="about">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose AI Dropship?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">AI Recommendations</h3>
              <p className="text-sm text-muted-foreground">
                Personalized product suggestions based on your preferences
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Secure Payments</h3>
              <p className="text-sm text-muted-foreground">
                Encrypted transactions with Stripe and PayPal
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Fast Shipping</h3>
              <p className="text-sm text-muted-foreground">
                Quick delivery with real-time tracking
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Best Deals</h3>
              <p className="text-sm text-muted-foreground">
                Competitive prices on trending products
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4" id="products">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Button variant="outline" asChild>
              <a href="/products">View All</a>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Trending Now</h2>
            <Button variant="outline" asChild>
              <a href="/products?sort=trending">View All</a>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of satisfied customers and discover your next favorite product.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <a href="/products">Browse Products</a>
          </Button>
        </div>
      </section>
    </div>
  );
}
