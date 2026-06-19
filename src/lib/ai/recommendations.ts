// AI-powered product recommendations
// Uses collaborative filtering and content-based recommendations

interface Product {
  id: string;
  name: string;
  category: string;
  tags: string[];
  price: number;
  rating: number;
  aiScore?: number;
  aiTags?: string[];
}

interface UserBehavior {
  productId: string;
  action: 'view' | 'cart' | 'purchase' | 'wishlist';
  timestamp: Date;
}

// Calculate similarity between products based on tags and category
const calculateSimilarity = (product1: Product, product2: Product): number => {
  let similarity = 0;
  
  // Category match
  if (product1.category === product2.category) {
    similarity += 0.3;
  }
  
  // Tag overlap
  const commonTags = product1.tags.filter(tag => product2.tags.includes(tag));
  const tagSimilarity = commonTags.length / Math.max(product1.tags.length, product2.tags.length);
  similarity += tagSimilarity * 0.4;
  
  // Price range similarity (products in similar price range)
  const priceDiff = Math.abs(product1.price - product2.price);
  const priceSimilarity = Math.max(0, 1 - priceDiff / Math.max(product1.price, product2.price));
  similarity += priceSimilarity * 0.2;
  
  // Rating similarity
  const ratingDiff = Math.abs(product1.rating - product2.rating);
  const ratingSimilarity = Math.max(0, 1 - ratingDiff / 5);
  similarity += ratingSimilarity * 0.1;
  
  return similarity;
};

// Generate AI tags for products
export const generateAITags = async (product: Product): Promise<string[]> => {
  // In production, this would use OpenAI API or similar
  // For now, we'll use rule-based tagging
  
  const aiTags: string[] = [];
  const nameLower = product.name.toLowerCase();
  
  // Price-based tags
  if (product.price < 20) aiTags.push('budget-friendly');
  else if (product.price < 50) aiTags.push('affordable');
  else if (product.price < 100) aiTags.push('mid-range');
  else aiTags.push('premium');
  
  // Rating-based tags
  if (product.rating >= 4.5) aiTags.push('top-rated');
  else if (product.rating >= 4.0) aiTags.push('popular');
  
  // Category-specific tags
  if (product.category === 'electronics') {
    if (nameLower.includes('wireless') || nameLower.includes('bluetooth')) {
      aiTags.push('wireless');
    }
    if (nameLower.includes('smart')) {
      aiTags.push('smart-device');
    }
  }
  
  if (product.category === 'clothing') {
    if (nameLower.includes('organic') || nameLower.includes('cotton')) {
      aiTags.push('sustainable');
    }
  }
  
  return [...new Set(aiTags)]; // Remove duplicates
};

// Calculate AI score for products
export const calculateAIScore = (product: Product, behavior: UserBehavior[]): number => {
  let score = product.rating / 5 * 0.4; // Base score from rating
  
  // Boost score based on user behavior
  const productBehavior = behavior.filter(b => b.productId === product.id);
  
  productBehavior.forEach(b => {
    switch (b.action) {
      case 'purchase':
        score += 0.3;
        break;
      case 'cart':
        score += 0.2;
        break;
      case 'wishlist':
        score += 0.15;
        break;
      case 'view':
        score += 0.05;
        break;
    }
  });
  
  // Decay based on time (recent behavior weighted more)
  const now = new Date();
  productBehavior.forEach(b => {
    const daysSince = (now.getTime() - b.timestamp.getTime()) / (1000 * 60 * 60 * 24);
    const timeDecay = Math.max(0, 1 - daysSince / 30); // Decay over 30 days
    score *= timeDecay;
  });
  
  return Math.min(score, 1); // Cap at 1
};

// Get personalized recommendations
export const getPersonalizedRecommendations = async (
  products: Product[],
  userBehavior: UserBehavior[],
  limit: number = 10
): Promise<Product[]> => {
  // If no user behavior, return popular products
  if (userBehavior.length === 0) {
    return products
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }
  
  // Get products user has interacted with
  const interactedProductIds = new Set(userBehavior.map(b => b.productId));
  
  // Calculate scores for non-interacted products
  const scoredProducts = products
    .filter(p => !interactedProductIds.has(p.id))
    .map(product => {
      let score = 0;
      
      // Calculate similarity with interacted products
      const interactedProducts = products.filter(p => interactedProductIds.has(p.id));
      interactedProducts.forEach(interacted => {
        const similarity = calculateSimilarity(product, interacted);
        const behavior = userBehavior.find(b => b.productId === interacted.id);
        
        if (behavior) {
          const behaviorWeight = {
            purchase: 1.0,
            cart: 0.7,
            wishlist: 0.5,
            view: 0.3,
          }[behavior.action];
          
          score += similarity * behaviorWeight;
        }
      });
      
      // Add AI score if available
      if (product.aiScore) {
        score += product.aiScore * 0.3;
      }
      
      return { ...product, recommendationScore: score };
    })
    .sort((a, b) => (b as any).recommendationScore - (a as any).recommendationScore);
  
  return scoredProducts.slice(0, limit);
};

// Get similar products
export const getSimilarProducts = async (
  product: Product,
  allProducts: Product[],
  limit: number = 6
): Promise<Product[]> => {
  const similarProducts = allProducts
    .filter(p => p.id !== product.id)
    .map(p => ({
      ...p,
      similarity: calculateSimilarity(product, p),
    }))
    .sort((a, b) => (b as any).similarity - (a as any).similarity)
    .slice(0, limit);
  
  return similarProducts;
};

// Get trending products (based on recent activity)
export const getTrendingProducts = (
  products: Product[],
  userBehavior: UserBehavior[],
  limit: number = 10
): Product[] => {
  const recentBehavior = userBehavior.filter(
    b => b.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
  );
  
  const productScores = new Map<string, number>();
  
  recentBehavior.forEach(b => {
    const current = productScores.get(b.productId) || 0;
    const weight = { purchase: 3, cart: 2, wishlist: 1.5, view: 1 }[b.action];
    productScores.set(b.productId, current + weight);
  });
  
  return products
    .map(p => ({
      ...p,
      trendScore: productScores.get(p.id) || 0,
    }))
    .sort((a, b) => (b as any).trendScore - (a as any).trendScore)
    .slice(0, limit);
};
