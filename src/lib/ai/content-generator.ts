// AI-powered content generation for marketing
// Generates social media posts, ad copy, and marketing content

interface ContentRequest {
  type: 'social-post' | 'ad-copy' | 'product-description' | 'email-subject' | 'blog-title';
  product?: any;
  platform?: 'instagram' | 'tiktok' | 'facebook' | 'twitter' | 'pinterest';
  tone?: 'exciting' | 'professional' | 'casual' | 'luxury';
  keywords?: string[];
}

interface GeneratedContent {
  content: string;
  hashtags?: string[];
  platform?: string;
  aiScore: number;
  suggestions?: string[];
}

class AIContentGenerator {
  private trendingKeywords = [
    'TikTok viral', 'aesthetic', 'smart home', 'AI-powered',
    'sustainable', 'eco-friendly', 'trending now', 'must-have',
    'game changer', 'viral sensation', 'future tech'
  ];

  private emojiLibrary = {
    excitement: ['🔥', '✨', '🎉', '🚀', '💫', '⚡', '🌟'],
    professional: ['✅', '📈', '🎯', '💼', '🔧', '🛠️'],
    casual: ['😊', '👍', '✨', '🔥', '💝', '🎁'],
    luxury: ['✨', '💎', '🌟', '👑', '💫', '🏆']
  };

  // Generate social media post content
  generateSocialPost(request: ContentRequest): GeneratedContent {
    const product = request.product;
    const platform = request.platform || 'instagram';
    const tone = request.tone || 'exciting';
    
    // Map tone to emoji library key
    const toneKey = tone === 'exciting' ? 'excitement' : tone;
    const emojis = this.emojiLibrary[toneKey as keyof typeof this.emojiLibrary] || this.emojiLibrary.excitement;

    let content = '';
    let hashtags: string[] = [];

    // Platform-specific content generation
    switch (platform) {
      case 'instagram':
        content = this.generateInstagramPost(product, tone, emojis);
        hashtags = this.generateInstagramHashtags(product);
        break;

      case 'tiktok':
        content = this.generateTikTokPost(product, tone, emojis);
        hashtags = this.generateTikTokHashtags(product);
        break;

      case 'facebook':
        content = this.generateFacebookPost(product, tone, emojis);
        hashtags = this.generateFacebookHashtags(product);
        break;

      case 'pinterest':
        content = this.generatePinterestPin(product, tone, emojis);
        hashtags = this.generatePinterestHashtags(product);
        break;

      case 'twitter':
        content = this.generateTwitterPost(product, tone, emojis);
        hashtags = this.generateTwitterHashtags(product);
        break;

      default:
        content = this.generateGenericPost(product, tone, emojis);
    }

    return {
      content,
      hashtags,
      platform,
      aiScore: this.calculateContentScore(content, platform),
      suggestions: this.generateContentSuggestions(product, platform)
    };
  }

  // Generate Instagram post
  private generateInstagramPost(product: any, tone: string, emojis: string[]): string {
    const trendingKeyword = this.trendingKeywords[Math.floor(Math.random() * this.trendingKeywords.length)];
    
    return `
${emojis[0]} ${emojis[1]} **${product?.name || 'Amazing Product!'}** ${emojis[0]}

${this.getProductBenefit(product, tone)}

✨ ${trendingKeyword}
✨ ${product?.description || 'Must-have product'}
✨ ${this.getViralReason(product)}

🔥 **Why it's viral:** ${this.getViralReason(product)}

💰 **Price:** $${product?.price || 'Check it out'}
🚚 **Fast shipping available**

👇 **Link in bio to shop!**

#AI #${tone} #viral #trending #${product?.category?.toLowerCase().replace(' ', '') || 'product'}
    `.trim();
  }

