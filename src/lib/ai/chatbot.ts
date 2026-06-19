// AI-powered customer support and sales chatbot
// Provides instant support and product recommendations

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

interface ChatContext {
  userId: string;
  conversationHistory: ChatMessage[];
  customerProfile?: any;
  currentIntent?: 'support' | 'sales' | 'general' | 'order-status';
  cartContents?: any[];
  browsingHistory?: string[];
}

class AIChatbot {
  private conversations: Map<string, ChatContext> = new Map();
  private productKnowledgeBase: Map<string, any> = new Map();

  constructor() {
    this.initializeKnowledgeBase();
  }

  // Initialize product knowledge base
  private initializeKnowledgeBase() {
    this.productKnowledgeBase.set('sunset-lamp', {
      name: 'Sunset Projection Lamp',
      features: ['LED projection', 'multiple colors', 'adjustable angle'],
      trending: '50M+ TikTok views',
      price: 29.99,
      useCase: 'Creating aesthetic room lighting'
    });
    
    this.productKnowledgeBase.set('mushroom-light', {
      name: 'Mushroom Night Light',
      features: ['cute design', 'warm LED glow', 'multiple colors'],
      trending: '3B+ TikTok views',
      price: 18.99,
      useCase: 'Bedroom decor and night lighting'
    });

    // Add more products to knowledge base as needed
  }

