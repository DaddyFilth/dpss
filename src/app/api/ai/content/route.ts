import logger from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { aiContentGenerator } from '@/lib/ai/content-generator';
import { rateLimit, getClientIP, getSecurityHeaders } from '@/lib/security/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIP(request);
    const rateLimitResult = await rateLimit(ip, 'ai-content', 20, 60000);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const body = await request.json();
    const { type, product, platform, tone, keywords } = body;

    if (!type) {
      return NextResponse.json(
        { error: 'Content type is required' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const contentRequest = {
      type,
      product,
      platform,
      tone,
      keywords
    };

    let result;

    switch (type) {
      case 'social-post':
        result = aiContentGenerator.generateSocialPost(contentRequest);
        break;
      case 'ad-copy':
        result = aiContentGenerator.generateAdCopy(contentRequest);
        break;
      case 'product-description':
        result = aiContentGenerator.generateProductDescription(contentRequest);
        break;
      case 'email-subject':
        result = aiContentGenerator.generateEmailSubject(contentRequest);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid content type' },
          { status: 400, headers: getSecurityHeaders() }
        );
    }

    return NextResponse.json(
      {
        content: result.content,
        hashtags: result.hashtags,
        aiScore: result.aiScore,
        suggestions: result.suggestions,
        platform: result.platform,
        meta: {
          generator: 'ai-content-engine',
          version: '1.0',
          timestamp: new Date().toISOString()
        }
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    logger.error('AI content generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}