  // Generate TikTok post
  private generateTikTokPost(product: any, tone: string, emojis: string[]): string {
    const trendingKeyword = this.trendingKeywords[Math.floor(Math.random() * this.trendingKeywords.length)];
    return `
${emojis[0]} POV: You just found the ${product?.name || 'perfect product'} ${emojis[1]}

This ${trendingKeyword} is taking over TikTok! 📈

${this.getProductBenefit(product, tone)}

🔥 **Why everyone's talking about it:**
${this.getViralReason(product)}

💸 **Price:** $${product?.price || 'Affordable'}
🎁 **Perfect for:** ${this.getProductUseCase(product)}

👇 **Shop now before it sells out!**

${this.generateTikTokHashtags(product).join(' ')}
    `.trim();
  }

  // Generate Facebook post
  private generateFacebookPost(product: any, tone: string, emojis: string[]): string {
    return `
${emojis[0]} ${emojis[1]} **${product?.name || 'Check this out!'}** ${emojis[0]}

${this.getProductBenefit(product, tone)}

${this.getDetailedDescription(product)}

✅ **Why our customers love it:**
${this.getCustomerBenefit(product)}

🔥 **Limited time offer:** ${this.getOfferMessage(product)}
💰 **Price:** $${product?.price || 'Shop now'}
🚚 **Free shipping on orders $50+**

👇 **Shop here:** [link]

${this.generateFacebookHashtags(product).join(' ')}
    `.trim();
  }

  // Generate Pinterest pin description
  private generatePinterestPin(product: any, tone: string, emojis: string[]): string {
    return `
${emojis[0]} ${product?.name || 'Amazing Product'} ${emojis[1]}

${this.getProductBenefit(product, tone)}

${this.getAestheticDescription(product)}

🔥 **Trending now on TikTok**
💰 **Price:** $${product?.price || 'Check price'}
✨ **${this.getAestheticMessage(product)}

Shop this viral product before it sells out! #${product?.category?.toLowerCase().replace(' ', '') || 'decor'} #${tone} #${this.trendingKeywords[0]}
    `.trim();
  }

  // Generate Twitter post
  private generateTwitterPost(product: any, tone: string, emojis: string[]): string {
    return `
${emojis[0]} ${product?.name || 'Amazing Product!'} ${emojis[1]}

${this.getProductBenefit(product, tone)}

🔥 ${this.getViralReason(product)}
💰 $${product?.price || 'Affordable'}
🚚 Fast shipping

${this.getCTA(product)} ${this.generateTwitterHashtags(product).join(' ')}
    `.trim();
  }

  // Generate generic post
  private generateGenericPost(product: any, tone: string, emojis: string[]): string {
    return `
${emojis[0]} ${product?.name || 'Great Product!'} ${emojis[1]}

${this.getProductBenefit(product, tone)}

✨ ${this.trendingKeywords[0]}
💰 $${product?.price || 'Shop now'}
🚚 Fast shipping available

${this.getCTA(product)}
    `.trim();
  }

  // Generate ad copy
  generateAdCopy(request: ContentRequest): GeneratedContent {
    const product = request.product;
    const tone = request.tone || 'exciting';
    
    // Map tone to emoji library key
    const toneKey = tone === 'exciting' ? 'excitement' : tone;
    const emojis = this.emojiLibrary[toneKey as keyof typeof this.emojiLibrary] || this.emojiLibrary.excitement;

    const headlines = [
      `🔥 ${product?.name || 'Amazing Product'} - ${this.trendingKeywords[0]}!`,
      `✨ ${product?.name || 'Great Product'} - ${this.getProductBenefit(product, tone)}`,
      `🚀 ${product?.name || 'Perfect Product'} - ${this.getViralReason(product)}`,
      `💫 ${product?.name || 'Must-Have Product'} - ${this.getOfferMessage(product)}`
    ];

    const selectedHeadline = headlines[Math.floor(Math.random() * headlines.length)];

    return {
      content: `
${selectedHeadline}

${this.getDetailedDescription(product)}

✅ **Why customers love it:**
${this.getCustomerBenefit(product)}

🔥 **Limited time offer:** ${this.getOfferMessage(product)}
💰 **Price:** $${product?.price || 'Shop now'}
🚚 **Free shipping on orders $50+**

${this.getCTA(product)}
      `.trim(),
      aiScore: 0.85,
      suggestions: [
        'Add customer testimonials',
        'Include social proof (reviews, ratings)',
        'Use urgency language (limited time, selling fast)',
        'Highlight unique features',
        'Add discount or promotion'
      ]
    };
  }

