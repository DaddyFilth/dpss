// AI-powered product recommendations system
// Uses collaborative filtering and content-based recommendations

interface Product {
  id: string;
  name: string;
  category: string;
  tags: string[];
  price: number;
  aiScore?: number;
  aiTags?: string[];
}

interface UserBehavior {
  viewedProducts: string[];
  purchasedProducts: string[];
  cartProducts: string[];
  categoryInterests: Record<string, number>;
  pricePreference: 'budget' | 'mid-range' | 'premium';
}

interface RecommendationScore {
  productId: string;
  score: number;
  reasons: string[];
}

class AIRecommendationEngine {
  private userBehaviors: Map<string, UserBehavior> = new Map();

  // Analyze user behavior pattern
  analyzeUserBehavior(userId: string, behavior: Partial<UserBehavior>) {
    const existing = this.userBehaviors.get(userId) || this.getDefaultBehavior();
    const updated = { ...existing, ...behavior };
    
    // Calculate category interests based on interactions
    if (behavior.viewedProducts) {
      behavior.viewedProducts.forEach(productId => {
        // This would normally fetch product data
        const category = this.getProductCategory(productId);
        if (category) {
          updated.categoryInterests[category] = (updated.categoryInterests[category] || 0) + 1;
        }
      });
    }
    
    // Determine price preference
    if (behavior.purchasedProducts?.length) {
      updated.pricePreference = this.calculatePricePreference(behavior.purchasedProducts);
    }
    
    this.userBehaviors.set(userId, updated);
    return updated;
  }

  // Get personalized recommendations for a user
  async getRecommendations(userId: string, allProducts: Product[]): Promise<Product[]> {
    const userBehavior = this.userBehaviors.get(userId) || this.getDefaultBehavior();
    
    const scoredProducts: RecommendationScore[] = allProducts.map(product => {
      const score = this.calculateRecommendationScore(product, userBehavior);
      const reasons = this.generateRecommendationReasons(product, userBehavior);
      
      return { productId: product.id, score, reasons };
    });

    // Sort by score and filter out already viewed/purchased
    const recommendations = scoredProducts
      .filter(rec => !userBehavior.viewedProducts.includes(rec.productId))
      .filter(rec => !userBehavior.purchasedProducts.includes(rec.productId))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    // Map back to product objects
    return recommendations.map(rec => 
      allProducts.find(p => p.id === rec.productId)!
    );
  }

  // Calculate recommendation score using multiple factors
  private calculateRecommendationScore(product: Product, userBehavior: UserBehavior): number {
    let score = 0;

    // Category interest matching
    const categoryInterest = userBehavior.categoryInterests[product.category] || 0;
    score += categoryInterest * 20;

    // Tag matching
    const matchingTags = product.tags.filter(tag => 
      userBehavior.viewedProducts.some(productId => 
        this.productHasTag(productId, tag)
      )
    ).length;
    score += matchingTags * 10;

    // AI score consideration
    if (product.aiScore) {
      score += product.aiScore * 15;
    }

    // Price preference matching
    const priceMatch = this.getPriceMatch(product.price, userBehavior.pricePreference);
    score += priceMatch * 10;

    // Trending boost
    if (product.aiTags?.includes('popular') || product.aiTags?.includes('viral')) {
      score += 15;
    }

    // Seasonal adjustment (could be enhanced with real-time data)
    const seasonalBoost = this.getSeasonalBoost(product);
    score += seasonalBoost;

    return Math.min(score, 100);
  }

  // Generate reasons for recommendation
  private generateRecommendationReasons(product: Product, userBehavior: UserBehavior): string[] {
    const reasons: string[] = [];

    if (userBehavior.categoryInterests[product.category] > 0) {
      reasons.push(`Based on your interest in ${product.category}`);
    }

    if (product.aiScore && product.aiScore > 0.7) {
      reasons.push('Highly rated by our AI');
    }

    if (product.aiTags?.includes('viral')) {
      reasons.push('Trending on social media');
    }

    if (product.aiTags?.includes('popular')) {
      reasons.push('Best-seller');
    }

    const priceMatch = this.getPriceMatch(product.price, userBehavior.pricePreference);
    if (priceMatch > 7) {
      reasons.push('Matches your price preference');
    }

    return reasons;
  }

  // Helper methods
  private getDefaultBehavior(): UserBehavior {
    return {
      viewedProducts: [],
      purchasedProducts: [],
      cartProducts: [],
      categoryInterests: {},
      pricePreference: 'mid-range'
    };
  }

  private getProductCategory(productId: string): string | null {
    // This would normally fetch from database
    // For now, return null or implement simple logic
    return null;
  }

  private productHasTag(productId: string, tag: string): boolean {
    // This would normally fetch from database
    return false;
  }

  private calculatePricePreference(productIds: string[]): 'budget' | 'mid-range' | 'premium' {
    // Analyze purchased products to determine preference
    // For now, default to mid-range
    return 'mid-range';
  }

  private getPriceMatch(price: number, preference: string): number {
    switch (preference) {
      case 'budget':
        return price < 30 ? 10 : price < 50 ? 5 : 0;
      case 'mid-range':
        return price >= 30 && price <= 70 ? 10 : price < 30 || price > 100 ? 5 : 2;
      case 'premium':
        return price > 70 ? 10 : price > 50 ? 5 : 0;
      default:
        return 5;
    }
  }

  private getSeasonalBoost(product: Product): number {
    const currentMonth = new Date().getMonth();
    
    // Seasonal recommendations
    if (currentMonth >= 11 || currentMonth <= 1) { // Winter
      if (product.category === 'Home & Kitchen' && product.tags.includes('heater')) return 20;
      if (product.category === 'Home Decor') return 10;
    }
    
    if (currentMonth >= 2 && currentMonth <= 4) { // Spring
      if (product.category === 'Home & Kitchen') return 10;
      if (product.category === 'Pet Supplies') return 15;
    }
    
    if (currentMonth >= 5 && currentMonth <= 7) { // Summer
      if (product.category === 'Home & Kitchen' && product.tags.includes('portable')) return 15;
      if (product.category === 'Fitness' && product.tags.includes('outdoor')) return 20;
    }
    
    if (currentMonth >= 8 && currentMonth <= 10) { // Fall
      if (product.category === 'Home Decor') return 15;
      if (product.category === 'Electronics') return 10;
    }
    
    return 0;
  }
}

// Singleton instance
export const aiRecommendationEngine = new AIRecommendationEngine();