  // Process user message and generate AI response
  async processMessage(userId: string, message: string): Promise<string> {
    const context = this.getOrCreateContext(userId);
    
    // Add user message to history
    context.conversationHistory.push({
      id: this.generateMessageId(),
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Analyze intent and generate response
    const response = await this.generateResponse(message, context);
    
    // Add assistant response to history
    context.conversationHistory.push({
      id: this.generateMessageId(),
      role: 'assistant',
      content: response,
      timestamp: new Date()
    });

    this.conversations.set(userId, context);
    return response;
  }

  // Generate AI response based on message analysis
  private async generateResponse(message: string, context: ChatContext): Promise<string> {
    const lowerMessage = message.toLowerCase();
    
    // Intent detection
    const intent = this.detectIntent(lowerMessage);
    context.currentIntent = intent;

    switch (intent) {
      case 'product-info':
        return this.handleProductInquiry(lowerMessage, context);
      case 'recommendation':
        return this.handleRecommendation(lowerMessage, context);
      case 'order-status':
        return this.handleOrderStatus(lowerMessage);
      case 'support':
        return this.handleSupport(lowerMessage);
      case 'pricing':
        return this.handlePricing(lowerMessage);
      case 'shipping':
        return this.handleShipping(lowerMessage);
      case 'discount':
        return this.handleDiscount(lowerMessage);
      case 'greeting':
        return this.handleGreeting(context);
      default:
        return this.handleGeneral(lowerMessage, context);
    }
  }

  // Detect user intent from message
  private detectIntent(message: string): ChatContext['currentIntent'] {
    if (message.includes('product') || message.includes('item') || message.includes('what')) {
      return 'product-info';
    }
    if (message.includes('recommend') || message.includes('suggest') || message.includes('like')) {
      return 'recommendation';
    }
    if (message.includes('order') || message.includes('delivery') || message.includes('shipped')) {
      return 'order-status';
    }
    if (message.includes('help') || message.includes('issue') || message.includes('problem')) {
      return 'support';
    }
    if (message.includes('price') || message.includes('cost') || message.includes('expensive')) {
      return 'pricing';
    }
    if (message.includes('shipping') || message.includes('delivery time') || message.includes('when')) {
      return 'shipping';
    }
    if (message.includes('discount') || message.includes('promo') || message.includes('code') || message.includes('sale')) {
      return 'discount';
    }
    if (message.includes('hi') || message.includes('hello') || message.includes('hey')) {
      return 'greeting';
    }
    return 'general';
  }

  // Handle product information requests
  private handleProductInquiry(message: string, context: ChatContext): string {
    const productInfo = this.extractProductInfo(message);
    
    if (productInfo) {
      return `
🛍️ **${productInfo.name}**
- Price: $${productInfo.price}
- Features: ${productInfo.features.join(', ')}
- Trending: ${productInfo.trending}
- Perfect for: ${productInfo.useCase}

💡 **AI Tip:** This product is currently trending on TikTok with ${productInfo.trending}! Would you like me to add it to your cart?
      `.trim();
    }
    
    return `
🔍 **Product Information**
I can help you find information about our 85+ trending products! Here are some popular categories:

🎨 **Home Decor:** Sunset Lamp, Mushroom Light, Canvas Prints
💄 **Beauty:** Ice Roller, Teeth Whitening Kit, Silk Pillowcase
🏠 **Smart Home:** AI Smart Mirror, Smart Plugs, Smart Bulbs
💻 **Electronics:** Gaming gear, audio equipment, smart watches
🐾 **Pet Supplies:** AI Pet Camera, Orthopedic beds, grooming tools

Which category interests you? I can provide detailed information about any product!
    `.trim();
  }

  // Handle recommendation requests
  private handleRecommendation(message: string, context: ChatContext): string {
    const preferences = this.extractPreferences(message);
    
    return `
🤖 **AI-Powered Recommendations**
Based on your interest in ${preferences.join(' and ')}, here are my top picks:

🔥 **Trending Now:**
- Sunset Projection Lamp - Viral aesthetic lighting ($29.99)
- Mushroom Night Light - Cute and cozy ($18.99)
- Ice Roller Face Massager - Skincare essential ($12.99)

💡 **AI Insight:** These products have 300%+ higher engagement rates on social media!

🎯 **For You Specifically:**
${this.getPersonalizedRecommendations(preferences)}

Would you like more details about any of these products? I can add them to your cart directly if you'd like!
    `.trim();
  }

  // Handle order status requests
  private handleOrderStatus(message: string): string {
    return `
📦 **Order Status**
To check your order status, please provide your order number or email address.

You can also:
- Track orders in your account dashboard
- Check your email for shipping updates
- Contact our support team for urgent issues

🤖 **AI Tip:** Most orders ship within 2-3 business days. Smart home devices may take 3-5 days due to quality checks.
    `.trim();
  }

  // Handle support requests
  private handleSupport(message: string): string {
    return `
🛠️ **Customer Support**
I'm here to help! Here's how I can assist you:

• Product information and recommendations
• Order tracking and status
• Shipping and delivery questions
• Returns and exchanges
• Account management
• Technical support

For more complex issues, our human support team is available at support@aidropship.com

What specific issue can I help you with today?
    `.trim();
  }

  // Handle pricing questions
  private handlePricing(message: string): string {
    return `
💰 **Pricing Information**
Our AI analyzes market trends to ensure competitive pricing:

🏷️ **Price Ranges:**
• Budget-friendly: $8.99 - $25.99
• Mid-range: $26.99 - $49.99
• Premium: $50.99 - $199.99

🎁 **Special Offers:**
• New customers: 10% off first order
• Email subscribers: Exclusive deals
• Seasonal promotions: Limited-time discounts

💡 **AI Insight:** Our viral products (sunset lamp, mushroom light) offer 300%+ ROI due to social media virality!

Need help finding products in your budget range?
    `.trim();
  }

  // Handle shipping questions
  private handleShipping(message: string): string {
    return `
🚚 **Shipping Information**
📦 **Processing Time:** 1-2 business days
⏱️ **Delivery Time:** 3-7 business days (depending on location)
🌍 **International:** 7-14 business days

🏷️ **Shipping Rates:**
• Orders under $50: $4.99
• Orders $50+: FREE shipping
• Expedited: Available at checkout

📱 **Track Your Order:** Use your tracking number sent in email confirmation

💡 **AI Tip:** Smart home devices may take 1 extra day for quality assurance testing.
    `.trim();
  }

  // Handle discount requests
  private handleDiscount(message: string): string {
    return `
🎁 **Discounts & Promotions**
Here's how to save at AI Dropship:

✨ **Current Offers:**
• New Customers: 10% off (code: WELCOME10)
• Email Subscribers: Exclusive weekly deals
• Bundle Deals: Save up to 20% on selected items

🔥 **Flash Sales:** Watch our emails for limited-time offers!

💰 **Money-Saving Tips:**
• Free shipping on orders $50+
• Sign up for our newsletter (10% off)
• Follow us on TikTok for exclusive codes

🤖 **AI Insight:** Our best-sellers have 40% higher margins, so even without discounts, you're getting great value!

Want me to recommend some products with the best value?
    `.trim();
  }

  // Handle greeting
  private handleGreeting(context: ChatContext): string {
    const isNewUser = context.conversationHistory.length <= 1;
    
    if (isNewUser) {
      return `
👋 **Welcome to AI Dropship!**
I'm your AI shopping assistant, ready to help you discover viral products and smart home devices!

🎯 **What I Can Do:**
• Recommend products based on your preferences
• Provide detailed product information
• Help with orders and shipping
• Find trending items before they go viral
• Assist with any shopping questions

🔥 **Trending Now:**
- Sunset Projection Lamp (50M+ TikTok views!)
- Mushroom Night Light (Aesthetic favorite)
- Ice Roller Face Massager (Skincare trend)

💡 **AI Insight:** We have 85+ curated products with AI-predicted future winners!

What can I help you find today?
      `.trim();
    }
    
    return `
👋 **Welcome back!**
Good to see you again. I remember you from our last conversation.

Looking for something new? We've recently added:
- AI Smart Mirror - Future of smart home
- Biometric Smart Lock - Next-gen security
- Smart Plant Monitor - AI-powered care

What can I help you discover today?
    `.trim();
  }

  // Handle general queries
  private handleGeneral(message: string, context: ChatContext): string {
    return `
🤖 **AI Shopping Assistant**
I'm here to help you discover trending products and make great shopping decisions!

Try asking me about:
• "Recommend products for my bedroom"
• "Tell me about the sunset lamp"
• "What's trending in beauty?"
• "How much is shipping?"
• "Do you have any discounts?"

Or just tell me what you're looking for and I'll use AI to find the perfect products for you!
    `.trim();
  }

  // Helper methods
  private getOrCreateContext(userId: string): ChatContext {
    if (!this.conversations.has(userId)) {
      this.conversations.set(userId, {
        userId,
        conversationHistory: [],
      });
    }
    return this.conversations.get(userId)!;
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private extractProductInfo(message: string): any {
    const productKeywords = ['sunset', 'mushroom', 'lamp', 'light', 'ice', 'roller', 'teeth', 'smart'];
    
    for (const [key, value] of this.productKnowledgeBase.entries()) {
      if (productKeywords.some(keyword => key.includes(keyword))) {
        return value;
      }
    }
    
    return null;
  }

  private extractPreferences(message: string): string[] {
    const preferences: string[] = [];
    
    if (message.includes('bedroom') || message.includes('room') || message.includes('decor')) {
      preferences.push('home decor');
    }
    if (message.includes('beauty') || message.includes('skincare') || message.includes('makeup')) {
      preferences.push('beauty');
    }
    if (message.includes('smart') || message.includes('tech') || message.includes('ai')) {
      preferences.push('smart home');
    }
    if (message.includes('fitness') || message.includes('workout') || message.includes('exercise')) {
      preferences.push('fitness');
    }
    if (message.includes('budget') || message.includes('cheap') || message.includes('affordable')) {
      preferences.push('budget-friendly');
    }
    
    return preferences.length > 0 ? preferences : ['trending products'];
  }

  private getPersonalizedRecommendations(preferences: string[]): string {
    const recommendations: string[] = [];
    
    if (preferences.includes('home decor')) {
      recommendations.push('Sunset Lamp - Create viral aesthetic');
    }
    if (preferences.includes('beauty')) {
      recommendations.push('Ice Roller - Skincare viral trend');
    }
    if (preferences.includes('smart home')) {
      recommendations.push('AI Smart Mirror - Future tech');
    }
    if (preferences.includes('budget-friendly')) {
      recommendations.push('Self-Stirring Mug - Novelty viral item');
    }
    
    return recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n');
  }
}

export const aiChatbot = new AIChatbot();