  // Generate product description
  generateProductDescription(request: ContentRequest): GeneratedContent {
    const product = request.product;
    const keywords = request.keywords || [];

    const description = `
${product?.name || 'Amazing Product'} - ${this.getProductBenefit(product, 'exciting')}

${this.getDetailedDescription(product)}

✨ **Key Features:**
${this.getProductFeatures(product)}

🔥 **Why it's trending:**
${this.getViralReason(product)}

💰 **Great value at $${product?.price || 'competitive price'}**
🚚 **Fast shipping and secure checkout**

${keywords.length > 0 ? `\nKeywords: ${keywords.join(', ')}` : ''}
    `.trim();

    return {
      content: description,
      aiScore: 0.9,
      suggestions: [
        'Add more specific technical specifications',
        'Include customer reviews',
        'Add sizing or dimension information',
        'Mention warranty or guarantee',
        'Include care instructions if applicable'
      ]
    };
  }

  // Generate email subject
  generateEmailSubject(request: ContentRequest): GeneratedContent {
    const product = request.product;
    const subjects = [
      `🔥 ${this.trendingKeywords[0]} Alert: ${product?.name || 'Great Product'}`,
      `✨ ${product?.name || 'Amazing Product'} - ${this.getProductBenefit(product, 'exciting')}`,
      `🚀 Don't miss: ${product?.name || 'Great Product'} ${this.getOfferMessage(product)}`,
      `💫 ${product?.name || 'Must-have product'} - ${this.getViralReason(product)}`
    ];

    const selectedSubject = subjects[Math.floor(Math.random() * subjects.length)];

    return {
      content: selectedSubject,
      aiScore: 0.88,
      suggestions: [
        'Use urgency words (limited time, ending soon)',
        'Personalize with customer name when possible',
        'A/B test different subject lines',
        'Keep under 50 characters for mobile'
      ]
    };
  }

  // Helper methods
  private getProductBenefit(product: any, tone: string): string {
    const toneKey = tone === 'exciting' ? 'exciting' : tone;
    const benefits = {
      exciting: `${product?.description || 'This amazing product'} will transform your life!`,
      professional: `${product?.description || 'High-quality product'} for your needs`,
      casual: `${product?.description || 'Super cool product'} you'll love`,
      luxury: `${product?.description || 'Premium quality'} for the discerning customer`
    };
    return benefits[toneKey as keyof typeof benefits] || benefits.exciting;
  }

  private getDetailedDescription(product: any): string {
    return product?.description || 'This is an amazing product with great features and benefits. Perfect for your needs.';
  }

  private getViralReason(product: any): string {
    const reasons = [
      '50M+ views on TikTok',
      '3B+ views across social platforms',
      'Trending #1 in its category',
      'Featured by top influencers',
      '300% higher engagement rate'
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  }

  private getOfferMessage(product: any): string {
    const offers = [
      'Use code SAVE15 for 15% off',
      'Limited time discount available',
      'Free shipping included',
      'Bundle deal available'
    ];
    return offers[Math.floor(Math.random() * offers.length)];
  }

  private getCTA(product: any): string {
    const ctas = [
      'Shop now before it sells out!',
      'Get yours today!',
    'Limited stock available',
      'Don\'t miss out!'
    ];
    return ctas[Math.floor(Math.random() * ctas.length)];
  }

  private getProductFeatures(product: any): string {
    return product?.features?.join(', ') || 'High quality, fast shipping, great value';
  }

  private getCustomerBenefit(product: any): string {
    const benefits = [
      '95% of customers rate this 5 stars',
      'Customers love the quality and price',
      'Highly recommended by satisfied customers',
      '4.9/5 stars from 1000+ reviews'
    ];
    return benefits[Math.floor(Math.random() * benefits.length)];
  }

  private getProductUseCase(product: any): string {
    return product?.useCase || 'Everyday use';
  }

  private getAestheticDescription(product: any): string {
    return `Create the perfect ${product?.category?.toLowerCase() || 'aesthetic'} vibe with this viral product. Perfect for ${this.getProductUseCase(product)}.`;
  }

  private getAestheticMessage(product: any): string {
    const messages = [
      'Aesthetic goals achieved',
      'Creates cozy atmosphere',
      'Perfect for content creation',
      'Instagram-worthy product'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  private calculateContentScore(content: string, platform: string): number {
    let score = 0.7;
    
    // Length check
    const idealLengths: Record<string, { min: number; max: number }> = {
      instagram: { min: 100, max: 2200 },
      twitter: { min: 50, max: 280 },
      tiktok: { min: 50, max: 200 },
      facebook: { min: 100, max: 2000 },
      pinterest: { min: 100, max: 500 }
    };

    const ideal = idealLengths[platform] || { min: 100, max: 1000 };
    if (content.length >= ideal.min && content.length <= ideal.max) {
      score += 0.1;
    }

    // Emoji check
    if (content.match(/[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F6FF}\u{1F700}-\u{1F77F}]/gu)) {
      score += 0.1;
    }

    // Hashtag check
    if (content.includes('#')) {
      score += 0.1;
    }

    return Math.min(score, 0.95);
  }

  private generateContentSuggestions(product: any, platform: string): string[] {
    const suggestions: string[] = [];

    if (platform === 'tiktok') {
      suggestions.push(
        'Use trending sounds',
        'Add voice-over with upbeat tone',
        'Show product in use',
        'Include call-to-action in video'
      );
    }

    if (platform === 'instagram') {
      suggestions.push(
        'Use high-quality photos',
        'Tag relevant accounts',
        'Use Stories for behind-the-scenes',
        'Create Reels for more reach'
      );
    }

    suggestions.push(
      'Post at optimal times (7-9 AM, 7-9 PM)',
      'Engage with comments',
      'Use location tags if applicable'
    );

    return suggestions;
  }

  private generateInstagramHashtags(product: any): string[] {
    return [
      '#aesthetic',
      '#viral',
      '#tiktokmade',
      '#productphotography',
      '#homeaesthetic',
      '#musthave',
      '#trending',
      '#shopsmall',
      '#ai',
      product?.category?.toLowerCase().replace(' ', ''),
      product?.name?.toLowerCase().replace(/[^a-z0-9]/g, '')
    ].filter(Boolean);
  }

  private generateTikTokHashtags(product: any): string[] {
    return [
      '#fyp',
      '#foryoupage',
      '#tiktoktrends',
      '#viral',
      '#aesthetic',
      '#productreview',
      '#musthave',
      '#tiktokshop',
      '#sponsored',
      '#ai',
      product?.category?.toLowerCase().replace(' ', '')
    ].filter(Boolean);
  }

  private generateFacebookHashtags(product: any): string[] {
    return [
      '#shopping',
      '#ecommerce',
      '#product',
      '#online',
      '#deals',
      '#freeshipping',
      '#sale',
      product?.category?.toLowerCase().replace(' ', ''),
      '#ai'
    ].filter(Boolean);
  }

  private generatePinterestHashtags(product: any): string[] {
    return [
      '#aesthetic',
      '#interior',
      '#decor',
      '#home',
      '#inspiration',
      '#homeaesthetic',
      '#trending',
      '#viral',
      '#musthave',
      product?.category?.toLowerCase().replace(' ', '')
    ].filter(Boolean);
  }

  private generateTwitterHashtags(product: any): string[] {
    return [
      '#shopping',
      '#deals',
      '#product',
      '#sale',
      '#trending',
      '#viral',
      '#ai',
      product?.name?.toLowerCase().replace(/[^a-z0-9]/g, '')
    ].filter(Boolean);
  }
}

export const aiContentGenerator = new AIContentGenerator();